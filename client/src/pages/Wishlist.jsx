import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    // Optionally remove from wishlist
    toggleWishlist(product);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-center text-6xl text-gray-300">
            <FiHeart />
          </div>
          <h2 className="text-3xl font-bold text-primary">Your Wishlist is Empty</h2>
          <p className="text-gray-500">Save your favorite cakes, cookies, and pastries to your wishlist to order them easily later.</p>
          <Link 
            to="/shop" 
            className="inline-block bg-primary text-white hover:bg-accent px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Explore Bakery shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold text-primary mb-10">My Wishlist ({wishlistItems.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => {
          const price = product.offerPrice || product.price;
          const id = product._id || product.id;

          return (
            <div key={id} className="bg-white rounded-xl shadow-sm border border-borderLight overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="p-4">
                  <span className="text-xs text-accent font-semibold">{product.category}</span>
                  <Link to={`/product/${id}`}>
                    <h3 className="font-semibold text-textMain text-sm lg:text-base mb-2 hover:text-primary transition-colors truncate">{product.name}</h3>
                  </Link>
                  <p className="font-bold text-primary">₹{price}</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button 
                  onClick={() => handleMoveToCart(product)}
                  className="w-full flex-center space-x-2 bg-primary hover:bg-accent text-white py-2 rounded font-semibold text-xs lg:text-sm transition-colors"
                >
                  <FiShoppingCart />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
