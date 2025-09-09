"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, ChevronDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useGetAllOrdersQuery } from "@/lib/api/ordersApiSlice";
import { useState } from "react";

export default function OrdersListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({
    page,
    limit: 10,
  });

  const orders = data?.orders || [];

  type OrderRow = {
    _id: string;
    orderNumber?: string;
    createdAt?: string;
    shippingAddress?: { fullName?: string } | null;
    paymentStatus?: string;
    total?: unknown;
    currency?: string;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders List</h1>
          <Breadcrumb
            items={[
              { label: "Home", href: "/dashboard" },
              { label: "Order List" },
            ]}
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent"
          >
            <Calendar className="w-4 h-4" />
            <span>Filter by Date</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-transparent"
          >
            <span>Change Status</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Recent Purchases
          </h2>
          <Button variant="ghost" size="icon" onClick={() => refetch()}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 text-gray-500">Loading...</div>
          ) : isError ? (
            <div className="p-6 text-red-500">Failed to load orders.</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-gray-500">No orders found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(orders as OrderRow[]).map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      <Link
                        href={`/dashboard/orders/${(o.orderNumber || o._id).toString().replace("#", "")}`}
                      >
                        #{o.orderNumber || o._id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                            {(o?.shippingAddress?.fullName || "U").substring(
                              0,
                              1
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">
                          {o?.shippingAddress?.fullName || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          o.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }
                      >
                        {o.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {o.total ? Number(o.total).toString() : "-"}{" "}
                      {o.currency || "USD"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 p-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Prev
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {data?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(data?.totalPages || 1, page + 1))}
            disabled={page >= (data?.totalPages || 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
