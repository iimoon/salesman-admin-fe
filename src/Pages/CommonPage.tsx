import { Routes, Route } from "react-router-dom";
import AddEditReward from "./AddEditReward";
import AttendanceTracking from "./AttendanceTracking";
import Leaderboard from "./Leaderboard";
import ManageSaleMan from "./ManageSaleMan";
import OrdersManagement from "./OrdersManagement";
import Reports from "./Reports";
import RewardsManagements from "./RewardsManagement";
import RewardsReport from "./RewardsReport";
import SalesManList from "./SalesManList";
import ExpenseTracker from "../components/ExpenseTracker";
import Sidebar from "../components/Sidebar";
import Products from "./Products";
import Client from "./Client";
import ReturnManagement from "./ReturnManagement";
import TaskAssignment from "./TaskAssignment";
import Messages from "./Messages";

export default function CommonPage() {
    return (
        <div className="flex h-screen" style={{ backgroundColor: "rgba(9, 68, 151, 1)" }}>
            
            <Sidebar />
            <div className="ml-64 flex p-6">
                <div className="flex-1">
                    <Routes>
                        <Route path="/dashboard" element={<ManageSaleMan />} />
                        <Route path="/dashboard/manage-salesman" element={<SalesManList />} />
                        <Route path="/dashboard/client" element={<Client />} />
                        <Route path="/dashboard/products" element={<Products />} />
                        <Route path="/dashboard/orders" element={<OrdersManagement />} />
                        <Route path="/dashboard/messages" element={<Messages />} />
                        <Route path="/dashboard/attendance" element={<AttendanceTracking />} />
                        <Route path="/dashboard/task" element={<TaskAssignment />} />
                        <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
                        <Route path="/dashboard/rewards" element={<RewardsManagements />} />
                        <Route path="/dashboard/return" element={<ReturnManagement />} />
                        <Route path="/dashboard/add-edit-reward" element={<AddEditReward />} />
                        <Route path="/dashboard/reports" element={<Reports />} />
                        <Route path="/dashboard/reports/rewards" element={<RewardsReport />} />

                    </Routes>
                </div>
                <ExpenseTracker />
            </div>
        </div>
    );
}
