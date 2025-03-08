import { FaTrash, FaEdit } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type TableProps = {
    title: string;
    columns: string[];
    propertyMap?: Record<string, string>;
    data: Record<string, any>[];
    showExport?: boolean;
    showActions?: boolean;
    onEdit?: (id: string, updatedData: Record<string, any>) => Promise<any>;
    onDelete?: (id: string) => Promise<any>;
};

const Table: React.FC<TableProps> = ({
    title,
    columns,
    propertyMap = {},
    data,
    // showExport,
    showActions,
    onEdit,
    onDelete
}) => {
    const [selectedRow, setSelectedRow] = useState<Record<string, any> | null>(null);
    const [editedData, setEditedData] = useState<Record<string, any>>({});
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");


    const getPropertyName = (column: string): string => {

        if (propertyMap[column]) {
            return propertyMap[column];
        }
        return column.toLowerCase().replace(/\s+/g, "_");
    };


    const openEditDialog = (row: Record<string, any>) => {
        setSelectedRow(row);
        setEditedData({ ...row });
        setError("");
        setIsEditDialogOpen(true);
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, column: string) => {
        const fieldName = getPropertyName(column);
        setEditedData(prev => ({
            ...prev,
            [fieldName]: e.target.value,
        }));
    };


    const handleSaveEdit = async () => {
        if (!selectedRow?._id || !onEdit) return;

        setLoading(true);
        setError("");
        console.log("Edited data:", editedData)

        try {
            await onEdit(selectedRow._id, editedData);
            setIsEditDialogOpen(false);

            window.location.reload();
        } catch (err: any) {
            setError(err.message || "Failed to save changes");
        } finally {
            setLoading(false);
        }
    };


    const openDeleteDialog = (id: string) => {
        setRowToDelete(id);
        setError("");
        setIsDeleteDialogOpen(true);
    };


    const handleConfirmDelete = async () => {
        if (!rowToDelete || !onDelete) return;

        setLoading(true);
        setError("");

        try {
            await onDelete(rowToDelete);
            setIsDeleteDialogOpen(false);
            window.location.reload();
        } catch (err: any) {
            setError(err.message || "Failed to delete");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-[#D0E4FF] p-8 rounded-lg shadow-md h-sm overflow-x-auto">
            <h1 className="font-bold text-2xl text-[#093497]">{title}</h1>
            <div className="border-b-4 border-[#093497] mt-4"></div>

            <div className="mt-6">

                <div
                    className="grid font-semibold text-[#093497] sticky top-0 z-10"
                    style={{ gridTemplateColumns: `repeat(${columns.length + (showActions ? 1 : 0)}, minmax(0, 1fr))` }}
                >
                    {columns.map((col, index) => (
                        <p key={index} className="px-2 py-1">{col}</p>
                    ))}
                    {showActions && <p className="px-2 py-1">Actions</p>}
                </div>


                <div className="h-60 overflow-y-auto">
                    {data.map((row, index) => (
                        <div
                            key={index}
                            className="grid mt-4 text-gray-700 border-b border-gray-400"
                            style={{ gridTemplateColumns: `repeat(${columns.length + (showActions ? 1 : 0)}, minmax(0, 1fr))` }}
                        >
                            {columns.map((col, colIndex) => {
                                const value = getPropertyName(col)
                                    .split('.')
                                    .reduce((obj, prop) => (obj && obj[prop] !== undefined ? obj[prop] : "—"), row);

                                return (
                                    <p key={colIndex} className="px-2 py-1 break-words">
                                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                                    </p>
                                );
                            })}


                            {showActions && (
                                <div className="px-2 py-1 flex gap-2 justify-center">
                                    {/* Edit Button */}
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => openEditDialog(row)}
                                    >
                                        <FaEdit />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => openDeleteDialog(row._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Record</DialogTitle>
                        <DialogDescription>Modify the details below.</DialogDescription>
                    </DialogHeader>
                    <div>
                        {error && (
                            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {columns.map((col) => {
                            const propName = getPropertyName(col);
                            return (
                                <div key={col} className="mb-3">
                                    <label className="font-semibold">{col}</label>
                                    <input
                                        type="text"
                                        value={editedData[propName] || ""}
                                        onChange={(e) => handleInputChange(e, col)}
                                        className="w-full p-2 border rounded mt-1"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleSaveEdit}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the record.
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

export default Table;