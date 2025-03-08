import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Table from "../components/Table";
import { useApi } from "../hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalesManList() {
    const salesmanColumns = ["Name", "Email", "Points"];
    const { fetchSalesmen } = useApi();
    const [salesManData, setSalesManData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const { editSalesman, deleteSalesman } = useApi();


    useEffect(() => {
        const getSalesmen = async () => {
            try {
                const data = await fetchSalesmen();
                setSalesManData(data.data);
                console.log(data.data)
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getSalesmen();
    }, []);

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            <PageTitle title="Salesman List" />
            <div className="mt-10">
                {loading ? (
                    <Skeleton className="w-full h-[300px] rounded-md" />
                ) : error ? (
                    <div className="text-red-500">Error: {error}</div>
                ) : (
                    <Table title="Salesman List" columns={salesmanColumns} data={salesManData} showExport={true} showActions={true} onEdit={editSalesman} onDelete={deleteSalesman} />
                )}
            </div>
        </div>
    );
}
