# 💰 ExpenseTracker - Production-Grade Full Stack Application

A minimalist yet powerful expense tracking application built with modern technologies. Track your income and expenses with beautiful visualizations and clean interface.

## 🎯 Project Overview

ExpenseTracker is a full-stack MERN application that demonstrates production-grade software engineering practices. It provides users with a clean, intuitive dashboard to manage their financial transactions with real-time analytics.

**Key Features:**
- 🔐 JWT-based authentication (signup/login)
- 💼 Transaction management (create, read, delete)
- 📊 Beautiful analytics dashboard with pie charts
- 💡 Category-based expense breakdown
- 🎨 Minimalist SaaS-style UI
- ⚡ Real-time data synchronization
- 📱 Responsive design (mobile, tablet, desktop)

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**
- React 19 with Vite (ultra-fast bundler)
- Tailwind CSS v4 with @tailwindcss/vite plugin
- Recharts for data visualization
- React Router for navigation
- Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Helmet for security
- CORS for cross-origin requests

**Database:**
- MongoDB Atlas (cloud)
- Mongoose schema validation
- Indexes on userId and date for performance

---

## 🏛️ Folder Structure

```
expense-tracker/
├── backend/                          # Node.js/Express server
│   ├── src/
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   └── analyticsController.js
│   │   ├── services/                 # Business logic
│   │   │   ├── AuthService.js
│   │   │   ├── TransactionService.js
│   │   │   └── AnalyticsService.js
│   │   ├── models/                   # Database schemas
│   │   │   ├── User.js
│   │   │   └── Transaction.js
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── auth.js               # JWT verification
│   │   │   └── errorHandler.js       # Error handling
│   │   ├── routes/                   # API endpoints
│   │   │   ├── authRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   └── index.js                  # Express server entry
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── node_modules/

└── frontend/frontend/                # React/Vite application
    ├── src/
    │   ├── pages/                    # Page components
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── components/               # Reusable components
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SummaryCard.jsx
    │   │   ├── CategoryChart.jsx
    │   │   └── TransactionsTable.jsx
    │   ├── services/                 # API client
    │   │   └── apiClient.js
    │   ├── context/                  # State management
    │   │   └── AuthContext.jsx
    │   ├── App.jsx                   # Main app with routing
    │   ├── main.jsx                  # React entry point
    │   └── index.css                 # Tailwind + global styles
    ├── .env                          # Environment variables
    ├── vite.config.js
    ├── package.json
    └── node_modules/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v22.x or higher
- npm or yarn
- MongoDB Atlas account (free tier available)

### Installation & Setup

#### 1. Clone/Navigate to Project

```bash
cd d:\Coding\FullStack\expense-tracker
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
# Copy from .env.example and update MONGODB_URI
```

**Backend .env Configuration:**
```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

# JWT configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

#### 3. Frontend Setup

```bash
cd frontend/frontend

# Install dependencies
npm install

# Create .env file
```

**Frontend .env Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
node src/index.js
```

Expected output:
```
✅ Server running on port 5000
📡 API Documentation:
   Auth: POST /api/auth/register, POST /api/auth/login
   Transactions: GET/POST /api/transactions
   Analytics: GET /api/analytics
✅ MongoDB connected successfully
```

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend/frontend
npm run dev
```

Expected output:
```
VITE v8.0.1 ready in 345 ms

➜  Local:   http://localhost:5173/
```

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

---

## 📡 API Documentation

### Authentication Endpoints

**POST `/api/auth/register`**
- Create a new user account
- Body: `{ email, password, name }`
- Returns: `{ user: { id, email, name }, token }`

**POST `/api/auth/login`**
- Login existing user
- Body: `{ email, password }`
- Returns: `{ user: { id, email, name }, token }`

**GET `/api/auth/profile`** (Protected)
- Fetch current user profile
- Headers: `Authorization: Bearer {token}`
- Returns: `{ user: { id, email, name } }`

### Transaction Endpoints

**POST `/api/transactions`** (Protected)
- Create a new transaction
- Body: `{ title, amount, type, category, date, description }`
- Returns: `{ transaction: {...} }`

**GET `/api/transactions`** (Protected)
- Fetch user's transactions with pagination
- Query params: `page`, `limit`, `category`, `type`, `startDate`, `endDate`
- Returns: `{ transactions: [...], pagination: {...} }`

**DELETE `/api/transactions/:id`** (Protected)
- Delete a transaction
- Returns: `{ message: "Transaction deleted successfully" }`

**POST `/api/transactions/import`** (Protected)
- Bulk import transactions
- Body: `{ transactions: [...] }`
- Returns: `{ count: number }`

**GET `/api/transactions/categories`** (Protected)
- Get available categories
- Returns: `{ categories: { income: [...], expense: [...] } }`

### Analytics Endpoints

**GET `/api/analytics`** (Protected)
- Get comprehensive analytics using MongoDB aggregation
- Query params: `startDate`, `endDate` (optional)
- Returns:
```json
{
  "summary": {
    "balance": 50000,
    "totalIncome": 100000,
    "totalExpense": 50000
  },
  "categoryBreakdown": [
    { "type": "expense", "category": "food", "amount": 5000, "count": 10 }
  ],
  "monthlyTrend": [
    { "date": "2026-03-01T00:00:00.000Z", "income": 50000, "expense": 25000 }
  ]
}
```

---

## 🎨 Design System

### Color Palette

| Color | Usage | Hex |
|-------|-------|-----|
| Slate 50 | Background | #f8fafc |
| Slate 500 | Secondary text | #64748b |
| Slate 800 | Primary text | #1e293b |
| Pink 400 | Subtle accent | #f472b6 |
| Pink 500 | Primary accent (buttons) | #ec4899 |
| Pink 600 | Hover state | #db2777 |

### Typography

- **Font**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI')
- **Headings**: 600-700 font weight
- **Body**: 400 font weight
- **Spacing**: Consistent 16px base unit

### Component Guidelines

- **Cards**: White background with subtle shadow and border
- **Buttons**: Solid color, no gradients, clear hover state
- **Inputs**: Border-based, focus ring with accent color
- **Icons**: 20-24px for UI, consistent stroke weight
- **Spacing**: 4px, 8px, 16px, 24px increments

---

## 🔐 Authentication Flow

1. **Signup**
   - User enters email, password, name
   - Password hashed with bcryptjs (10 salt rounds)
   - User created in MongoDB
   - JWT token generated
   - Token stored in localStorage (frontend)

2. **Login**
   - User enters email, password
   - Password verified against hashed value
   - JWT token generated with 7-day expiry
   - Token sent to frontend

3. **Protected Routes**
   - Token extracted from Authorization header
   - JWT verified with secret key
   - userId decoded and attached to request
   - Protected endpoints only accessible with valid token

---

## 📊 Data Models

### User Schema

```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Schema

```javascript
{
  userId: ObjectId (indexed),
  title: String (required),
  amount: Number (min: 0.01),
  type: String (enum: ["income", "expense"]),
  category: String (validated against type),
  date: Date (indexed),
  description: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId` - For filtering by user
- `date` - For date range queries
- `userId + date` - For analytics queries

---

## 🏆 Technical Decisions & Rationale

### Why MongoDB Aggregation Over JavaScript Reduce?

**Problem:** Analytics require complex calculations (sum, group, filter) across potentially thousands of transactions.

**Solution:** MongoDB aggregation pipeline
- **Benefits:**
  - All computation happens at database layer (not in Node.js)
  - Significantly faster for large datasets
  - Reduces network payload (aggregated data only)
  - Automatically indexed for performance
  - Handles concurrent requests efficiently
  - Cleaner code with pipeline syntax

**Example:** Getting category breakdown with JavaScript reduce would require:
1. Fetching ALL transactions to Node.js (network overhead)
2. Iterating through each transaction (O(n) complexity)
3. Grouping and summing in memory (memory overhead)

With aggregation:
```javascript
// Single MongoDB query handles all computation
db.transactions.aggregate([
  { $match: { userId: user._id } },
  { $group: { _id: "$category", amount: { $sum: "$amount" } } }
])
```

### Pagination Implementation

**Why pagination matters:**
- Reduces initial load time
- Improves UI responsiveness
- Decreases memory usage
- Better user experience with large datasets

**Implementation:**
- Default: 10 items per page
- Max: 100 items per page
- Skip-based offset: `(page - 1) * limit`
- Returns: `transactions[]`, `pagination { page, limit, total, pages }`

### Controller-Service Pattern

**Architecture:**
```
Request → Controller → Service → Model → Database
Response ← Controller ← Service ← Model ← Database
```

**Benefits:**
- **Separation of Concerns**: Controllers handle HTTP, Services handle logic
- **Testability**: Services can be tested independently
- **Reusability**: Services can be used by multiple controllers
- **Maintainability**: Easy to locate and modify business logic
- **Error Handling**: Centralized in middleware

**Example:**
```javascript
// Controller (handles HTTP)
export const authController = {
  login: asyncHandler(async (req, res) => {
    const result = await AuthService.login(email, password);
    res.json({ data: result });
  })
};

// Service (handles logic)
export class AuthService {
  static async login(email, password) {
    const user = await User.findOne({ email });
    // business logic here
    return { user, token };
  }
}
```

### Why Tailwind CSS v4 with @tailwindcss/vite?

**Old Approach (PostCSS):**
- Multiple dependencies (tailwindcss, postcss, autoprefixer)
- Complex configuration
- Slower build times
- Separate tool chain

**New Approach (Vite Plugin):**
- Single dependency (@tailwindcss/vite)
- Zero configuration
- Faster builds with Vite
- Seamless integration with Vite
- Native ES modules support

---

## 🧪 Testing the Application

### Test Signup Flow

1. Visit http://localhost:5173
2. Click "Sign up"
3. Enter: Name, Email, Password (min 6 chars)
4. Submit
5. Redirected to dashboard

### Test Login Flow

1. Visit http://localhost:5173
2. Enter: Email, Password
3. Submit
4. Redirected to dashboard

### Test Dashboard

1. View summary cards (Balance, Income, Expense)
2. See category pie chart (if transactions exist)
3. View recent transactions table
4. Delete a transaction
5. Verify data refreshes

---

## 🚀 Production Deployment

### Frontend Deployment (AWS S3 + CloudFront)

1. **Build the project:**
   ```bash
   cd frontend/frontend
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Configure CloudFront distribution** for the S3 bucket

### Backend Deployment (AWS EC2)

1. **Create EC2 instance** (t2.micro or larger)
2. **Install Node.js and PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone and setup:**
   ```bash
   git clone your-repo
   cd backend
   npm install
   pm2 start src/index.js --name "expense-tracker"
   pm2 save
   ```

4. **Configure MongoDB Atlas** to accept connections from your EC2 IP

### Environment Variables for Production

**Backend:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://prod_user:secure_password@prod-cluster.mongodb.net/expense-tracker
JWT_SECRET=use_a_strong_random_string_change_regularly
JWT_EXPIRY=7d
FRONTEND_URL=https://your-production-domain.com
```

**Frontend:**
```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## 📈 Performance Optimizations

### Database

- ✅ Indexes on frequently queried fields (userId, date)
- ✅ Compound index for analytics queries
- ✅ Aggregation pipeline for analytics (server-side)
- ✅ Pagination to limit data transfer

### Frontend

- ✅ Vite for ultra-fast module resolution
- ✅ Code splitting with React Router
- ✅ Lazy loading of components
- ✅ Efficient re-renders with React hooks
- ✅ Tailwind CSS v4 with optimized bundle

### Backend

- ✅ Helmet for security headers
- ✅ CORS properly configured
- ✅ Error handling middleware
- ✅ Async/await for non-blocking operations
- ✅ Lean/Select for MongoDB queries

---

## 🐛 Common Issues & Solutions

### Port 5000 Already in Use

```bash
# Kill process on port 5000
Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Force

# Or use a different port
PORT=5001 node src/index.js
```

### MongoDB Connection Failed

- ✅ Check internet connection
- ✅ Verify MONGODB_URI in .env
- ✅ Ensure IP whitelist in MongoDB Atlas
- ✅ Check credentials are correct

### Frontend Can't Connect to Backend

- ✅ Verify VITE_API_URL in .env
- ✅ Ensure backend is running on port 5000
- ✅ Check CORS is enabled in backend
- ✅ Check browser console for errors

### Tailwind Styles Not Applying

- ✅ Restart dev server
- ✅ Clear node_modules and reinstall
- ✅ Verify `@import "tailwindcss"` in index.css
- ✅ Check vite.config.js has tailwindcss() plugin

---

## 📚 Project Learnings

This project demonstrates:

1. **Clean Code Principles**
   - Separation of concerns
   - Single responsibility principle
   - DRY (Don't Repeat Yourself)

2. **RESTful API Design**
   - Proper HTTP methods
   - Status codes
   - Request/response structure

3. **Security Best Practices**
   - Password hashing with bcryptjs
   - JWT-based authentication
   - Helmet security headers
   - Environment variables for secrets

4. **Database Design**
   - Schema validation
   - Proper indexing
   - Aggregation pipelines
   - Efficient queries

5. **Frontend Architecture**
   - Component composition
   - State management with Context API
   - Protected routes
   - Responsive design

6. **Modern Development Tools**
   - Vite for fast builds
   - Tailwind CSS for utility-first styling
   - React Router for navigation
   - ESM modules

---

## 📝 Future Enhancements

- [ ] Add transaction form on dashboard
- [ ] Implement advanced filtering
- [ ] Add export to CSV/PDF
- [ ] Email notifications for large expenses
- [ ] Budget setting and alerts
- [ ] Multi-currency support
- [ ] Mobile app with React Native
- [ ] Dark mode support
- [ ] Two-factor authentication
- [ ] Recurring transactions

---

## 📞 Support

For issues or questions:
1. Check the Common Issues section
2. Review API documentation
3. Check browser console for errors
4. Review server logs

---

## 📄 License

This project is open source and available under the ISC License.

---

## 🎓 Created with Focus on

- ✅ Production-grade code quality
- ✅ Professional SaaS design
- ✅ Best practices and patterns
- ✅ Scalability and performance
- ✅ Security and reliability
- ✅ Comprehensive documentation

---

**Happy tracking! 💰**
