# Community App - Comprehensive API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Frontend Components](#frontend-components)
4. [Backend API Endpoints](#backend-api-endpoints)
5. [Redux Store & Actions](#redux-store--actions)
6. [Data Models & Interfaces](#data-models--interfaces)
7. [Services & Utilities](#services--utilities)
8. [Usage Examples](#usage-examples)
9. [Development Setup](#development-setup)

## Project Overview

This is a full-stack community gaming application built with React/TypeScript frontend and Node.js/Express backend. The application provides game management, user authentication, statistics tracking, and real-time features.

## Technology Stack

### Frontend
- **React 16.4.2** with TypeScript
- **Redux** for state management
- **Material-UI** for UI components
- **D3.js** for data visualization
- **Socket.io** for real-time communication
- **React Router** for navigation
- **i18next** for internationalization

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Inversify** for dependency injection
- **Sequelize** with MySQL for database
- **Passport.js** for authentication
- **Socket.io** for real-time features
- **JWT** for token-based authentication

---

## Frontend Components

### Core Components

#### AppMenu
**Location**: `frontend/src/components/AppMenu/`

A dropdown menu component for user account actions.

**Props**:
```typescript
interface AppMenuProps {
  appMenuItems: AppMenuItem[];
  children?: JSX.Element;
  imageUrl?: string;
}
```

**Usage**:
```tsx
import { AppMenu } from 'components';

const menuItems = [
  {
    icon: <AccountIcon />,
    title: 'Profile',
    action: () => navigateToProfile()
  }
];

<AppMenu 
  appMenuItems={menuItems}
  imageUrl={user.avatar}
>
  <div>Additional content</div>
</AppMenu>
```

#### GameCard
**Location**: `frontend/src/components/GameCard/`

Displays game information with join/leave functionality.

**Props**:
```typescript
interface GameCardProps {
  game: GameModel;
  status: BattleStatus;
  battleStatus: BattleStatus;
  waitBattlePlayersCountAction: number;
  isWaitBattle: boolean;
  isFull?: boolean;
  battleStartTime: Date;
  moreMenuItems: MoreMenuItem[];
  joinGame($event: string): void;
  leaveGame($event: string): void;
}
```

**Usage**:
```tsx
import { GameCard } from 'components';

<GameCard
  game={gameData}
  status={BattleStatus.Wait}
  battleStatus={BattleStatus.Wait}
  waitBattlePlayersCountAction={5}
  isWaitBattle={false}
  isFull={false}
  battleStartTime={new Date()}
  moreMenuItems={menuItems}
  joinGame={handleJoinGame}
  leaveGame={handleLeaveGame}
/>
```

#### LoginForm
**Location**: `frontend/src/components/LoginForm/`

Handles user authentication with form validation.

**Props**:
```typescript
interface LoginFormProps {
  status: AuthStatus;
  history: History;
  spinnerRun: boolean;
  loginUser(user: UserFieldsToLogin): void;
  socialNetworksLogin(socialNetworksUser: SocialNetworksUser): void;
}
```

**Usage**:
```tsx
import { LoginForm } from 'components';

<LoginForm
  status={authStatus}
  history={history}
  spinnerRun={isLoading}
  loginUser={handleLogin}
  socialNetworksLogin={handleSocialLogin}
/>
```

#### BarChart
**Location**: `frontend/src/components/BarChart/`

D3.js-based bar chart component for data visualization.

**Props**:
```typescript
interface BarChartProps {
  diagramData: WeekReportData[];
  config: BarChartConfig;
}

interface BarChartConfig {
  margin: Margin;
  animationDuration: number;
  marginBetweenLegends: number;
  legendRectWidth: number;
  legendRectHeight: number;
  ticksNumber: number;
  legendRectMargins: number;
  legendTextMargins: number;
}
```

**Usage**:
```tsx
import { BarChart } from 'components';

const chartConfig = {
  margin: { top: 20, right: 30, left: 40, bottom: 20 },
  animationDuration: 1000,
  marginBetweenLegends: 20,
  legendRectWidth: 15,
  legendRectHeight: 15,
  ticksNumber: 5,
  legendRectMargins: 5,
  legendTextMargins: 10
};

<BarChart 
  diagramData={weekData}
  config={chartConfig}
/>
```

### Additional Components

- **AddGameComponent**: Form for adding new games
- **EditGameComponent**: Form for editing existing games
- **ChangePasswordForm**: Password change functionality
- **Countdown**: Timer component for game countdowns
- **CircleDiagram**: Circular chart component
- **Logo**: Application logo component
- **MoreMenu**: Context menu component
- **Navbar**: Navigation bar
- **ProtectedRoute**: Route protection wrapper
- **RegistrationForm**: User registration form
- **Spinner**: Loading indicator
- **StatisticTables**: Data tables for statistics
- **VkDialog**: VKontakte integration dialog
- **YandexMap**: Map integration component

---

## Backend API Endpoints

### User Controller
**Base Path**: `/api/users`

#### POST /register
Register a new user.

**Request Body**:
```typescript
interface UserFieldsToRegister {
  email: string;
  name: string;
  password: string;
  password2: string;
  language: string;
}
```

**Response**: `User` object or error

**Example**:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "password2": "password123",
    "language": "en"
  }'
```

#### POST /login
Authenticate user and return JWT token.

**Request Body**:
```typescript
interface UserFieldsToLogin {
  email: string;
  password: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  token: string;
}
```

#### POST /user-language
Set user language preference.

**Request Body**:
```typescript
{
  userEmail: string;
  userLanguage: string;
}
```

#### GET /get-user-language
Get user language preference.

**Query Parameters**:
- `email`: User email address

#### POST /google-auth
Authenticate with Google OAuth.

**Request Body**:
```typescript
{
  email: string;
  name: string;
  language: string;
  accessToken: string;
  imageUrl: string;
}
```

### Game Controller
**Base Path**: `/api/games`

#### GET /get-games
Get all approved games.

**Response**: Array of `Game` objects

**Example**:
```bash
curl -X GET http://localhost:3000/api/games/get-games
```

### Events Controller
**Base Path**: `/api/events`

#### POST /add-event
Add a new event.

**Request Body**:
```typescript
interface Event {
  id?: number;
  userId?: number;
  title: string;
  description: string;
  city: string;
  place: string;
  address: string;
  locationX: string;
  locationY: string;
  begginingInTime: string;
  begginingDate: string;
  createAt?: Date;
  updatedAt?: Date;
}
```

#### POST /delete-event
Delete an event.

**Request Body**:
```typescript
{
  id: number;
}
```

#### POST /edit-event
Edit an existing event.

**Request Body**: `Event` object

#### GET /get-events
Get all events.

**Response**: Array of `Event` objects

#### GET /get-event
Get a specific event.

**Query Parameters**:
- `id`: Event ID

### Statistics Controller
**Base Path**: `/api/v1/statistic`

#### POST /set-game-result
Set game results for statistics.

**Headers**:
- `Authorization: Bearer <app-token>`

**Request Body**:
```typescript
interface GameData {
  userToken: string;
  playedTime: number;
  scores: number;
  resultStatus: ResultStatus;
  participationStatus: ParticipationStatus;
}
```

#### GET /recent-games
Get recent games for a user.

**Authentication**: JWT required

**Query Parameters**:
- `userId`: User token

#### GET /most-popular-games
Get most popular games.

**Authentication**: JWT required

#### GET /best-users
Get best users by statistics.

**Authentication**: JWT required

#### GET /get-leaders
Get top 10 leaders for a specific game.

**Query Parameters**:
- `appName`: Game application name

### My Games Controller
**Base Path**: `/api/v1/my-games`

#### POST /add-game
Add a new game.

**Request Body**: `Game` object

#### POST /edit-game
Edit an existing game.

**Request Body**: `Game` object

#### POST /delete-game
Delete a game.

**Request Body**: `Game` object

#### GET /get-games
Get games for a specific user.

**Query Parameters**:
- `userId`: User ID

---

## Redux Store & Actions

### Auth Actions
**Location**: `frontend/src/store/auth/`

#### Action Types
```typescript
enum AuthTypes {
  RegisterUser = '[auth] Register User',
  LoginUser = '[auth] Login User',
  LogoutUser = '[auth] Logout User',
  SetCurrentUser = '[auth] Set Current User',
  RegistrationSuccess = '[auth] Registration (Success)',
  RegistrationError = '[auth] Registration (Error)',
  SocialNetworksLogin = '[auth] Social Networks Login',
  LoginError = '[auth] Login (error)'
}
```

#### Actions
```typescript
// Register a new user
new RegisterUser(userData: UserFieldsToRegister)

// Login user
new LoginUser(credentials: UserFieldsToLogin)

// Logout user
new LogoutUser()

// Set current user
new SetCurrentUser(user: FrontEndUser | undefined)

// Social networks login
new SocialNetworksLogin(socialUser: SocialNetworksUser)
```

### Games Actions
**Location**: `frontend/src/store/games/`

#### Action Types
```typescript
enum GamesTypes {
  LoadGames = '[games] Load Games',
  LoadGamesSuccess = '[games] Load Games (Success)',
  LoadGamesError = '[games] Load Games (Error)'
}
```

#### Actions
```typescript
// Load games
new LoadGames()

// Load games success
new LoadGamesSuccess(games: GameModel[])

// Load games error
new LoadGamesError()
```

---

## Data Models & Interfaces

### Core Models

#### GameModel
```typescript
interface GameModel {
  id?: number;
  userId?: number;
  appName: string;
  description: string;
  maxRoomPlayer: number;
  maxRooms: number;
  requestUrl: string;
  maxWaitingTime: number;
  createAt?: Date;
  updatedAt?: Date;
  redirectUrl: string;
  registrationEventName: string;
  leaveEventName: string;
  updateRoomsInfoEventName: string;
  notifyCountdown: string;
  approve: boolean;
  appToken?: string;
}
```

#### User Models
```typescript
interface UserFieldsToRegister {
  email: string;
  name: string;
  password: string;
  password2: string;
  language: string;
}

interface UserFieldsToLogin {
  email: string;
  password: string;
}

interface SocialNetworksUser {
  email: string | undefined;
  language: string;
  name: string | undefined;
  accessToken: string;
  SocialId?: number;
  imageUrl?: string;
}
```

#### Event Model
```typescript
interface Event {
  id?: number;
  userId?: number;
  title: string;
  description: string;
  city: string;
  place: string;
  address: string;
  locationX: string;
  locationY: string;
  begginingInTime: string;
  begginingDate: string;
  createAt?: Date;
  updatedAt?: Date;
}
```

### Enums

#### BattleStatus
```typescript
enum BattleStatus {
  Init,
  Wait,
  Play,
  Error
}
```

#### AuthStatus
```typescript
enum AuthStatus {
  NotAuthorized,
  Registered,
  Authorized
}
```

#### RoomStatus
```typescript
enum RoomStatus {
  Waiting,
  InGame,
  Closed
}
```

---

## Services & Utilities

### Backend Services

#### UserAuthenticationRepository
**Location**: `server/src/service/user-authentication/`

```typescript
abstract class UserAuthenticationRepository {
  abstract registerUser(newUser: User): Promise<User>;
  abstract loginUser(newUser: User): Promise<{ success: boolean, token: string }>;
  abstract setUserLanguage(userEmail: string, userLanguage: string): Promise<boolean>;
  abstract getUserLanguage(userEmail: string): Promise<string>;
  abstract checkUserEmail(userEmail: string): Promise<boolean>;
  abstract socialNetworksLogin(email: string, name: string, language: string, accessToken: string, imageUrl: string): Promise<{ success: boolean, token: string }>;
}
```

#### GamesRepository
**Location**: `server/src/service/games/`

```typescript
abstract class GamesRepository {
  abstract getGames(): Promise<Game[]>;
}
```

#### StatisticService
**Location**: `server/src/service/statistic/`

```typescript
class StatisticService {
  calculatePlayedInWeek(rows: Array<{playedTime: number, createdAt: number}>): number;
  sortBy<T>(array: T[], property: keyof T): T[];
  calculatePlayedTime(array: Array<{playedTime: number}>): number;
}
```

---

## Usage Examples

### Frontend Component Integration

#### Setting up a Game Card
```tsx
import React from 'react';
import { GameCard } from 'components';
import { BattleStatus } from 'models';

const GamePage = () => {
  const gameData = {
    appName: 'Chess Game',
    description: 'Classic chess game',
    maxRoomPlayer: 2,
    // ... other game properties
  };

  const handleJoinGame = (appName: string) => {
    console.log(`Joining game: ${appName}`);
    // Implement join logic
  };

  const handleLeaveGame = (appName: string) => {
    console.log(`Leaving game: ${appName}`);
    // Implement leave logic
  };

  return (
    <GameCard
      game={gameData}
      status={BattleStatus.Wait}
      battleStatus={BattleStatus.Wait}
      waitBattlePlayersCountAction={1}
      isWaitBattle={false}
      battleStartTime={new Date()}
      moreMenuItems={[]}
      joinGame={handleJoinGame}
      leaveGame={handleLeaveGame}
    />
  );
};
```

#### Redux Action Usage
```tsx
import { useDispatch } from 'react-redux';
import { LoginUser, RegisterUser } from 'store';

const AuthComponent = () => {
  const dispatch = useDispatch();

  const handleLogin = (credentials) => {
    dispatch(new LoginUser(credentials));
  };

  const handleRegister = (userData) => {
    dispatch(new RegisterUser(userData));
  };

  return (
    // Component JSX
  );
};
```

### Backend API Usage

#### User Registration
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

#### Game Statistics
```javascript
const submitGameResult = async (gameData, appToken) => {
  try {
    const response = await fetch('/api/v1/statistic/set-game-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appToken}`
      },
      body: JSON.stringify(gameData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to submit game result:', error);
  }
};
```

---

## Development Setup

### Prerequisites
- Node.js (v8 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd community-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env` files in both `frontend/` and `server/` directories with required configuration.

4. **Set up database**
Configure MySQL connection in server configuration files.

5. **Start development servers**
```bash
# Start both frontend and backend
npm start

# Or start individually
cd frontend && npm start
cd server && npm start
```

### Available Scripts

#### Root Level
- `npm install` - Install all dependencies
- `npm run build` - Build both frontend and backend
- `npm start` - Start both frontend and backend in development mode

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linter

#### Backend
- `npm start` - Start development server with watch mode
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linter

### Project Structure
```
community-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── store/          # Redux store and actions
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── models.ts       # TypeScript interfaces
│   └── package.json
├── server/                  # Node.js backend application
│   ├── src/
│   │   ├── controller/     # API controllers
│   │   ├── service/        # Business logic services
│   │   ├── models/         # Database models
│   │   └── validation/     # Input validation
│   └── package.json
└── package.json            # Root package.json
```

---

## Additional Notes

### Authentication
The application uses JWT tokens for authentication. Include the token in the `Authorization` header for protected endpoints:
```
Authorization: Bearer <your-jwt-token>
```

### Error Handling
All API endpoints return consistent error responses with appropriate HTTP status codes and error messages.

### Internationalization
The frontend supports multiple languages (English, Russian) using i18next.

### Real-time Features
Socket.io is used for real-time game updates and notifications.

### Database
The application uses Sequelize ORM with MySQL for data persistence.

This documentation covers all public APIs, components, and services in the Community App. For more specific implementation details, refer to the source code and inline comments.