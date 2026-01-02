import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";

import { addToCart, getTotal, loadCart } from "../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart when component mounts
  useEffect(() => {
    setCart(loadCart());
  }, []);

  // Increase/decrease quantity
  const updateCart = (item, qty) => {
    addToCart(item, qty);
    setCart(loadCart());
  };

  // Remove item completely
  const removeItem = (item) => updateCart(item, -item.quantity);

  // Handle Checkout button click
  const handleCheckout = () => {
    if (cart.length === 0) return; // Prevent empty cart checkout
    navigate("/checkout", { state: { cart } });
  };

  if (cart.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-white text-center p-4">
        <div>
          <h1 className="text-2xl font-bold">🛒 Your cart is empty</h1>
          <p className="mt-2">Add some products to checkout</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-accent px-6 py-3 rounded-lg hover:bg-accent/80"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-primary flex flex-col pt-6 items-center px-4">
      <div className="w-full max-w-4xl flex flex-col gap-4">

        {/* Cart Items */}
        {cart.map((item, index) => (
          <div
            key={index}
            className="w-full bg-white flex flex-col lg:flex-row items-center p-3 rounded-lg shadow-md relative"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeItem(item)}
              className="absolute top-2 right-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1"
            >
              <BiTrash size={20} />
            </button>

            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="h-28 w-28 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center ml-4 text-left">
              <h1 className="font-semibold text-lg">{item.name}</h1>
              <span className="text-sm text-secondary">{item.productID}</span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 ml-4">
              <CiCircleChevUp
                className="text-2xl cursor-pointer"
                onClick={() => updateCart(item, 1)}
              />
              <span className="font-semibold text-xl">{item.quantity}</span>
              <CiCircleChevDown
                className="text-2xl cursor-pointer"
                onClick={() => updateCart(item, -1)}
              />
            </div>

            {/* Price */}
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

        {/* Checkout Section */}
        <div className="w-full bg-white p-4 rounded-lg shadow-md flex flex-col lg:flex-row justify-between items-center mt-4">
          <span className="font-bold text-accent text-xl">
            Total: LKR {getTotal().toFixed(2)}
          </span>

          <button
            onClick={handleCheckout}
            className="mt-2 lg:mt-0 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/80"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
