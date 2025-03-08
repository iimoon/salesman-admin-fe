import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Assuming this is from shadcn
import { useApi } from "../../hooks/useApi"; // Import your useApi hook

type TaskAssignmentPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (task: { salesman: string; taskDescription: string; dueDate: string }) => void;
};

export default function TaskAssignmentPopup({ isOpen, onClose, onAssign }: TaskAssignmentPopupProps) {
    const { fetchSalesmen, addTask } = useApi(); // Use the fetchSalesman and addTask functions
    const [salesmen, setSalesmen] = useState<any[]>([]); // State to hold fetched salesmen
    const [salesman, setSalesman] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);


    // Fetch salesmen data when the component mounts
    useEffect(() => {
        const getSalesmen = async () => {
            try {
                const data = await fetchSalesmen();
                setSalesmen(data.data); // Set the salesmen data to state
            } catch (error) {
                console.log("Error fetching salesmen:", error);
            }
        };
        getSalesmen();
    }, []);

    // Handle task assignment
    const handleAssign = async () => {
        if (!salesman || !taskDescription || !dueDate) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const taskData = { salesman, taskDescription, dueDate: dueDate.toISOString() }; // Convert date to string
            await addTask(taskData); // Add the task using addTask
            onAssign(taskData); // Pass the task data to the parent component
            onClose(); // Close the popup
            // Reset input fields after closing
            setSalesman("");
            setTaskDescription("");
            setDueDate(undefined);
        } catch (error) {
            console.error("Error assigning task:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign New Task</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Salesman</Label>
                        <Select value={salesman} onValueChange={setSalesman}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Salesman" />
                            </SelectTrigger>
                            <SelectContent>
                                {salesmen.map((salesman) => (
                                    <SelectItem key={salesman._id} value={salesman._id}>
                                        {salesman.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Task Description</Label>
                        <Input
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            placeholder="Enter task description"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="w-[240px] justify-start text-left font-normal"
                                >
                                    <CalendarIcon />
                                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAssign} className="bg-blue-600 text-white hover:bg-blue-700">
                        Assign Task
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
