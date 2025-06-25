# Bookshop API

This is the backend API for the Bookshop website, providing user management, cart functionality, and gift voucher management.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set up environment variables in .env file:

   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

3. Run the server:
   ```
   npm run dev   # development mode with nodemon
   npm start     # production mode
   ```

## API Endpoints

### User Routes

- `POST /api/users/register` - Register a new user

  - Body: `{ firstName, lastName, email, password, contactNumber, address }`

- `POST /api/users/login` - Login user

  - Body: `{ email, password }`

- `GET /api/users/profile` - Get user profile (Protected)

  - Headers: `Authorization: Bearer <token>`

- `PUT /api/users/profile` - Update user profile (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ firstName, lastName, email, contactNumber, address, password }` (all fields optional)

### Cart Routes

All cart routes require authentication with `Authorization: Bearer <token>` header.

- `GET /api/cart` - Get user's cart

- `POST /api/cart` - Add item to cart

  - Body: `{ bookName, quantity, price }`

- `PUT /api/cart/:bookName` - Update cart item quantity

  - Body: `{ quantity }`

- `DELETE /api/cart/:bookName` - Remove item from cart

- `DELETE /api/cart` - Clear user's cart

### Voucher Routes

All voucher routes require authentication with `Authorization: Bearer <token>` header.

- `POST /api/vouchers` - Create a new voucher

  - Body: `{ voucherPrice }`

- `GET /api/vouchers/active` - Get user's active vouchers

- `GET /api/vouchers/expired` - Get user's expired vouchers

- `POST /api/vouchers/validate` - Validate a voucher

  - Body: `{ voucherCode }`

- `POST /api/vouchers/apply` - Apply a voucher (mark as used)
  - Body: `{ voucherCode }`

## Authentication

Most API endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <token>
```

The token is obtained upon successful login or registration.
