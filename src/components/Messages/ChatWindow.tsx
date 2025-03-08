import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAdminIdFromToken } from "../../utils/auth";
import { Message } from "@/types/type";

type ChatWindowProps = {
    messages: Message[];
    loadingMessages: boolean;
    selectedUser: any;
    onSendMessage: (message: string) => void;
};

export default function ChatWindow({
    messages,
    loadingMessages,
    selectedUser,
    onSendMessage
}: ChatWindowProps) {
    const [newMessage, setNewMessage] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    // const adminId = localStorage.getItem('adminId') 

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight + 50,
                behavior: "smooth",
            });
        }
    }, [messages]);


    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedUser) return;
        onSendMessage(newMessage);
        setNewMessage("");
    };

    const shouldShowDate = (index: number, currentMsg: Message, prevMsg?: Message) => {
        if (index === 0) return true;

        if (!currentMsg.createdAt || !prevMsg?.createdAt) return false;

        const currentDate = new Date(currentMsg.createdAt).toLocaleDateString();
        const prevDate = new Date(prevMsg.createdAt).toLocaleDateString();

        return currentDate !== prevDate;
    };

    return (
        <div className="flex flex-col bg-white p-4 h-[88vh] w-full rounded-tr-lg rounded-br-lg shadow-md">
            
            {selectedUser ? (
                <div className="flex items-center gap-3 pb-3 mb-3 border-b">
                    <Avatar>
                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                        <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                </div>
            ) : (
                <h2 className="text-lg font-semibold mb-3">Select a user to start chatting</h2>
            )}


            <div className="flex-1 overflow-hidden">
                {loadingMessages ? (
                    <div className="flex-1 space-y-3 p-4">
                        <Skeleton className="h-10 w-3/4 rounded-lg" />
                        <Skeleton className="h-10 w-2/3 ml-auto rounded-lg" />
                        <Skeleton className="h-10 w-3/4 rounded-lg" />
                        <Skeleton className="h-10 w-1/2 ml-auto rounded-lg" />
                    </div>
                ) : (
                    <ScrollArea className="flex-1 p-2 pr-4 h-[calc(88vh-120px)]" ref={scrollAreaRef}>
                        <div className="space-y-3">
                            {messages.map((msg, index) => {
                                const isAdmin = msg.senderId === getAdminIdFromToken();
                                const prevMsg = index > 0 ? messages[index - 1] : undefined;
                                const showDate = shouldShowDate(index, msg, prevMsg);

                                return (
                                    <div key={msg._id} className="space-y-1">
                                        {showDate && msg.createdAt && (
                                            <div className="text-center text-xs text-gray-500 my-2">
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </div>
                                        )}
                                        <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`p-3 max-w-[75%] rounded-lg shadow-md ${isAdmin ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
                                                    }`}
                                            >
                                                <p>{msg.message}</p>
                                                <span className="text-xs opacity-75 block text-right">
                                                    {msg.createdAt ? formatMessageTime(msg.createdAt) : "Invalid Date"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                );
                            })}

                            <div className="h-4"></div>
                        </div>
                    </ScrollArea>


                )}
            </div>

            <div className="flex gap-2 mt-3">
                <Input
                    type="text"
                    placeholder={selectedUser ? "Type a message..." : "Select a user to start chatting"}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="border-2 border-[#094497] bg-white focus:ring-[#072c66] focus:border-[#072c66]"
                    disabled={!selectedUser}
                />
                <Button
                    className="bg-[#094497] text-white hover:bg-[#072c66] px-4"
                    onClick={handleSendMessage}
                    disabled={!selectedUser}
                >
                    <IoPaperPlaneOutline className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
