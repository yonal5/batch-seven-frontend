import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get token from localStorage (after login)
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const updateStatus = async (orderID, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/status/${orderID}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.orderID === orderID ? { ...order, status } : order
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderID}>
                <td className="border p-2">{order.orderID}</td>
                <td className="border p-2">{order.customerName || order.email}</td>
                <td className="border p-2">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="border p-2">{order.total}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  {["Pending", "Shipped", "Delivered", "Cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.orderID, status)}
                        className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                      >
                        {status}
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
