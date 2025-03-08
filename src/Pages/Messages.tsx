import { useState, useEffect } from "react";
import ChatWindow from "../components/Messages/ChatWindow";
import UsersList from "../components/Messages/UsersList";
import { useApi } from "../hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminIdFromToken } from "../utils/auth";
import { Message } from "@/types/type";


interface Salesman {
    _id: string;
    name: string;
}



export default function Messages() {
    const { fetchMessages, sendMessage, fetchSalesmen } = useApi();

    const [salesmen, setSalesmen] = useState<Salesman[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUser, setSelectedUser] = useState<Salesman | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

    useEffect(() => {
        const loadSalesmen = async () => {
            try {
                const data = await fetchSalesmen();
                console.log(data.data);

                if (data && Array.isArray(data.data)) {
                    setSalesmen(data.data);
                    if (data.data.length > 0) {
                        setSelectedUser(data.data[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching salesmen:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSalesmen();
    }, []);

    useEffect(() => {
        if (!selectedUser) return;

        const loadMessages = async () => {
            setLoadingMessages(true);
            try {
                const adminId = getAdminIdFromToken();

                if (!adminId) {
                    console.error("Admin ID is null");
                    return;
                }

                
                const data: any = await fetchMessages({
                    senderId: adminId,
                    receiverId: selectedUser._id
                });

                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        loadMessages();
    }, [selectedUser]);


    const handleSelectUser = (user: Salesman) => {
        setSelectedUser(user);
    };

    const handleSendMessage = async (messageText: string) => {
        if (!selectedUser || !messageText.trim()) return;
      
        try {
          const adminId = getAdminIdFromToken();
      
          if (!adminId) {
            console.error("Admin ID is null");
            return;
          }
      
          const messageData = {
            senderId: adminId,
            receiverId: selectedUser._id,
            message: messageText,
            senderType: "testadmin"
          };
      
          await sendMessage(messageData);
      
          const updatedMessages:any = await fetchMessages({
            senderId: adminId,
            receiverId: selectedUser._id
          });
      
          setMessages(updatedMessages);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            {loading ? (
                <div className="flex gap-4">
                    <div className="w-72">
                        <Skeleton className="h-[88vh] w-full rounded-lg" />
                    </div>
                    <Skeleton className="h-[88vh] w-full rounded-lg" />
                </div>
            ) : (
                <div className="flex gap-4">
                    <UsersList
                        users={salesmen}
                        selectedUser={selectedUser}
                        onSelectUser={handleSelectUser}
                    />
                    <ChatWindow
                        messages={messages}
                        loadingMessages={loadingMessages}
                        selectedUser={selectedUser}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            )}
        </div>
    );
}
