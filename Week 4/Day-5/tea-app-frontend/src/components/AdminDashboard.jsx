import { useState } from "react";
import {
  useGetTeasQuery,
  useCreateTeaMutation,
  useUpdateTeaMutation,
  useDeleteTeaMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../services/api";

export default function AdminDashboard() {
  const role = localStorage.getItem("role") || "";
  const mail = localStorage.getItem("email") || "";
  console.log("Mail:", mail);
  const [activeTab, setActiveTab] = useState("users"); // Tab state

  const { data: teas, refetch: refetchTeas } = useGetTeasQuery();
  const [createTea] = useCreateTeaMutation();
  const [updateTea] = useUpdateTeaMutation();
  const [deleteTea] = useDeleteTeaMutation();

  const { data: users, refetch: refetchUsers } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [newTea, setNewTea] = useState({ name: "", price: "" });
  const [editingTea, setEditingTea] = useState(null);

  // Separate loading states
  const [loadingBlockId, setLoadingBlockId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (!role || (role !== "admin" && role !== "super-admin")) {
    return <p className="text-red-500 mx-auto text-3xl">Access Denied</p>;
  }

  // --- Product handlers ---
  const handleCreateTea = async () => {
    if (!newTea.name || !newTea.price) return;
    await createTea(newTea);
    setNewTea({ name: "", price: "" });
    refetchTeas();
  };

  const handleUpdateTea = async (tea) => {
    await updateTea(tea);
    setEditingTea(null);
    refetchTeas();
  };

  const handleDeleteTea = async (id) => {
    if (role !== "super-admin")
      return alert("Only Super Admin can delete products");
    await deleteTea(id);
    refetchTeas();
  };

  // --- User handlers ---
  const handleRoleChange = async (user, newRole) => {
    if (
      role === "admin" &&
      (user.role === "admin" || user.role === "super-admin")
    ) {
      return;
    }
    if (role === "admin" && newRole === "super-admin") {
      return alert("Only Super Admin can assign Super Admin role");
    }
    await updateUser({ id: user._id, role: newRole });
    refetchUsers();
  };

  const handleBlockUser = async (user) => {
    if (role === "admin" && user.role !== "user") return;
    await updateUser({ id: user._id, blocked: !user.blocked });
    refetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (role !== "super-admin")
      return alert("Only Super Admin can delete users");
    await deleteUser(userId);
    refetchUsers();
  };

  // --- Loading + Confirmation wrappers ---
  const handleBlockClick = async (user) => {
    setLoadingBlockId(user._id);
    try {
      await handleBlockUser(user);
    } finally {
      setLoadingBlockId(null);
    }
  };

  const handleDeleteClick = async (userId) => {
    setLoadingDeleteId(userId);
    try {
      await handleDeleteUser(userId);
    } finally {
      setLoadingDeleteId(null);
      setDeleteConfirmId(null);
    }
  };

  // --- Filter users by role ---
  const superAdmins = users?.filter((u) => u.role === "super-admin");
  const admins = users?.filter((u) => u.role === "admin");
  const normalUsers = users?.filter((u) => u.role === "user");

  const renderUserTable = (userList, tableRole) => {
    if (!userList?.length) return null;

    const gradient =
      tableRole === "super-admin"
        ? "from-red-400 to-red-600"
        : tableRole === "admin"
        ? "from-blue-400 to-blue-600"
        : "from-purple-400 to-purple-600";

    const title =
      tableRole === "super-admin"
        ? "Super Admins"
        : tableRole === "admin"
        ? "Admins"
        : "Users";

    return (
      <div key={tableRole} className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-600">{title}</h3>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className={`bg-gradient-to-r ${gradient} text-white`}>
              <tr>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Blocked</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => {
                const isRowDisabled =
                  (role === "admin" &&
                    (user.role === "admin" || user.role === "super-admin")) ||
                  mail === user.email;

                const isBlockedRow =
                  role === "admin" &&
                  (user.role === "admin" || user.role === "super-admin");

                const isBlockLoading = loadingBlockId === user._id;
                const isDeleteLoading = loadingDeleteId === user._id;

                return (
                  <tr
                    key={user._id}
                    className={`border-b transition-colors duration-200
                      ${isBlockedRow ? "bg-gray-200" : "hover:bg-gray-100"}
                      ${isRowDisabled ? "cursor-not-allowed bg-gray-100" : ""}
                    `}
                  >
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        disabled={isRowDisabled}
                        className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-6">
                      {user.blocked ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-6 flex gap-2">
                      {(role === "super-admin" || user.role === "user") && (
                        <button
                          onClick={() => handleBlockClick(user)}
                          disabled={isRowDisabled || isBlockLoading}
                          className="w-24 bg-yellow-400 text-white px-3 py-1 rounded-lg transition transform
                            hover:bg-yellow-500 hover:scale-105
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400 disabled:hover:scale-100 flex justify-center items-center"
                        >
                          {isBlockLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : user.blocked ? (
                            "Unblock"
                          ) : (
                            "Block"
                          )}
                        </button>
                      )}
                      {role === "super-admin" && (
                        <button
                          onClick={() => setDeleteConfirmId(user._id)}
                          disabled={isRowDisabled || isDeleteLoading}
                          className="w-24 bg-red-500 text-white px-3 py-1 rounded-lg transition transform
                            hover:bg-red-600 hover:scale-105
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500 disabled:hover:scale-100 flex justify-center items-center"
                        >
                          {isDeleteLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete this user?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteClick(deleteConfirmId)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="p-6 bg-gray-50 px-3 sm:px-6 md:px-10 lg:px-15 xl:px-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-300">
      
        <button
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === "users"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
          <button
          className={`px-4 py-2 -mb-px font-semibold ${
            activeTab === "products"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Products
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <section className="mb-10">
          <div className="mb-6 flex gap-3">
            <input
              placeholder="Name"
              value={newTea.name}
              onChange={(e) => setNewTea({ ...newTea, name: e.target.value })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <input
              placeholder="Price"
              value={newTea.price}
              onChange={(e) => setNewTea({ ...newTea, price: e.target.value })}
              className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            <button
              onClick={handleCreateTea}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition transform hover:scale-105"
            >
              Add
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-green-300 to-green-500 text-white">
                <tr>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teas?.map((tea) => (
                  <tr
                    key={tea._id}
                    className="border-b hover:bg-gray-100 transition-colors duration-200"
                  >
                    <td className="py-3 px-6">
                      {editingTea?.id === tea._id ? (
                        <input
                          value={editingTea.name}
                          onChange={(e) =>
                            setEditingTea({
                              ...editingTea,
                              name: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                      ) : (
                        tea.name
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {editingTea?.id === tea._id ? (
                        <input
                          value={editingTea.price}
                          onChange={(e) =>
                            setEditingTea({
                              ...editingTea,
                              price: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                      ) : (
                        tea.price
                      )}
                    </td>
                    <td className="py-3 px-6 flex gap-2">
                      {editingTea?.id === tea._id ? (
                        <button
                          onClick={() => handleUpdateTea(editingTea)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition transform hover:scale-105"
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setEditingTea({
                                id: tea._id,
                                name: tea.name,
                                price: tea.price,
                              })
                            }
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition transform hover:scale-105"
                          >
                            Edit
                          </button>
                          {role === "super-admin" && (
                            <button
                              onClick={() => handleDeleteTea(tea._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition transform hover:scale-105"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "users" && (
        <section>
          {renderUserTable(superAdmins, "super-admin")}
          {renderUserTable(admins, "admin")}
          {renderUserTable(normalUsers, "user")}
        </section>
      )}
    </div>
  );
}
