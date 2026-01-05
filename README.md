💰NovaSync - The Expense Splitting Application

A full-stack web application for tracking shared expenses and settling debts efficiently.

Table of Contents

1. Project Overview
2. Problem Statement
3. Features
4. Tech Stack
5. System Architecture
6. Installation & Setup
7. Usage Guide
8. Settlement Algorithm Deep Dive
9. 

1. # Project Overview

NovaSync is a modern, full-stack expense splitting application designed to simplify the management of shared expenses among groups. Whether you're splitting rent with roommates, managing vacation expenses with friends, or tracking team lunch costs, NovaSync makes it easy to track who paid what and who owes whom.

-- Key Highlights

- Modern UI - Glassmorphism design with responsive layouts
- Secure - JWT-based authentication with encrypted passwords
- Smart Algorithm - Optimized settlement calculations minimize transactions
- Real-time - Instant balance updates across all members
- Responsive - Works seamlessly on desktop, tablet, and mobile devices
- Performance - Optimized with Next.js code splitting and MongoDB indexing

2. # Problem Statement

- The Challenge

When multiple people share expenses in a group (roommates, friends on vacation, project teams), managing who paid what and who owes whom becomes increasingly complex:

- Real-World Scenario

Trip to Goa with 5 friends:
- Alice paid ₹15,000 for hotel booking
- Bob paid ₹3,000 for restaurant dinner
- Carol paid ₹5,000 for cab rides
- David paid ₹2,000 for groceries
- Eve paid ₹4,000 for activities

Questions that arise:
   Who owes how much to whom?
   What's the minimum number of transactions to settle all debts?
   What if someone already paid back some amount?

- Traditional Approaches (Problems)

1. Pen & Paper
   - Error-prone calculations
   - Lost receipts
   - No audit trail

2. Excel Spreadsheets
   - Manual updates required
   - Version conflicts when shared
   - Complex formulas needed
   - Not mobile-friendly

3. Group Chat
   - Messages get lost in history
   - Difficult to track totals
   - Arguments over "who said what"

# NovaSync Solution 

NovaSync solves these problems by providing:
- Automated calculations - No manual math needed
- Real-time synchronization - Everyone sees current balances
- Smart settlements - Algorithm finds minimum transactions
- Complete audit trail - All expenses logged with timestamps
- User-friendly interface - No learning curve
- Secure & private - Your data is protected

3. # Features

- Core Functionality

1. User Management
- Registration & Login - Secure account creation with email/password
- JWT Authentication - Token-based stateless authentication
- Password Security - bcrypt hashing with salt rounds
- Session Persistence - Stay logged in across browser sessions

2. Group Management
- Create Groups - Name and describe expense groups (e.g., "Goa Trip", "Apartment 401")
- Invite Members - Add people by email (they get instant invites)
- Accept Invites - Dedicated inbox for pending group invitations
- View Members - See all group participants with their details
- Group Dashboard - Overview of all groups you're a part of.

3. Expense Tracking
- Add Expenses - Record who paid and for what
- Flexible Splitting:
  - Equal Split - Divide amount equally among all members
  - Custom Split - Manually specify each person's share
- Expense Categories - Organize by Food, Transport, Entertainment, Bills, etc.
- Expense Details - Description, amount, date, category, payer
- Expense History - Chronological list of all group expenses

4. Balance Calculation
- Real-time Balances - Instant calculation of net positions
- Visual Indicators:
  - 🟢Green - You should get money back
  - 🔴Red - You owe money
  - ⚪Grey - All settled up
- Per-Member Breakdown - See each person's balance
- Running Totals - Cumulative tracking across all expenses

5. Smart Settlement System
- Optimized Suggestions - Greedy algorithm minimizes transactions
- Settlement Recording - Mark debts as paid
- Settlement History - Track all past payments
- Partial Settlements - Record payments of any amount
- Settlement Verification - Both parties can confirm payments

6. User Experience
- Responsive Design - Works on all screen sizes
- Glassmorphism UI - Modern frosted glass aesthetic
- Intuitive Navigation - Clear routing and breadcrumbs
- Loading States - Skeleton screens and spinners
- Error Handling - User-friendly error messages
- Form Validation - Client and server-side validation

4. # Tech Stack

# Frontend Technologies

## Core Framework
- **Next.js 14** - React framework with:
  - File-based routing (`pages/` directory)
  - Automatic code splitting per page
  - Built-in CSS support
  - Fast Refresh for instant feedback

## UI Library
- **React 18** - Component-based UI library with:
  - Functional components with Hooks
  - `useState` for local state management
  - `useEffect` for side effects (data fetching)
  - `useRouter` for programmatic navigation
  - Context API (if needed for global state)

## HTTP Client
- **Axios 1.6+** - Promise-based HTTP client with:
  - Request/response interceptors
  - Automatic JSON transformation
  - Request cancellation support
  - Better error handling than fetch()
  
## Styling
- **CSS3** - Modern CSS with:
  - Flexbox and Grid layouts
  - Glassmorphism effects (backdrop-filter)
  - CSS Variables for theming
  - Media queries for responsiveness
  - Smooth transitions and animations

## Browser APIs
- **localStorage** - Client-side JWT token storage
- **Fetch API** - Backup for network requests

# Backend Technologies

## Runtime & Framework
- **Node.js 18+** - JavaScript runtime for server-side
- **Express.js 4** - Minimalist web framework with:
  - Routing middleware
  - JSON body parsing
  - Error handling middleware
  - Static file serving

## Database
- **MongoDB 6.0+** - NoSQL document database with:
  - Flexible schema design
  - JSON-like documents (BSON)
  - Indexing for fast queries
  - Aggregation pipeline support
  
- **Mongoose 8** - MongoDB ODM with:
  - Schema validation
  - Query building
  - Middleware (pre/post hooks)
  - Population (joins)
  - Virtual properties

## Authentication & Security
- **jsonwebtoken (JWT)** - Stateless authentication tokens
- **bcryptjs** - Password hashing library with:
  - Salt generation
  - One-way hashing (cannot be reversed)
  - Configurable difficulty (10 rounds)

## Middleware
- **CORS** - Cross-Origin Resource Sharing
  - Allows frontend (port 3000) to talk to backend (port 5000)
- **express.json()** - JSON body parser
- **Custom auth middleware** - JWT verification

## Environment Management
- **dotenv** - Load environment variables from `.env` files

# Development Tools

## Package Managers
- **npm** - Node package manager

## Version Control
- **Git** - Distributed version control system
- **GitHub** - Code hosting and collaboration

## Code Editor
- **VS Code** with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

5. # System Architecture

┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        |
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Browser (Chrome, Firefox, Safari, Edge)               │ │
│  │  - localStorage (JWT Token Storage)                    │ │
│  │  - React Components (UI)                               │ │
│  │  - Axios HTTP Client                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                      |
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js Server (Port 3000)                            │ │
│  │  - Pages Routing                                       │ │
│  │  - Server-Side Rendering (SSR)                         │ │
│  │  - Static Generation (SSG)                             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                        Backend Layer                        |
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js Server (Port 5000)                         │ │
│  │  ┌──────────────────────────────────────────────────┐  | |
│  │  │ Middleware Layer                                 |  │ │
│  │  │ - CORS, JSON Parser, Auth Verification           │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Route Handlers                                   │  │ │
│  │  │ - /auth (login, register)                        │  │ │
│  │  │ - /groups (invites)                              │  │ │
│  │  │ - /expenses (balances, settlements)              │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │ Business Logic                                   │  │ │
│  │  │ - Balance calculation algorithm                  │  │ │
│  │  │ - Settlement optimization algorithm              │  │ │
│  │  │ - Validation logic                               │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                       Database Layer                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MongoDB (Port 27017)                                  │ │
│  │  ┌──────────────┬──────────────┬──────────────────┐    │ │
│  │  │   users      │   groups     │   expenses       │    │ │
│  │  │  collection  │  collection  │  collection      │    │ │
│  │  └──────────────┴──────────────┴──────────────────┘    │ │
│  │  ┌──────────────┐                                      │ │
│  │  │ settlements  │                                      │ │
│  │  │  collection  │                                      │ │
│  │  └──────────────┘                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

# Request Flow Example

*User adds an expense:

1. User fills form on frontend
   └─ pages/group/[id]/add-expense.js

2. Form submission triggers handleSubmit()
   └─ Calls: api.post("/expenses", data)

3. Axios interceptor adds JWT token
   └─ utilities/api.js
   └─ Authorization: Bearer eyJhbGc...

4. Request sent to backend
   └─ POST http://localhost:5000/expenses

5. Express receives request
   └─ server.js routes to expenseRoutes

6. Auth middleware verifies token
   └─ middleware/authMiddleware.js
   └─ Extracts user ID from token
   └─ Sets req.user.id

7. Route handler processes request
   └─ routes/expenseRoutes.js
   └─ Validates input
   └─ Calculates splits
   └─ Creates Expense document

8. Mongoose saves to MongoDB
   └─ models/Expense.js
   └─ Returns saved document with _id

9. Response sent back to frontend
   └─ res.status(201).json(expense)

10. Frontend updates UI
    └─ Shows success message
    └─ Redirects to group detail page
    └─ Fetches updated balances


6. # Installation & Setup

Prerequisites

Installments required:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v6.0 or higher):
  - **Option A:** [Local installation](https://www.mongodb.com/try/download/community)
  - **Option B:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud hosting)
- **Git** - [Download](https://git-scm.com/)

# Step 1: Clone the Repository

git clone https://github.com/username/NovaSync.git

# Navigate to project directory
cd NovaSync


# Step 2: Backend Setup

# Install Dependencies
bash
cd backend
npm install

This installs:
- express (^4.18.2)
- mongoose (^8.0.0)
- jsonwebtoken (^9.0.2)
- bcryptjs (^2.4.3)
- cors (^2.8.5)
- dotenv (^16.3.1)

# Configure Environment Variables

Create a `.env` file in the `backend/` directory:

bash
touch .env

Add the following configuration:

env
MongoDB Connection String
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/novasync

# For MongoDB Atlas (replace with your credentials):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/novasync?retryWrites=true&w=majority

# JWT Secret Key (CHANGE THIS!)
# Generate a strong random string: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

**SECURITY WARNING:** Never commit `.env` to version control! Make sure `.gitignore` includes `.env`

## Start MongoDB

**If using local MongoDB:**

bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"

# Or simply run:
mongod

If using MongoDB Atlas:
- No need to start anything locally
- Ensure your IP is whitelisted in Atlas dashboard
- Use the Atlas connection string in `.env`

## Start Backend Server

bash
npm start

You should see:

🚀 Server running on http://localhost:5000
✅ MongoDB connected successfully

Alternative (with auto-restart on changes):
bash
npm install -g nodemon
nodemon server.js

## Step 3: Frontend Setup

Open a *new terminal* (keep backend running):

## Install Dependencies
bash
cd frontend
npm install

This installs:
- next (^14.0.0)
- react (^18.2.0)
- react-dom (^18.2.0)
- axios (^1.6.0)

## Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

bash
touch .env.local


Add the following:

env
# Backend API URL
NEXT_PUBLIC_API_BASE=http://localhost:5000

# For production, change to:
# NEXT_PUBLIC_API_BASE=https://your-backend-domain.com

Note: Next.js requires `NEXT_PUBLIC_` prefix for client-side environment variables.

## Start Frontend Development Server

bash
npm run dev

You should see:

ready - started server on 0.0.0.0:3000, url: http://localhost:3000


## Step 4: Verify Installation

1. Open browser and visit: `http://localhost:3000`
2. You should see the NovaSync landing page
3. Try registering a new account
4. Backend console should show: `POST /auth/register 201`


7. # Usage Guide

# Getting Started

1. # Create Your Account

1. Visit `http://localhost:3000`
2. Click **Register** button
3. Fill in:
   - **Name**: Your full name (e.g., "Alice Johnson")
   - **Email**: Valid email address (e.g., "alice@example.com")
   - **Password**: Minimum 6 characters
4. Click **Register**
5. You'll be automatically logged in and redirected to Dashboard

Note: Password is hashed with bcrypt before storing (never stored in plain text)

## 2. Explore Dashboard

After login, you'll see:
- **Header**: Your name, logout button, create group button
- **Groups Section**: List of all groups you're part of
- **Invites Button**: Access pending group invitations

**Initial state:** No groups (empty state with "Create your first group" prompt)

## Creating & Managing Groups

## Create a New Group

1. Click **+ Create Group** button
2. Fill in group details:
   - **Group Name**: E.g., "Goa Trip 2025", "Apartment 401", "Office Team Lunch"
   - **Description** (optional): E.g., "Beach vacation expenses", "Monthly rent and utilities"
3. Click **Create Group**
4. Group is created with you as the owner and sole member

## Invite Members to Group

After creating a group:
1. **Invite form appears automatically**
2. Enter member's email address (must be registered user)
3. Click **Add Member**
4. Options:
   - **User exists**: Immediately added to group
5. Repeat for more members
6. Click **Done** when finished

**Pro tip:** Invite all members before adding expenses for accurate split calculations

## Accept Group Invitations

If someone invited you:
1. Log in to your account
2. Click **Invites** button in header
3. See list of pending invitations with:
   - Group name and description
   - Who invited you
4. Click **Accept** button
5. You're now a member! Group appears in your dashboard

## Adding Expenses

## Access Group Expenses

1. From Dashboard, click on any group card
2. You'll see three tabs:
   - **Expenses**: List of all expenses
   - **Balances**: Current net positions
   - **Settle**: Payment suggestions

## Add New Expense

1. Click **+ Add Expense** button
2. Fill in expense details:

**Required Fields:**
- **Description**: What was purchased (e.g., "Dinner at Beach Shack", "Uber to Airport")
- **Amount**: Total expense in ₹ (e.g., 1500.00)

**Optional Fields:**
- **Category**: Select from dropdown
  - General (default)
  - Food
  - Transport
  - Entertainment
  - Shopping
  - Bills
  - Other

**Split Configuration:**
- **Equal Split** (default):
  - Amount divided equally among all members
  - Example: ₹900 ÷ 3 people = ₹300 each
  - Automatic calculation, no input needed

- **Custom Split**:
  - Manually specify each member's share
  - Example: Alice ₹400, Bob ₹300, Carol ₹200
  - Must total exactly the expense amount
  - Useful for unequal consumption (Alice ordered extra drinks)

3. Click **Add Expense**
4. Expense is recorded with:
   - You as the payer
   - Current timestamp
   - Split distribution

#### Example Scenarios

**Scenario 1: Restaurant Dinner (Equal Split)**

Description: Dinner at Olive Garden
Amount: ₹1,800
Category: Food
Split: Equal (3 people)

Result:
- Alice (paid): +₹1800 - ₹600 = +₹1200
- Bob (didn't pay): -₹600
- Carol (didn't pay): -₹600


**Scenario 2: Cab Ride (Custom Split)**

Description: Uber to Mall
Amount: ₹500
Category: Transport
Split: Custom
- Alice: ₹200 (got in first)
- Bob: ₹200 (got in with Alice)
- Carol: ₹100 (only went halfway)

Result:
- Alice (paid): +₹500 - ₹200 = +₹300
- Bob: -₹200
- Carol: -₹100


## Understanding Balances

## View Current Balances

1. Go to group page
2. Click **Balances** tab
3. See each member's net position:

**Interpretation:**
- **Green (+₹X)**: This person should GET BACK ₹X
  - They've paid more than their share
- **Red (-₹X)**: This person OWES ₹X
  - They haven't paid their fair share
- **Gray (₹0)**: All settled up
  - Paid exactly their share

#### Example Balance Visual

Group: Goa Trip (3 members)

┌─────────────────────────────────────┐
│ Alice Johnson                       │
│ alice@example.com                   │
│                          +₹2,500 🟢 │
│ Gets back                           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Bob Smith                           │
│ bob@example.com                     │
│                          -₹1,200 🔴 │
│ Owes                                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Carol Davis                         │
│ carol@example.com                   │
│                          -₹1,300 🔴 │
│ Owes                                │
└─────────────────────────────────────┘


**What this means:**
- Alice paid most expenses
- Bob and Carol owe Alice money
- Total balances sum to zero (₹2500 - ₹1200 - ₹1300 = 0)

## Settling Debts

## View Settlement Suggestions

1. Go to group page
2. Click **Settle** tab
3. See optimized payment plan:


Settlement Suggestions (Minimum transactions)

Bob Smith → Alice Johnson
₹1,200.00
[Record Payment]

Carol Davis → Alice Johnson
₹1,300.00
[Record Payment]

Total: 2 transactions to settle all debts


**Algorithm ensures:**
- Minimum number of transactions
- Everyone settles completely
- No one overpays

## Record a Settlement

**When Bob pays Alice ₹1,200:**
1. Bob clicks **Record Payment** button
2. Confirmation dialog: "Record settlement of ₹1,200?"
3. Click **OK**
4. Settlement recorded in database
5. Balances update automatically:
   - Bob: -₹1,200 + ₹1,200 = ₹0 (settled!)
   - Alice: +₹2,500 - ₹1,200 = +₹1,300 (still owed by Carol)


# Additional Features

## View Expense History

1. Go to group page
2. **Expenses** tab shows chronological list
3. Each expense displays:
   - Description and amount
   - Who paid
   - Date and time
   - Split type (equal/custom)
   - List of participants

## Logout

1. Click **Logout** button in header
2. Token removed from localStorage
3. Redirected to login page


8. ## Settlement Algorithm 

This is the core innovation of NovaSync - minimizing the number of transactions needed to settle all debts in a group.

### The Mathematical Problem

**Given:**
- N people in a group
- Each person has a net balance (positive = owed money, negative = owes money)
- Sum of all balances = 0 (money is conserved)

**Find:**
- Minimum number of transactions to settle all debts
- Who should pay whom and how much

### Why This Matters

**Bad Approach (Everyone pays everyone):**

5 people, 20 possible transaction pairs
If everyone paid everyone they owe:
- Could take 10-20 transactions
- Confusing and inefficient

**Good Approach (Optimized):**

Same 5 people
With algorithm: Only 3-4 transactions needed
- 50-80% fewer transactions!
- Clearer and simpler

### Algorithm Explanation (Plain Language)

#### Step-by-Step Logic

**Think of it like organizing a pencil exchange in class:**

1. **Find who has extra pencils** (positive balances)
   - These are creditors (should get money back)
   
2. **Find who needs pencils** (negative balances)
   - These are debtors (owe money)

3. **Match biggest surplus with biggest shortage**
   - Person with most extra pencils
   - Gives to person who needs most pencils
   
4. **Settle as much as possible**
   - Transfer minimum of (surplus, shortage)
   - This eliminates at least one person from the problem

5. **Repeat until everyone has the right amount**
   - Keep matching and settling
   - Eventually everyone is balanced

# Visual Example

**Initial State:**

Alice:  +₹3,000 (has extra, should get back)
Bob:    -₹1,200 (shortage, owes)
Carol:  -₹1,800 (shortage, owes)

Total: 0 (balanced)

**Round 1: Match Largest**

Largest creditor: Alice (+₹3,000)
Largest debtor: Carol (-₹1,800)

Transaction: Carol → Alice (₹1,800)

Updated:
Alice:  +₹3,000 - ₹1,800 = +₹1,200 (still owed)
Bob:    -₹1,200 (unchanged)
Carol:  -₹1,800 + ₹1,800 = ₹0 ✅ (SETTLED!)

**Round 2: Match Remaining**

Largest creditor: Alice (+₹1,200)
Largest debtor: Bob (-₹1,200)

Transaction: Bob → Alice (₹1,200)

Updated:
Alice:  +₹1,200 - ₹1,200 = ₹0 ✅ (SETTLED!)
Bob:    -₹1,200 + ₹1,200 = ₹0 ✅ (SETTLED!)
Carol:  ₹0 ✅ (already settled)

**Result:**
- **2 transactions** (optimal for 3 people)
- Everyone settled
- No overpayments

### Technical Implementation

## Algorithm Name
**Greedy Min-Max Matching Algorithm**

## Complexity Analysis
- **Time Complexity**: O(N log N)
  - O(N) to calculate balances
  - O(N log N) to sort debtors and creditors
  - O(N) for matching loop
- **Space Complexity**: O(N)
  - Two arrays for debtors and creditors

### Technical Algorithm: Greedy Min-Max Matching

#### Step 1: Calculate Net Balances
For each expense:
  - Person who paid gets CREDIT (+amount)
  - Each person in split gets DEBIT (-their share)

Net Balance = Total Credits - Total Debits

**Example:**

Alice: Paid ₹9000, owes ₹3700 → Net: +₹5300
Bob: Paid ₹1500, owes ₹3700 → Net: -₹2200  
Carol: Paid ₹600, owes ₹3400 → Net: -₹2800

#### Step 2: Separate into Two Groups

Creditors (positive balance):
- Alice: +₹5300 (should get back)

Debtors (negative balance):
- Carol: -₹2800 (owes)
- Bob: -₹2200 (owes)

#### Step 3: Sort by Amount (Largest First)

Creditors: [Alice: ₹5300]
Debtors: [Carol: ₹2800, Bob: ₹2200]

#### Step 4: Greedy Matching
**Round 1:**
- Largest debtor: Carol (owes ₹2800)
- Largest creditor: Alice (gets ₹5300)
- Settlement: Carol → Alice (₹2800)
- Update: Carol settled ✅, Alice still needs ₹2500

**Round 2:**
- Largest debtor: Bob (owes ₹2200)
- Largest creditor: Alice (gets ₹2500)
- Settlement: Bob → Alice (₹2200)
- Update: Bob settled ✅, Alice still needs ₹300

**Wait, that's wrong!** Let me recalculate...

Actually with correct math:
Total paid: ₹11,100
Per person share: ₹3,700

Alice: Paid ₹9000 - ₹3700 = +₹5300 (gets back)
Bob: Paid ₹1500 - ₹3700 = -₹2200 (owes)
Carol: Paid ₹600 - ₹3700 = -₹3100 (owes)

**Optimized Settlements:**
1. Carol → Alice (₹3100)
2. Bob → Alice (₹2200)

**Total: 2 transactions** (optimal!)

### Why This Algorithm is Optimal

**Mathematical Proof:**
- Minimum transactions needed = max(number of debtors, number of creditors)
- Each transaction eliminates at least one person completely
- Greedy matching ensures we use the minimum possible transactions


9. Credits & Attributions
Technologies Used
•	Next.js - React framework by Vercel
•	React - UI library by Meta
•	Node.js - JavaScript runtime
•	Express - Web framework
•	MongoDB - NoSQL database
•	Mongoose - MongoDB ODM
•	Axios - HTTP client
•	JWT - JSON Web Tokens
•	bcrypt - Password hashing

Design Inspiration
•	Glassmorphism trend from Glass UI
•	Color schemes from Coolors
•	Icons from Heroicons

Algorithm References
•	Greedy Algorithm concept, inspired from Splitwise Application.

Learning Resources
•	Next.js Documentation - nextjs.org/docs
•	MongoDB University - university.mongodb.com
•	MDN Web Docs - developer.mozilla.org
•	also learnt about some topics from GPT for in-depth understanding.



