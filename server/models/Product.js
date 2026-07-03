const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  offerPrice: {
    type: Number,
    default: null
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock count'],
    default: 10
  },
  ingredients: {
    type: [String],
    default: []
  },
  weight: {
    type: String,
    required: [true, 'Please specify product weight (e.g. 500g, 1kg)']
  },
  availability: {
    type: Boolean,
    default: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
