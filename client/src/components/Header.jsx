import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [headerSearch, setHeaderSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch('');
    }
  };

  const totalCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm border-b border-borderLight">
      <div className="container-custom py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
          Delicious.
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-textMain hover:text-accent transition-colors font-medium">Home</Link>
          <Link to="/shop" className="text-textMain hover:text-accent transition-colors font-medium">Shop</Link>
          <Link to="/categories" className="text-textMain hover:text-accent transition-colors font-medium">Categories</Link>
          <Link to="/contact" className="text-textMain hover:text-accent transition-colors font-medium">Contact</Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center bg-lightBackground rounded-full px-4 py-2 border border-borderLight w-64">
          <FiSearch className="text-gray-400 mr-2 cursor-pointer" onClick={handleSearchSubmit} />
          <input 
            type="text" 
            placeholder="Search cakes..." 
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </form>

        {/* Icons */}
        <div className="flex items-center space-x-6 text-xl text-primary">
          <Link to="/wishlist" className="hover:text-accent transition-colors relative">
            <FiHeart />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="hover:text-accent transition-colors relative">
            <FiShoppingCart />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {totalCartCount}
              </span>
            )}
          </Link>
          
          <div className="flex items-center space-x-4 ml-2 pl-4 border-l border-borderLight text-sm font-medium">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-1 hover:text-accent transition-colors">
                  <FiUser className="text-lg" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="text-red-500 hover:text-red-700 transition-colors flex items-center" title="Sign Out">
                  <FiLogOut className="text-lg" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-accent">Sign In</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-accent transition-colors">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

