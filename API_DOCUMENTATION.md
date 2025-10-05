# Community Application API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Server API Endpoints](#server-api-endpoints)
3. [Frontend Components](#frontend-components)
4. [Models & Interfaces](#models--interfaces)
5. [Services & Utilities](#services--utilities)
6. [Usage Examples](#usage-examples)

## Overview

The Community Application is a full-stack TypeScript application consisting of:
- **Backend**: Node.js/Express server with Sequelize ORM and MySQL database
- **Frontend**: React application with Material-UI components and Redux for state management
- **Features**: User authentication, gaming platform, statistics, events management, and real-time communication via Socket.IO

## Server API Endpoints

### Authentication & User Management (`/api/users`)

#### POST `/api/users/register`
Register a new user account.

**Request Body:**
```typescript
interface UserFieldsToRegister {
  email: string;
  name: string;
  password: string;
  password2: string;
  language: string;
}
```

**Response:**
- **Success (200)**: User object
- **Error (400)**: Validation errors
- **Error (500)**: Server error

**Example:**
```javascript
fetch('/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    password: 'securePassword123',
    password2: 'securePassword123',
    language: 'en'
  })
});
```

#### POST `/api/users/login`
Authenticate user and receive JWT token.

**Request Body:**
```typescript
interface UserFieldsToLogin {
  email: string;
  password: string;
}
```

**Response:**
```typescript
{ success: boolean, token: string }
```

**Example:**
```javascript
fetch('/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securePassword123'
  })
});
```

#### POST `/api/users/user-language`
Update user's language preference.

**Request Body:**
```javascript
{
  userEmail: string;
  userLanguage: string;
}
```

#### GET `/api/users/get-user-language`
Get user's language preference.

**Query Parameters:**
- `email`: User email address

#### POST `/api/users/google-auth`
Authenticate via Google OAuth.

**Request Body:**
```typescript
{
  email: string;
  name: string;
  language: string;
  accessToken: string;
  imageUrl?: string;
}
```

### Games Management (`/api/games`)

#### GET `/api/games/get-games`
Retrieve all approved games.

**Response:**
```typescript
Game[] // Array of game objects
```

**Example:**
```javascript
fetch('/api/games/get-games')
  .then(response => response.json())
  .then(games => console.log(games));
```

### Events Management (`/api/events`)

#### POST `/api/events/add-event`
Create a new event.

**Request Body:**
```typescript
interface Event {
  title: string;
  description: string;
  city: string;
  place: string;
  address: string;
  locationX: string;
  locationY: string;
  begginingInTime: string;
  begginingDate: string;
}
```

#### POST `/api/events/delete-event`
Delete an event by ID.

**Request Body:**
```javascript
{ id: number }
```

#### POST `/api/events/edit-event`
Update an existing event.

**Request Body:** Event object with updated fields

#### GET `/api/events/get-events`
Retrieve all events.

#### GET `/api/events/get-event`
Get a specific event by ID.

**Query Parameters:**
- `id`: Event ID

### Statistics (`/api/v1/statistic`)

#### POST `/api/v1/statistic/set-game-result`
Submit game results (requires authentication).

**Request Body:**
```typescript
interface GameData {
  userToken: string;
  playedTime: number;
  scores: number;
  resultStatus: ResultStatus;
  participationStatus: ParticipationStatus;
}
```

**Headers:**
- `Authorization`: Bearer token

#### GET `/api/v1/statistic/recent-games` 🔒
Get user's recent games (requires authentication).

**Query Parameters:**
- `userId`: User token

#### GET `/api/v1/statistic/most-popular-games` 🔒
Get most popular games (requires authentication).

#### GET `/api/v1/statistic/best-users` 🔒
Get best users leaderboard (requires authentication).

#### GET `/api/v1/statistic/get-leaders`
Get top 10 leaders for a specific game.

**Query Parameters:**
- `appName`: Application name

## Frontend Components

### Core Components

#### `<App>`
Main application component with Material-UI theme provider.

```typescript
import { App } from './App';

// Usage in index.tsx
ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18nInstance}>
      <App />
    </I18nextProvider>
  </Provider>,
  document.getElementById('root')
);
```

#### `<LoginForm>`
User authentication form component.

**Props:**
```typescript
interface LoginFormProps {
  history: History;
  status: AuthStatus;
  errors: any;
  spinnerRun: boolean;
  loginUser: (user: UserFieldsToLogin) => void;
  socialNetworksLogin: (user: SocialNetworksUser) => void;
}
```

**Usage:**
```tsx
import { LoginForm } from 'components';

<LoginForm history={history} />
```

#### `<CaGameCard>`
Game card component for displaying game information.

**Props:**
```typescript
interface GameCardProps {
  game: GameModel;
  joinGame: (appName: string) => void;
  leaveGame: (appName: string) => void;
  waitBattlePlayersCountAction: number;
  isFull: boolean;
  battleStartTime: Date;
  isWaitBattle: boolean;
  moreMenuItems: MoreMenuItem[];
}
```

**Usage:**
```tsx
import { CaGameCard } from 'components';

<CaGameCard
  game={gameObject}
  joinGame={handleJoinGame}
  leaveGame={handleLeaveGame}
  waitBattlePlayersCountAction={2}
  isFull={false}
  battleStartTime={new Date()}
  isWaitBattle={false}
  moreMenuItems={menuItems}
/>
```

#### `<BarChart>`
Interactive D3.js bar chart component.

**Props:**
```typescript
interface BarChartProps {
  diagramData: WeekReportData[];
  config: BarChartConfig;
}

interface BarChartConfig {
  margin: Margin;
  ticksNumber: number;
  animationDuration: number;
  marginBetweenLegends: number;
  legendRectWidth: number;
  legendRectHeight: number;
  legendRectMargins: number;
  legendTextMargins: number;
}
```

**Usage:**
```tsx
import { BarChart } from 'components';

const chartConfig = {
  margin: { top: 20, right: 20, bottom: 30, left: 40 },
  ticksNumber: 10,
  animationDuration: 750,
  marginBetweenLegends: 20,
  legendRectWidth: 15,
  legendRectHeight: 15,
  legendRectMargins: 5,
  legendTextMargins: 25
};

<BarChart diagramData={weekData} config={chartConfig} />
```

### UI Components (`/components/Mui`)

#### `<CaButton>`
Custom Material-UI button with theming.

```tsx
import { CaButton } from 'components';

<CaButton color="primary" onClick={handleClick}>
  Click Me
</CaButton>
```

#### `<CaTable>`
Enhanced table component with sorting and actions.

**Props:**
```typescript
interface CaTableProps {
  headerNames: HeaderName[];
  rows: Row[];
}
```

#### `<CaDialog>`
Modal dialog component.

#### `<CaSelect>`
Styled select dropdown component.

#### `<CaSnackbar>`
Notification snackbar component.

### Specialized Components

#### `<Countdown>`
Timer countdown component for games.

#### `<CircleDiagram>`
Circular progress/pie chart component.

#### `<StatisticTables>`
Component for displaying game statistics.

#### `<YandexMap>`
Yandex Maps integration component.

#### `<ProtectedRoute>`
Route wrapper for authenticated pages.

```tsx
import { ProtectedRoute } from 'components';

<ProtectedRoute component={Dashboard} />
```

## Models & Interfaces

### Core Models

#### User Models
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  language: string;
  // ... additional user fields
}

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
```

#### Game Models
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
  redirectUrl: string;
  registrationEventName: string;
  leaveEventName: string;
  updateRoomsInfoEventName: string;
  notifyCountdown: string;
  approve: boolean;
  appToken?: string;
}

interface RoomInfo {
  id: number;
  gameId: number;
  gameName: string;
  description: string;
  maxWaitingTime: number;
  maxPlayersCount: number;
  playersCount: number;
  status: RoomStatus;
  distance?: number;
}
```

#### Event Models
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

#### Statistics Models
```typescript
interface BestUser {
  userToken: string;
  playedTime: number;
  name: number;
  scores: number;
}

interface MostPopularGames {
  game: string;
  playedTime: number;
  playedInWeek: number;
}

interface RecentGames {
  game: string;
  scores: number;
  result: number;
  playedAt: string;
}

interface Leaders {
  userToken: string;
  name: number;
  scores: number;
}
```

### Enums

```typescript
enum AuthStatus {
  NotAuthorized,
  Registered,
  Authorized
}

enum BattleStatus {
  Init,
  Wait,
  Play,
  Error
}

enum ResultStatus {
  Init,
  Win,
  Lose,
  Draw
}

enum RoomStatus {
  Waiting,
  InGame,
  Closed
}

enum LoadStatus {
  Init,
  Fetching,
  Success,
  Error
}

enum Languages {
  En = 'en',
  Ru = 'ru'
}
```

## Services & Utilities

### Redux Store Structure

The application uses Redux with the following store modules:

- `auth` - Authentication state
- `games` - Games data and state
- `socket` - Socket.IO connection state
- `myGames` - User's games
- `statistic` - Statistics data
- `userSettings` - User preferences
- `snackbar` - UI notifications
- `room` - Game room state

### Axios Service

```typescript
// Located in: frontend/src/services/axiosWrapper.service.ts
// Provides HTTP request wrapper with authentication
```

### Socket Service

```typescript
// Located in: server/src/service/socket/
// Handles real-time communication between clients
```

## Usage Examples

### Complete User Registration Flow

```typescript
// 1. Register user
const registerUser = async (userData: UserFieldsToRegister) => {
  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      const user = await response.json();
      console.log('User registered:', user);
      return user;
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// 2. Login user
const loginUser = async (credentials: UserFieldsToLogin) => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      return token;
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Game Management Example

```typescript
// Get available games
const getGames = async () => {
  const response = await fetch('/api/games/get-games');
  const games = await response.json();
  return games;
};

// Submit game results
const submitGameResult = async (gameData: GameData[], token: string) => {
  const response = await fetch('/api/v1/statistic/set-game-result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(gameData)
  });
  
  return response.ok;
};
```

### Component Usage Example

```tsx
import React from 'react';
import { CaGameCard, BarChart, LoginForm } from 'components';

const GameDashboard = () => {
  const handleJoinGame = (appName: string) => {
    // Join game logic
  };

  const handleLeaveGame = (appName: string) => {
    // Leave game logic
  };

  return (
    <div>
      <CaGameCard
        game={gameData}
        joinGame={handleJoinGame}
        leaveGame={handleLeaveGame}
        waitBattlePlayersCountAction={2}
        isFull={false}
        battleStartTime={new Date()}
        isWaitBattle={false}
        moreMenuItems={[]}
      />
      
      <BarChart
        diagramData={statisticsData}
        config={chartConfiguration}
      />
    </div>
  );
};
```

### Real-time Communication

```typescript
// Client-side socket usage
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

// Join a game room
socket.emit('joinRoom', { gameId: 'game123', userId: 'user456' });

// Listen for game updates
socket.on('gameUpdate', (data) => {
  console.log('Game updated:', data);
});

// Leave room
socket.emit('leaveRoom', { gameId: 'game123' });
```

---

## Development Setup

### Prerequisites
- Node.js (v14+)
- MySQL Server
- NPM or Yarn

### Installation
```bash
# Install dependencies
npm run install

# Start development servers
npm run start

# Build for production
npm run build
```

### Project Structure
```
community-app/
├── frontend/           # React frontend application
├── server/            # Node.js backend server
├── acceptance_tests/  # E2E tests (Java/Cucumber)
└── package.json      # Root package configuration
```

### Environment Configuration
Create `config.json` files in both frontend/src/ and server/src/config/ directories with appropriate database and API configurations.

---

*This documentation covers all public APIs, components, and interfaces in the Community Application. For implementation details, refer to the respective source files in the codebase.*