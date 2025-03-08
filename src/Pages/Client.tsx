import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Table from "../components/Table";
import { useApi } from "../hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../components/ui/button";
import AddClientPopup from "../components/popups/AddClientPopup";

export default function Client() {
    const clientColumns = ["Name", "Contact", "Address", "Orders Placed", "Outstanding Due"];
    const { fetchClients, addClient, editClient, deleteClient } = useApi();
    const [clientData, setClientData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const getClients = async () => {
            try {
                const data = await fetchClients();
                console.log(data)
                setClientData(data.clients);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getClients();
    }, []);

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            <PageTitle title="Client Management" />
            <div className="mt-10">
                {loading ? (
                    <Skeleton className="w-full h-[300px] rounded-md" />
                ) : error ? (
                    <div className="text-red-500">Error: {error}</div>
                ) : (
                    <Table
                        title="Client List"
                        columns={clientColumns}
                        data={clientData}
                        propertyMap={{
                            "Name": "name",
                            "Contact": "contact",
                            "Address": "address",
                            "Orders Placed": "ordersPlaced",
                            "Outstanding Due": "outstandingDue"
                        }}
                        showExport={false}
                        showActions={true}
                        onEdit={editClient}
                        onDelete={deleteClient}
                    />
                )}
            </div>

            <div className="mt-6">
                <Button
                    className="bg-[#094497] text-white hover:bg-[#072c66]"
                    onClick={() => setIsPopupOpen(true)}
                >
                    Add Client +
                </Button>
            </div>

            <AddClientPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onSave={addClient}
            />
        </div>
    );
}
