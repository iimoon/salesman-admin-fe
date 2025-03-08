import React from "react";
import { PiRankingLight } from "react-icons/pi";
import { MdOutlineStars } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

interface UserCardProps {
    name: string;
    rank?: string;
    points: number;
  }

const UserCard: React.FC<UserCardProps> = ({ name, rank, points }) => {
    return (
        <div className="flex gap-2">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-100 h-40 bg-gray-100 rounded-lg shadow-md border border-blue-300">
                    <div className="flex flex-col items-center">
                        <PiRankingLight size={80} />
                        <p className="text-2xl">
                            <span className="text-[#094497] font-bold ">Rank:</span>{rank}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center w-100 h-40 bg-gray-100 rounded-lg shadow-md border border-blue-300">
                    <div className="flex flex-col items-center">
                        <div className="">
                            <MdOutlineStars size={80} />
                        </div>
                        <p className="text-2xl">
                            <span className="text-[#094497] font-bold ">Points:</span>{points}pts
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-[#D0E4FF] w-sm h-sm rounded-lg border shadow-md border-blue-300 flex flex-col items-center justify-center">
                <CgProfile size={80} />
                <p className="text-2xl text-center">
                    <span className="text-[#094497] font-bold">Name:</span> {name}
                </p>
            </div>
        </div>
    );
};

export default UserCard;