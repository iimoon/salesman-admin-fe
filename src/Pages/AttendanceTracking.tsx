import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Table from "../components/Table";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "../hooks/useApi";

export default function AttendanceTracking() {
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const attendanceColumns = ["Name", "Check-in", "Check-out", "Location"];
    const { fetchAttendance } = useApi();

    useEffect(() => {
        const getAttendance = async () => {
            setLoading(true);
            try {
                const data = await fetchAttendance();
                setAttendanceData(data.records);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getAttendance();
    }, []);

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            <PageTitle title="Attendance Tracking" />
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
                    <Table
                        title="Attendance Summary"
                        columns={attendanceColumns}
                        data={attendanceData}
                        propertyMap={{
                            "Name": "salesman.name",
                            "Check-in": "checkInTime",
                            "Check-out": "checkOutTime",
                            "Location": "location",
                        }}
                        showExport={true}
                        showActions={false}
                    />
                )}
            </div>
        </div>
    );
}
