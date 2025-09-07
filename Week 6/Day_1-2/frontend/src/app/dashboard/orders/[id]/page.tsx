
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, ChevronDown, Printer, Save, User, Package, MapPin, MoreHorizontal } from "lucide-react"

export default function OrderDetailsPage() {
  const orderItems = [
    { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "₹800.40" },
    { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "₹800.40" },
    { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "₹800.40" },
    { name: "Lorem Ipsum", orderId: "#25421", quantity: 2, total: "₹800.40" },
  ]

  return (

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders Details</h1>
          <Breadcrumb
            items={[{ label: "Home", href: "/dashboard" }, { label: "Order List", href: "/orders" }, { label: "Order Details" }]}
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Orders ID: #6743</h2>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 mt-2">Pending</Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Feb 16,2022 - Feb 20,2022</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <span>Change Status</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save
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
                  <span className="text-gray-600">Full Name:</span> Shristi Singh
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> shristi@gmail.com
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span> +91 904 231 1212
                </p>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
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
                  <span className="text-gray-600">Shipping:</span> Next express
                </p>
                <p>
                  <span className="text-gray-600">Payment Method:</span> Paypal
                </p>
                <p>
                  <span className="text-gray-600">Status:</span> Pending
                </p>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
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
                  <span className="text-gray-600">Address:</span> Dharam Colony, Palam Vihar, Gurgaon, Haryana
                </p>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
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
                  <span>Master Card **** **** 6557</span>
                </div>
                <p>
                  <span className="text-gray-600">Business name:</span> Shristi Singh
                </p>
                <p>
                  <span className="text-gray-600">Phone:</span> +91 904 231 1212
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Note</h3>
              <Textarea placeholder="Type some notes" className="min-h-[100px] resize-none" />
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
                    <input type="checkbox" className="rounded border-gray-300" />
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
                {orderItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <span className="text-sm text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total}</td>
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
                  <span className="text-gray-900">₹3,201.6</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (20%)</span>
                  <span className="text-gray-900">₹640.32</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-gray-900">₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sipping Rate</span>
                  <span className="text-gray-900">₹0</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹3841.92</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  )
}
