import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Table from "../components/Table";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "../hooks/useApi";
import TaskAssignmentPopup from "../components/popups/TaskAssignmentPopup";
import { Button } from "../components/ui/button";

export default function TaskAssignment() {
    const [taskData, setTaskData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const taskColumns = ["Salesman", "Task Description", "Due Date", "Status"];
    const { fetchTask } = useApi();

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const handleAssignTask = (task: { salesman: string; taskDescription: string; dueDate: string }) => {
        console.log("Task assigned:", task);
    };

    useEffect(() => {
        const getTasks = async () => {
            setLoading(true);
            try {
                const data = await fetchTask();
                setTaskData(data.tasks);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getTasks();
    }, []);

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            <PageTitle title="Task Assignment" />
            <div className="mt-10">
                {loading ? (
                    <div className="flex flex-col space-y-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                ) : (
                    <Table
                        title="Task List"
                        columns={taskColumns}
                        data={taskData}
                        propertyMap={{
                            "Salesman": "salesman.name",
                            "Task Description": "taskDescription",
                            "Due Date": "dueDate",
                            "Status": "status",
                        }}
                        showExport={true}
                    />
                )}
            </div>

            <div className="mt-4">
                <Button
                    className="bg-[#094497] text-white hover:bg-[#072c66]"
                    onClick={openPopup}
                >
                    Assign Task +
                </Button>
            </div>

            <TaskAssignmentPopup
                isOpen={isPopupOpen}
                onClose={closePopup}
                onAssign={handleAssignTask}
            />
        </div>
    );
}
