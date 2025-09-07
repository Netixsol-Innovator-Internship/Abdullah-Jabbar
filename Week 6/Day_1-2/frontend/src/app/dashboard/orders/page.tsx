
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, ChevronDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export default function OrdersListPage() {
  const orders = [
    {
      id: "#25426",
      product: "Lorem Ipsum",
      date: "Nov 8th,2023",
      customer: "Kavin",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "K",
    },
    {
      id: "#25425",
      product: "Lorem Ipsum",
      date: "Nov 7th,2023",
      customer: "Komael",
      status: "Canceled",
      amount: "₹200.00",
      avatar: "K",
    },
    {
      id: "#25424",
      product: "Lorem Ipsum",
      date: "Nov 6th,2023",
      customer: "Nikhil",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "N",
    },
    {
      id: "#25423",
      product: "Lorem Ipsum",
      date: "Nov 5th,2023",
      customer: "Shivam",
      status: "Canceled",
      amount: "₹200.00",
      avatar: "S",
    },
    {
      id: "#25422",
      product: "Lorem Ipsum",
      date: "Nov 4th,2023",
      customer: "Shadab",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "S",
    },
    {
      id: "#25421",
      product: "Lorem Ipsum",
      date: "Nov 2nd,2023",
      customer: "Yogesh",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "Y",
    },
    {
      id: "#25423",
      product: "Lorem Ipsum",
      date: "Nov 1st,2023",
      customer: "Sunita",
      status: "Canceled",
      amount: "₹200.00",
      avatar: "S",
    },
    {
      id: "#25421",
      product: "Lorem Ipsum",
      date: "Nov 1st,2023",
      customer: "Priyanka",
      status: "Delivered",
      amount: "₹200.00",
      avatar: "P",
    },
  ]

  return (
 
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders List</h1>
            <Breadcrumb items={[{ label: "Home", href: "/dashboard" }, { label: "Order List" }]} />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Calendar className="w-4 h-4" />
              <span>Feb 16,2022 - Feb 20,2022</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <span>Change Status</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Purchases</h2>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link href={`/dashboard/orders/${order.id.replace("#", "")}`} className="text-blue-600 hover:text-blue-800">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">{order.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={order.status === "Delivered" ? "default" : "secondary"}
                        className={
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 p-4 border-t border-gray-200">
            <Button variant="default" size="sm" className="bg-gray-900 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <span className="text-gray-500">...</span>
            <Button variant="outline" size="sm">
              10
            </Button>
            <Button variant="outline" size="sm">
              NEXT
            </Button>
          </div>
        </div>
      </div>
  
  )
}
