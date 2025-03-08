import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddClientPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: {
        name: string;
        contact: string;
        address: string;  
        companyName: string;  
        email: string;  
        outstandingDue?: number;  
        ordersPlaced?: number;  
    }) => void;
};

export default function AddClientPopup({ isOpen, onClose, onSave }: AddClientPopupProps) {
    
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [address, setAddress] = useState(""); 
    const [companyName, setCompanyName] = useState("");  
    const [email, setEmail] = useState("");  
    const [outstandingDue, setOutstandingDue] = useState("0");  
    const [ordersPlaced, setOrdersPlaced] = useState("0");  

    
    const handleSave = () => {
        if (!name || !contact || !address || !companyName || !email) {
            alert("Please fill all required fields.");
            return;
        }

        onSave({
            name,
            contact,
            address,
            companyName,
            email,
            outstandingDue: parseFloat(outstandingDue) || 0,
            ordersPlaced: parseInt(ordersPlaced) || 0
        });

        onClose();

        
        setName("");
        setContact("");
        setAddress("");
        setCompanyName("");
        setEmail("");
        setOutstandingDue("0");
        setOrdersPlaced("0");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Client Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter client name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Company Name</Label>
                        <Input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter company name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Contact</Label>
                        <Input
                            type="tel"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Enter contact number"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Address</Label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter client address"
                            required
                        />
                    </div>

                </div>
                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
                        Save Client
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}