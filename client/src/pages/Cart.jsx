import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTax, getDeliveryCharge, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-center text-6xl text-accent">
            <FiShoppingBag />
          </div>
          <h2 className="text-3xl font-bold text-primary">Your Cart is Empty</h2>
          <p className="text-gray-500">Looks like you haven't added any sweet treats to your cart yet. Let's explore our bakery menu!</p>
          <Link 
            to="/shop" 
            className="inline-block bg-primary text-white hover:bg-accent px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold text-primary mb-10">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const product = item.product;
            const price = product.offerPrice || product.price;
            const id = product._id || product.id;

            return (
              <div 
                key={id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white border border-borderLight rounded-xl shadow-sm gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-lg overflow-hidden border border-borderLight flex-shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs text-accent font-semibold">{product.category}</span>
                    <h3 className="font-semibold text-textMain text-base lg:text-lg">{product.name}</h3>
                    <p className="text-gray-500 text-xs">Weight: {product.weight}</p>
                    <p className="font-bold text-primary mt-1">₹{price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-borderLight rounded-md bg-lightBackground">
                    <button 
                      onClick={() => updateQuantity(id, item.quantity - 1)}
                      className="px-3 py-1 font-semibold hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-center w-8 text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(id, item.quantity + 1)}
                      className="px-3 py-1 font-semibold hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-bold text-primary text-base">₹{price * item.quantity}</span>

                  <button 
                    onClick={() => removeFromCart(id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between pt-4">
            <Link to="/shop" className="text-primary hover:text-accent font-semibold transition-colors flex items-center space-x-2">
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-lightBackground p-6 rounded-xl border border-borderLight h-fit space-y-6">
          <h2 className="text-xl font-bold text-primary">Order Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{getSubtotal()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST (5%)</span>
              <span>₹{getTax()}</span>
            </div>
            <div className="flex justify-between text-gray-600 border-b border-borderLight pb-3">
              <span>Delivery Charges</span>
              <span>{getDeliveryCharge() === 0 ? 'FREE' : `₹${getDeliveryCharge()}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary pt-2">
              <span>Grand Total</span>
              <span>₹{getTotal()}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full flex-center bg-primary hover:bg-accent text-white py-3 rounded-md font-semibold transition-colors space-x-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <FiArrowRight />
          </button>

          <p className="text-xs text-gray-400 text-center">
            {getSubtotal() < 499 
              ? `Add ₹${499 - getSubtotal()} more to get FREE Delivery!` 
              : 'Congrats! You are eligible for FREE Delivery.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
