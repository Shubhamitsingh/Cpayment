# Payment Admin Dashboard

A comprehensive admin dashboard for managing payment requests with approval/rejection functionality.

## Features

- **Payment Requests Dashboard** - View all submitted payments with filtering options
- **Screenshot Preview** - View payment screenshots with click-to-enlarge functionality
- **Approve/Reject Actions** - One-click approval or rejection of payments
- **Statistics** - Quick view of pending/approved/rejected payments and total amount
- **User Information** - See who paid and what package they bought

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client && npm install
```

Or use the convenience script:
```bash
npm run install-all
```

## Running the Application

Start both server and client in development mode:
```bash
npm run dev
```

Or run them separately:

**Server (port 5000):**
```bash
npm run server
```

**Client (port 3000):**
```bash
npm run client
```

## API Endpoints

- `GET /api/payments` - Get all payment requests
- `GET /api/payments/:id` - Get a specific payment request
- `GET /api/statistics` - Get payment statistics
- `PATCH /api/payments/:id/status` - Update payment status (approved/rejected/pending)

## Project Structure

```
├── server/
│   ├── index.js          # Express server and API routes
│   ├── data/             # JSON database (auto-created)
│   └── uploads/          # Uploaded screenshots (if applicable)
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── public/
└── package.json
```

## Sample Data

The application uses a JSON file for data storage. You can add sample payment data to `server/data/payments.json`:

```json
[
  {
    "id": "unique-id",
    "userName": "John Doe",
    "packageName": "Premium Package",
    "amount": "99.99",
    "status": "pending",
    "screenshot": "/path/to/screenshot.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## Technologies Used

- **Frontend**: React, React Icons
- **Backend**: Node.js, Express
- **Storage**: JSON file (can be easily replaced with a database)



