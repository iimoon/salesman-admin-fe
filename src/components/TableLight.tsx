import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "./ui/spinner";


export interface Reward {
    _id: string;
    rewardName: string;
    pointsRequired: number;
    quantityAvailable: number;
    rewardImageURL?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }
  
  export interface UpdateRewardData {
    rewardName?: string;
    pointsRequired?: number;
    quantityAvailable?: number;
    rewardImageURL?: string;
  }

  interface TableLightProps {
    getRewards: () => Promise<{ rewards: Reward[] }>;
    updateReward: (rewardId: string, rewardData: UpdateRewardData) => Promise<any>; 
    deleteReward: (id: string) => Promise<any>;
  }

export default function TableLight({ getRewards, updateReward, deleteReward }: TableLightProps) {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editFormData, setEditFormData] = useState<Reward | null>(null);

    useEffect(() => {
        fetchRewards();
    }, []);

    useEffect(() => {
        if (selectedReward) {
            setEditFormData({ ...selectedReward });
        }
    }, [selectedReward]);

    const fetchRewards = async () => {
        try {
            setLoading(true);
            const data = await getRewards();
            setRewards(data.rewards);
        } catch (error) {
            console.error("Failed to fetch rewards:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateReward = async () => {
        if (!editFormData || !editFormData._id) {
            console.error("Invalid reward data:", editFormData);
            return;
        }

        const updatedData: UpdateRewardData = {
            rewardName: editFormData.rewardName,
            pointsRequired: editFormData.pointsRequired,
            quantityAvailable: editFormData.quantityAvailable,
            rewardImageURL: editFormData.rewardImageURL,
        };

        try {
            await updateReward(editFormData._id, updatedData);

            setRewards((prevRewards) =>
                prevRewards.map((reward) =>
                    reward._id === editFormData._id ? { ...reward, ...updatedData } : reward
                )
            );

            setIsEditOpen(false);
            setSelectedReward(null);

            toast.success("Reward updated successfully!");
        } catch (error) {
            console.error("Failed to update reward:", error);
            toast.error("Failed to update reward. Please try again.");
        }
    };

    const handleDeleteReward = async () => {
        if (!selectedReward?._id) return;

        try {
            await deleteReward(selectedReward._id);
            setIsDeleteOpen(false);
            toast.success("Reward deleted successfully!");
            fetchRewards();
        } catch (error) {
            console.error("Failed to delete reward:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editFormData) return;

        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: name === "pointsRequired" || name === "quantityAvailable" ? parseInt(value) : value,
        });
    };

    return (
        <div className="bg-[#EDF0F6] p-6 rounded-lg shadow-md w-full max-h-96">
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <Spinner size="large" />
                </div>
            ) : (
                <ScrollArea className="h-64 w-full">
                    <div className="pr-4">
                        {rewards.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">No rewards found</div>
                        ) : (
                            rewards.map((reward) => (
                                <div key={reward._id} className="flex justify-between items-center px-6 py-4 border-b last:border-none">
                                    <div className="w-1/4">
                                        <p className="text-blue-600 font-semibold">Reward Name</p>
                                        <p className="text-gray-800">{reward.rewardName}</p>
                                    </div>
                                    <div className="w-1/4">
                                        <p className="text-blue-600 font-semibold">Points Required</p>
                                        <p className="text-gray-800">{reward.pointsRequired} pts</p>
                                    </div>
                                    <div className="w-1/4">
                                        <p className="text-blue-600 font-semibold">Quantity Available</p>
                                        <p className="text-gray-800">{reward.quantityAvailable}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="text-blue-600" onClick={() => { setSelectedReward(reward); setIsEditOpen(true); }}>
                                            <MdEdit size={18} />
                                        </button>
                                        <button className="text-red-500" onClick={() => { setSelectedReward(reward); setIsDeleteOpen(true); }}>
                                            <RiDeleteBinLine size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            )}

            {/* Edit Dialog */}
            {selectedReward && editFormData && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Reward</DialogTitle>
                            <DialogDescription>Modify the reward details below.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="font-semibold block mb-1">Reward Name</label>
                                <input
                                    type="text"
                                    name="rewardName"
                                    value={editFormData.rewardName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="font-semibold block mb-1">Points Required</label>
                                <input
                                    type="number"
                                    name="pointsRequired"
                                    value={editFormData.pointsRequired}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="font-semibold block mb-1">Quantity Available</label>
                                <input
                                    type="number"
                                    name="quantityAvailable"
                                    value={editFormData.quantityAvailable}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdateReward}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            
            {selectedReward && (
                <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete "{selectedReward.rewardName}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteReward}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}