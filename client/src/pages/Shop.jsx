import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiFilter, FiSearch, FiHeart, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { products as mockProducts, categories as mockCategories } from '../utils/mockData';

const Shop = () => {
  const { API_URL } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Latest');

  // Load URL query parameters on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    const searchParam = params.get('search');

    if (catParam) {
      setSelectedCategory(catParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        setCategories(mockCategories);
      }
    };
    loadCategories();
  }, [API_URL]);

  // Fetch products based on active filters/sorting
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Query to backend API
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (sortOption) {
          params.sort = sortOption;
        }

        const res = await axios.get(`${API_URL}/products`, { params });
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.warn('Backend server down. Applying filtering/sorting on mock data.');
        // Apply frontend filters on mockData
        let filtered = [...mockProducts];

        if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        if (searchTerm) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Apply sorting
        if (sortOption === 'Price: Low to High') {
          filtered.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
        } else if (sortOption === 'Price: High to Low') {
          filtered.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
        } else if (sortOption === 'Alphabetical A-Z') {
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'Alphabetical Z-A') {
          filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === 'Popular' || sortOption === 'Best Selling') {
          filtered.sort((a, b) => b.rating - a.rating);
        }

        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search changes

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchTerm, sortOption, API_URL]);

  return (
    <div className="container-custom py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-primary mb-3">Shop Freshly Baked Goods</h1>
        <p className="text-gray-500">Delicious treats prepared daily with organic ingredients.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-lightBackground p-6 rounded-xl border border-borderLight mb-6">
            <h3 className="font-semibold text-lg text-primary mb-4 flex items-center">
              <FiFilter className="mr-2" /> Filters
            </h3>
            
            {/* Search */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-borderLight bg-white rounded-md focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>

            {/* Categories list */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Categories</label>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${selectedCategory === 'All' ? 'bg-primary text-white font-semibold' : 'text-gray-600 hover:bg-white hover:text-primary'}`}
                  >
                    All Products
                  </button>
                </li>
                {categories.map((cat) => {
                  const name = cat.categoryName || cat.name;
                  return (
                    <li key={cat._id || cat.id}>
                      <button 
                        onClick={() => setSelectedCategory(name)}
                        className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${selectedCategory === name ? 'bg-primary text-white font-semibold' : 'text-gray-600 hover:bg-white hover:text-primary'}`}
                      >
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {/* Grid control bar */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
            <span className="text-gray-500 text-sm">Showing {products.length} delicacies</span>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-borderLight rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white cursor-pointer"
              >
                <option>Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Popular</option>
                <option>Best Selling</option>
                <option>Alphabetical A-Z</option>
                <option>Alphabetical Z-A</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-3 text-sm text-gray-500">Loading catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-borderLight">
              <p className="text-gray-500 font-medium">No products found matching your criteria.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                className="mt-4 text-xs font-semibold text-accent hover:text-primary transition-colors underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const id = product._id || product.id;
                const isSaved = isInWishlist(id);
                const currentPrice = product.offerPrice || product.price;

                return (
                  <div key={id} className="bg-white rounded-xl shadow-sm border border-borderLight overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                    <div className="relative">
                      <Link to={`/product/${id}`}>
                        <div className="h-60 overflow-hidden relative bg-lightBackground">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.offerPrice && (
                            <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">Sale</span>
                          )}
                        </div>
                      </Link>
                      
                      {/* Wishlist toggle icon */}
                      <button 
                        onClick={() => toggleWishlist(product)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors bg-white ${isSaved ? 'text-red-500 hover:text-red-700' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <FiHeart className={isSaved ? "fill-current" : ""} />
                      </button>
                    </div>

                    <div className="p-5 flex-grow">
                      <span className="text-xs text-accent font-semibold">{product.category}</span>
                      
                      <Link to={`/product/${id}`}>
                        <h3 className="font-semibold text-base lg:text-lg text-textMain mb-1 mt-1 hover:text-primary transition-colors truncate">
                          {product.name}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center text-yellow-400 text-xs mb-3">
                        <FiStar className="fill-current mr-1" />
                        <span className="font-bold text-gray-700">{product.rating}</span>
                        <span className="text-gray-400 ml-1">({product.reviewsCount})</span>
                      </div>

                      <p className="text-xs text-gray-500 truncate">{product.description}</p>
                    </div>

                    <div className="p-5 pt-0 flex justify-between items-center mt-auto border-t border-borderLight pt-4">
                      <div>
                        {product.offerPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary text-base lg:text-lg">₹{product.offerPrice}</span>
                            <span className="text-gray-400 line-through text-xs">₹{product.price}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-primary text-base lg:text-lg">₹{product.price}</span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product, 1)}
                        className="text-sm font-semibold bg-primary hover:bg-accent text-white px-4 py-1.5 rounded transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
