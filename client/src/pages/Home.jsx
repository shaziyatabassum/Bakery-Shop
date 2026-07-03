import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { categories as mockCategories, products as mockProducts } from '../utils/mockData';

const Home = () => {
  const { API_URL } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/products?limit=10`)
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.categories.slice(0, 6));
        }
        if (prodRes.data.success) {
          const prods = prodRes.data.products;
          setFeaturedProducts(prods.filter(p => p.isBestSeller).slice(0, 4));
          setNewArrivals(prods.filter(p => p.isNewArrival).slice(0, 4));
        }
      } catch (err) {
        console.warn('Backend server unavailable. Falling back to mock data.');
        setCategories(mockCategories.slice(0, 6));
        setFeaturedProducts(mockProducts.filter(p => p.isBestSeller).slice(0, 4));
        setNewArrivals(mockProducts.filter(p => p.isNewArrival).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [API_URL]);

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="bg-lightBackground py-24 relative overflow-hidden">
        <div className="container-custom flex flex-col items-center text-center relative z-10">
          <span className="text-accent font-bold uppercase tracking-wider text-sm mb-3">Welcome to Delicious Bakery</span>
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight leading-tight">
            Freshly Baked Goodness, <br/> Crafted with Love
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Experience the rich taste of artisan cakes, decadent brownies, and gourmet cookies baked fresh daily using premium, organic ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/shop" 
              className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-accent transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Order Online
            </Link>
            <Link 
              to="/categories" 
              className="bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-lightBackground transition-colors"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">Browse Categories</h2>
            <p className="text-gray-500">Find the perfect treat for any craving</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat._id || cat.id} 
                onClick={() => navigate(`/shop?category=${cat.categoryName || cat.name}`)}
                className="cursor-pointer bg-lightBackground p-6 rounded-xl border border-borderLight text-center hover:shadow-md transition-all group"
              >
                <div className="h-20 w-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white group-hover:border-primary transition-colors">
                  <img src={cat.image} alt="" className="h-full w-full object-cover" />
                </div>
                <h4 className="font-semibold text-primary text-sm lg:text-base">{cat.categoryName || cat.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products (Best Sellers) */}
      <section className="py-20 bg-lightBackground">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Top Rated</span>
            <h2 className="text-3xl font-bold text-primary mt-1">Our Best Sellers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <div key={p._id || p.id} className="bg-white rounded-xl shadow-sm border border-borderLight overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                <Link to={`/product/${p._id || p.id}`}>
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">Best Seller</span>
                  </div>
                </Link>
                <div className="p-5 flex-grow">
                  <span className="text-xs text-accent font-semibold">{p.category}</span>
                  <Link to={`/product/${p._id || p.id}`}>
                    <h3 className="font-semibold text-textMain mb-2 hover:text-primary transition-colors truncate">{p.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-400 mb-3">{p.weight}</p>
                </div>
                <div className="p-5 pt-0 flex justify-between items-center mt-auto border-t border-borderLight pt-4">
                  <span className="font-bold text-primary">₹{p.offerPrice || p.price}</span>
                  <button 
                    onClick={() => addToCart(p, 1)}
                    className="text-sm font-semibold bg-primary hover:bg-accent text-white px-4 py-1.5 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Just Out of the Oven</span>
            <h2 className="text-3xl font-bold text-primary mt-1">New Arrivals</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {newArrivals.map((p) => (
              <div key={p._id || p.id} className="bg-white rounded-xl shadow-sm border border-borderLight overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
                <Link to={`/product/${p._id || p.id}`}>
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">New</span>
                  </div>
                </Link>
                <div className="p-5 flex-grow">
                  <span className="text-xs text-accent font-semibold">{p.category}</span>
                  <Link to={`/product/${p._id || p.id}`}>
                    <h3 className="font-semibold text-textMain mb-2 hover:text-primary transition-colors truncate">{p.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-400 mb-3">{p.weight}</p>
                </div>
                <div className="p-5 pt-0 flex justify-between items-center mt-auto border-t border-borderLight pt-4">
                  <span className="font-bold text-primary">₹{p.offerPrice || p.price}</span>
                  <button 
                    onClick={() => addToCart(p, 1)}
                    className="text-sm font-semibold bg-primary hover:bg-accent text-white px-4 py-1.5 rounded transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-lightBackground border-t border-borderLight">
        <div className="container-custom text-center max-w-4xl">
          <h2 className="text-3xl font-bold text-primary mb-12">Why Choose Delicious?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-3xl text-accent font-bold">100% Organic</div>
              <p className="text-sm text-gray-600">We use only high-grade certified organic flour, sugar, and natural dairy products.</p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl text-accent font-bold">Freshly Baked</div>
              <p className="text-sm text-gray-600">Every item in our shop is prepared fresh daily. We never sell day-old baked goods.</p>
            </div>
            <div className="space-y-3">
              <div className="text-3xl text-accent font-bold">Express Delivery</div>
              <p className="text-sm text-gray-600">Enjoy hot-out-of-the-oven goodness delivered directly to your doorstep in 2 hours.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
