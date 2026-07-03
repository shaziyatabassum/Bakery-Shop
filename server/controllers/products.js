const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 30 } = req.query;

    const query = {};

    // Category Filter
    if (category && category !== 'All') {
      // Use regex case-insensitive just in case
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Search Filter
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let queryPromise = Product.find(query);

    // Sorting
    if (sort) {
      switch (sort) {
        case 'Price: Low to High':
        case 'price_asc':
          queryPromise = queryPromise.sort({ price: 1 });
          break;
        case 'Price: High to Low':
        case 'price_desc':
          queryPromise = queryPromise.sort({ price: -1 });
          break;
        case 'Latest':
        case 'latest':
          queryPromise = queryPromise.sort({ createdAt: -1 });
          break;
        case 'Popular':
        case 'popular':
        case 'Best Selling':
        case 'bestselling':
          queryPromise = queryPromise.sort({ rating: -1, reviewsCount: -1 });
          break;
        case 'Alphabetical A-Z':
        case 'az':
          queryPromise = queryPromise.sort({ name: 1 });
          break;
        case 'Alphabetical Z-A':
        case 'za':
          queryPromise = queryPromise.sort({ name: -1 });
          break;
        default:
          queryPromise = queryPromise.sort({ createdAt: -1 });
      }
    } else {
      queryPromise = queryPromise.sort({ createdAt: -1 });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    queryPromise = queryPromise.skip(skip).limit(parseInt(limit));

    const products = await queryPromise;
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.status(200).json({
      success: true,
      products: related
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted'
    });
  } catch (err) {
    next(err);
  }
};
