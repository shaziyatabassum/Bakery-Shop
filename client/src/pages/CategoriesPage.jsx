import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { categories as mockCategories } from '../utils/mockData';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/categories`);
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.warn('Backend categories unavailable. Using mock data.');
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_URL]);

  const handleCategoryClick = (catName) => {
    navigate(`/shop?category=${catName}`);
  };

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-3">Baking Categories</h1>
        <p className="text-gray-500">Choose from our daily fresh selections below.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat._id || cat.id} 
            onClick={() => handleCategoryClick(cat.categoryName || cat.name)}
            className="cursor-pointer bg-white rounded-xl shadow-sm border border-borderLight overflow-hidden hover:shadow-md transition-shadow group text-center"
          >
            <div className="h-56 overflow-hidden relative">
              <img 
                src={cat.image} 
                alt={cat.categoryName || cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all flex-center">
                <span className="bg-white text-primary font-bold px-4 py-2 rounded-md shadow-md text-sm uppercase tracking-wide">
                  View Menu
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-primary">{cat.categoryName || cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
