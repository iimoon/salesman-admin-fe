import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; 

type ProductPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: { name: string; price: number; stock: number }) => void;
    refetchProducts: () => void;
    initialProduct?: { name: string; price: number; stock: number };
};


export default function ProductPopup({ isOpen, onClose, onSave, refetchProducts, initialProduct }: ProductPopupProps) {
    const [name, setName] = useState(initialProduct?.name || "");
    const [price, setPrice] = useState<number | "">(initialProduct?.price || "");
    const [stock, setStock] = useState<number | "">(initialProduct?.stock || "");

    useEffect(() => {
        if (isOpen && initialProduct) {
            setName(initialProduct.name);
            setPrice(initialProduct.price);
            setStock(initialProduct.stock);
        }
    }, [isOpen, initialProduct]);
    
    const handleSave = () => {
        if (!name || !price || !stock) {
            alert("Please fill all fields.");
            return;
        }
        
        onSave({ name, price: Number(price), stock: Number(stock) });
        onClose();
        setName(""); 
        setPrice("");
        setStock("");

        
        toast.success("Product added successfully!");

        
        refetchProducts();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <Label className="text-sm font-medium">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-sm font-medium">Price (₹)</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                            placeholder="Enter price"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-sm font-medium">Quantity</Label>
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value ? Number(e.target.value) : "")}
                            placeholder="Enter quantity"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">Save Product</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
