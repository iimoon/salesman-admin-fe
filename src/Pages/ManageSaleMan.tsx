import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi"; 
import PageTitle from "../components/PageTitle";
import checklist from "../assets/icons/checklist.png";
import salesmanicon from "../assets/icons/salesmanicon.png";
import moneybag from "../assets/icons/moneybag.png";
import attendance from "../assets/icons/attendance.png";
import { Skeleton } from "@/components/ui/skeleton";


interface PerformanceData {
    totalSalesAmount: number;
    totalCompletedOrders: number;
    attendancePercentage: number;
    totalExpenseAmount: number;
}

const ManageSaleMan = () => {
    const { fetchPerformanceData } = useApi();  
    const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const data: PerformanceData = await fetchPerformanceData(); 
                setPerformanceData(data);
            } catch (error) {
                console.error("Error fetching performance data:", error);
            } finally {
                setLoading(false);
            }
        };

        getData();  
    }, []); 

    return (
        <div className="bg-white h-[calc(95vh-1.5rem)] rounded-tl-lg rounded-bl-lg p-10 px-10 overflow-auto">
            <PageTitle title="Metrics Overview" />
            <div className="flex flex-col gap-6 mt-15">
                <div className="flex gap-6">
                    
                    <div className="bg-[#C8DFFF] h-60 w-80 border border-[#5EA1FF] rounded-lg shadow-lg flex flex-col items-center justify-center">
                        {loading ? (
                            <Skeleton className="w-20 h-20 mb-2" />
                        ) : (
                            <img src={salesmanicon} alt="Sales" className="w-20 h-20 mb-2" />
                        )}
                        <p className="text-lg font-bold text-[#094497]">
                            Sales:{" "}
                            <span className="text-black">
                                {loading ? <Skeleton className="w-24" /> : `₹${performanceData?.totalSalesAmount ?? 0}`}
                            </span>
                        </p>
                    </div>

                    
                    <div className="bg-[#E7F1FF] h-60 w-80 border border-[#5EA1FF] rounded-lg shadow-lg flex flex-col items-center justify-center">
                        {loading ? (
                            <Skeleton className="w-20 h-20 mb-2" />
                        ) : (
                            <img src={checklist} alt="Orders" className="w-20 h-20 mb-2" />
                        )}
                        <p className="text-lg font-bold text-[#094497]">
                            Orders:{" "}
                            <span className="text-black">
                                {loading ? <Skeleton className="w-24" /> : performanceData?.totalCompletedOrders ?? 0}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex gap-6">
                    
                    <div className="bg-[#E7F1FF] h-60 w-80 border border-[#5EA1FF] rounded-lg shadow-lg flex flex-col items-center justify-center">
                        {loading ? (
                            <Skeleton className="w-20 h-20 mb-2" />
                        ) : (
                            <img src={attendance} alt="Attendance" className="w-20 h-20 mb-2" />
                        )}
                        <p className="text-lg font-bold text-[#094497]">
                            Attendance:{" "}
                            <span className="text-black">
                                {loading ? <Skeleton className="w-24" /> : performanceData?.attendancePercentage ?? 0}%
                            </span>
                        </p>
                    </div>

                    
                    <div className="bg-[#C8DFFF] h-60 w-80 border border-[#5EA1FF] rounded-lg shadow-lg flex flex-col items-center justify-center">
                        {loading ? (
                            <Skeleton className="w-20 h-20 mb-2" />
                        ) : (
                            <img src={moneybag} alt="Expenses" className="w-20 h-20 mb-2" />
                        )}
                        <p className="text-lg font-bold text-[#094497]">
                            Expenses:{" "}
                            <span className="text-black">
                                {loading ? <Skeleton className="w-24" /> : `₹${performanceData?.totalExpenseAmount ?? 0}`}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageSaleMan;
