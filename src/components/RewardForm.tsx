import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


interface RewardData {
    rewardName: string;
    pointsRequired: number;
    quantityAvailable: number;
    rewardImageURL: string | null;
}


interface RewardFormProps {
    onSubmit: (data: RewardData) => Promise<void>; 
}

export default function RewardForm({ onSubmit }: RewardFormProps) {
    const [formData, setFormData] = useState({
        rewardName: "",
        pointsRequired: "",
        quantity: "",
        rewardImage: "" as string, 
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: type === "file" && files?.length ? files[0].name : value, 
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const rewardData: RewardData = {
            rewardName: formData.rewardName,
            pointsRequired: Number(formData.pointsRequired),
            quantityAvailable: Number(formData.quantity),
            rewardImageURL: formData.rewardImage || null,
        };

        try {
            await onSubmit(rewardData);
            toast.success("Reward added successfully!");
            setFormData({ rewardName: "", pointsRequired: "", quantity: "", rewardImage: "" });
        } catch (error) {
            toast.error("Failed to add reward.");
            console.error("API Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#EDF0F6] p-6 rounded-lg shadow-md max-w-lg">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="rewardName" className="text-gray-700 mb-2 block">Reward Name</Label>
                    <Input id="rewardName" type="text" className="bg-white" value={formData.rewardName} onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="pointsRequired" className="text-gray-700 mb-2 block">Points Required</Label>
                    <Input id="pointsRequired" type="number" className="bg-white" value={formData.pointsRequired} onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="quantity" className="text-gray-700 mb-2 block">Quantity Available</Label>
                    <Input id="quantity" type="number" className="bg-white" value={formData.quantity} onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="rewardImage" className="text-gray-700 mb-2 block">Upload Reward Image</Label>
                    <Input id="rewardImage" type="file" className="bg-white" onChange={handleChange} />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Reward"}
                </Button>
            </form>
        </div>
    );
}
