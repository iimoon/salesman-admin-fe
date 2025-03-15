import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import RewardsReportTable from "../components/RewardsReportTable";
import { useApi } from "../hooks/useApi";


interface RewardReportData {
    totalPoints: number;
    totalRewardsRedeemed: number;
    pendingApprovals: number;
}

export default function RewardsReport() {
    const { rewardReports } = useApi();
    const [reportData, setReportData] = useState<RewardReportData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchRewardReport() {
            try {
                const data = await rewardReports();
                console.log(data.totalPointsDistributed);
                setReportData({
                    totalPoints: data.totalPointsDistributed,
                    totalRewardsRedeemed: data.totalRewardsRedeemed,
                    pendingApprovals: data.pendingApprovals,
                });
            } catch (error) {
                console.error("Failed to fetch reward report:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRewardReport();
    }, []);

    return (
        <div className="bg-white h-[calc(95vh-1.5rem)] rounded-tl-lg rounded-bl-lg p-10 px-10 overflow-auto">
            <PageTitle title="Reward Report" />
            <div className="mt-8">
                <RewardsReportTable reportData={reportData} loading={loading} />
            </div>
        </div>
    );
}
