import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PageTitle from "../components/PageTitle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { CiSaveDown1 } from "react-icons/ci";
import { useApi } from "../hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";


interface ReportData {
    totalSalesAmount: number;
    totalCompletedOrders: number;
    attendancePercentage: string;
    totalExpenseAmount: number;
}


interface FormattedReportData {
    sales: string;
    attendance: string;
    expenses: string;
    orders: number;
}

export default function Reports() {
    const [date, setDate] = React.useState<Date | undefined>();
    const { generalReport } = useApi();
    const [reportData, setReportData] = React.useState<FormattedReportData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        async function fetchReport() {
            try {
                const data: ReportData = await generalReport();
                console.log(data);
                setReportData({
                    sales: `₹${data.totalSalesAmount.toLocaleString()}`,
                    attendance: data.attendancePercentage,
                    expenses: `₹${data.totalExpenseAmount.toLocaleString()}`,
                    orders: data.totalCompletedOrders,
                });
            } catch (error) {
                console.error("Failed to fetch report:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchReport();
    }, []);

    const handleGenerateReport = (): void => {
        toast.info("Not implemented yet");
    };

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            <PageTitle title="Reports" />
            <div className="mt-10">
                <div className="w-[800px] bg-[#D0E4FF] p-8 rounded-lg h-sm">
                    <h1 className="font-bold text-2xl text-[#093497]">Generate Reports</h1>
                    <div className="border-b-4 border-[#093497] mt-4"></div>

                    <div className="mt-6">
                        <div className="grid font-semibold text-[#093497]"
                            style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                            <p className="px-4 py-2">Sales Report</p>
                            <p className="px-4 py-2">Attendance Report</p>
                            <p className="px-4 py-2">Expenses Report</p>
                            <p className="px-4 py-2">Orders Report</p>
                        </div>

                        <div className="grid text-black-700 font-semibold"
                            style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                            {loading ? (
                                <>
                                    <Skeleton className="h-6 w-24 mx-4 my-2" />
                                    <Skeleton className="h-6 w-24 mx-4 my-2" />
                                    <Skeleton className="h-6 w-24 mx-4 my-2" />
                                    <Skeleton className="h-6 w-24 mx-4 my-2" />
                                </>
                            ) : (
                                <>
                                    <p className="px-4 py-2">{reportData?.sales}</p>
                                    <p className="px-4 py-2">{reportData?.attendance}</p>
                                    <p className="px-4 py-2">{reportData?.expenses}</p>
                                    <p className="px-4 py-2">{reportData?.orders}</p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[240px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Button
                                className="bg-[#093497] flex items-center gap-2"
                                onClick={handleGenerateReport}
                            >
                                Generate Report <CiSaveDown1 size={24} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
