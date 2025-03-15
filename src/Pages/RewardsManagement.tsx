import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import TableLight from "../components/TableLight";
import TableApproveReject from "../components/TableApproveReject";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../components/ui/button";
import { useApi } from "../hooks/useApi";

export default function RewardsManagement() {
    const columns = ["Salesman", "Date", "Status"];
    const [redeemedRewards, setRedeemedRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {
        getReward,
        updateReward,
        deleteReward,
        getRedeemedRewards,
        // approveReward,
        // rejectReward
    } = useApi();

    useEffect(() => {
        fetchRedeemedRewards();
    }, []);

    const fetchRedeemedRewards = async () => {
        try {
            setLoading(true);
            const data = await getRedeemedRewards();
            console.log(data.redemptionRequests);
            const mappedData = data.redemptionRequests.map((item: any) => ({
                id: item._id,
                userId: item.userId, 
                salesman: item.userId.name || "N/A",
                date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A",
                requiredDate: item.requiredDate, 
                status: item.status || "Pending", 
            }));
            setRedeemedRewards(mappedData);
        } catch (error) {
            console.error("Failed to fetch redeemed rewards:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white h-[calc(95vh-1.5rem)] rounded-tl-lg rounded-bl-lg p-10 px-10 overflow-auto">
            <PageTitle title="Rewards Management" />

            <div className="mt-5">
                <h1 className="font-bold text-2xl mb-4">Manage Rewards</h1>
                <TableLight
                    getRewards={getReward}
                    updateReward={updateReward}
                    deleteReward={deleteReward}
                />
            </div>

            <div className="mt-8">
                <Button
                    className="bg-[#094497] text-white hover:bg-[#072c66]"
                    onClick={() => navigate("/dashboard/add-edit-reward")}
                >
                    Add New Reward +
                </Button>
            </div>

            <div className="mt-6">
                <h2 className="text-3xl font-bold">Redeemed Rewards</h2>
            </div>

            <div className="mt-6">
                {loading ? (
                    <div className="flex flex-col space-y-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                ) : (
                    <TableApproveReject
                        columns={columns}
                        data={redeemedRewards}
                        propertyMap={{
                            "Salesman": "salesman",
                            "Date": "date",
                            "Status": "status"
                        }}
                        onRefresh={fetchRedeemedRewards} 
                    />
                )}
            </div>
        </div>
    );
}
