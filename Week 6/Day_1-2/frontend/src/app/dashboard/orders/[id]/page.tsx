"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  ChevronDown,
  Printer,
  Save,
  User,
  Package,
  MapPin,
  MoreHorizontal,
} from "lucide-react";
import {
  useGetOrderByIdQuery,
  Order,
  OrderItem,
} from "@/lib/api/ordersApiSlice";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function OrderDetailsPage() {
  const params = useParams();
  const rawId = params?.id;
  const idStr = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useGetOrderByIdQuery(idStr);

  const items = useMemo<OrderItem[]>(() => order?.items || [], [order?.items]);

  // extend `Order` locally with optional UI-only fields that the backend may include
  type ExtendedOrder = Order & {
    currency?: string;
    discount?: number | { $numberDecimal?: string };
    shippingRate?: number | { $numberDecimal?: string };
    shippingMethod?: string;
  };

  const ord = order as ExtendedOrder | undefined;

  const toNumber = (v: unknown): number => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v) || 0;
    if (typeof v === "object") {
      const obj = v as { $numberDecimal?: unknown };
      if (obj && typeof obj.$numberDecimal === "string")
        return Number(obj.$numberDecimal) || 0;
      try {
        return Number(JSON.stringify(v)) || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  };

  const { subtotal, tax, total } = useMemo(() => {
    const computedSubtotal = ord?.subtotal
      ? toNumber(ord.subtotal)
      : items.reduce(
          (s: number, it: OrderItem) =>
            s + toNumber(it.price) * (it.quantity || 0),
          0
        );
    const computedTax = +(computedSubtotal * 0.2);
    const computedTotal = order?.total
      ? toNumber(order.total)
      : order?.totalAmount
        ? Number(order.totalAmount)
        : computedSubtotal + computedTax;
    return {
      subtotal: computedSubtotal,
      tax: computedTax,
      total: computedTotal,
    };
  }, [ord, items, order?.total, order?.totalAmount]);

  if (!idStr) return <div className="p-6">Invalid order id</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Orders Details
        </h1>
        <Breadcrumb
          items={[
            { label: "Home", href: "/dashboard" },
            { label: "Order List", href: "/dashboard/orders" },
            { label: `Order ${idStr}` },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          Loading order...
        </div>
      ) : isError ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-red-500">
          Failed to load order.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Orders ID: {order?.orderNumber || order?._id}
                  </h2>
                  <Badge
                    className={
                      order?.fulfillmentStatus === "pending"
                        ? "bg-orange-100 text-orange-800 mt-2"
                        : "bg-green-100 text-green-800 mt-2"
                    }
                  >
                    {order?.fulfillmentStatus || "-"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {order?.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "-"}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <span>Change Status</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Printer className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => refetch()}>
                  <Save className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Customer, Order, and Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">Customer</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Full Name:</span>{" "}
                    {order?.shippingAddress?.fullName || "-"}
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span>{" "}
                    {order?.userId || "-"}
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{" "}
                    {order?.shippingAddress?.phone || "-"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  View profile
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">Order Info</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Shipping:</span>{" "}
                    {ord?.shippingMethod || "Standard"}
                  </p>
                  <p>
                    <span className="text-gray-600">Payment Method:</span>{" "}
                    {order?.paymentMethod || "-"}
                  </p>
                  <p>
                    <span className="text-gray-600">Status:</span>{" "}
                    {order?.paymentStatus || "-"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  Download info
                </Button>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900">Deliver to</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Address:</span>{" "}
                    {order?.shippingAddress?.addressLine1 ||
                      order?.shippingAddress?.street1 ||
                      "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order?.shippingAddress?.city || ""}{" "}
                    {order?.shippingAddress?.state || ""}{" "}
                    {order?.shippingAddress?.postalCode || ""}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  View profile
                </Button>
              </Card>
            </div>

            {/* Payment Info and Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-4">Payment Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                    <span>{order?.paymentMethod || "-"}</span>
                  </div>
                  <p>
                    <span className="text-gray-600">Business name:</span>{" "}
                    {order?.shippingAddress?.fullName || "-"}
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{" "}
                    {order?.shippingAddress?.phone || "-"}
                  </p>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-4">Note</h3>
                <Textarea
                  placeholder="Type some notes"
                  className="min-h-[100px] resize-none"
                />
              </Card>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Products</h3>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item: OrderItem, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded"></div>
                          <span className="text-sm text-gray-900">
                            {item.productName || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order?.orderNumber || order?._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(toNumber(item.price) * (item.quantity || 0)).toFixed(
                          2
                        )}{" "}
                        {ord?.currency || "USD"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">
                      {subtotal.toFixed(2)} {ord?.currency || "USD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (20%)</span>
                    <span className="text-gray-900">
                      {tax.toFixed(2)} {ord?.currency || "USD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-gray-900">
                      {ord?.discount ? toNumber(ord.discount).toFixed(2) : "0"}{" "}
                      {ord?.currency || "USD"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping Rate</span>
                    <span className="text-gray-900">
                      {ord?.shippingRate
                        ? toNumber(ord.shippingRate).toFixed(2)
                        : "0"}{" "}
                      {ord?.currency || "USD"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {total.toFixed(2)} {ord?.currency || "USD"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
