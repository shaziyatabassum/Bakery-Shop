import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  React.useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="container-custom py-20 text-center">
      <div className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-xl border border-borderLight shadow-sm">
        <div className="flex justify-center text-6xl text-green-500 animate-bounce">
          <FiCheckCircle />
        </div>
        <h1 className="text-3xl font-bold text-primary">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for choosing Delicious. We have received your order, and our bakers are starting to prepare your treats!
        </p>

        <div className="bg-lightBackground p-4 rounded-lg border border-borderLight text-sm space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-semibold text-textMain">{order._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Amount:</span>
            <span className="font-bold text-primary">₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode:</span>
            <span className="font-semibold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Delivery:</span>
            <span className="font-semibold text-green-600">Within 2 Hours</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Link 
            to="/profile" 
            className="flex-grow bg-white border-2 border-primary hover:bg-lightBackground text-primary py-2.5 rounded font-semibold text-sm transition-colors"
          >
            View Order History
          </Link>
          <Link 
            to="/shop" 
            className="flex-grow bg-primary hover:bg-accent text-white py-2.5 rounded font-semibold text-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
