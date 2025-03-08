import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";


type User = {
    _id: string;
    name: string;
    avatar?: string;
};

type UsersListProps = {
    users: User[];
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
};

export default function UsersList({ users, selectedUser, onSelectUser }: UsersListProps) {
    const [searchTerm, setSearchTerm] = useState("");

    
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col bg-white p-4 h-[88vh] w-72 rounded-tl-lg rounded-bl-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Users</h2>

            
            <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

            
            <div className="space-y-3 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className={`flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer
                                ${selectedUser && selectedUser._id === user._id ? "bg-blue-100" : ""}`}
                            onClick={() => onSelectUser(user)}
                        >
                            <Avatar>
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-4">No users found</p>
                )}
            </div>
        </div>
    );
}