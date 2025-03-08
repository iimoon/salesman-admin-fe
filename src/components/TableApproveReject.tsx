import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApi } from "@/hooks/useApi";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface TableApproveRejectProps {
    columns: string[];
    data: any[];
    propertyMap?: Record<string, string>;
    onRefresh?: () => Promise<void>;
}

export default function TableApproveReject({
    columns,
    data,
    propertyMap = {},
    // onRefresh
}: TableApproveRejectProps) {
    const { approveReward, rejectReward } = useApi();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [localData, setLocalData] = useState<any[]>([]);

    
    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const handleApprove = async (id: string) => {
        setLoadingId(id);
        try {
            await approveReward(id);
            toast.success("Reward approved successfully!");

            
            setLocalData(prevData =>
                prevData.map(item =>
                    item.id === id ? { ...item, status: "Approved" } : item
                )
            );
        } catch (error) {
            toast.error("Failed to approve reward.");
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setLoadingId(id);
        try {
            await rejectReward(id);
            toast.success("Reward rejected successfully!");

            
            setLocalData(prevData =>
                prevData.map(item =>
                    item.id === id ? { ...item, status: "Rejected" } : item
                )
            );
        } catch (error) {
            toast.error("Failed to reject reward.");
        } finally {
            setLoadingId(null);
        }
    };

    
    const getPropertyName = (column: string): string => {
        
        if (propertyMap[column]) {
            return propertyMap[column];
        }
        
        return column.toLowerCase();
    };

    
    const getNestedProperty = (obj: any, path: string) => {
        return path.split('.').reduce((prev, curr) => {
            return prev && prev[curr] ? prev[curr] : "N/A";
        }, obj);
    };

    
    const canBeActioned = (status: string): boolean => {
        return status !== "Approved" && status !== "approved" && status !== "Rejected" && status !== "rejected";
    };


    return (
        <div className="bg-[#EDF0F6] p-6 rounded-lg shadow-md w-full">
            <ScrollArea className="h-64 w-full">
                <div className="p-6 flex flex-col gap-4 pr-4">
                    
                    <div className="flex w-full font-semibold text-blue-600 pb-4 border-b">
                        {columns.map((col, index) => (
                            <div key={index} className="w-1/4">{col}</div>
                        ))}
                        <div className="w-1/4">Actions</div>
                    </div>

                    
                    {localData.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            No data found
                        </div>
                    ) : (
                        localData.map((row) => {
                            const status = row.status || "Pending";
                            const isActionable = canBeActioned(status);

                            return (
                                <div key={row.id} className="flex w-full items-center border-b last:border-none py-2">
                                    
                                    {columns.map((col, index) => {
                                        const propName = getPropertyName(col);
                                        return (
                                            <div key={index} className="w-1/4">
                                                <p className="text-gray-800">
                                                    {propName.includes('.')
                                                        ? getNestedProperty(row, propName)
                                                        : row[propName] || "N/A"}
                                                </p>
                                            </div>
                                        );
                                    })}

                                    
                                    <div className="w-1/4 flex gap-3">
                                        <Button
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            onClick={() => handleApprove(row.id)}
                                            disabled={loadingId === row.id || !isActionable}
                                        >
                                            {loadingId === row.id ? "Approving..." : "Approve"}
                                        </Button>
                                        <Button
                                            className="border bg-[#EDF0F6] border-blue-600 text-blue-600 px-4 py-2 rounded-lg disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                                            onClick={() => handleReject(row.id)}
                                            disabled={loadingId === row.id || !isActionable}
                                        >
                                            {loadingId === row.id ? "Rejecting..." : "Reject"}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}