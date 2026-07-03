import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiShoppingBag, FiDollarSign, FiUsers, FiTrendingUp, FiFolder } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, token, API_URL } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('analytics'); // analytics, products, categories, orders
  const [loading, setLoading] = useState(true);

  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  // Modal / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    offerPrice: '',
    stock: '',
    weight: '',
    ingredients: '',
    images: ''
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    image: ''
  });

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      toast.error('Unauthorized access. Admins only.');
      navigate('/');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes, ordRes] = await Promise.all([
          axios.get(`${API_URL}/products?limit=100`),
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/orders`)
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.products);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (ordRes.data.success) setOrders(ordRes.data.orders);
      } catch (err) {
        toast.error('Failed to load dashboard data. Starting in simulator mode.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, user, navigate, API_URL]);

  // Product Operations
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      offerPrice: productForm.offerPrice ? Number(productForm.offerPrice) : null,
      stock: Number(productForm.stock),
      ingredients: productForm.ingredients.split(',').map(i => i.trim()).filter(Boolean),
      images: [productForm.images.trim() || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80']
    };

    try {
      if (editingProduct) {
        // Edit product
        const res = await axios.put(`${API_URL}/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          setProducts(products.map(p => p._id === editingProduct._id ? res.data.product : p));
          toast.success('Product updated successfully!');
        }
      } else {
        // Create product
        const res = await axios.post(`${API_URL}/products`, payload);
        if (res.data.success) {
          setProducts([res.data.product, ...products]);
          toast.success('Product created successfully!');
        }
      }
      setShowProductModal(false);
      resetProductForm();
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      price: prod.price,
      offerPrice: prod.offerPrice || '',
      stock: prod.stock,
      weight: prod.weight,
      ingredients: prod.ingredients ? prod.ingredients.join(', ') : '',
      images: prod.images ? prod.images[0] : ''
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await axios.delete(`${API_URL}/products/${id}`);
      if (res.data.success) {
        setProducts(products.filter(p => p._id !== id));
        toast.success('Product deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      category: '',
      price: '',
      offerPrice: '',
      stock: '',
      weight: '',
      ingredients: '',
      images: ''
    });
  };

  // Category Operations
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const slug = categoryForm.categoryName.toLowerCase().replace(/ /g, '-');
    const payload = { ...categoryForm, slug };

    try {
      const res = await axios.post(`${API_URL}/categories`, payload);
      if (res.data.success) {
        setCategories([...categories, res.data.category]);
        toast.success('Category created successfully!');
        setShowCategoryModal(false);
        setCategoryForm({ categoryName: '', image: '' });
      }
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  // Order Operations
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        toast.success('Order status updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Analytics Helpers
  const totalSales = orders.reduce((acc, o) => o.status !== 'Cancelled' ? acc + o.totalAmount : acc, 0);
  const totalCustomersCount = new Set(orders.map(o => o.userId?._id || o.userId)).size;

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading Admin Center...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center lg:text-left">Admin Management Center</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-xl border border-borderLight shadow-sm flex flex-row lg:flex-col overflow-x-auto gap-2">
            {[
              { id: 'analytics', label: 'Dashboard Overview', icon: <FiTrendingUp /> },
              { id: 'products', label: 'Manage Products', icon: <FiShoppingBag /> },
              { id: 'categories', label: 'Manage Categories', icon: <FiFolder /> },
              { id: 'orders', label: 'Fulfill Orders', icon: <FiShoppingBag /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 lg:w-full text-left ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-lightBackground hover:text-primary'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Dynamic Panel */}
        <main className="flex-1 bg-white p-6 rounded-xl border border-borderLight shadow-sm overflow-x-auto">
          
          {/* ANALYTICS PANEL */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold text-primary">Store Dashboard Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-lightBackground p-6 rounded-xl border border-borderLight flex items-center space-x-4">
                  <div className="p-3 bg-secondary text-primary rounded-lg text-2xl"><FiDollarSign /></div>
                  <div>
                    <span className="text-xs text-gray-500 block">Total Sales</span>
                    <span className="text-2xl font-bold text-primary">₹{totalSales}</span>
                  </div>
                </div>

                <div className="bg-lightBackground p-6 rounded-xl border border-borderLight flex items-center space-x-4">
                  <div className="p-3 bg-secondary text-primary rounded-lg text-2xl"><FiShoppingBag /></div>
                  <div>
                    <span className="text-xs text-gray-500 block">Total Orders</span>
                    <span className="text-2xl font-bold text-primary">{orders.length}</span>
                  </div>
                </div>

                <div className="bg-lightBackground p-6 rounded-xl border border-borderLight flex items-center space-x-4">
                  <div className="p-3 bg-secondary text-primary rounded-lg text-2xl"><FiUsers /></div>
                  <div>
                    <span className="text-xs text-gray-500 block">Unique Customers</span>
                    <span className="text-2xl font-bold text-primary">{totalCustomersCount}</span>
                  </div>
                </div>

                <div className="bg-lightBackground p-6 rounded-xl border border-borderLight flex items-center space-x-4">
                  <div className="p-3 bg-secondary text-primary rounded-lg text-2xl"><FiShoppingBag /></div>
                  <div>
                    <span className="text-xs text-gray-500 block">Catalog Products</span>
                    <span className="text-2xl font-bold text-primary">{products.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Catalog Products ({products.length})</h2>
                <button
                  onClick={() => { resetProductForm(); setShowProductModal(true); }}
                  className="flex items-center space-x-2 bg-primary hover:bg-accent text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  <FiPlus />
                  <span>Add Product</span>
                </button>
              </div>

              <table className="min-w-full text-sm divide-y divide-borderLight">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-3 font-semibold">Image</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Stock</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {products.map((prod) => (
                    <tr key={prod._id} className="text-textMain">
                      <td className="py-3 pr-4">
                        <img src={prod.images[0]} alt="" className="h-10 w-10 object-cover rounded border border-borderLight" />
                      </td>
                      <td className="py-3 font-medium truncate max-w-[150px]">{prod.name}</td>
                      <td className="py-3 text-gray-500">{prod.category}</td>
                      <td className="py-3 font-semibold text-primary">₹{prod.offerPrice || prod.price}</td>
                      <td className={`py-3 font-semibold ${prod.stock < 5 ? 'text-red-500' : 'text-gray-600'}`}>{prod.stock}</td>
                      <td className="py-3 space-x-3 text-lg">
                        <button onClick={() => handleProductSubmit} className="text-primary hover:text-accent" onClick={() => handleEditProduct(prod)}><FiEdit2 className="inline" /></button>
                        <button onClick={() => handleDeleteProduct(prod._id)} className="text-red-500 hover:text-red-700"><FiTrash2 className="inline" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Store Categories ({categories.length})</h2>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="flex items-center space-x-2 bg-primary hover:bg-accent text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  <FiPlus />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <div key={cat._id} className="border border-borderLight p-4 rounded-xl text-center space-y-2">
                    <img src={cat.image} alt="" className="h-16 w-16 object-cover rounded-full mx-auto border border-borderLight" />
                    <h4 className="font-semibold text-primary text-sm">{cat.categoryName}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-primary">Fulfillment Orders ({orders.length})</h2>

              <table className="min-w-full text-sm divide-y divide-borderLight">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Total Amount</th>
                    <th className="pb-3 font-semibold">Address</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borderLight">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="text-textMain">
                      <td className="py-3 font-medium truncate max-w-[100px]">{ord._id}</td>
                      <td className="py-3">
                        <span className="block font-semibold">{ord.shippingAddress?.name}</span>
                        <span className="block text-xs text-gray-400">{ord.shippingAddress?.mobile}</span>
                      </td>
                      <td className="py-3 font-bold text-primary">₹{ord.totalAmount}</td>
                      <td className="py-3 text-xs text-gray-500 max-w-[180px] truncate">
                        {ord.shippingAddress?.address}, {ord.shippingAddress?.city}
                      </td>
                      <td className="py-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                          className="border border-borderLight rounded px-2 py-1 text-xs bg-white"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

      {/* PRODUCT FORM MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl border border-borderLight shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-xl font-bold text-primary">{editingProduct ? 'Edit Product details' : 'Add New Product'}</h3>
            
            <form onSubmit={handleProductSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                <input 
                  required
                  value={productForm.name} 
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea 
                  required
                  value={productForm.description} 
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select 
                    required
                    value={productForm.category} 
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full border border-borderLight rounded px-3 py-2 text-sm bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.categoryName}>{c.categoryName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Weight (e.g. 500g)</label>
                  <input 
                    required
                    value={productForm.weight} 
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹)</label>
                  <input 
                    required
                    type="number"
                    value={productForm.price} 
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Offer Price (₹)</label>
                  <input 
                    type="number"
                    value={productForm.offerPrice} 
                    onChange={(e) => setProductForm({ ...productForm, offerPrice: e.target.value })}
                    className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
                  <input 
                    required
                    type="number"
                    value={productForm.stock} 
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Ingredients (comma-separated)</label>
                <input 
                  value={productForm.ingredients} 
                  onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                  placeholder="Cocoa, Flour, Butter"
                  className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input 
                  value={productForm.images} 
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  placeholder="Unsplash image URL"
                  className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-borderLight rounded text-sm text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-accent text-white rounded text-sm font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY FORM MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl border border-borderLight shadow-lg max-w-sm w-full space-y-4">
            <h3 className="text-xl font-bold text-primary">Add New Category</h3>
            
            <form onSubmit={handleCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category Name</label>
                <input 
                  required
                  value={categoryForm.categoryName} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                  className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input 
                  required
                  value={categoryForm.image} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full border border-borderLight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border border-borderLight rounded text-sm text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-accent text-white rounded text-sm font-semibold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
