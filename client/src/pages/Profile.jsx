import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiPackage, FiLogOut, FiSettings } from 'react-icons/fi';

const Profile = () => {
  const { user, token, logout, updateProfile, API_URL } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Form profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      landmark: user?.address?.landmark || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await axios.get(`${API_URL}/orders/myorders`);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders from backend');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchMyOrders();
  }, [token, navigate, API_URL]);

  const handleDetailsChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setProfileData({
      ...profileData,
      address: {
        ...profileData.address,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    const res = await updateProfile(profileData);
    if (res && res.success) {
      toast.success('Information updated successfully');
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container-custom py-10">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl border border-borderLight shadow-sm space-y-6">
            <div className="text-center">
              <div className="h-20 w-20 bg-secondary text-primary rounded-full flex-center text-3xl font-bold mx-auto mb-4 border border-borderLight uppercase">
                {user.name.charAt(0)}
              </div>
              <h3 className="font-bold text-lg text-primary">{user.name}</h3>
              <p className="text-xs text-gray-500">@{user.username} ({user.role})</p>
              <p className="text-sm text-gray-600 mt-1">{user.email}</p>
            </div>

            <nav className="flex flex-col space-y-1">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-lightBackground hover:text-primary'}`}
              >
                <FiPackage />
                <span>My Orders</span>
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-lightBackground hover:text-primary'}`}
              >
                <FiSettings />
                <span>Account details</span>
              </button>

              {user.role === 'admin' && (
                <Link 
                  to="/admin"
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-accent hover:bg-lightBackground transition-colors"
                >
                  <FiSettings />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <button 
                onClick={handleLogoutClick}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors w-full text-left"
              >
                <FiLogOut />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-white p-6 rounded-xl border border-borderLight shadow-sm">
          {activeTab === 'orders' ? (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Order History</h2>

              {ordersLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-borderLight space-y-4">
                  <p className="text-gray-500">You haven't placed any orders yet.</p>
                  <Link to="/shop" className="inline-block bg-primary text-white px-6 py-2 rounded text-sm hover:bg-accent font-semibold transition-colors">
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-borderLight rounded-xl overflow-hidden shadow-sm">
                      {/* Order Header */}
                      <div className="bg-lightBackground p-4 border-b border-borderLight flex flex-col sm:flex-row justify-between sm:items-center text-sm gap-2">
                        <div>
                          <span className="text-gray-500 block">Order ID:</span>
                          <span className="font-semibold text-textMain">{order._id}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Placed On:</span>
                          <span className="font-semibold text-textMain">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Grand Total:</span>
                          <span className="font-bold text-primary">₹{order.totalAmount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Status:</span>
                          <span className={`inline-block font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-4 divide-y divide-borderLight">
                        {order.products.map((p, index) => (
                          <div key={index} className="py-3 flex justify-between items-center text-sm first:pt-0 last:pb-0">
                            <div>
                              <h4 className="font-semibold text-textMain">{p.name}</h4>
                              <span className="text-gray-500 text-xs">Quantity: {p.quantity}</span>
                            </div>
                            <span className="font-semibold text-primary">₹{p.price * p.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Account Settings</h2>
              
              <form onSubmit={handleSaveDetails} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      name="name"
                      value={profileData.name}
                      onChange={handleDetailsChange}
                      required
                      className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                      name="phone"
                      value={profileData.phone}
                      onChange={handleDetailsChange}
                      required
                      className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="border-t border-borderLight pt-4 space-y-4">
                  <h3 className="font-semibold text-primary text-base">Default Shipping Address</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input 
                        name="street"
                        value={profileData.address.street}
                        onChange={handleAddressChange}
                        className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="House no, Street details"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                      <input 
                        name="landmark"
                        value={profileData.address.landmark}
                        onChange={handleAddressChange}
                        className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="Near hospital, store etc"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input 
                        name="city"
                        value={profileData.address.city}
                        onChange={handleAddressChange}
                        className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input 
                        name="state"
                        value={profileData.address.state}
                        onChange={handleAddressChange}
                        className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input 
                        name="pincode"
                        value={profileData.address.pincode}
                        onChange={handleAddressChange}
                        className="w-full border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        placeholder="6-digit PIN code"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-md font-semibold transition-colors text-sm"
                >
                  Save Information
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
