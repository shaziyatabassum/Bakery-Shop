const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please select a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: [true, 'Please add a review description']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate and update product average rating
ReviewSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.aggregate([
    {
      $match: { productId: productId }
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 }
      }
    }
  ]);

  try {
    if (obj.length > 0) {
      await this.model('Product').findByIdAndUpdate(productId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        reviewsCount: obj[0].reviewsCount
      });
    } else {
      await this.model('Product').findByIdAndUpdate(productId, {
        rating: 0,
        reviewsCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.productId);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.getAverageRating(this.productId);
});

module.exports = mongoose.model('Review', ReviewSchema);
