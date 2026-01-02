import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state || []);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Calculate total price
  function getTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Handle cart quantity update
  const updateQuantity = (index, change) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, newCart[index].quantity + change);
    setCart(newCart);
  };

  // Handle remove item
  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // Purchase cart
  async function purchaseCart() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (!phone || !address) {
      toast.error("Please fill in required fields: phone and address");
      return;
    }

    try {
      const items = cart.map((item) => ({
        productID: item.productID,
        quantity: item.quantity,
      }));

      await axios.post(
        import.meta.env.VITE_API_URL + "/api/orders",
        {
          customerName: name || null,
          phone,
          email: email || null,
          address,
          notes: notes || null,
          items,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order placed successfully!");
      navigate("/"); // redirect to home or order confirmation page
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      }
    }
  }

  if (cart.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-white text-center p-4">
        <div>
          <h1 className="text-2xl font-bold">🛒 Your cart is empty</h1>
          <p className="mt-2">Add some products to checkout</p>
        </div>
      </div>
    );

  return (
    <div className="w-full lg:h-[calc(100vh-100px)] overflow-y-scroll bg-primary flex flex-col pt-[25px] items-center px-4">
      <div className="w-[400px] lg:w-[600px] flex flex-col gap-4">

        {/* Cart Items */}
        {cart.map((item, index) => (
          <div
            key={index}
            className="w-full bg-white flex flex-col lg:flex-row items-center p-3 lg:p-0 rounded-lg shadow-md relative"
          >
            <button
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1"
            >
              <BiTrash size={20} />
            </button>

            <img
              className="h-28 w-28 object-cover rounded-lg"
              src={item.image}
              alt={item.name}
            />

            <div className="flex-1 flex flex-col justify-center ml-4 text-left">
              <h1 className="font-semibold text-lg">{item.name}</h1>
              <span className="text-sm text-secondary">{item.productID}</span>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <CiCircleChevUp
                className="text-2xl cursor-pointer"
                onClick={() => updateQuantity(index, 1)}
              />
              <span className="font-semibold text-xl">{item.quantity}</span>
              <CiCircleChevDown
                className="text-2xl cursor-pointer"
                onClick={() => updateQuantity(index, -1)}
              />
            </div>

            <div className="ml-4 flex flex-col items-end">
              {item.labelledPrice > item.price && (
                <span className="line-through text-gray-400">
                  LKR {item.labelledPrice.toFixed(2)}
                </span>
              )}
              <span className="font-bold text-accent text-lg">
                LKR {item.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {/* Customer Info */}
        <div className="w-full bg-white flex flex-col gap-4 p-4 rounded-lg shadow-md mt-4">
          <div className="flex flex-col">
            <label className="text-sm text-secondary mb-1">Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 border border-secondary rounded-md px-3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-secondary mb-1">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 border border-secondary rounded-md px-3"
              placeholder="e.g. +9477XXXXXXX"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-secondary mb-1">Email (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 border border-secondary rounded-md px-3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-secondary mb-1">Shipping Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-24 border border-secondary rounded-md px-3"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-secondary mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-20 border border-secondary rounded-md px-3"
              placeholder="Additional instructions for delivery"
            />
          </div>
        </div>

        {/* Checkout Button */}
        <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row justify-between items-center mt-4">
          <span className="font-bold text-accent text-xl">
            Total: LKR {getTotal().toFixed(2)}
          </span>
          <button
            onClick={purchaseCart}
            className="mt-2 lg:mt-0 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80"
          >
            Place Order
          </button>
        </div>

      </div>
    </div>
  );
}
