
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "../../components/loader";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><Loader /></div>;
  if (error) return <div className="text-center text-red-500 font-semibold mt-8">{error}</div>;

  return (
    <main className="main-content">
      <h1 className="text-3xl font-extrabold mb-8 text-accent drop-shadow">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center text-secondary/60 text-lg py-12 card">No orders found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse card">
            <thead>
              <tr className="bg-accent/90 text-white">
                <th className="p-3 font-semibold">Order ID</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Items</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderID} className="odd:bg-primary even:bg-white hover:bg-accent/10 transition-colors">
                  <td className="p-3 font-mono text-secondary/80">{order.orderID}</td>
                  <td className="p-3">{order.customerName || order.email}</td>
                  <td className="p-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-secondary">{item.name}</span> <span className="text-secondary/60">x {item.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3 font-semibold text-accent">${order.total?.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
