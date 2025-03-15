import { useState, useEffect } from "react";
import LeaderboardOverviewTable from "../components/LeaderboardOverviewTable";
import PageTitle from "../components/PageTitle";
import { Button } from "../components/ui/button";
import UserCard from "../components/UserCard";
import { CiSaveDown1 } from "react-icons/ci";
import { useApi } from "../hooks/useApi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { LeaderboardResponse, Salesman } from "../types/type"; 

export default function Leaderboard() {
    const { fetchLeaderboard, editSalesman } = useApi();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse>({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        leaderboard: [],
    });
    const [selectedUser, setSelectedUser] = useState<Salesman | null>(null);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);
    const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState<boolean>(false);
    const [pointsToAdjust, setPointsToAdjust] = useState<number | string>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        loadLeaderboardData();
    }, []);

    const loadLeaderboardData = async () => {
        try {
            setIsLoading(true);
            const data = await fetchLeaderboard();
            setLeaderboardData(data);
            if (data.leaderboard && data.leaderboard.length > 0) {
                setSelectedUser(data.leaderboard[0]);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserSelect = (user: Salesman) => {
        setSelectedUser(user);
    };

    const handleResetPoints = async () => {
        if (!selectedUser) return;

        try {
            await editSalesman(selectedUser._id, { points: 0 });
            setIsResetDialogOpen(false);
            await loadLeaderboardData();
        } catch (error) {
            console.error("Failed to reset points:", error);
        }
    };

    const handleAdjustPoints = async () => {
        if (!selectedUser) return;

        try {
            const adjustValue = typeof pointsToAdjust === 'string'
                ? parseInt(pointsToAdjust)
                : pointsToAdjust;

            const newPoints = selectedUser.points + adjustValue;
            await editSalesman(selectedUser._id, { points: newPoints >= 0 ? newPoints : 0 });
            setIsAdjustDialogOpen(false);
            setPointsToAdjust(0);
            await loadLeaderboardData();
        } catch (error) {
            console.error("Failed to adjust points:", error);
        }
    };

    const exportLeaderboard = () => {
        const csvContent =
            "Name,Points\n" +
            leaderboardData.leaderboard.map(user => `${user.name},${user.points}`).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "leaderboard_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getUserRank = (userId: string): number | string => {
        if (!leaderboardData.leaderboard) return "-";
        const index = leaderboardData.leaderboard.findIndex(user => user._id === userId);
        return index !== -1 ? index + 1 : "-";
    };

    return (
        <div className="bg-white h-[calc(95vh-1.5rem)] rounded-tl-lg rounded-bl-lg p-10 px-10 overflow-auto">
            <div className="overflow-y-auto max-h-full">
                <PageTitle title="Leaderboard Overview" />

                {selectedUser && (
                    <div className="mt-10">
                        <UserCard
                            name={selectedUser.name}
                            rank={String(getUserRank(selectedUser._id))} 
                            points={selectedUser.points}
                        />
                    </div>
                )}

                <div className="mt-10 mb-8">
                    <h2 className="font-bold text-xl">Overview</h2>
                    <div className="border border-b-4 border-[#094497] w-20 rounded-lg" />
                </div>

                {isLoading ? (
                    <div className="w-full bg-[#EDF0F6] p-6 rounded-lg shadow-md">
                        <p className="text-center text-gray-500">Loading leaderboard data...</p>
                    </div>
                ) : (
                    <LeaderboardOverviewTable
                        leaderboard={leaderboardData.leaderboard || []}
                        onSelectUser={handleUserSelect}
                        selectedUserId={selectedUser?._id}
                    />
                )}

                <div className="mt-5">
                    <Button
                        className="rounded-xl bg-[#094497]"
                        onClick={exportLeaderboard}
                        disabled={isLoading || leaderboardData.leaderboard.length === 0}
                    >
                        Export Leaderboard <CiSaveDown1 className="ml-2" />
                    </Button>
                </div>

                <div className="flex items-center mt-5 mb-5">
                    <Button
                        className="rounded-xl mr-3 bg-[#094497]"
                        onClick={() => setIsResetDialogOpen(true)}
                        disabled={!selectedUser}
                    >
                        Reset Points <CiSaveDown1 className="ml-2" />
                    </Button>

                    <Button
                        className="rounded-xl bg-[#094497]"
                        onClick={() => setIsAdjustDialogOpen(true)}
                        disabled={!selectedUser}
                    >
                        Adjust Points <CiSaveDown1 className="ml-2" />
                    </Button>
                </div>
            </div>

            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reset Points</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Are you sure you want to reset {selectedUser?.name}'s points to 0?
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsResetDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleResetPoints}>Confirm Reset</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Adjust Points</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="mb-2">Current points: {selectedUser?.points}</p>
                        <Input
                            type="number"
                            placeholder="Enter points to add/subtract"
                            value={pointsToAdjust}
                            onChange={(e) => setPointsToAdjust(e.target.value)}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Use positive values to add points, negative to subtract
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAdjustDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleAdjustPoints}>Apply Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}