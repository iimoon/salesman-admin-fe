import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import Table from "../components/Table";
import { Button } from "../components/ui/button";
import ProductPopup from "../components/popups/ProductPopup";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";

type Product = {
    name: string;
    price: number;
    quantity?: number;
    stock?: number;
};

const ProductsManagement = () => {
    const productColumns = ["Name", "Price", "Stock"];

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [productData, setProductData] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { fetchProducts, addProduct, editProduct, deleteProduct } = useApi();

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProductData(data.products);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    const refetchProducts = async () => {
        try {
            const data = await fetchProducts();
            setProductData(data.products);
        } catch (error) {
            toast.error("Failed to refetch products.");
        }
    };

    const handleAddProduct = () => {
        const defaultProduct: Product = { name: "", price: 0, stock: 0, quantity: 0 };
        setSelectedProduct(defaultProduct);
        setIsPopupOpen(true);
    };

    const handleSaveProduct = async (product: { name: string; price: number; stock: number }) => {
        try {
            const response = await addProduct(product);
            if (response.success) {
                refetchProducts();
                toast.success("Product added successfully!");
            }
            setIsPopupOpen(false);
        } catch (error) {
            toast.error("Failed to add product.");
        }
    };

    return (
        <div className="bg-white h-[95vh] rounded-tl-lg rounded-bl-lg p-10 px-30 w-[1220px]">
            <PageTitle title="Products Management" />

            <div className="mt-10">
                {loading ? (
                    <Skeleton className="h-16 w-full mb-4" />
                ) : (
                    <Table
                        title="Product Inventory"
                        columns={productColumns}
                        data={productData}
                        showExport={true}
                        showActions={true}
                        onEdit={editProduct}
                        onDelete={deleteProduct}
                    />
                )}
            </div>

            <div className="mt-6">
                <Button className="bg-[#094497] text-white hover:bg-[#072c66]" onClick={handleAddProduct}>
                    Add New Product +
                </Button>
            </div>

            {selectedProduct && (
                <ProductPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    onSave={handleSaveProduct}
                    refetchProducts={refetchProducts}
                    initialProduct={{
                        name: selectedProduct.name,
                        price: selectedProduct.price,
                        stock: selectedProduct.stock ?? 0,
                    }}
                />
            )}
        </div>
    );
};

export default ProductsManagement;
