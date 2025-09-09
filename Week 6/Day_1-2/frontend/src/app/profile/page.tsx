"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth-rtk";
import {
  useGetAllOrdersQuery,
  useGetUserOrdersQuery,
} from "@/lib/api/ordersApiSlice";
import {
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
  useTestConnectionQuery,
} from "@/lib/api/usersApiSlice";
import { formatCurrency } from "@/lib/utils";

interface AddressFormData {
  label?: string;
  fullName?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
  addressIndex?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null
  );
  const [addressForm, setAddressForm] = useState<AddressFormData>({});
  const limit = 5; // Orders per page

  const [updateUserAddress, { isLoading: isUpdatingAddress }] =
    useUpdateUserAddressMutation();
  const [deleteUserAddress, { isLoading: isDeletingAddress }] =
    useDeleteUserAddressMutation();

  // Test connection to backend
  const { data: testData, error: testError } = useTestConnectionQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  );

  useEffect(() => {
    if (testData) {
      console.log("Backend connection test successful:", testData);
    }
    if (testError) {
      console.error("Backend connection test failed:", testError);
    }
  }, [testData, testError]);

  // Handle address form submission
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting address form:", addressForm);
    console.log("Editing index:", editingAddressIndex);

    try {
      const addressData = {
        ...addressForm,
        addressIndex:
          editingAddressIndex !== null
            ? editingAddressIndex.toString()
            : undefined,
      };
      console.log("Sending address data:", addressData);

      const result = await updateUserAddress(addressData).unwrap();
      console.log("Address update result:", result);

      setShowAddressForm(false);
      setEditingAddressIndex(null);
      setAddressForm({});
      // The user data will be refetched automatically due to invalidatesTags
    } catch (error) {
      console.error("Failed to update address:", error);
      alert("Failed to update address. Please check the console for details.");
    }
  };

  // Handle editing an existing address
  const handleEditAddress = (index: number) => {
    const address = user?.addresses?.[index];
    if (address) {
      setAddressForm(address);
      setEditingAddressIndex(index);
      setShowAddressForm(true);
    }
  };

  // Handle adding a new address
  const handleAddNewAddress = () => {
    setAddressForm({});
    setEditingAddressIndex(null);
    setShowAddressForm(true);
  };

  // Cancel address form
  const handleCancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressIndex(null);
    setAddressForm({});
  };

  // Handle deleting an address
  const handleDeleteAddress = async (index: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      console.log("Deleting address at index:", index);
      try {
        await deleteUserAddress(index).unwrap();
        console.log("Address deleted successfully");
      } catch (error) {
        console.error("Failed to delete address:", error);
        alert("Failed to delete address. Please try again.");
      }
    }
  };

  // Fetch orders using both methods for comparison
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery(
    {
      page: currentPage,
      limit,
      userId: (user?._id as string) || "", // MongoDB stores IDs as _id
    },
    {
      skip: !isAuthenticated || activeTab !== "orders" || !user?._id,
      // Re-fetch when user changes or when the tab is selected
      refetchOnMountOrArgChange: true,
    }
  );

  // Try the dedicated user orders endpoint if userId is available
  const { data: userOrdersData, isLoading: userOrdersLoading } =
    useGetUserOrdersQuery(
      {
        page: currentPage,
        limit,
        userId: (user?._id as string) || "",
      },
      {
        skip: !isAuthenticated || activeTab !== "orders" || !user?._id,
        refetchOnMountOrArgChange: true,
      }
    );

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authForm");
    }
  }, [isAuthenticated, router]);

  // Log user info and orders data for debugging
  useEffect(() => {
    if (user) {
      console.log("Current user:", user);
      console.log("User ID (_id):", user._id);
      console.log("User ID type:", typeof user._id);

      // Check if the ID is a valid MongoDB ObjectID
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(
        user._id?.toString() || ""
      );
      console.log("Is valid MongoDB ObjectID:", isValidObjectId);

      // Log the exact format for API debugging
      console.log("User ID for API calls:", {
        original: user._id,
        string: user._id?.toString(),
        validFormat: isValidObjectId,
      });
    }
    if (ordersData) {
      console.log("Regular orders endpoint data:", ordersData);
      console.log("Regular orders count:", ordersData.orders?.length || 0);
    }
    if (userOrdersData) {
      console.log("User-specific orders endpoint data:", userOrdersData);
      console.log(
        "User-specific orders count:",
        userOrdersData.orders?.length || 0
      );
    }
  }, [user, ordersData, userOrdersData]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting to login...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "info"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "orders"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Order History
          </button>
        </nav>
      </div>

      {/* Personal Information Tab */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {user?.name || "Not provided"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {user?.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Loyalty Points
                </h3>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold text-green-600">
                    {user?.loyaltyPoints || 0}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">points</span>
                </div>
                {user?.loyaltyTier && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tier:{" "}
                    <span className="font-medium">{user.loyaltyTier}</span>
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1 text-base font-medium text-gray-900">
                  {(user?.phone as string) || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Saved Addresses
              </h2>
              <button
                onClick={handleAddNewAddress}
                className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Add New Address
              </button>
            </div>

            {user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-4">
                {user.addresses.map((address, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <span className="font-medium">
                            {address.label || `Address ${index + 1}`}
                          </span>
                          {address.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm sm:text-base">
                          <p className="text-gray-700">{address.fullName}</p>
                          <p className="text-gray-700">{address.street1}</p>
                          {address.street2 && (
                            <p className="text-gray-700">{address.street2}</p>
                          )}
                          <p className="text-gray-700">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-gray-700">{address.country}</p>
                          {address.phone && (
                            <p className="text-gray-700">{address.phone}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditAddress(index)}
                        className="self-start sm:self-center text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No addresses saved yet.</p>
            )}
          </div>

          {/* Address Form Modal */}
          {showAddressForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingAddressIndex !== null
                      ? "Edit Address"
                      : "Add New Address"}
                  </h3>

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Label
                      </label>
                      <input
                        type="text"
                        value={addressForm.label || ""}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            label: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                        placeholder="Home, Work, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={addressForm.fullName || ""}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            fullName: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={addressForm.street1 || ""}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            street1: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Street Address 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.street2 || ""}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            street2: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          value={addressForm.city || ""}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              city: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          value={addressForm.state || ""}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              state: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={addressForm.postalCode || ""}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              postalCode: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <input
                          type="text"
                          value={addressForm.country || ""}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              country: e.target.value,
                            })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone || ""}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value,
                          })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-black focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={addressForm.isDefault || false}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              isDefault: e.target.checked,
                            })
                          }
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Set as default address
                        </span>
                      </label>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
                      {/* Delete button - only show when editing */}
                      {editingAddressIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            if (editingAddressIndex !== null) {
                              handleDeleteAddress(editingAddressIndex);
                              setShowAddressForm(false);
                              setEditingAddressIndex(null);
                              setAddressForm({});
                            }
                          }}
                          disabled={isDeletingAddress}
                          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {isDeletingAddress ? "Deleting..." : "Delete Address"}
                        </button>
                      )}

                      {/* Cancel and Save buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
                        <button
                          type="button"
                          onClick={handleCancelAddressForm}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdatingAddress}
                          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          {isUpdatingAddress
                            ? "Saving..."
                            : editingAddressIndex !== null
                              ? "Update"
                              : "Add Address"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order History Tab */}
      {activeTab === "orders" && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order History
          </h2>

          {ordersLoading && userOrdersLoading ? (
            <div className="py-4 text-center">Loading orders...</div>
          ) : (userOrdersData?.orders && userOrdersData.orders.length > 0) ||
            (ordersData?.orders && ordersData.orders.length > 0) ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order #
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Items
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Prefer user-specific orders, fallback to regular orders */}
                    {(userOrdersData?.orders || ordersData?.orders || []).map(
                      (order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.orderNumber || order._id.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.fulfillmentStatus === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.fulfillmentStatus === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {(order.fulfillmentStatus &&
                                order.fulfillmentStatus
                                  .charAt(0)
                                  .toUpperCase() +
                                  order.fulfillmentStatus.slice(1)) ||
                                "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(order.total || order.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.items.length}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {(userOrdersData?.totalPages || ordersData?.totalPages || 0) >
                1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    <span className="text-sm text-gray-700">
                      Page {currentPage} of{" "}
                      {userOrdersData?.totalPages ||
                        ordersData?.totalPages ||
                        1}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(
                            prev + 1,
                            userOrdersData?.totalPages ||
                              ordersData?.totalPages ||
                              1
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        (userOrdersData?.totalPages ||
                          ordersData?.totalPages ||
                          1)
                      }
                      className={`px-3 py-1 rounded-md ${
                        currentPage ===
                        (userOrdersData?.totalPages ||
                          ordersData?.totalPages ||
                          1)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="py-4 text-center text-gray-500">
              No orders found for your account. You haven&apos;t placed any
              orders yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
