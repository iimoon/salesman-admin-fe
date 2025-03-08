import PageTitle from "../components/PageTitle";
import OrderTable from "../components/OrderTable";
import { useApi } from "../hooks/useApi";
import { useState } from "react";
import { toast } from "sonner";

const OrdersManagement = () => {
    const [isLoading] = useState(true);
    const { editOrder, deleteOrder } = useApi();
    
    
    const propertyMap = {
        "ID": "id",
        "Client": "clientName", 
        "Date": "date",
        "Amount": "amount",
        "Status": "status"
    };
    
    const orderColumns = ["ID", "Client", "Date", "Amount", "Status"];
    
    
    const handleEditOrder = async (id: string, updatedData: Record<string, any>) => {
        try {
            const result = await editOrder(id, updatedData); 
            toast.success("Order updated successfully");
            return result;
        } catch (error: any) {
            toast.error(error.message || "Failed to update order");
            throw error;
        }
    };
    
    
    const handleDeleteOrder = async (id: string) => {
        try {
            const result = await deleteOrder(id);
            toast.success("Order deleted successfully");
            return result;
        } catch (error: any) {
            toast.error(error.message || "Failed to delete order");
            throw error;
        }
    };
    
    const handleExport = () => {
        toast.info("Not implemented yet");
    };
    
    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            <PageTitle title="Orders Management" />
            <div className="mt-10">
                <OrderTable
                    title="Orders Summary"
                    columns={orderColumns}
                    propertyMap={propertyMap}
                    isLoading={isLoading}
                    onEdit={handleEditOrder}
                    onDelete={handleDeleteOrder}
                    onExport={handleExport}
                />
            </div>
        </div>
    );
};

export default OrdersManagement;