# E-Com Site (Full Stack)

A full-stack e-commerce project with three apps:
- Customer Frontend (React + Vite + Tailwind)
- Admin Panel (React + Vite + Tailwind)
- Backend API (Node.js + Express + MongoDB)

## Project Structure

- backend: Express API, auth, products, cart, orders, payment integration hooks
- frontend: Customer website (browse products, cart, place order, track order)
- admin: Admin dashboard (manage products and orders, update order status)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Admin: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary
- Payments: Stripe and Razorpay support in backend routes

## Prerequisites

- Node.js 18+
- npm
- MongoDB connection string
- Cloudinary account (for image uploads)
- Stripe and Razorpay keys (if payment routes are used)

## Environment Variables

Create backend/.env with values like below:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:5173

Create frontend/.env:

VITE_BACKEND_URL=http://localhost:3000

Create admin/.env:

VITE_BACKEND_URL=http://localhost:3000

## Installation

Install dependencies in each app:

1. Backend
   - cd backend
   - npm install

2. Frontend
   - cd frontend
   - npm install

3. Admin
   - cd admin
   - npm install

## Run The Project

Use 3 terminals:

1. Start backend
   - cd backend
   - npm run server

2. Start frontend
   - cd frontend
   - npm run dev

3. Start admin
   - cd admin
   - npm run dev

Default URLs:
- Frontend: http://localhost:5173
- Admin: http://localhost:5174 (or next free Vite port)
- Backend API: http://localhost:3000

## Main Features

### Customer Frontend
- User register/login
- Product listing and collection pages
- Add to cart and cart management
- Place orders with COD / Stripe / Razorpay routes
- Track orders with latest status refresh from backend

### Admin Panel
- Admin login
- Manage store data and products
- View all customer orders
- Update order status (order placed, packed, shipped, out for delivery, delivered)

### Backend API
- User auth and admin auth
- Product CRUD and product listing
- Cart add/update/get operations
- Order create/get/update status
- Stripe and Razorpay verification endpoints

## Important API Groups

- /api/users
  - register
  - login
  - adminlogin

- /api/products
  - add
  - list
  - remove
  - single

- /api/cart
  - add
  - update
  - usercart

- /api/orders
  - placecod
  - placestripe
  - placerazorpay
  - verifystripe
  - verifyrazorpay
  - userorders
  - allorders (admin)
  - status (admin)

## Git Ignore Notes

This repository includes separate gitignore files for each app:
- backend/.gitignore
- frontend/.gitignore
- admin/.gitignore

They ignore node_modules, logs, env files, build output, and editor-specific files.

## Common Troubleshooting

- If command npm rundev fails, use npm run dev.
- If frontend/admin cannot reach backend, verify VITE_BACKEND_URL and backend PORT.
- If admin login fails, check ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env.
- If images fail to upload, verify Cloudinary environment values.
- If order/payment verification fails, verify Stripe/Razorpay keys.

## Future Improvements

- Add refresh tokens and stronger session handling
- Add order timeline events with timestamps
- Add email notifications for status updates
- Add unit/integration tests
- Add Docker setup for one-command startup

## Author

Built as a full-stack e-commerce practice project with separate customer, admin, and backend apps.
