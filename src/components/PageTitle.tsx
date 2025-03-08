import stats from "../assets/Stats.png"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiPlusCircle } from "react-icons/fi";
import { Button } from "./ui/button";

interface PageTitleProps {
    title: string;
    imageSrc?: string;
}

export default function PageTitle({ title }: PageTitleProps) {
    return (
        <>
            <div className="flex justify-between items-center w-3xl">
                <h1 className="font-bold text-4xl font-poppins">{title}</h1>
                <div className="flex items-center">
                    <div className="flex -space-x-3">
                        <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src="https://randomuser.me/api/portraits/women/1.jpg" alt="User 1" />
                            <AvatarFallback>U1</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="User 2" />
                            <AvatarFallback>U2</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src="https://randomuser.me/api/portraits/women/2.jpg" alt="User 3" />
                            <AvatarFallback>U3</AvatarFallback>
                        </Avatar>
                        <Button className="bg-white w-10 h-10 rounded-full p-0 flex items-center justify-center">
                            <FiPlusCircle className="w-6 h-6 text-gray-500" />
                        </Button>
                    </div>
                </div>
            </div>
            <h1 className="text-lg font-semibold text-gray-400">01 - 25 March, 2020</h1>
            <img className="w-3xl h-20 mt-5" src={stats} />
        </>
    );
}
