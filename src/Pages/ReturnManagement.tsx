import { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import TableApproveReject from "../components/TableApproveReject";
import { Button } from "../components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";

interface ReturnItem {
    _id: string;
    salesman: { name: string }; 
    client: { name: string };   
    product?: { name: string }; 
    quantity: number;
    reason: string;
    status: string;
}

interface GetReturnsResponse {
    returns: ReturnItem[];
}

interface TableReturnItem {
    id: string;
    salesman: string;
    client: string;
    product: string;
    quantity: number;
    reason: string;
    status: string;
}



export default function ReturnManagement() {
    const [loading, setLoading] = useState(true);
    const [returns, setReturns] = useState<TableReturnItem[]>([]);
    const { getReturns, approveReturn, rejectReturn } = useApi();

    const columns = ["Salesman", "Client", "Product", "Quantity", "Reason", "Status"];

    const propertyMap = {
        "Salesman": "salesman",
        "Client": "client",
        "Product": "product",
        "Quantity": "quantity",
        "Reason": "reason",
        "Status": "status"
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const fetchReturns = async () => {
        setLoading(true);
        try {
            const response: GetReturnsResponse = await getReturns();
    
            const formattedData: TableReturnItem[] = response.returns.map((item) => ({
                id: item._id, 
                salesman: item.salesman.name, 
                client: item.client.name,
                product: item.product?.name || "N/A", 
                quantity: item.quantity,
                reason: item.reason,
                status: item.status
            }));
    
            setReturns(formattedData); 
        } catch (error) {
            console.error("Failed to fetch returns:", error);
            toast.error("Failed to load returns data");
        } finally {
            setLoading(false);
        }
    };
    
    
    const customApiHooks = {
        approveReward: async (id: string) => {
            return await approveReturn(id);
        },
        rejectReward: async (id: string) => {
            return await rejectReturn(id);
        }
    };

    const handleGenerateReport = () => {
        toast.info("Not implemented yet");
    };

    return (
        <div className="bg-white h-[calc(95vh-1.5rem)] rounded-tl-lg rounded-bl-lg p-10 px-10 overflow-auto">
            <PageTitle title="Returns Management" />

            <div className="mt-10">
                {loading ? (
                    <div className="flex flex-col space-y-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                ) : (
                    <TableApproveReject
                        columns={columns}
                        data={returns}
                        propertyMap={propertyMap}
                        onRefresh={fetchReturns}
                        {...customApiHooks}
                    />
                )}
            </div>

            <div className="mt-4">
                <Button
                    className="bg-[#094497] text-white hover:bg-[#072c66]"
                    onClick={handleGenerateReport}
                >
                    Generate Return Report
                </Button>
            </div>
        </div>
    );
}
