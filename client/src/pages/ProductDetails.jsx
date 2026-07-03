import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiHeart, FiShoppingCart, FiChevronRight, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { products as mockProducts } from '../utils/mockData';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API_URL } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  
  // Review state
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Fetch product from backend
        const res = await axios.get(`${API_URL}/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setSelectedImage(res.data.product.images[0]);
          
          // Fetch related
          try {
            const relRes = await axios.get(`${API_URL}/products/${id}/related`);
            if (relRes.data.success) {
              setRelatedProducts(relRes.data.products);
            }
          } catch (err) {
            console.warn('Failed to load related products from backend.');
          }

          // Fetch reviews
          try {
            const revRes = await axios.get(`${API_URL}/reviews/product/${id}`);
            if (revRes.data.success) {
              setReviews(revRes.data.reviews);
            }
          } catch (err) {
            console.warn('Failed to load reviews from backend.');
          }
        }
      } catch (err) {
        console.warn('Backend fetch failed, falling back to mock data.');
        // Fallback to local mock data
        const localProd = mockProducts.find(p => p.id.toString() === id || p._id === id);
        if (localProd) {
          setProduct(localProd);
          setSelectedImage(localProd.images[0]);
          const related = mockProducts.filter(p => p.category === localProd.category && p.id !== localProd.id).slice(0, 4);
          setRelatedProducts(related);
        } else {
          toast.error('Product not found');
          navigate('/shop');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    setQuantity(1);
  }, [id, API_URL, navigate]);

  const handleQuantityChange = (val) => {
    if (val < 1) return;
    if (product.stock && val > product.stock) {
      toast.error(`Only ${product.stock} items left in stock`);
      return;
    }
    setQuantity(val);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please sign in to submit a review');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(`${API_URL}/reviews`, {
        productId: product._id || product.id,
        rating: newRating,
        review: newComment
      });

      if (res.data.success) {
        toast.success('Review submitted successfully!');
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
        // Reload details to update average rating
        const prodRes = await axios.get(`${API_URL}/products/${id}`);
        if (prodRes.data.success) {
          setProduct(prodRes.data.product);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading mouth-watering details...</p>
      </div>
    );
  }

  if (!product) return null;

  const inStock = product.stock !== undefined ? product.stock > 0 : product.availability;
  const originalPrice = product.price;
  const currentPrice = product.offerPrice || product.price;
  const hasDiscount = !!product.offerPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div className="container-custom py-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary">Home</Link>
        <FiChevronRight />
        <Link to="/shop" className="hover:text-primary">Shop</Link>
        <FiChevronRight />
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden border border-borderLight bg-lightBackground h-96">
            <img 
              src={selectedImage || product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Multiple image thumbnails */}
          <div className="flex space-x-4 overflow-x-auto py-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {/* If product only has 1 image, duplicate as thumbnail placeholders */}
            {product.images.length === 1 && [1, 2, 3].map((item) => (
              <div 
                key={item}
                className="h-20 w-20 rounded-lg overflow-hidden border border-borderLight opacity-50 flex-shrink-0"
              >
                <img src={product.images[0]} alt="" className="w-full h-full object-cover filter grayscale" />
              </div>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">{product.category}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mt-1">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < Math.round(product.rating) ? "fill-current" : ""} />
                ))}
                <span className="ml-2 text-sm font-semibold text-textMain">{product.rating}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-500">{reviews.length > 0 ? reviews.length : product.reviewsCount} Customer Reviews</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="py-4 border-y border-borderLight flex items-baseline space-x-4">
            <span className="text-3xl font-bold text-primary">₹{currentPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">Save {discountPercent}%</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-lightBackground p-4 rounded-xl border border-borderLight">
            <div>
              <span className="text-gray-500 block">Weight / Size:</span>
              <span className="font-semibold text-textMain">{product.weight}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Availability:</span>
              <span className={`font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                {inStock ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <h4 className="font-semibold text-primary mb-2">Ingredients:</h4>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, index) => (
                  <span key={index} className="text-xs bg-white border border-borderLight text-gray-700 px-3 py-1 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Quantity */}
            <div className="flex items-center border border-borderLight rounded-md max-w-fit bg-white">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-lg"
                disabled={!inStock}
              >
                -
              </button>
              <span className="px-4 py-2 text-center w-12 font-medium">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition-colors font-bold text-lg"
                disabled={!inStock}
              >
                +
              </button>
            </div>

            {/* Actions */}
            <button 
              onClick={() => addToCart(product, quantity)}
              disabled={!inStock}
              className="flex-grow flex-center space-x-2 bg-white text-primary border-2 border-primary hover:bg-lightBackground px-6 py-3 rounded-md font-semibold transition-colors disabled:opacity-50"
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>

            <button 
              onClick={handleBuyNow}
              disabled={!inStock}
              className="flex-grow bg-primary text-white hover:bg-accent px-6 py-3 rounded-md font-semibold transition-colors disabled:opacity-50"
            >
              Buy Now
            </button>

            {/* Wishlist Toggle */}
            <button 
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-md border flex-center transition-colors ${isInWishlist(product._id || product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'border-borderLight hover:bg-gray-50 text-gray-500'}`}
            >
              <FiHeart className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 border-t border-borderLight pt-12">
        <h2 className="text-2xl font-bold text-primary mb-8">Customer Reviews ({reviews.length})</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews Form */}
          <div className="bg-lightBackground p-6 rounded-xl border border-borderLight h-fit">
            <h3 className="font-semibold text-lg text-primary mb-4">Add a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select 
                  value={newRating} 
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full border border-borderLight rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                <textarea 
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this baked treat..."
                  className="w-full border border-borderLight rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submittingReview}
                className="w-full bg-primary text-white hover:bg-accent py-2 rounded-md font-semibold transition-colors text-sm"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-borderLight">
                No reviews yet. Be the first to rate this product!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id || rev.id} className="border-b border-borderLight pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-textMain">{rev.userName}</h4>
                      <div className="flex text-yellow-400 text-sm mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={i < rev.rating ? "fill-current" : ""} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">{rev.review}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-primary mb-8">Related Delicacies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div key={p._id || p.id} className="bg-white rounded-xl shadow-sm border border-borderLight overflow-hidden hover:shadow-md transition-shadow group">
                <Link to={`/product/${p._id || p.id}`}>
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={p.images[0]} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <span className="text-xs text-accent font-semibold">{p.category}</span>
                  <Link to={`/product/${p._id || p.id}`}>
                    <h3 className="font-semibold text-textMain mb-2 hover:text-primary transition-colors truncate">{p.name}</h3>
                  </Link>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-primary">₹{p.offerPrice || p.price}</span>
                    <button 
                      onClick={() => addToCart(p, 1)}
                      className="text-xs bg-primary hover:bg-accent text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
