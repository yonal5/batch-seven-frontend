import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Checkout({ user }) {
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("checkoutProduct");
    if (!data) {
      navigate("/");
      return;
    }
    setProduct(JSON.parse(data));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        userId: user?._id || null,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: [
          {
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
          },
        ],
        total: product.price * product.quantity,
      });

      localStorage.removeItem("checkoutProduct");
      toast.success("Order placed successfully!");
      navigate("/order-success");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white max-w-4xl w-full rounded-xl shadow-lg p-6 grid md:grid-cols-2 gap-6">

        {/* Product Summary */}
        <div>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <img
            src={product.image}
            className="w-full h-56 object-cover rounded-lg mb-3"
          />
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">
            Price: LKR {product.price.toFixed(2)}
          </p>
          <p className="font-bold mt-2">
            Total: LKR {(product.price * product.quantity).toFixed(2)}
          </p>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="text-xl font-bold mb-4">Billing Details</h2>

          <input
            name="name"
            placeholder="Full Name"
            className="w-full mb-3 p-3 border rounded-lg"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="w-full mb-3 p-3 border rounded-lg"
            value={form.phone}
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Delivery Address"
            className="w-full mb-3 p-3 border rounded-lg"
            rows={4}
            value={form.address}
            onChange={handleChange}
          />

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
