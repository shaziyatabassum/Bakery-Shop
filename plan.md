# Delicious - Bakery E-Commerce Website
## Complete Project Requirement Document (MERN Stack)

---

# Project Overview

## Project Name
**Delicious**

## Project Type
Modern Bakery E-Commerce Website

## Development Experience Standard
Develop the project following the architecture, coding standards, UI/UX principles, scalability, and folder structure expected from a **10+ years experienced MERN Stack developer**. The application should be production-ready, clean, reusable, maintainable, responsive, and optimized for future feature expansion.

---

# Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Context API / Redux Toolkit
- React Hook Form
- React Icons
- Swiper.js
- Framer Motion (Simple Animations)
- React Hot Toast
- Google Fonts

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas

## Authentication

- JWT Authentication
- Password Hashing using bcrypt

## Image Storage

Use real product images.

Preferred:

- Cloudinary
- Product images stored via URLs

---

# Currency

- INR (₹)

---

# Theme

## Style

- Minimalist
- Modern
- Premium
- Attractive
- Aesthetic
- Trendy
- Bakery Inspired

No gradient colors.

Use flat colors only.

---

# Color Palette

## Primary Color

Chocolate Brown

```
#5C3A21
```

## Secondary Color

Peach

```
#F6D7B0
```

## Background

```
#FFFFFF
```

## Light Background

```
#FFF8F2
```

## Accent Color

```
#D89B5B
```

## Text

```
#2C2C2C
```

## Border

```
#ECECEC
```

Buttons should have subtle hover effects only.

---

# Typography

Use Google Fonts.

Preferred Font:

**Poppins**

Fallback:

- Inter
- Nunito Sans

---

# Website Pages

## Home

Sections

- Hero Banner
- Featured Products
- New Arrivals
- Today's Offers
- Categories
- Best Sellers
- Customer Reviews
- Why Choose Delicious
- Newsletter
- Instagram Gallery
- Footer

---

## Shop

Features

- Product Grid
- Filters
- Sorting
- Search
- Pagination
- Category Filter
- Price Filter
- Rating Filter

---

## Categories

Display categories such as

- Cakes
- Cookies
- Biscuits
- Brownies
- Muffins
- Donuts
- Pastries
- Chocolates
- Puffs
- Sandwiches
- Snacks
- Beverages

---

## Product Details Page

Show

- Large Product Image
- Multiple Images
- Product Name
- Price
- Offer Price
- Rating
- Reviews
- Description
- Ingredients
- Availability
- Quantity Selector
- Add to Cart
- Wishlist
- Buy Now
- Related Products
- Recommended Products
- Customer Reviews

Below the selected product display:

- Similar Products
- Frequently Bought Together
- Recommended Products

---

## Wishlist

Features

- Add
- Remove
- Move to Cart

---

## Cart

Features

- Product Image
- Name
- Price
- Quantity
- Increase Quantity
- Decrease Quantity
- Remove Product
- Continue Shopping
- Checkout

Display

Subtotal

Delivery Charge

Discount

Final Total

---

## Checkout

Two-column layout.

### Left Side

Customer Details

- Full Name
- Mobile Number
- Email
- Address
- Landmark
- City
- State
- Pincode

### Right Side

Order Summary

- Products
- Quantity
- Price
- Subtotal
- Delivery Charges
- Grand Total

---

## Payment

Only one payment option.

Cash On Delivery

Display

- Customer Details
- Delivery Address
- Order Summary

Place Order button.

---

## Order Success

Show

- Success Icon
- Order Number
- Estimated Delivery
- Continue Shopping Button

---

## Order History

After login.

Display

- Order Number
- Date
- Products
- Total Amount
- Payment Method
- Order Status

---

## Sign Up

Fields

- Full Name
- Email
- Password

Validation required.

---

## Sign In

Fields

- Email
- Password

---

## Profile

After login.

Show

- Profile Photo
- Name
- Email
- Phone
- Address
- Order History
- Wishlist
- Logout

---

## Contact

Show

Address

Phone Number

Email

Google Map

Contact Form

Fields

- Name
- Email
- Subject
- Message

---

# Header

Include

Logo

Navigation

- Home
- Shop
- Categories
- Contact

Search Bar

Wishlist

Cart

Profile

Sign In

Sign Up

Sticky Header

---

# Footer

Sections

## Let Us Help You

- Contact Us
- FAQs
- Shipping Policy
- Return Policy
- Privacy Policy
- Terms & Conditions

## Contact Details

Address

Phone Number

Email

---

## Follow Us

Social Icons

- Instagram
- Facebook
- Pinterest
- YouTube

Use icons only.

No emojis.

---

# Functionalities

## Authentication

- Register
- Login
- Logout
- JWT Authentication

---

## Product

- Product Listing
- Product Details
- Search
- Category Filter
- Price Filter
- Rating Filter
- Sorting

---

## Search

Live Search.

While typing,

show relevant bakery products below the search bar.

Example

Searching

Cake

shows

- Chocolate Cake
- Black Forest Cake
- Red Velvet Cake

---

## Cart

- Add Product
- Remove Product
- Increase Quantity
- Decrease Quantity
- Save Cart

---

## Wishlist

- Add
- Remove
- Move to Cart

---

## Offers

Display

- Discount Badge
- Limited Time Offers
- Festival Offers
- Combo Offers

---

## Reviews

Customers can

- Give Rating
- Write Review

Display

- Average Rating
- Review Count

---

## Recommendation System

Display

Recommended Products

Based on

- Category
- Similar Products
- Recently Viewed
- Best Sellers

---

## New Arrivals

Display latest bakery products.

---

## Best Sellers

Display most purchased bakery products.

---

## Featured Products

Display premium products.

---

## Newsletter

Subscribe with email.

---

## Mobile Responsive

Responsive for

- Mobile
- Tablet
- Laptop
- Desktop

---

# Animations

Use simple animations only.

Examples

- Fade In
- Slide Up
- Hover Scale
- Button Hover
- Card Hover

Avoid heavy animations.

---

# Images

Use real bakery product images.

Examples

- Chocolate Cake
- Black Forest Cake
- Cookies
- Brownies
- Muffins
- Donuts
- Croissants
- Pastries
- Sandwiches
- Veg Puffs
- Chocolate Cookies
- Garlic Bread
- Cupcakes

Do not use placeholder illustrations.

Use realistic product photography.

---

# Database Collections

Users

```
_id
name
email
password
phone
address
createdAt
```

Products

```
_id
name
description
category
price
offerPrice
rating
reviews
images
stock
ingredients
createdAt
```

Categories

```
_id
categoryName
image
```

Orders

```
_id
userId
products
totalAmount
address
paymentMethod
status
createdAt
```

Wishlist

```
_id
userId
productId
```

Reviews

```
_id
userId
productId
rating
review
createdAt
```

---

# Backend APIs

Authentication

- Register
- Login
- Logout

Products

- Get All Products
- Get Single Product
- Search Product
- Filter Product

Categories

- Get Categories

Wishlist

- Add
- Remove

Cart

- Add
- Remove
- Update Quantity

Orders

- Create Order
- Order History

Reviews

- Add Review
- Get Reviews

Profile

- Get Profile
- Update Profile

---

# Folder Structure

```
client/
│
├── public
├── src
│   ├── assets
│   ├── components
│   ├── layouts
│   ├── pages
│   ├── context
│   ├── hooks
│   ├── services
│   ├── utils
│   ├── routes
│   ├── styles
│   └── App.jsx
│
server/
│
├── config
├── controllers
├── middleware
├── models
├── routes
├── utils
├── uploads
└── server.js
```

---

# Project Phases

# Phase 1 — Frontend Only

## Objective

Develop a complete frontend that is fully responsive and ready for backend integration.

### Deliverables

- Complete UI/UX
- Routing
- Static Product Data
- Responsive Design
- Search UI
- Wishlist UI
- Cart UI
- Checkout UI
- Profile UI
- Order History UI
- Offers Section
- Reviews Section
- Recommendation Section
- Footer
- Ready API integration structure

---

# Phase 2 — Backend & Database Integration

## Objective

Connect the frontend with backend services and MongoDB Atlas.

### Deliverables

- Express Server
- MongoDB Atlas Connection
- JWT Authentication
- CRUD APIs
- Product APIs
- Cart APIs
- Wishlist APIs
- Orders APIs
- Reviews APIs
- Profile APIs
- Validation
- Error Handling

---

# Phase 3 — Full Integration & Production Ready

## Objective

Complete the project with full functionality and deployment readiness.

### Deliverables

- Fully Integrated MERN Stack
- Authentication
- Cart Persistence
- Wishlist Persistence
- Checkout
- Cash On Delivery Order Placement
- Order History
- Reviews & Ratings
- Recommendation Engine
- Performance Optimization
- Responsive Testing
- Security Best Practices
- Clean Code
- Production Build
- Deployment Ready

---

# UI/UX Guidelines

- Clean spacing
- Rounded corners (8–12px)
- Soft shadows
- White background
- Chocolate and peach color theme
- Consistent typography
- Large product images
- Minimalistic cards
- Flat design
- Accessible color contrast
- Mobile-first approach
- Smooth scrolling
- Sticky navigation
- Icon-based interactions (no emojis)

---

# Final Goal

Develop **Delicious**, a premium bakery e-commerce platform using the MERN stack with a modern, minimalist, and aesthetically pleasing chocolate-inspired design. The application should deliver a seamless shopping experience featuring real bakery product images, intelligent search and recommendations, wishlist management, cart functionality, customer reviews and ratings, Cash on Delivery checkout, user profiles, and order history. The project must be completed in three structured phases—Frontend, Backend with MongoDB Atlas integration, and Full Production Integration—resulting in a scalable, maintainable, responsive, and deployment-ready application built according to professional industry standards.