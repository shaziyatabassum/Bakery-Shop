export const categories = [
  { id: 1, name: "Cakes", slug: "cakes", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Cookies", slug: "cookies", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Brownies", slug: "brownies", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Donuts", slug: "donuts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Pastries", slug: "pastries", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "Beverages", slug: "beverages", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
];

export const products = [
  {
    id: 1,
    name: "Classic Chocolate Truffle",
    category: "Cakes",
    price: 699,
    offerPrice: 599,
    rating: 4.8,
    reviews: 124,
    description: "Rich, dense and incredibly moist chocolate cake with layers of decadent chocolate truffle ganache.",
    ingredients: ["Cocoa Powder", "Dark Chocolate", "Flour", "Sugar", "Butter", "Eggs"],
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 2,
    name: "Red Velvet Bliss",
    category: "Cakes",
    price: 899,
    offerPrice: null,
    rating: 4.9,
    reviews: 86,
    description: "Iconic red velvet cake with smooth cream cheese frosting, perfect for any celebration.",
    ingredients: ["Flour", "Cocoa Powder", "Buttermilk", "Cream Cheese", "Butter", "Vanilla"],
    availability: true,
    isBestSeller: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 3,
    name: "Choco Chip Cookies (Box of 6)",
    category: "Cookies",
    price: 299,
    offerPrice: 249,
    rating: 4.5,
    reviews: 42,
    description: "Freshly baked gooey chocolate chip cookies, crisp on the edges and soft in the middle.",
    ingredients: ["Flour", "Brown Sugar", "Butter", "Chocolate Chips", "Vanilla Extract"],
    availability: true,
    isBestSeller: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 4,
    name: "Fudge Brownies",
    category: "Brownies",
    price: 349,
    offerPrice: null,
    rating: 4.7,
    reviews: 56,
    description: "Intensely chocolatey, fudgy brownies with a crinkly top.",
    ingredients: ["Dark Chocolate", "Butter", "Sugar", "Eggs", "Cocoa Powder", "Flour"],
    availability: true,
    isBestSeller: true,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 5,
    name: "Glazed Donut",
    category: "Donuts",
    price: 99,
    offerPrice: 79,
    rating: 4.3,
    reviews: 21,
    description: "Classic light and fluffy yeast donut coated with a sweet sugar glaze.",
    ingredients: ["Flour", "Yeast", "Sugar", "Milk", "Butter", "Glaze"],
    availability: true,
    isBestSeller: false,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 6,
    name: "Blueberry Muffin",
    category: "Muffins",
    price: 149,
    offerPrice: null,
    rating: 4.6,
    reviews: 34,
    description: "Soft, tender muffins bursting with fresh blueberries and topped with a streusel crumb.",
    ingredients: ["Flour", "Sugar", "Blueberries", "Butter", "Milk", "Baking Powder"],
    availability: false,
    isBestSeller: false,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1559553156-2e97137af16f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  }
];
