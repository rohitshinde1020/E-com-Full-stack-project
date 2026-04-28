# E-Com Website Monorepo

Complete e-commerce platform with 3 apps inside one workspace:

- `frontend` for customers
- `admin` for store management
- `backend` for API, auth, products, cart, orders, and payments

This README documents the full `e-com-site` folder based on the current project state.

## What Is Inside

```text
e-com-site/
|- README.md
|- frontend/                      # Customer app (React + Vite + Tailwind)
|  |- src/
|  |  |- components/
|  |  |- context/shopcontext.jsx  # Global state: products, cart, auth token
|  |  `- pages/                   # home, collection, product, cart, login, order, etc.
|  |- package.json
|  `- vercel.json
|- admin/                         # Admin app (React + Vite + Tailwind)
|  |- src/
|  |  |- components/              # login, navbar, sidebar, dashboard cards
|  |  `- pages/                   # add product, product list, order management
|  |- package.json
|  `- vercel.json
`- backend/                       # Node.js + Express + MongoDB API
   |- api/index.js                # Vercel serverless entry
   |- app.js                      # Express app wiring, CORS, routes
   |- server.js                   # Local dev server entry
   |- config/                     # db and cloudinary connection
   |- controllers/                # user, product, cart, order logic
   |- middlewares/                # auth middlewares + multer
   |- models/                     # mongoose schemas
   |- routers/                    # API route groups
   |- uploads/
   |- package.json
   `- vercel.json
```

## Architecture Overview

1. Frontend and admin call backend using `VITE_BACKEND_URL`.
2. Backend authenticates with JWT (`role: user` or `role: admin`).
3. Product images upload to Cloudinary using in-memory multer buffers (no local disk requirement).
4. Orders support COD, Stripe Checkout, and Razorpay.
5. Deployment is split per app (3 separate Vercel projects is the recommended flow).

## Tech Stack

- Frontend/Admin: React 19, Vite 8, React Router, Axios, Tailwind CSS 4, React Toastify
- Backend: Node.js, Express 5, Mongoose, JWT, bcryptjs, CORS, cookie-parser, multer, cloudinary
- Payments: Stripe + Razorpay
- Database: MongoDB

## Features (Current)

- User signup/login with JWT and cookie set from backend responses
- Admin login using `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Product creation with up to 4 images, size options, category/subcategory, bestseller flag
- Product list and single product fetch for storefront
- Cart create/update/fetch per authenticated user
- Order placement:
  - COD
  - Stripe checkout session + verification
  - Razorpay order + signature verification
- Admin order retrieval and order status updates
- API health endpoints and JSON 404 handling

## Prerequisites

- Node.js (project currently declares `22.x` in backend engines)
- npm
- MongoDB connection string
- Cloudinary account
- Stripe secret key (if Stripe flow is enabled)
- Razorpay key pair (if Razorpay flow is enabled)

## Environment Variables

Create `.env` file in each app.

### backend/.env

```env
# Server
PORT=3000
NODE_ENV=development

# Database/Auth
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Client origin + CORS
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

Notes:

- `MONGO_URI` and `JWT_SECRET` are required to boot backend.
- Keep `CORS_ORIGINS` comma-separated.
- In production, include deployed frontend/admin origins in `CORS_ORIGINS`.

### frontend/.env

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### admin/.env

```env
VITE_BACKEND_URL=http://localhost:3000
```

## Install Dependencies

Run these once from project root:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

## Run Locally (3 Terminals)

1. Backend

```bash
cd backend
npm run server
```

2. Frontend

```bash
cd frontend
npm run dev
```

3. Admin

```bash
cd admin
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Backend: `http://localhost:3000`

## NPM Scripts

### backend/package.json

- `npm start` -> starts Node server (`server.js`)
- `npm run server` -> starts nodemon for development

### frontend/package.json

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### admin/package.json

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## API Reference (Current)

Base URL (local): `http://localhost:3000`

Health:

- `GET /` -> basic API running response
- `GET /health` -> uptime + timestamp

Users:

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/adminlogin`

Products:

- `GET /api/products/list` (public)
- `POST /api/products/add` (admin token required)
- `POST /api/products/remove` (admin token required)
- `POST /api/products/single` (admin token required)

Cart (user token required):

- `POST /api/cart/add`
- `POST /api/cart/update`
- `POST /api/cart/usercart`

Orders:

- `POST /api/orders/placecod` (user token required)
- `POST /api/orders/placestripe` (user token required)
- `POST /api/orders/placerazorpay` (user token required)
- `POST /api/orders/verifystripe` (user token required)
- `POST /api/orders/verifyrazorpay` (user token required)
- `POST /api/orders/userorders` (user token required)
- `POST /api/orders/allorders` (admin token required)
- `POST /api/orders/status` (admin token required)

Auth header accepted by middleware:

- `token: <jwt>`
- or `Authorization: Bearer <jwt>`

## Deployment (Vercel)

Deploy as 3 separate projects.

### Backend deployment

- Project root: `backend`
- Uses `backend/vercel.json` with rewrite to `api/index.js`
- Set all backend env vars in Vercel Project Settings

### Frontend deployment

- Project root: `frontend`
- Uses Vite build output (`dist`)
- Set `VITE_BACKEND_URL` to deployed backend URL

### Admin deployment

- Project root: `admin`
- Uses Vite build output (`dist`)
- Set `VITE_BACKEND_URL` to deployed backend URL

Post-deploy checks:

1. Backend `/health` returns success.
2. Frontend and admin can login against live backend.
3. `CORS_ORIGINS` includes both deployed frontend and admin domains.
4. Payment env vars match mode (test/live) on both backend and client (Razorpay key ID in frontend).

## Troubleshooting

- `Invalid or expired token`: login again to refresh JWT and verify auth header format.
- CORS blocked requests: update `CORS_ORIGINS` with exact origins.
- Product upload failing: verify Cloudinary credentials and multipart payload fields `image1..image4`.
- Stripe verification failing: ensure `sessionId` + `orderId` match the checkout metadata.
- Razorpay verification failing: confirm signature fields and backend secret.
- Linux-only deployment crashes can happen from case-sensitive import mismatches. Keep file import casing exact.

## Security Notes

- Never commit real `.env` files.
- Rotate keys immediately if exposed.
- Use strong secrets for JWT, admin password, and DB user.
- Prefer production HTTPS and strict origin management.

## Suggested Next Improvements

1. Add API request validation (zod/joi/express-validator).
2. Add tests (unit + integration).
3. Add CI checks (lint, build, test).
4. Add role-based authorization helper utilities for cleaner middleware.

## License

Learning and portfolio project.
