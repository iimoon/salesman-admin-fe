import { FaTrash, FaEdit } from "react-icons/fa";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useApi } from "../hooks/useApi";
import EditOrderDialog from "./EditOrderDialog";
import {Order} from "../types/type"



type OrderTableProps = {
    title: string;
    columns: string[];
    propertyMap?: Record<string, string>;
    isLoading?: boolean;
    onEdit?: (id: string, updatedData: Record<string, any>) => Promise<any>;
    onDelete?: (id: string) => Promise<any>;
    onExport?: () => void;
};

const OrderTable: React.FC<OrderTableProps> = ({
    title,
    columns,
    propertyMap = {},
    // isLoading = false,
    // onEdit,
    // onDelete,
    onExport
}) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { getOrders, editOrder, deleteOrder } = useApi();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            console.log(data.orders);

            // Generate sequential order IDs for display if real IDs aren't available
            const transformedOrders = data.orders.map((order: Order, index: number) => {
                // Calculate a more user-friendly ID format
                const sequentialId = `ORD-${(index + 1).toString().padStart(4, '0')}`;

                return {
                    ...order,
                    // Use the real ID if available, otherwise use our sequential ID
                    _id: order._id || order.id || order.orderId || sequentialId,
                    // For display purposes, we'll use the sequential ID if there's no real ID
                    displayId: order._id || order.id || order.orderId || sequentialId,
                    clientName: order.clientName || (order.clientId?.name || "Unknown Client"),
                    createdAt: order.createdAt || order.orderDate || new Date().toISOString()
                };
            });

            setOrders(transformedOrders);
        } catch (err: any) {
            toast.error(err.message || "Failed to fetch orders");
            setError(err.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get the correct property name for a column
    const getPropertyName = (column: string): string => {
        if (propertyMap[column]) {
            return propertyMap[column];
        }
        return column.toLowerCase().replace(/\s+/g, "_");
    };

    // Open edit dialog
    const openEditDialog = (order: Order) => {
        const structuredOrder = {
            _id: order._id || '',
            clientName: order.clientName || '',
            clientId: order.clientId || { _id: '', name: order.clientName || '' },
            products: order.products || [],
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt || order.orderDate || ''
        };

        setSelectedOrder(structuredOrder);
        setError("");
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = async (orderId: string, updatedData: Record<string, any>) => {
        setLoading(true);
        setError("");

        try {
            await editOrder(orderId, updatedData);
            setIsEditDialogOpen(false);
            toast.success("Order updated successfully");
            fetchOrders();
        } catch (err: any) {
            toast.error(err.message || "Failed to save changes");
            setError(err.message || "Failed to save changes");
        } finally {
            setLoading(false);
        }
    };


    const openDeleteDialog = (id: string) => {
        setOrderToDelete(id);
        setError("");
        setIsDeleteDialogOpen(true);
    };


    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;

        setLoading(true);
        setError("");

        try {
            await deleteOrder(orderToDelete);
            setIsDeleteDialogOpen(false);
            toast.success("Order deleted successfully");
            fetchOrders();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete");
            setError(err.message || "Failed to delete");
        } finally {
            setLoading(false);
        }
    };


    const formatStatus = (status: string) => {
        let bgColor = "bg-yellow-100 text-yellow-800";

        if (status === "completed") {
            bgColor = "bg-green-100 text-green-800";
        } else if (status === "cancelled") {
            bgColor = "bg-red-100 text-red-800";
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Handle export to CSV
    const handleExport = () => {
        if (onExport) {
            onExport();
        } else {
            const header = columns.join(',');
            const rows = orders.map(order => {
                return columns.map(col => {
                    const propName = getPropertyName(col);
                    if (propName === "id") {
                        return order._id || order.id || "N/A";
                    } else if (propName === "client" || propName === "clientName") {
                        return order.clientName || (order.clientId?.name || "Unknown");
                    } else if (propName === "date") {
                        const dateString = order.createdAt || order.orderDate || "";
                        return dateString ? format(new Date(dateString), "dd-MM-yy") : "N/A";
                    } else if (propName === "amount") {
                        return `$${order.totalAmount || 0}`;
                    } else if (propName === "status") {
                        return order.status || "pending";
                    }
                    return "";
                }).join(',');
            }).join('\n');

            const csvContent = `data:text/csv;charset=utf-8,${header}\n${rows}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${title.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    const getOrderValue = (order: Order, propName: string) => {
        try {
            if (propName === "id") {
                return order._id || order.id || "N/A";
            } else if (propName === "client" || propName === "clientName") {
                return order.clientName || (order.clientId?.name || "Unknown Client");
            } else if (propName === "date") {
                const dateString = order.createdAt || order.orderDate || "";
                return dateString ? format(new Date(dateString), "dd-MM-yy") : "N/A";
            } else if (propName === "amount") {
                return `$${order.totalAmount || 0}`;
            } else if (propName === "status") {
                return formatStatus(order.status || "pending");
            }
            return "—";
        } catch (err) {
            console.error("Error rendering order value:", err);
            return "Error";
        }
    };

    return (
        <div className="w-full bg-[#D0E4FF] p-8 rounded-lg shadow-md h-sm overflow-x-auto">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl text-[#093497]">{title}</h1>
                <Button
                    onClick={handleExport}
                    className="bg-[#093497] hover:bg-blue-800"
                >
                    Export to CSV
                </Button>
            </div>
            <div className="border-b-4 border-[#093497] mt-4"></div>

            <div className="mt-6">

                <div
                    className="grid font-semibold text-[#093497] sticky top-0 z-10"
                    style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
                >
                    {columns.map((col, index) => (
                        <p key={index} className="px-2 py-1">{col}</p>
                    ))}
                    <p className="px-2 py-1">Actions</p>
                </div>


                <div className="h-60 overflow-y-auto">
                    {loading ? (

                        Array(5).fill(0).map((_, index) => (
                            <div
                                key={index}
                                className="grid mt-4 gap-2"
                                style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
                            >
                                {Array(columns.length + 1).fill(0).map((_, colIndex) => (
                                    <div key={colIndex} className="px-2 py-1">
                                        <Skeleton className="h-6 w-full" />
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : orders.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No orders found.
                        </div>
                    ) : (
                        orders.map((order, index) => (
                            <div
                                key={index}
                                className="grid mt-4 text-gray-700 border-b border-gray-400"
                                style={{ gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))` }}
                            >

                                {columns.map((col, colIndex) => {
                                    const propName = getPropertyName(col);
                                    return (
                                        <p key={colIndex} className="px-2 py-1 break-words">
                                            {getOrderValue(order, propName)}
                                        </p>
                                    );
                                })}


                                <div className="px-2 py-1 flex gap-2 justify-center">

                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => openEditDialog(order)}
                                    >
                                        <FaEdit />
                                    </button>


                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => openDeleteDialog(order._id || order.id || "")}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>


            <EditOrderDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                order={selectedOrder ?? null} 
                onSave={handleSaveEdit}
                loading={loading}
            />




            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {error && (
                        <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleConfirmDelete}
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default OrderTable;