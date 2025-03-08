import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaDownload } from "react-icons/fa"; 
import { toast } from "sonner";

interface RewardsReportTableProps {
    reportData: any;
    loading: any;
}

export default function RewardsReportTable({ reportData, loading }: RewardsReportTableProps) {
    const handleExport = () => {
        toast.info("Not implemented yet!");
    };

    return (
        <div className="bg-[#EDF0F6] p-6 rounded-lg shadow-md max-w-4xl">
            <div className="flex justify-between items-start">
                
                <div>
                    <p className="text-blue-900 font-semibold">Total Points Distributed</p>
                    {loading ? (
                        <Skeleton className="h-6 w-24 my-2" />
                    ) : (
                        <p className="text-gray-900">{reportData?.totalPoints} pts</p>
                    )}
                </div>
                <div>
                    <p className="text-blue-900 font-semibold">Total Rewards Redeemed</p>
                    {loading ? (
                        <Skeleton className="h-6 w-24 my-2" />
                    ) : (
                        <p className="text-gray-900">{reportData?.totalRewardsRedeemed}</p>
                    )}
                </div>
                <div>
                    <p className="text-blue-900 font-semibold">Pending Approvals</p>
                    {loading ? (
                        <Skeleton className="h-6 w-24 my-2" />
                    ) : (
                        <p className="text-gray-900">{reportData?.pendingApprovals}</p>
                    )}
                </div>
            </div>

            
            <div className="mt-4">
                <Button
                    className="bg-[#094497] hover:bg-blue-700 text-white flex items-center"
                    onClick={handleExport}
                    disabled={loading} 
                >
                    Export Rewards Data <FaDownload className="ml-2" />
                </Button>
            </div>
        </div>
    );
}
