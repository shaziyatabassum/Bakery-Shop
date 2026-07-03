import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, getSubtotal, getTax, getDeliveryCharge, getTotal, clearCart } = useCart();
  const { user, API_URL } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    address: user?.address?.street || '',
    landmark: user?.address?.landmark || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!formData.email.trim() || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit PIN code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const orderProducts = cartItems.map(item => ({
      productId: item.product._id || item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.offerPrice || item.product.price
    }));

    const orderData = {
      products: orderProducts,
      totalAmount: getTotal(),
      shippingAddress: formData
    };

    try {
      const res = await axios.post(`${API_URL}/orders`, orderData);
      if (res.data.success) {
        toast.success('Order placed successfully!');
        const orderId = res.data.order._id;
        clearCart();
        navigate('/order-success', { state: { order: res.data.order } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold text-primary mb-10 text-center lg:text-left">Checkout Details</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Side: Address Details */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-borderLight shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-4 border-b border-borderLight pb-2">Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-borderLight'} rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                placeholder="Receiver name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleChange}
                className={`w-full border ${errors.mobile ? 'border-red-500' : 'border-borderLight'} rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                placeholder="10-digit number"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-borderLight'} rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                placeholder="notification email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input 
                name="address" 
                value={formData.address} 
                onChange={handleChange}
                className={`w-full border ${errors.address ? 'border-red-500' : 'border-borderLight'} rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                placeholder="Flat / House no, Building, Street details"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
              <input 
                name="landmark" 
                value={formData.landmark} 
                onChange={handleChange}
                className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Nearby landmark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                className={`w-full border ${errors.city ? 'border-red-500' : 'border-borderLight'} rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input 
                name="state" 
                value={formData.state} 
                onChange={handleChange}
                className={`w-full border ${errors.state ? 'border-red-500' : 'border-borderLight'} rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                placeholder="State"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input 
                name="pincode" 
                value={formData.pincode} 
                onChange={handleChange}
                className={`w-full border ${errors.pincode ? 'border-red-500' : 'border-borderLight'} rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary`}
                placeholder="6-digit PIN code"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary & COD selection */}
        <div className="space-y-6">
          <div className="bg-lightBackground p-6 rounded-xl border border-borderLight">
            <h2 className="text-xl font-bold text-primary mb-4">Order Summary</h2>

            <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id || item.product.id} className="flex justify-between items-center text-sm border-b border-borderLight pb-2">
                  <div className="truncate max-w-[70%]">
                    <span className="font-semibold">{item.quantity}x</span> {item.product.name}
                  </div>
                  <span className="font-semibold">₹{(item.product.offerPrice || item.product.price) * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-borderLight pt-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{getSubtotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>₹{getTax()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>{getDeliveryCharge() === 0 ? 'FREE' : `₹${getDeliveryCharge()}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-primary border-t border-borderLight pt-2">
                <span>Grand Total</span>
                <span>₹{getTotal()}</span>
              </div>
            </div>
          </div>

          {/* Payment Option */}
          <div className="bg-white p-6 rounded-xl border border-borderLight space-y-4">
            <h2 className="text-lg font-bold text-primary">Payment Method</h2>
            <div className="flex items-center space-x-3 p-3 bg-lightBackground border border-primary rounded-md">
              <input 
                type="radio" 
                defaultChecked 
                className="h-4 w-4 text-primary focus:ring-primary border-borderLight"
              />
              <div>
                <span className="block text-sm font-semibold text-primary">Cash On Delivery (COD)</span>
                <span className="block text-xs text-gray-500">Pay cash when products are delivered to you.</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white py-3 rounded-md font-bold transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
