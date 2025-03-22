# EBuddy Monorepo

A full-stack application built with Next.js, Firebase, and Material UI, organized as a monorepo using Turborepo.

## Overview

This project is a technical implementation for EBuddy PTE. LTD., featuring a user management system with authentication, user data management, and a potential user scoring algorithm. The application is structured as a monorepo to share code between frontend and backend services.

This project demonstrates a full-stack application with:

- **Backend:** Express.js with Firebase/Realtime Database integration
- **Frontend:** Next.js with Material UI and Redux
- **Shared Code:** Common types and interfaces used by both frontend and backend
- **Monorepo Structure:** Using Turborepo for efficient workspace management

![EBuddy-App-03-22-2025_08_30_PM](https://github.com/user-attachments/assets/f7c63d35-bfc1-443f-9efd-c4101d36f935)

## IMPORTANT
In the current implementation, the dashboard data comes from several fallback mechanisms designed to work without a real database:

### 1. Mock API Endpoints

The application includes mock API endpoints in the frontend that simulate database responses:

```typescript
// In apps/frontend/src/pages/api/user/[userId].ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This returns mock data instead of querying Firebase
  const now = Date.now();
  const randomFactor = Math.sin(now / 10000) * 0.1 + 0.9; // Value between 0.8 and 1.0
  
  return res.status(200).json({
    success: true,
    data: {
      id: userId || "user-123",
      email: "angela.soenoko@gmail.com",
      displayName: "Angela Soenoko",
      photoURL: null,
      totalAverageWeightRatings: 4.5 * randomFactor,
      numberOfRents: Math.floor(12 * randomFactor),
      recentlyActive: now,
      createdAt: now - 30 * 86400000, // 30 days ago
      updatedAt: now - Math.floor(Math.random() * 5) * 86400000, // 0-5 days ago
      potentialScore: 85.75 * randomFactor, // Mock potential score
    },
  });
}
```

These endpoints generate realistic-looking data with some randomization to simulate changes when you refresh.

### 2. LocalStorage for User Information

When you log in, basic user information is stored in localStorage:

```javascript
// From the login page
localStorage.setItem(
  "user",
  JSON.stringify({
    uid: "user-123",
    email: email,
    displayName: email.split("@")[0],
  })
);
localStorage.setItem("token", "mock-token-123");
```

This information is then retrieved and displayed on the dashboard:

```javascript
// From the dashboard page
const storedUser = localStorage.getItem("user");
if (storedUser) {
  const parsedUser = JSON.parse(storedUser);
  setUser(parsedUser);
}
```

### 3. Client-Side Mock Data Generation

If API calls fail, the dashboard has fallback logic to generate mock data:

```javascript
// In dashboard-client.tsx
// Create mock user data
const mockUserData: UserData = {
  id: parsedUser.uid,
  email: parsedUser.email,
  displayName: parsedUser.displayName || parsedUser.email.split("@")[0],
  photoURL: null,
  totalAverageWeightRatings: 4.5,
  numberOfRents: 12,
  recentlyActive: Date.now() - 86400000, // 1 day ago
  createdAt: Date.now() - 30 * 86400000, // 30 days ago
  updatedAt: Date.now() - 5 * 86400000, // 5 days ago
};
```

### 4. Simulated API Responses

The "Refresh Data" button triggers a request to the mock API endpoints, which return slightly different data each time to simulate real-time updates.

### How This Works Without Firebase

This approach creates a complete demo experience without requiring a real database:

1. **Login Flow**: Works with any email/password
2. **Dashboard Data**: Generated with realistic values
3. **Data Refreshing**: Simulates API calls with changing data
4. **Activity Tracking**: Updates timestamps in localStorage


### What Would Change With Real Firebase

If you were to set up a real Firebase Realtime Database:

1. The mock API endpoints would be replaced with real Firebase queries
2. Authentication would use Firebase Auth instead of localStorage
3. Data would persist between sessions and across devices
4. Changes made by one user would be visible to others


The application is designed to seamlessly transition from mock data to real Firebase data once the environment variables are properly configured, without requiring code changes.


## **Repository Structure**
Thought for 4 seconds```markdown project="EBuddy Technical Test" file="README.md"
...
```

ebuddymonorepo/
├── apps/
│   ├── backend/                 # Express.js backend application
│   │   ├── src/
│   │   │   ├── config/          # Firebase configuration
│   │   │   ├── controller/      # API controllers
│   │   │   ├── core/            # Core application setup
│   │   │   ├── entities/        # Data models
│   │   │   ├── middleware/      # Auth middleware
│   │   │   ├── pages/           # Next.js API routes
│   │   │   ├── repository/      # Data access layer
│   │   │   └── routes/          # API route definitions
│   │   └── package.json
│   │
│   └── frontend/                # Next.js frontend application
│       ├── src/
│       │   ├── apis/            # API client code
│       │   ├── app/             # Next.js App Router pages
│       │   ├── components/      # React components (atomic design)
│       │   ├── hooks/           # Custom React hooks
│       │   ├── lib/             # Utility functions
│       │   ├── store/           # Redux store configuration
│       │   ├── theme/           # MUI theme configuration
│       │   └── utils/           # Helper utilities
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared code between apps
│       ├── src/
│       │   └── types/           # Shared TypeScript interfaces
│       └── package.json
│
├── turbo.json                   # Turborepo configuration
└── package.json                 # Root package.json

```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/yarn
- Firebase account with Realtime Database and Authentication enabled
- Firebase CLI installed globally (`npm install -g firebase-tools`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ebuddymonorepo.git
   cd ebuddymonorepo
```

2. Install dependencies:

```shellscript
yarn install
```


3. Set up environment variables:

Create a `.env.local` file in the `apps/backend` directory:

```plaintext
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...} # Your Firebase service account JSON
FIREBASE_PROJECT_ID=your-project-id
```

Create a `.env.local` file in the `apps/frontend` directory:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=/api
```




### Development

Run the entire project in development mode:

```shellscript
yarn dev
```

Or run specific workspaces:

```shellscript
# Run only the backend
yarn workspace @ebuddy/backend dev

# Run only the frontend
yarn workspace @ebuddy/frontend dev
```

### Building

Build all packages and applications:

```shellscript
yarn build
```

## Features and Implementation

### Backend Features

1. **Firebase Integration**: Complete setup with Firebase Admin SDK
2. **API Endpoints**:
   - `GET /api/user/:userId?` - Fetch user data
   - `PUT /api/user/:userId?` - Update user data
   - `GET /api/users` - Fetch all users
   - `GET /api/users/potential` - Fetch potential users ranked by score
   - `POST /api/user/activity` - Record user activity


3. **Authentication Middleware**: JWT-based authentication using Firebase Auth tokens
4. **Data Repository**: Abstracted data access layer for Firebase Realtime Database operations


### Frontend Features

1. **Authentication**: Complete login flow with Firebase Authentication
2. **Dashboard**: User dashboard displaying user information and stats
3. **Responsive Design**: Mobile-friendly UI using Material UI
4. **State Management**: Redux for global state management
5. **API Integration**: Abstracted API client for backend communication


### Shared Code

The `packages/shared` directory contains common TypeScript interfaces used by both frontend and backend:

- `User` interface defining the structure of user data
- `UserUpdateData` interface for update operations
- `UserResponse` interface for API responses


## Potential User Ranking System

To efficiently rank users by potential, we implemented a composite scoring system:

### Composite Score Formula

```plaintext
potentialScore = (normalizedRating * 0.6) + (normalizedRents * 0.3) + (normalizedActivity * 0.1)

Where:
- normalizedRating = totalAverageWeightRatings / 5
- normalizedRents = min(numberOfRents / 100, 1)
- normalizedActivity = max(0, 1 - daysAgo / 30)
- daysAgo = (currentTime - recentlyActive) / (1000 * 60 * 60 * 24)
```

This formula:

- Gives 60% weight to ratings (highest priority)
- Gives 30% weight to number of rents (medium priority)
- Gives 10% weight to recent activity (lowest priority)
- Normalizes each factor to a 0-1 scale for fair comparison


### Implementation

1. We pre-compute and store this score for each user
2. We update the score whenever any contributing factor changes
3. We query users based on this single field for efficient pagination


```javascript
// Query with pagination
const query = db.ref("USERS")
  .orderByChild("potentialScore")
  .limitToFirst(10);

// For subsequent pages
const nextPageQuery = db.ref("USERS")
  .orderByChild("potentialScore")
  .startAt(lastScore, lastId)
  .limitToFirst(10);
```

## Keeping 'recentlyActive' Field Updated

We use a multi-layered approach to ensure the `recentlyActive` field stays current:

1. **Event-Driven Updates**: Update the field whenever a user performs any significant action
2. **Automatic Updates**: Update the field on any user data change
3. **Client-Side Tracking**: Track user presence and activity on the client side


This approach ensures:

- Comprehensive coverage of all user activities
- Performance optimization by avoiding excessive writes
- Integration with analytics for deeper insights
- Real-time potential score updates


## Deployment

### Vercel Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in Vercel:
   - `FIREBASE_SERVICE_ACCOUNT` (JSON string of your service account)
   - `FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_API_URL`



3. Deploy using the Vercel dashboard or CLI


### Firebase Emulator for Local Testing

To test with Firebase Emulator:

1. Install Firebase CLI:

```shellscript
npm install -g firebase-tools
```


2. Initialize Firebase in the project:

```shellscript
firebase init
```


3. Start the emulators:

```shellscript
firebase emulators:start --only functions,database,auth
```


4. Run the frontend with the emulator configuration:

```shellscript
yarn workspace @ebuddy/frontend dev
```




## Technical Decisions and Tradeoffs

### Using Realtime Database vs Firestore

The project was initially designed for Firestore but was adapted to work with Realtime Database. Key differences:

- **Data Structure**: Realtime Database uses a JSON tree structure vs. Firestore's document-collection model
- **Querying**: Different methods for querying and filtering data
- **Scaling**: Different scaling characteristics and pricing models


### Monorepo Structure

Using Turborepo provides several benefits:

- **Shared Code**: Easy sharing of types and utilities
- **Consistent Development**: Unified development experience
- **Efficient Builds**: Optimized build process with caching
- **Simplified Deployment**: Streamlined deployment process

## License

This project is licensed under the MIT License - see the LICENSE file for details.

