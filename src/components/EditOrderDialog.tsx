import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Plus } from "lucide-react";
import { Order } from "@/types/type";

type Product = {
  _id: string;
  name: string;
  price: number;
};


type EditOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order | null;
  onSave: (id: string, updatedData: Record<string, any>) => Promise<any>;
  loading: boolean;
};

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  open,
  onOpenChange,
  order,
  onSave,
  loading
}) => {
  const [editedOrder, setEditedOrder] = useState<Record<string, any>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [orderProducts, setOrderProducts] = useState<Array<{ productId: string, quantity: number, price?: number }>>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState("");
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { fetchProducts } = useApi();

  useEffect(() => {
    if (open && order) {
      setEditedOrder({
        clientId: order.clientId?._id,
        status: order.status,
        totalAmount: order.totalAmount
      });

      
      const formattedProducts = order.products?.map(product => ({
        productId: product.productId._id,
        quantity: product.quantity,
        price: product.productId.price
      }))|| [];

      setOrderProducts(formattedProducts);
      setIsFormChanged(false);

      
      fetchProductsList();
    }
  }, [open, order]);

  const fetchProductsList = async () => {
    setLoadingProducts(true);
    try {
      const data = await fetchProducts();
      console.log(data);
      setProducts(data.products);
    } catch (err: any) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditedOrder(prev => ({
      ...prev,
      [field]: value,
    }));
    setIsFormChanged(true);
  };

  const handleAddProduct = () => {
    const updatedProducts = [...orderProducts, { productId: "", quantity: 1 }];
    setOrderProducts(updatedProducts);
    setIsFormChanged(true);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...orderProducts];
    updatedProducts.splice(index, 1);
    setOrderProducts(updatedProducts);
    calculateTotal(updatedProducts);
    setIsFormChanged(true);
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...orderProducts];

    if (field === "productId" && typeof value === "string") {
      // Find product price
      const product = products.find(p => p._id === value);
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
        price: product?.price || 0
      };
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value
      };
    }

    setOrderProducts(updatedProducts);
    calculateTotal(updatedProducts);
    setIsFormChanged(true);
  };

  const calculateTotal = (products: Array<{ productId: string, quantity: number, price?: number }>) => {
    let total = 0;

    products.forEach(item => {
      const productPrice = item.price ?? 
        products.find(p => p.productId === item.productId)?.price ?? 0; 

      total += productPrice * item.quantity;
    });

    setEditedOrder(prev => ({
      ...prev,
      totalAmount: total,
    }));
  };

  const handleSave = async () => {
    if (!order?._id) return;
    const formattedProducts = orderProducts.map(product => ({
      productId: product.productId,
      quantity: product.quantity
    }));
  
    const orderData = {
      status: editedOrder.status,
      totalAmount: editedOrder.totalAmount,
      products: formattedProducts
    };
  
    try {
      await onSave(order._id, orderData);
      setIsFormChanged(false);
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    }
  };

  const getProductName = (id: string) => {
    const product = products.find(p => p._id === id);
    return product ? product.name : "Unknown Product";
  };

  const areProductsValid = () => {
    return orderProducts.length > 0 && orderProducts.every(p => p.productId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>Update the order details below.</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid gap-4 py-4">
          {/* Status Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Status</label>
            <div className="col-span-3">
              <Select
                value={editedOrder.status}
                onValueChange={(value) => handleInputChange("status", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Total Amount */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right font-medium">Total Amount</label>
            <div className="col-span-3">
              <Input
                type="number"
                value={editedOrder.totalAmount || ""}
                onChange={(e) => handleInputChange("totalAmount", parseFloat(e.target.value))}
                disabled={true}
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Automatically calculated from products</p>
            </div>
          </div>

          {/* Products Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Products</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddProduct}
                disabled={loading || loadingProducts}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            {loadingProducts ? (
              <div className="space-y-2">
                {[1, 2].map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {orderProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        value={product.productId}
                        onValueChange={(value) => handleProductChange(index, "productId", value)}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p._id} value={p._id}>
                              {p.name} - ${p.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))}
                      className="w-24"
                      placeholder="Qty"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(index)}
                      disabled={loading || orderProducts.length <= 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Product Summary */}
                {orderProducts.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded border">
                    <h4 className="font-medium mb-2">Order Summary</h4>
                    <ul className="space-y-1 text-sm">
                      {orderProducts.map((product, index) => (
                        product.productId && (
                          <li key={index} className="flex justify-between">
                            <span>{getProductName(product.productId)} × {product.quantity}</span>
                            <span>${((product.price || 0) * product.quantity).toFixed(2)}</span>
                          </li>
                        )
                      ))}
                      <li className="flex justify-between font-medium pt-2 border-t mt-2">
                        <span>Total</span>
                        <span>${editedOrder.totalAmount?.toFixed(2) || "0.00"}</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !areProductsValid() || !isFormChanged}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;