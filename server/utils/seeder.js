const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Load env vars
dotenv.config({ path: './.env' });

const categoriesData = [
  { categoryName: "Cakes", slug: "cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80" },
  { categoryName: "Cookies", slug: "cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80" },
  { categoryName: "Brownies", slug: "brownies", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80" },
  { categoryName: "Donuts", slug: "donuts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80" },
  { categoryName: "Muffins", slug: "muffins", image: "https://images.unsplash.com/photo-1559553156-2e97137af16f?auto=format&fit=crop&w=800&q=80" },
  { categoryName: "Cupcakes", slug: "cupcakes", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80" },
  { categoryName: "Pastries", slug: "pastries", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80" },
  { categoryName: "Beverages", slug: "beverages", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80" }
];

const productsData = [
  // Cakes
  {
    name: "Classic Chocolate Truffle",
    category: "Cakes",
    price: 699,
    offerPrice: 599,
    rating: 4.8,
    reviewsCount: 124,
    description: "Rich, dense and incredibly moist chocolate cake with layers of decadent chocolate truffle ganache.",
    ingredients: ["Cocoa Powder", "Dark Chocolate", "Flour", "Sugar", "Butter", "Eggs"],
    stock: 15,
    weight: "500g",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Red Velvet Bliss Cake",
    category: "Cakes",
    price: 899,
    offerPrice: 799,
    rating: 4.9,
    reviewsCount: 86,
    description: "Iconic red velvet cake with smooth cream cheese frosting, perfect for any celebration.",
    ingredients: ["Flour", "Cocoa Powder", "Buttermilk", "Cream Cheese", "Butter", "Vanilla"],
    stock: 8,
    weight: "1kg",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Fresh Strawberry Gateau",
    category: "Cakes",
    price: 749,
    offerPrice: null,
    rating: 4.6,
    reviewsCount: 52,
    description: "Vanilla sponge layered with fresh strawberry slices and light whipped cream.",
    ingredients: ["Fresh Strawberries", "Whipping Cream", "Vanilla", "Flour", "Sugar", "Eggs"],
    stock: 12,
    weight: "500g",
    availability: true,
    isBestSeller: false,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1464349172961-10492e86a957?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Premium Black Forest",
    category: "Cakes",
    price: 649,
    offerPrice: 549,
    rating: 4.7,
    reviewsCount: 110,
    description: "Layers of chocolate sponge cake, whipped cream, and cherries, topped with chocolate flakes.",
    ingredients: ["Chocolate Sponge", "Cherries", "Whipping Cream", "Dark Chocolate Shavings"],
    stock: 20,
    weight: "500g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Caramel Butterscotch Delight",
    category: "Cakes",
    price: 790,
    offerPrice: null,
    rating: 4.5,
    reviewsCount: 45,
    description: "Butter sponge cake layered with sweet butterscotch cream and crunchy butterscotch chips.",
    ingredients: ["Butterscotch Sauce", "Butter Sponge", "Praline Crumb", "Whipped Cream"],
    stock: 10,
    weight: "500g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=800&q=80"]
  },

  // Cookies
  {
    name: "Choco Chip Cookies (Box of 6)",
    category: "Cookies",
    price: 299,
    offerPrice: 249,
    rating: 4.5,
    reviewsCount: 42,
    description: "Freshly baked gooey chocolate chip cookies, crisp on the edges and soft in the middle.",
    ingredients: ["Flour", "Brown Sugar", "Butter", "Chocolate Chips", "Vanilla Extract"],
    stock: 50,
    weight: "300g",
    availability: true,
    isBestSeller: false,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Double Chocolate Decadence Cookies",
    category: "Cookies",
    price: 320,
    offerPrice: null,
    rating: 4.8,
    reviewsCount: 61,
    description: "Rich dark chocolate cookies packed with white and dark chocolate chips.",
    ingredients: ["Flour", "Cocoa Powder", "Dark Chocolate Chips", "White Chocolate Chips", "Butter"],
    stock: 40,
    weight: "300g",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1618925250226-52c50269f83a?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Oatmeal Raisin Soft Cookies",
    category: "Cookies",
    price: 260,
    offerPrice: null,
    rating: 4.3,
    reviewsCount: 19,
    description: "Wholesome oats blended with raisins and a hint of cinnamon in a chewy cookie.",
    ingredients: ["Rolled Oats", "Organic Raisins", "Brown Sugar", "Cinnamon", "Butter"],
    stock: 25,
    weight: "250g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1558961309-dbdf71799f5a?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Almond Biscotti (Box of 8)",
    category: "Cookies",
    price: 350,
    offerPrice: 299,
    rating: 4.6,
    reviewsCount: 33,
    description: "Twice-baked Italian biscuits loaded with crunchy almonds. Perfect with coffee.",
    ingredients: ["Roasted Almonds", "Flour", "Sugar", "Eggs", "Vanilla Extract"],
    stock: 30,
    weight: "200g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80"]
  },

  // Brownies
  {
    name: "Classic Fudge Brownies",
    category: "Brownies",
    price: 349,
    offerPrice: 299,
    rating: 4.7,
    reviewsCount: 56,
    description: "Intensely chocolatey, fudgy brownies with a crinkly top.",
    ingredients: ["Dark Chocolate", "Butter", "Sugar", "Eggs", "Cocoa Powder", "Flour"],
    stock: 35,
    weight: "350g",
    availability: true,
    isBestSeller: true,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Walnut Brownie Treat",
    category: "Brownies",
    price: 399,
    offerPrice: null,
    rating: 4.8,
    reviewsCount: 74,
    description: "Classic rich fudge brownies loaded with crunchy toasted walnuts.",
    ingredients: ["Toasted Walnuts", "Dark Chocolate", "Butter", "Eggs", "Sugar"],
    stock: 30,
    weight: "350g",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Salted Caramel Brownie",
    category: "Brownies",
    price: 380,
    offerPrice: 329,
    rating: 4.9,
    reviewsCount: 40,
    description: "Decadent fudge brownie layered and swirled with house-made salted caramel sauce.",
    ingredients: ["Salted Caramel", "Cocoa Powder", "Dark Chocolate", "Flour", "Sea Salt"],
    stock: 18,
    weight: "300g",
    availability: true,
    isBestSeller: false,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1624353365286-3f86224ad766?auto=format&fit=crop&w=800&q=80"]
  },

  // Donuts
  {
    name: "Classic Glazed Donut",
    category: "Donuts",
    price: 99,
    offerPrice: 79,
    rating: 4.3,
    reviewsCount: 21,
    description: "Classic light and fluffy yeast donut coated with a sweet sugar glaze.",
    ingredients: ["Flour", "Yeast", "Sugar", "Milk", "Butter", "Glaze"],
    stock: 45,
    weight: "80g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Double Chocolate Sprinkle Donut",
    category: "Donuts",
    price: 120,
    offerPrice: null,
    rating: 4.6,
    reviewsCount: 38,
    description: "Fluffy donut glazed in rich milk chocolate and topped with colorful sprinkles.",
    ingredients: ["Flour", "Yeast", "Milk Chocolate Glaze", "Rainbow Sprinkles"],
    stock: 40,
    weight: "90g",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1612240498936-65f5101365d2?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Boston Cream Donut",
    category: "Donuts",
    price: 140,
    offerPrice: 119,
    rating: 4.7,
    reviewsCount: 49,
    description: "Yeast-risen donut filled with creamy custard and topped with chocolate icing.",
    ingredients: ["Custard Filling", "Chocolate Icing", "Flour", "Milk", "Yeast"],
    stock: 20,
    weight: "100g",
    availability: true,
    isBestSeller: false,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80"]
  },

  // Muffins
  {
    name: "Blueberry Crumble Muffin",
    category: "Muffins",
    price: 149,
    offerPrice: null,
    rating: 4.6,
    reviewsCount: 34,
    description: "Soft, tender muffins bursting with fresh blueberries and topped with a streusel crumble.",
    ingredients: ["Flour", "Sugar", "Blueberries", "Butter", "Milk", "Baking Powder"],
    stock: 25,
    weight: "120g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1559553156-2e97137af16f?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Banana Walnut Muffin",
    category: "Muffins",
    price: 129,
    offerPrice: 109,
    rating: 4.4,
    reviewsCount: 28,
    description: "Perfectly spiced muffin prepared with ripe bananas and loaded with crunchy walnuts.",
    ingredients: ["Bananas", "Walnuts", "Cinnamon", "Flour", "Brown Sugar", "Butter"],
    stock: 22,
    weight: "120g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Double Chocolate Chip Muffin",
    category: "Muffins",
    price: 139,
    offerPrice: null,
    rating: 4.7,
    reviewsCount: 32,
    description: "Moist chocolate muffin packed with semi-sweet chocolate chips throughout.",
    ingredients: ["Cocoa Powder", "Chocolate Chips", "Flour", "Butter", "Eggs", "Milk"],
    stock: 30,
    weight: "125g",
    availability: true,
    isBestSeller: true,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1587960389570-03cdb0f4f80e?auto=format&fit=crop&w=800&q=80"]
  },

  // Cupcakes
  {
    name: "Classic Vanilla Cupcake",
    category: "Cupcakes",
    price: 89,
    offerPrice: 79,
    rating: 4.4,
    reviewsCount: 15,
    description: "Simple, moist vanilla sponge cupcake topped with soft vanilla buttercream frosting.",
    ingredients: ["Flour", "Sugar", "Butter", "Vanilla Extract", "Frosting"],
    stock: 35,
    weight: "70g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Decadent Oreo Cupcake",
    category: "Cupcakes",
    price: 110,
    offerPrice: null,
    rating: 4.8,
    reviewsCount: 46,
    description: "Chocolate cupcake loaded with crushed Oreo cookies, topped with cookies and cream frosting.",
    ingredients: ["Oreo Cookies", "Cocoa Powder", "Flour", "Whipped Frosting"],
    stock: 24,
    weight: "80g",
    availability: true,
    isBestSeller: true,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Lemon Meringue Cupcake",
    category: "Cupcakes",
    price: 115,
    offerPrice: 99,
    rating: 4.5,
    reviewsCount: 22,
    description: "Zesty lemon-filled cupcake topped with toasted, fluffy meringue.",
    ingredients: ["Lemon Curd", "Flour", "Sugar", "Egg Whites", "Lemon Zest"],
    stock: 15,
    weight: "75g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80"]
  },

  // Pastries
  {
    name: "Classic French Croissant",
    category: "Pastries",
    price: 120,
    offerPrice: 99,
    rating: 4.7,
    reviewsCount: 75,
    description: "Flaky, buttery, golden brown classic French pastry made with layered rolled dough.",
    ingredients: ["Butter", "Flour", "Yeast", "Salt", "Sugar", "Milk"],
    stock: 40,
    weight: "90g",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Butter Croissant Combo",
    category: "Pastries",
    price: 340,
    offerPrice: 280,
    rating: 4.8,
    reviewsCount: 31,
    description: "Pack of 3 freshly baked croissants, flaky and rich in buttery layers.",
    ingredients: ["Butter", "Flour", "Yeast", "Salt"],
    stock: 20,
    weight: "270g",
    availability: true,
    isBestSeller: false,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Almond Flaky Croissant",
    category: "Pastries",
    price: 160,
    offerPrice: null,
    rating: 4.9,
    reviewsCount: 44,
    description: "Delectable buttery croissant filled with rich almond paste and topped with sliced almonds.",
    ingredients: ["Almond Frangipane Filling", "Butter", "Flour", "Sliced Almonds"],
    stock: 15,
    weight: "110g",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Apple Cinnamon Turnover",
    category: "Pastries",
    price: 130,
    offerPrice: 110,
    rating: 4.5,
    reviewsCount: 29,
    description: "Puff pastry turnover stuffed with spiced cinnamon apple filling and drizzled with icing.",
    ingredients: ["Spiced Apple Filling", "Puff Pastry Dough", "Cinnamon", "Sugar Glaze"],
    stock: 25,
    weight: "120g",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Belgian Pain Au Chocolat",
    category: "Pastries",
    price: 150,
    offerPrice: null,
    rating: 4.8,
    reviewsCount: 68,
    description: "Crisp flaky pastry dough wrapped around two bars of premium Belgian dark chocolate.",
    ingredients: ["Belgian Dark Chocolate", "Butter", "Flour", "Yeast"],
    stock: 30,
    weight: "95g",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80"]
  },

  // Beverages
  {
    name: "Cold Brew Coffee",
    category: "Beverages",
    price: 180,
    offerPrice: 149,
    rating: 4.7,
    reviewsCount: 92,
    description: "Artisanal coffee beans steeped in cold water for 18 hours, smooth and low acid.",
    ingredients: ["Specialty Coffee Beans", "Filtered Water"],
    stock: 50,
    weight: "300ml",
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Classic Cafe Latte",
    category: "Beverages",
    price: 150,
    offerPrice: null,
    rating: 4.5,
    reviewsCount: 54,
    description: "Rich espresso shot with steamed milk and a thin layer of microfoam.",
    ingredients: ["Espresso", "Steamed Milk"],
    stock: 60,
    weight: "250ml",
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: ["https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Iced Caramel Macchiato",
    category: "Beverages",
    price: 190,
    offerPrice: 169,
    rating: 4.8,
    reviewsCount: 88,
    description: "Espresso combined with vanilla syrup, milk, and ice, topped with caramel drizzle.",
    ingredients: ["Espresso", "Caramel Drizzle", "Vanilla Syrup", "Milk", "Ice"],
    stock: 45,
    weight: "350ml",
    availability: true,
    isBestSeller: true,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80"]
  },
  {
    name: "Matcha Latte",
    category: "Beverages",
    price: 210,
    offerPrice: null,
    rating: 4.6,
    reviewsCount: 37,
    description: "Pure Japanese Uji Matcha powder whisked with warm creamy milk.",
    ingredients: ["Ceremonial Grade Matcha", "Milk", "Honey (Optional)"],
    stock: 30,
    weight: "250ml",
    availability: true,
    isBestSeller: false,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/delicious');
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Existing products and categories cleared.');

    // Insert categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`${categories.length} categories seeded successfully!`);

    // Insert products
    const products = await Product.insertMany(productsData);
    console.log(`${products.length} products seeded successfully!`);

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
