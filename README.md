# Full Stack E-Commerce Project

A complete e-commerce platform built with three separate applications:

- Frontend app for customers
- Admin app for store management
- Backend REST API for business logic, authentication, and payments

This repository is structured for real-world workflow: independent app deployments, environment-based configuration, and production-ready route separation.

## Applications

- `frontend/` - Customer website (React + Vite)
- `admin/` - Admin dashboard (React + Vite)
- `backend/` - API server (Node.js + Express + MongoDB)

## Tech Stack

- Frontend and Admin: React, Vite, Axios, React Router, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary
- Payments: Stripe and Razorpay integration

## Core Features

- User registration and login
- Admin login and role-based admin authorization
- Product listing and product management
- Cart operations
- Order placement (COD, Stripe, Razorpay)
- Payment verification endpoints
- Admin order management and status updates

## Repository Structure

```text
.
|- frontend/
|- admin/
|- backend/
`- README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas (or reachable MongoDB instance)
- Cloudinary account (for product image upload)
- Stripe and Razorpay keys (if payment flows are enabled)

## Environment Variables

Use environment files per app.

### Backend (`backend/.env`)

```env
PORT=3000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=strong_admin_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Admin (`admin/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
```

## Local Setup

Install dependencies in all apps.

```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

## Run Locally

Open 3 terminals:

1. Start backend

```bash
cd backend
npm run server
```

2. Start frontend

```bash
cd frontend
npm run dev
```

3. Start admin

```bash
cd admin
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5174` (or next available Vite port)
- Backend: `http://localhost:3000`

## API Health Endpoints

- `GET /` - Basic API status
- `GET /health` - Uptime health check

## Main API Groups

### Users

- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/adminlogin`

### Products

- `GET /api/products/list`
- `POST /api/products/add` (admin)
- `POST /api/products/remove` (admin)
- `POST /api/products/single` (admin)

### Cart

- `POST /api/cart/add`
- `POST /api/cart/update`
- `POST /api/cart/usercart`

### Orders

- `POST /api/orders/placecod`
- `POST /api/orders/placestripe`
- `POST /api/orders/placerazorpay`
- `POST /api/orders/verifystripe`
- `POST /api/orders/verifyrazorpay`
- `POST /api/orders/userorders`
- `POST /api/orders/allorders` (admin)
- `POST /api/orders/status` (admin)

## Deployment Guide

Deploy each app separately.

### 1) Deploy Backend

- Deploy `backend/` to Vercel
- Set backend environment variables in Vercel project settings
- Confirm backend URL works:
  - `/`
  - `/health`

### 2) Deploy Frontend

- Deploy `frontend/` to Vercel
- Set `VITE_BACKEND_URL` to deployed backend URL
- Redeploy after env changes

### 3) Deploy Admin

- Deploy `admin/` to Vercel
- Set `VITE_BACKEND_URL` to deployed backend URL
- Redeploy after env changes

### Deployment Checklist

- No secrets committed to Git
- All production env variables set in deployment platform
- `CORS_ORIGINS` includes deployed frontend and admin domains
- Frontend and admin point to live backend URL
- Payment keys are valid for selected mode (test or live)

## Security Notes

- Keep `.env` out of Git
- Rotate keys immediately if exposed
- Use strong `JWT_SECRET`, `ADMIN_PASSWORD`, and database credentials
- Prefer role claim checks for admin-protected routes

## Troubleshooting

- Command typo: use `npm run dev` (not `npm run derver`)
- If frontend/admin cannot call backend, verify `VITE_BACKEND_URL`
- If CORS error occurs, verify `CORS_ORIGINS` contains current origins
- If admin routes fail with 403, re-login to get a fresh admin token
- If upload fails, verify Cloudinary env values
- If payment verification fails, verify payment keys and callback flow

## Future Improvements

- Add automated tests (unit + integration)
- Add CI pipeline (lint, build, test)
- Add rate limiting and request validation
- Add order email notifications
- Add refresh token and session invalidation strategy

## License

This project is for learning and portfolio use.
