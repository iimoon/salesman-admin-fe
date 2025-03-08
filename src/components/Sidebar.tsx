import { Link, useLocation } from "react-router-dom";
import dummyPic from "../assets/profile.png";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; 

export default function Sidebar() {
  const location = useLocation();
  const [reportsOpen, setReportsOpen] = useState(false);

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };

  return (
    <div className="fixed h-screen w-64 bg-[#094497] text-white flex flex-col">
      <div className="p-6 flex-shrink-0">
        <DropdownMenu>
          
          <DropdownMenuTrigger>
            <Avatar className="w-16 h-16 rounded-md cursor-pointer">
              <AvatarImage
                src={dummyPic}
                alt="Profile"
                className="rounded-md object-cover"
              />
              <AvatarFallback className="bg-gray-400 text-white font-bold">S</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          
          <DropdownMenuContent align="end" className="bg-white text-black rounded-md shadow-lg w-48 mt-2">
            <div className="p-2">
              <p className="text-sm font-semibold">Samantha</p>
              <p className="text-xs text-gray-500">samantha@email.com</p>
            </div>
            <DropdownMenuItem onClick={handleLogout} className="p-2 text-sm hover:bg-gray-200">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-xl font-bold mt-2">Samantha</p>
        <p className="text-gray-400">samantha@email.com</p>
      </div>

      <ScrollArea className="flex-1 overflow-auto">
        <ul className="space-y-3 p-4">
          {[
            { path: "/", label: "Overview" },
            { path: "/dashboard/manage-salesman", label: "Manage Salesmen" },
            { path: "/dashboard/client", label: "Manage Client" },
            { path: "/dashboard/products", label: "Manage Products" },
            { path: "/dashboard/orders", label: "View Orders" },
            { path: "/dashboard/messages", label: "Messages" },
            { path: "/dashboard/attendance", label: "Attendance" },
            { path: "/dashboard/task", label: "Task Assignment" },
            { path: "/dashboard/leaderboard", label: "Leaderboard" },
            { path: "/dashboard/rewards", label: "Reward Management" },
            { path: "/dashboard/return", label: "Return Management" },
            { path: "/dashboard/add-edit-reward", label: "Add Rewards" },
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.path}
                className={cn(
                  "p-3 text-xl font-bold rounded cursor-pointer transition-colors",
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                )}
              >
                <Link to={item.path}>{item.label}</Link>
              </li>
            );
          })}

          
          <li
            className="p-3 text-xl font-bold cursor-pointer transition-colors text-gray-400 hover:text-white flex items-center justify-between"
            onClick={() => setReportsOpen(!reportsOpen)}
          >
            Reports
            {reportsOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          </li>
          {reportsOpen && (
            <ul className="pl-6 space-y-2">
              <li>
                <Link
                  to="/dashboard/reports"
                  className="block text-lg text-gray-400 hover:text-white"
                >
                  General Report
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/reports/rewards"
                  className="block text-lg text-gray-400 hover:text-white"
                >
                  Reward Reports
                </Link>
              </li>
            </ul>
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}
