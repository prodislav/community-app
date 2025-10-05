# Community App - Comprehensive API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Backend API Documentation](#backend-api-documentation)
3. [Frontend Components Documentation](#frontend-components-documentation)
4. [Data Models and Interfaces](#data-models-and-interfaces)
5. [Services Documentation](#services-documentation)
6. [Authentication and Authorization](#authentication-and-authorization)
7. [Error Handling](#error-handling)
8. [Usage Examples](#usage-examples)

## Project Overview

This is a full-stack community gaming application built with:
- **Frontend**: React 16.4.2 with TypeScript, Material-UI, Redux
- **Backend**: Node.js with Express, TypeScript, InversifyJS for dependency injection
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.IO for live updates

## Backend API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### POST /api/users/register
Register a new user account.

**Request Body:**
```typescript
{
  email: string;
  name: string;
  password: string;
  password2: string;
  language: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    language: string;
  }
}
```

**Example:**
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

#### POST /api/users/login
Authenticate user and return JWT token.

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  token: string;
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### POST /api/users/google-auth
Authenticate user via Google OAuth.

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

**Response:**
```typescript
{
  success: boolean;
  token: string;
}
```

#### POST /api/users/user-language
Update user's language preference.

**Request Body:**
```typescript
{
  userEmail: string;
  userLanguage: string;
}
```

**Response:**
- `200` - Success
- `400` - Validation error
- `500` - Server error

#### GET /api/users/get-user-language
Get user's current language setting.

**Query Parameters:**
- `email` (string): User's email address

**Response:**
```typescript
string // Language code (e.g., "en", "ru")
```

### Games Endpoints

#### GET /api/games/get-games
Retrieve all approved games.

**Response:**
```typescript
GameModel[]
```

**Example:**
```bash
curl -X GET http://localhost:3000/api/games/get-games
```

### Events Endpoints

#### POST /api/events/add-event
Add a new event.

**Request Body:**
```typescript
{
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

**Response:**
- `200` - Event added successfully
- `400` - Validation error

#### GET /api/events/get-events
Retrieve all events.

**Response:**
```typescript
Event[]
```

#### GET /api/events/get-event
Retrieve a specific event by ID.

**Query Parameters:**
- `id` (number): Event ID

**Response:**
```typescript
Event
```

#### POST /api/events/edit-event
Update an existing event.

**Request Body:**
```typescript
{
  id: number;
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

#### POST /api/events/delete-event
Delete an event.

**Request Body:**
```typescript
{
  id: number;
}
```

### Statistics Endpoints

#### POST /api/v1/statistic/set-game-result
Submit game results for statistics.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```typescript
GameData[]
```

Where `GameData` is:
```typescript
{
  userToken: string;
  playedTime: number;
  scores: number;
  resultStatus: ResultStatus;
  participationStatus: ParticipationStatus;
}
```

#### GET /api/v1/statistic/recent-games
Get user's recent games.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `userId` (string): User token

**Response:**
```typescript
RecentGames[]
```

#### GET /api/v1/statistic/most-popular-games
Get most popular games statistics.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```typescript
MostPopularGames[]
```

#### GET /api/v1/statistic/best-users
Get best users statistics.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```typescript
BestUser[]
```

#### GET /api/v1/statistic/get-leaders
Get top 10 leaders for a specific game.

**Query Parameters:**
- `appName` (string): Game application name

**Response:**
```typescript
Leaders[]
```

## Frontend Components Documentation

### Core Components

#### App
Main application component that provides Material-UI theme and routing.

**Props:** None

**Usage:**
```tsx
import { App } from './App';

// Rendered automatically by index.tsx
<App />
```

#### GameCard
Displays game information with join/leave functionality.

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
  game={gameData}
  joinGame={handleJoinGame}
  leaveGame={handleLeaveGame}
  waitBattlePlayersCountAction={5}
  isFull={false}
  battleStartTime={new Date()}
  isWaitBattle={false}
  moreMenuItems={menuItems}
/>
```

#### LoginForm
Handles user authentication with form validation.

**Props:**
```typescript
interface LoginFormProps {
  history: History;
  status: AuthStatus;
  errors: Errors;
  spinnerRun: boolean;
  loginUser: (user: UserFieldsToRegister) => void;
  socialNetworksLogin: (user: SocialNetworksUser) => void;
}
```

**Usage:**
```tsx
import { LoginForm } from 'components';

<LoginForm
  history={history}
  status={authStatus}
  errors={errors}
  spinnerRun={isLoading}
  loginUser={handleLogin}
  socialNetworksLogin={handleSocialLogin}
/>
```

#### RegistrationForm
Handles user registration with validation.

**Props:**
```typescript
interface RegistrationFormProps {
  history: History;
  status: AuthStatus;
  errors: Errors;
  spinnerRun: boolean;
  registerUser: (user: UserFieldsToRegister) => void;
  socialNetworksLogin: (user: SocialNetworksUser) => void;
}
```

#### Countdown
Displays countdown timer for game start.

**Props:**
```typescript
interface CountdownProps {
  timeLeft: number;
  onTimeUp: () => void;
}
```

#### BarChart
Renders bar chart using D3.js.

**Props:**
```typescript
interface BarChartProps {
  data: any[];
  width: number;
  height: number;
  margin: Margin;
}
```

#### CircleDiagram
Renders pie chart using D3.js.

**Props:**
```typescript
interface CircleDiagramProps {
  data: any[];
  width: number;
  height: number;
  margin: Margin;
}
```

#### StatisticTables
Displays statistics in table format.

**Props:**
```typescript
interface StatisticTablesProps {
  data: Row[];
  headers: HeaderName[];
  onEdit?: (id: number) => void;
  onDelete?: (item: GameModel) => void;
  onLock?: (appName: string) => void;
}
```

### UI Components

#### CaButton
Custom button component with Material-UI styling.

**Props:**
```typescript
interface CaButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}
```

#### Spinner
Loading spinner component.

**Props:**
```typescript
interface SpinnerProps {
  isActive: boolean;
}
```

#### Logo
Application logo component.

**Props:**
```typescript
interface LogoProps {
  className?: string;
}
```

## Data Models and Interfaces

### Core Models

#### User
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  token: string;
  language: string;
  accessToken?: string;
  imageUrl?: string;
}
```

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

#### Event
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

#### AuthStatus
```typescript
enum AuthStatus {
  NotAuthorized = 0,
  Registered = 1,
  Authorized = 2
}
```

#### ResultStatus
```typescript
enum ResultStatus {
  Init = 0,
  Win = 1,
  Lose = 2,
  Draw = 3
}
```

#### RoomStatus
```typescript
enum RoomStatus {
  Waiting = 0,
  InGame = 1,
  Closed = 2
}
```

## Services Documentation

### HTTP Wrapper Service

#### HttpWrapper
Utility class for making HTTP requests.

**Methods:**

##### post<T, R>(url: string, data: T): Promise<AxiosResponse<R>>
Make a POST request.

**Parameters:**
- `url` (string): API endpoint
- `data` (T): Request payload

**Returns:** Promise with Axios response

**Example:**
```typescript
import { HttpWrapper } from 'services';

const response = await HttpWrapper.post('/api/users/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

##### get<R>(url: string): Promise<AxiosResponse<R>>
Make a GET request.

**Parameters:**
- `url` (string): API endpoint

**Returns:** Promise with Axios response

**Example:**
```typescript
const response = await HttpWrapper.get('/api/games/get-games');
```

### Backend Services

#### UserAuthenticationRepository
Handles user authentication operations.

**Methods:**
- `registerUser(userData: UserFieldsToRegister): Promise<User>`
- `loginUser(userData: UserFieldsToLogin): Promise<{success: boolean, token: string}>`
- `socialNetworksLogin(email: string, name: string, language: string, accessToken: string, imageUrl?: string): Promise<{success: boolean, token: string}>`
- `setUserLanguage(email: string, language: string): Promise<boolean>`
- `getUserLanguage(email: string): Promise<string>`

#### GamesRepository
Manages game data operations.

**Methods:**
- `getGames(): Promise<GameModel[]>`

#### EventsRepository
Handles event management.

**Methods:**
- `addEvent(event: Event): Promise<void>`
- `getEvents(): Promise<Event[]>`
- `getEvent(id: number): Promise<Event>`
- `editEvent(event: Event): Promise<void>`
- `deleteEvent(id: number): Promise<void>`

#### StatisticRepository
Manages statistics and analytics.

**Methods:**
- `setGameResult(data: GameData[], token: string): Promise<void>`
- `getRecentGames(userToken: string): Promise<RecentGames[]>`
- `getMostPopularGames(): Promise<MostPopularGames[]>`
- `getBestUsers(): Promise<BestUser[]>`
- `getLeaders(appName: string): Promise<Leaders[]>`

## Authentication and Authorization

### JWT Token Structure
```typescript
{
  id: number;
  email: string;
  iat: number;
  exp: number;
}
```

### Protected Routes
Routes requiring authentication use the `passport.authenticate('jwt', { session: false })` middleware.

### Token Usage
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

### Error Response Format
```typescript
{
  code: number;
  msg: string;
}
```

### Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid token)
- `500` - Internal Server Error

### Frontend Error Handling
Errors are managed through Redux store and displayed via snackbar notifications.

## Usage Examples

### Complete Authentication Flow

```typescript
// 1. Register a new user
const registerResponse = await HttpWrapper.post('/api/users/register', {
  email: 'user@example.com',
  name: 'John Doe',
  password: 'password123',
  password2: 'password123',
  language: 'en'
});

// 2. Login with credentials
const loginResponse = await HttpWrapper.post('/api/users/login', {
  email: 'user@example.com',
  password: 'password123'
});

const token = loginResponse.data.token;

// 3. Use token for protected requests
const gamesResponse = await HttpWrapper.get('/api/games/get-games', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Game Management

```typescript
// Get all games
const games = await HttpWrapper.get('/api/games/get-games');

// Submit game results
const gameResults = await HttpWrapper.post('/api/v1/statistic/set-game-result', [
  {
    userToken: 'user-token',
    playedTime: 300,
    scores: 1500,
    resultStatus: ResultStatus.Win,
    participationStatus: ParticipationStatus.Completed
  }
], {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Event Management

```typescript
// Add a new event
const newEvent = await HttpWrapper.post('/api/events/add-event', {
  title: 'Gaming Tournament',
  description: 'Monthly gaming tournament',
  city: 'New York',
  place: 'Convention Center',
  address: '123 Main St',
  locationX: '40.7128',
  locationY: '-74.0060',
  begginingInTime: '18:00',
  begginingDate: '2024-01-15'
});

// Get all events
const events = await HttpWrapper.get('/api/events/get-events');
```

This documentation provides a comprehensive overview of all public APIs, functions, and components in the Community App. For more specific implementation details, refer to the source code in the respective files.