# Community Application - Comprehensive API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Server-Side REST API](#server-side-rest-api)
   - [User Authentication API](#user-authentication-api)
   - [Game Management API](#game-management-api)
   - [My Games API](#my-games-api)
   - [Events API](#events-api)
   - [Statistics API](#statistics-api)
   - [User Settings API](#user-settings-api)
   - [Password Restoration API](#password-restoration-api)
3. [Server-Side Services](#server-side-services)
4. [Frontend Components](#frontend-components)
5. [Redux Store Architecture](#redux-store-architecture)
6. [Data Models and Interfaces](#data-models-and-interfaces)
7. [Utility Functions](#utility-functions)
8. [WebSocket Communication](#websocket-communication)

---

## Overview

The Community Application is a full-stack TypeScript application built with:
- **Backend**: Node.js + Express + TypeScript + Inversify (IoC container)
- **Frontend**: React + Redux + TypeScript + Material-UI
- **Database**: MySQL with Sequelize ORM
- **Real-time Communication**: Socket.io
- **Authentication**: JWT with Passport.js

---

## Server-Side REST API

Base URL: `http://localhost:{port}/api`

### User Authentication API

#### POST `/api/users/register`

Register a new user account.

**Request Body:**
```typescript
{
  email: string;        // Valid email address
  name: string;         // User display name (min 3 characters)
  password: string;     // Password (min 6 characters)
  password2: string;    // Password confirmation (must match)
  language: string;     // User language preference ('en' or 'ru')
}
```

**Response:**
```typescript
// Success (200)
{
  id: number;
  name: string;
  email: string;
  token: string;
  language: string;
}

// Error (400/500)
{
  [field: string]: {
    code: number;
    msg: string;
  }
}
```

**Example:**
```javascript
// Request
fetch('http://localhost:3001/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    password: 'password123',
    password2: 'password123',
    language: 'en'
  })
});

// Success Response
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "token": "uuid-token-string",
  "language": "en"
}
```

---

#### POST `/api/users/login`

Authenticate an existing user.

**Request Body:**
```typescript
{
  email: string;     // User email
  password: string;  // User password
}
```

**Response:**
```typescript
// Success (200)
{
  success: boolean;
  token: string;     // JWT token with 'Bearer ' prefix
}
```

**Example:**
```javascript
// Request
const response = await fetch('http://localhost:3001/api/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Success Response
{
  "success": true,
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usage Notes:**
- Store the JWT token in localStorage or sessionStorage
- Include token in Authorization header for protected routes
- Token contains user ID, name, email, and user token

---

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

**Response:**
```typescript
{
  success: boolean;
  token: string;     // JWT token with 'Bearer ' prefix
}
```

---

#### POST `/api/users/user-language`

Set user language preference.

**Request Body:**
```typescript
{
  userEmail: string;
  userLanguage: string;  // 'en' or 'ru'
}
```

**Response:**
- Status 200: Success
- Status 400/500: Error with details

---

#### GET `/api/users/get-user-language`

Get user language preference.

**Query Parameters:**
- `email`: User email address

**Response:**
```typescript
string  // Language code ('en' or 'ru')
```

**Example:**
```javascript
const response = await fetch(
  'http://localhost:3001/api/users/get-user-language?email=user@example.com'
);
const language = await response.text();
console.log(language); // 'en' or 'ru'
```

---

### Game Management API

#### GET `/api/games/get-games`

Retrieve all approved games.

**Response:**
```typescript
Game[] // Array of approved games

interface Game {
  id: number;
  userId: number;
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
  appToken: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3001/api/games/get-games');
const games = await response.json();

// Response
[
  {
    "id": 1,
    "appName": "Chess Master",
    "description": "Classic chess game",
    "maxRoomPlayer": 2,
    "maxRooms": 10,
    "maxWaitingTime": 60000,
    "approve": true,
    // ... other fields
  }
]
```

---

### My Games API

Endpoints for managing user-created games.

#### GET `/api/v1/my-games/get-games`

Get games created by a specific user.

**Query Parameters:**
- `userId`: ID of the user who created the games

**Response:**
```typescript
Game[]  // Array of games
```

**Example:**
```javascript
const response = await fetch(
  'http://localhost:3001/api/v1/my-games/get-games?userId=1'
);
const myGames = await response.json();
```

---

#### POST `/api/v1/my-games/add-game`

Create a new game.

**Request Body:**
```typescript
{
  userId: number;
  appName: string;                    // Unique game name
  description: string;                // Game description
  maxRoomPlayer: number;              // Max players per room
  maxRooms: number;                   // Max concurrent rooms
  requestUrl: string;                 // Unique URL path
  maxWaitingTime: number;             // Wait time in milliseconds
  redirectUrl: string;                // Redirect URL after game
  registrationEventName?: string;     // Socket event name
  leaveEventName?: string;            // Socket event name
  updateRoomsInfoEventName?: string;  // Socket event name
  notifyCountdown?: string;           // Socket event name
  approve: boolean;                   // Admin approval status
}
```

**Response:**
```typescript
Game  // Created game with generated appToken
```

**Example:**
```javascript
const newGame = {
  userId: 1,
  appName: 'TicTacToe',
  description: 'Classic Tic Tac Toe game',
  maxRoomPlayer: 2,
  maxRooms: 5,
  requestUrl: '/tictactoe',
  maxWaitingTime: 30000,
  redirectUrl: '/games/tictactoe',
  approve: false
};

const response = await fetch('http://localhost:3001/api/v1/my-games/add-game', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newGame)
});

const createdGame = await response.json();
console.log(createdGame.appToken); // Generated token for game authentication
```

---

#### POST `/api/v1/my-games/edit-game`

Update an existing game.

**Request Body:**
```typescript
Game  // Game object with updated fields
```

**Response:**
```typescript
Game[]  // All user games after update
```

---

#### POST `/api/v1/my-games/delete-game`

Delete a game.

**Request Body:**
```typescript
Game  // Game to delete
```

**Response:**
```typescript
Game[]  // Remaining user games after deletion
```

---

### Events API

Manage community events.

#### GET `/api/events/get-events`

Retrieve all events.

**Response:**
```typescript
Event[]

interface Event {
  id: number;
  title: string;
  description: string;
  city: string;
  place: string;
  address: string;
  locationX: string;     // Longitude
  locationY: string;     // Latitude
  begginingInTime: string;
  begginingDate: string;
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:3001/api/events/get-events');
const events = await response.json();

// Response
[
  {
    "id": 1,
    "title": "Board Game Night",
    "description": "Join us for a fun evening",
    "city": "New York",
    "place": "Community Center",
    "address": "123 Main St",
    "locationX": "-74.006",
    "locationY": "40.7128",
    "begginingInTime": "18:00",
    "begginingDate": "2025-10-20"
  }
]
```

---

#### GET `/api/events/get-event`

Get a specific event by ID.

**Query Parameters:**
- `id`: Event ID

**Response:**
```typescript
Event  // Single event object
```

---

#### POST `/api/events/add-event`

Create a new event.

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
- Status 200: Success

---

#### POST `/api/events/edit-event`

Update an existing event.

**Request Body:**
```typescript
Event  // Event object with updated fields
```

**Response:**
- Status 200: Success

---

#### POST `/api/events/delete-event`

Delete an event.

**Request Body:**
```typescript
{
  id: number;  // Event ID to delete
}
```

**Response:**
- Status 200: Success

---

### Statistics API

All statistics endpoints (except `/get-leaders`) require JWT authentication via `Authorization: Bearer <token>` header.

#### POST `/api/v1/statistic/set-game-result`

Submit game results for one or more players.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```typescript
GameData[]

interface GameData {
  userToken: string;              // User's unique token
  playedTime: number;             // Time played in milliseconds
  scores: number;                 // Points earned
  resultStatus: ResultStatus;     // 0=Init, 1=Win, 2=Lose, 3=Draw
  participationStatus: ParticipationStatus;
}
```

**Response:**
- Status 200: Success

**Example:**
```javascript
const gameResults = [
  {
    userToken: 'user-uuid-token',
    playedTime: 120000,  // 2 minutes
    scores: 150,
    resultStatus: 1,     // Win
    participationStatus: 1
  }
];

const response = await fetch('http://localhost:3001/api/v1/statistic/set-game-result', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + jwtToken
  },
  body: JSON.stringify(gameResults)
});
```

---

#### GET `/api/v1/statistic/recent-games`

Get recently played games for a user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `userId`: User's unique token

**Response:**
```typescript
RecentGame[]

interface RecentGame {
  game: string;      // Game name
  scores: number;    // Points scored
  result: number;    // Result status
  playedAt: string;  // Timestamp
}
```

---

#### GET `/api/v1/statistic/most-popular-games`

Get most popular games (requires authentication).

**Response:**
```typescript
MostPopularGame[]

interface MostPopularGame {
  game: string;
  playedTime: number;
  playedInWeek: number;
}
```

---

#### GET `/api/v1/statistic/best-users`

Get top performing users (requires authentication).

**Response:**
```typescript
BestUser[]

interface BestUser {
  userToken: string;
  playedTime: number;
  name: string;
  scores: number;
}
```

---

#### GET `/api/v1/statistic/get-leaders`

Get top 10 leaders for a specific game (no authentication required).

**Query Parameters:**
- `appName`: Name of the game

**Response:**
```typescript
Leader[]

interface Leader {
  userToken: string;
  name: string;
  scores: number;
}
```

**Example:**
```javascript
const response = await fetch(
  'http://localhost:3001/api/v1/statistic/get-leaders?appName=Chess'
);
const leaders = await response.json();

// Response
[
  { "name": "Player1", "scores": 2500, "userToken": "..." },
  { "name": "Player2", "scores": 2400, "userToken": "..." },
  // ... top 10 players
]
```

---

### User Settings API

#### POST `/api/v1/user-settings/change-password`

Change user password (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```typescript
{
  oldPassword: string;       // Current password (min 6 chars)
  newPassword: string;       // New password (min 6 chars)
  repeatNewPassword: string; // Must match newPassword
}
```

**Response:**
```typescript
// Success (200)
{
  result: boolean;
}

// Error (400)
{
  errors: ErrorBlock[];
}
```

---

### Password Restoration API

#### POST `/api/restore-password/send-mail`

Send password reset email.

**Request Body:**
```typescript
{
  userEmail: string;  // Valid registered email
}
```

**Response:**
- Status 200: Email sent successfully
- Status 400: Email not found or invalid

**Example:**
```javascript
const response = await fetch('http://localhost:3001/api/restore-password/send-mail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userEmail: 'user@example.com'
  })
});

if (response.ok) {
  console.log('Password reset email sent!');
}
```

---

## Server-Side Services

### UserAuthenticationRepository

Handles user registration, login, and authentication.

**Methods:**

#### `registerUser(data: User): Promise<User>`

Registers a new user with hashed password and assigns default role.

**Process:**
1. Checks if email already exists
2. Generates unique UUID token
3. Hashes password with bcrypt
4. Saves user to database
5. Assigns default user role

---

#### `loginUser(data: User): Promise<{ success: boolean, token: string }>`

Authenticates user and returns JWT token.

**Process:**
1. Finds user by email
2. Compares password hash
3. Generates JWT token with user payload
4. Returns token with 'Bearer ' prefix

---

#### `socialNetworksLogin(email, name, language, accessToken, imageUrl): Promise<{ success: boolean, token: string }>`

Handles authentication via social networks (Google, VK, Facebook).

**Process:**
1. Checks if user exists by email
2. If exists: Returns JWT token
3. If new: Creates user account and returns JWT token

---

#### `setUserLanguage(userEmail: string, userLanguage: string): Promise<boolean>`

Updates user's language preference.

---

#### `getUserLanguage(userEmail: string): Promise<string>`

Retrieves user's language preference.

---

#### `checkUserEmail(userEmail: string): Promise<boolean>`

Validates if email exists in database.

---

### StatisticRepository

Manages game statistics and leaderboards.

**Methods:**

- `getMostPopularGames(): Promise<PopularGamesFromServer[]>`
- `getBestUsers(): Promise<BestUsersFromServer[]>`
- `getRecentGames(userToken: string): Promise<RecentGameFromServer[]>`
- `setGameResult(statistic: GameData[], appToken: string): Promise<any>`
- `getLeaders(appName: string): Promise<Leaders[]>`

---

### GamesRepository

Manages game data.

**Methods:**

- `getGames(): Promise<Game[]>` - Retrieves all approved games

---

### MyGamesRepository

Manages user-created games.

**Methods:**

- `getGames(userId: number): Promise<Game[]>`
- `addGame(game: Game): Promise<Game>`
- `editGame(game: Game): Promise<Game[]>`
- `deleteGame(game: Game): Promise<Game[]>`

---

### EventsRepository

Manages community events.

**Methods:**

- `getEvents(): Promise<Event[]>`
- `getEvent(eventId: number): Promise<Event>`
- `addEvent(event: Event): Promise<void>`
- `editEvent(event: Event): Promise<void>`
- `deleteEvent(eventId: number): Promise<void>`

---

### SocketService

Manages WebSocket connections and real-time communication.

**Methods:**

- `setSocket(serverInstance: SocketIO.Server): void`
- `notifyAllClients(eventName: string, payload: string): void`

---

### MailerService

Handles email notifications.

**Methods:**

- `sendRestorePasswordMail(userEmail: string): void`

---

### LoggerService

Centralized logging service.

**Methods:**

- `infoLog(message: string): void`
- `errorLog(error: Error): void`

---

## Frontend Components

### Authentication Components

#### `LoginForm`

User login form component.

**Props:**
```typescript
interface LoginFormProps {
  status: AuthStatus;
  errors: ErrorsFromServer;
  spinnerRun: boolean;
  history: History;
  loginUser: (user: UserFieldsToLogin) => void;
  socialNetworksLogin: (user: SocialNetworksUser) => void;
}
```

**Features:**
- Email and password validation
- Form validation with error messages
- Social network login integration
- Loading spinner during authentication
- Automatic redirect on successful login

**Usage:**
```tsx
import { LoginForm } from 'components';

<Route path="/login" component={LoginForm} />
```

---

#### `RegistrationForm`

User registration form component.

**Features:**
- Email, name, password validation
- Password confirmation matching
- Language selection
- Real-time validation feedback
- Social network registration

---

#### `ChangePasswordForm`

Password change form for authenticated users.

**Features:**
- Old password verification
- New password validation
- Password confirmation
- Requires authentication

---

### Game Components

#### `GameCard`

Displays game information and join/leave actions.

**Props:**
```typescript
interface GameCardProps {
  game: Game;
  joinGame: (appName: string) => void;
  leaveGame: (appName: string) => void;
  waitBattlePlayersCountAction: number;
  isFull: boolean;
  battleStartTime: Date;
  isWaitBattle: boolean;
  moreMenuItems: MoreMenuItem[];
}
```

**Features:**
- Displays game details (name, description, max players)
- Shows countdown timer until game starts
- Shows current player count vs max players
- Join/leave game buttons
- Visual indicators for full games
- Single-player mode support
- More menu for additional actions

**Usage:**
```tsx
<CaGameCard
  game={game}
  joinGame={(appName) => dispatch(joinGame(appName))}
  leaveGame={(appName) => dispatch(leaveGame(appName))}
  waitBattlePlayersCountAction={3}
  isFull={false}
  battleStartTime={new Date()}
  isWaitBattle={false}
  moreMenuItems={menuItems}
/>
```

---

#### `GameForm`

Form for creating/editing games.

**Features:**
- Game configuration fields
- Validation for all fields
- URL format validation
- Numeric input validation

---

#### `AddGameComponent`

Wrapper component for adding new games.

---

#### `EditGameComponent`

Wrapper component for editing existing games.

---

### UI Components

#### `CaButton`

Custom Material-UI button component.

**Usage:**
```tsx
<CaButton
  color="primary"
  onClick={handleClick}
  disabled={false}
>
  Click Me
</CaButton>
```

---

#### `CaTable`

Data table component with sorting and actions.

**Props:**
```typescript
interface CaTableProps {
  headers: HeaderName[];
  rows: Row[];
}

interface HeaderName {
  headerName: string;
  field?: RowProperty;
  type: TypeOfColumn;
  editAction?(payload: number): void;
  deleteAction?(payload: GameModel): void;
  lockAction?(payload: string): void;
}
```

**Features:**
- Sortable columns
- Custom column types (String, TimeCount, Points, Result, Date)
- Row actions (edit, delete, lock)
- Internationalization support

**Usage:**
```tsx
<CaTable
  headers={[
    { headerName: 'Name', field: RowProperty.Name, type: TypeOfColumn.String },
    { headerName: 'Score', field: RowProperty.Scores, type: TypeOfColumn.Points }
  ]}
  rows={dataRows}
/>
```

---

#### `CaDialog`

Modal dialog component.

**Features:**
- Customizable title and content
- Confirm/cancel actions
- Responsive design

---

#### `CaSnackbar`

Notification snackbar component.

**Props:**
```typescript
interface CaSnackbarProps {
  type: 'error' | 'warning' | 'info' | 'success';
  messages: ErrorBlock[];
  open: boolean;
  onClose: () => void;
}
```

**Features:**
- Multiple message types
- Auto-dismiss
- Internationalization
- Customizable duration

**Usage:**
```tsx
<CaSnackbar
  type="success"
  messages={[{ msg: 'Operation successful!' }]}
  open={isOpen}
  onClose={handleClose}
/>
```

---

#### `CaSelect`

Select/dropdown component.

---

#### `CaTabs` / `CaTab`

Tab navigation components.

---

#### `CaSpinner`

Loading spinner component.

**Usage:**
```tsx
<CaSpinner isActive={loading} />
```

---

### Navigation Components

#### `Navbar`

Main navigation bar.

**Features:**
- User profile display
- Language switcher
- Logout button
- Responsive design

---

#### `AppMenu`

Application menu with navigation items.

**Props:**
```typescript
interface AppMenuProps {
  items: AppMenuItem[];
}

interface AppMenuItem {
  icon: JSX.Element;
  title: string;
  action: () => void;
}
```

---

#### `ProtectedRoute`

Route component that requires authentication.

**Usage:**
```tsx
<ProtectedRoute
  path="/profile"
  component={ProfilePage}
  authStatus={authStatus}
/>
```

---

### Visualization Components

#### `BarChart`

Bar chart component using D3.js.

**Features:**
- Responsive design
- Tooltips
- Custom margins
- Animated transitions

---

#### `CircleDiagram`

Pie/circle chart component using ECharts.

**Props:**
```typescript
interface CircleDiagramProps {
  options: EChartOption;
}
```

---

#### `ChartContainer`

Container component for charts with loading states.

---

#### `StatisticTables`

Displays various statistics in tabular format.

**Features:**
- Multiple tabs (Best Users, Popular Games, Recent Games)
- Sorting capabilities
- Internationalization

---

### Map Components

#### `YandexMap`

Yandex Maps integration for displaying event locations.

**Features:**
- Marker placement
- Location search
- Responsive design

---

### Social Network Components

#### `SocialNetworksBlock`

Social login buttons container.

**Features:**
- Google login
- VK login
- Facebook login
- Password restore link

---

#### `VkDialog`

VK authentication dialog.

---

### Utility Components

#### `Countdown`

Countdown timer component.

**Features:**
- Displays remaining time
- Auto-updates
- Callback on completion

---

#### `Author`

Author information component.

---

#### `Logo`

Application logo component.

---

#### `MoreMenu`

Context menu with additional actions.

**Props:**
```typescript
interface MoreMenuProps {
  items: MoreMenuItem[];
}

interface MoreMenuItem {
  title: string;
  action: () => void;
}
```

---

## Redux Store Architecture

### Store Structure

```typescript
interface AppState {
  auth: AuthState;
  games: GamesState;
  statistic: StatisticState;
  socket: SocketState;
  snackbarUi: SnackbarUiState;
  restorePassword: RestorePasswordState;
  userSettings: UserSettingsState;
  myGames: MyGamesState;
  room: RoomState;
}
```

---

### Auth Module

**State:**
```typescript
interface AuthState {
  status: AuthStatus;        // NotAuthorized, Registered, Authorized
  user?: FrontEndUser;
  spinnerRun: boolean;
  errors: ErrorBlock[];
}
```

**Actions:**
- `RegisterUser(payload: UserFieldsToRegister)`
- `LoginUser(payload: UserFieldsToLogin)`
- `LogoutUser()`
- `SetCurrentUser(payload: FrontEndUser)`
- `SocialNetworksLogin(payload: SocialNetworksUser)`
- `RegistrationSuccess(payload: string)`
- `RegistrationError()`
- `LoginError()`

**Usage:**
```typescript
import { RegisterUser } from 'store/auth';
import { useDispatch } from 'react-redux';

const dispatch = useDispatch();

const handleRegister = (userData: UserFieldsToRegister) => {
  dispatch(new RegisterUser(userData));
};
```

---

### Games Module

**State:**
```typescript
interface GamesState {
  games: Game[];
  loadStatus: LoadStatus;
}
```

**Actions:**
- `GetGames()` - Fetch all approved games
- `GetGamesSuccess(payload: Game[])`
- `GetGamesError()`

**Example:**
```typescript
import { GetGames } from 'store/games';

// Fetch games
dispatch(new GetGames());

// In component
const games = useSelector((state: AppState) => state.games.games);
```

---

### My Games Module

**State:**
```typescript
interface MyGamesState {
  games: GameModel[];
  isAddDialogOpened: boolean;
  isEditDialogOpened: boolean;
  loadStatus: LoadStatus;
  editingGame?: GameModel;
}
```

**Actions:**
- `GetMyGames(userId: number)`
- `AddGame(game: GameModel)`
- `EditGame(game: GameModel)`
- `DeleteGame(game: GameModel)`
- `OpenAddDialog()`
- `CloseAddDialog()`
- `OpenEditDialog(game: GameModel)`
- `CloseEditDialog()`

---

### Statistics Module

**State:**
```typescript
interface StatisticState {
  bestUsers: BestUser[];
  mostPopularGames: MostPopularGames[];
  recentGames: RecentGames[];
  leaders: Leaders[];
  selectedTab: StatTab;
  loadStatus: LoadStatus;
}
```

**Actions:**
- `GetBestUsers()`
- `GetMostPopularGames()`
- `GetRecentGames(userId: string)`
- `GetLeaders(appName: string)`
- `SetGameResult(results: GameData[])`
- `ChangeStatTab(tab: StatTab)`

---

### Room Module

**State:**
```typescript
interface RoomState {
  rooms: RoomInfo[];
  currentRoom?: RoomInfo;
}
```

**Actions:**
- `UpdateRooms(rooms: RoomInfo[])`
- `JoinRoom(roomId: number)`
- `LeaveRoom()`

---

### Socket Module

**State:**
```typescript
interface SocketState {
  status: SocketStatus;  // Opened, Closed
  socket?: SocketIOClient.Socket;
}
```

**Actions:**
- `OpenSocket()`
- `CloseSocket()`
- `SocketConnected(socket: SocketIOClient.Socket)`
- `EmitEvent(eventName: string, data: any)`

**Usage:**
```typescript
import { OpenSocket, EmitEvent } from 'store/socket';

// Connect to WebSocket
dispatch(new OpenSocket());

// Emit event
dispatch(new EmitEvent('join-game', { gameId: 1, userId: 123 }));
```

---

### Snackbar Module

**State:**
```typescript
interface SnackbarUiState {
  isOpen: boolean;
  type: SnackbarType;
  messages: ErrorBlock[];
}
```

**Actions:**
- `ShowSnackbar(payload: SnackbarPayload)`
- `HideSnackbar()`

**Usage:**
```typescript
import { ShowSnackbar } from 'store/snackbar';
import { SnackbarType } from 'models';

dispatch(new ShowSnackbar({
  type: SnackbarType.Success,
  messages: [{ msg: 'Game created successfully!' }]
}));
```

---

### User Settings Module

**State:**
```typescript
interface UserSettingsState {
  loadStatus: LoadStatus;
  changePasswordStatus: LoadStatus;
}
```

**Actions:**
- `ChangePassword(payload: FieldsToChangePassword)`
- `ChangePasswordSuccess()`
- `ChangePasswordError()`

---

### Restore Password Module

**State:**
```typescript
interface RestorePasswordState {
  status: RestorePasswordStatus;
}
```

**Actions:**
- `SendRestorePasswordMail(email: string)`
- `RestorePasswordSuccess()`
- `RestorePasswordError()`

---

## Data Models and Interfaces

### User

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

---

### Game

```typescript
interface Game {
  id?: number;
  userId: number;
  appName: string;              // Unique game name
  description: string;
  maxRoomPlayer: number;        // 1 for single player, 2+ for multiplayer
  maxRooms: number;             // Max concurrent game rooms
  requestUrl: string;           // Unique URL path
  maxWaitingTime: number;       // Milliseconds to wait before game starts
  redirectUrl: string;          // URL to redirect after game
  registrationEventName?: string;
  leaveEventName?: string;
  updateRoomsInfoEventName?: string;
  notifyCountdown?: string;
  approve: boolean;             // Admin approval required
  appToken?: string;            // Generated authentication token
  createdAt?: string;
  updatedAt?: string;
}
```

---

### Event

```typescript
interface Event {
  id?: number;
  title: string;
  description: string;
  city: string;
  place: string;
  address: string;
  locationX: string;          // Longitude
  locationY: string;          // Latitude
  begginingInTime: string;    // HH:MM format
  begginingDate: string;      // YYYY-MM-DD format
  createAt?: Date;
  updatedAt?: Date;
}
```

---

### RoomInfo

```typescript
interface RoomInfo {
  id: number;
  gameId: number;
  gameName: string;
  description: string;
  maxWaitingTime: number;
  maxPlayersCount: number;
  playersCount: number;
  status: RoomStatus;         // Waiting, InGame, Closed
  distance?: number;
}
```

---

### Enumerations

```typescript
enum AuthStatus {
  NotAuthorized,
  Registered,
  Authorized
}

enum LoadStatus {
  Init,
  Fetching,
  Success,
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

enum SocketStatus {
  Opened,
  Closed
}

enum SnackbarType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success'
}

enum Languages {
  En = 'en',
  Ru = 'ru'
}
```

---

## Utility Functions

### Authentication Utilities

#### `setAuthToken(token: string): void`

Sets the JWT token in axios default headers.

**Usage:**
```typescript
import { setAuthToken } from 'utils';

setAuthToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
```

---

#### `deleteAuthToken(): void`

Removes the JWT token from axios default headers.

---

### HTTP Utilities

#### `HttpWrapper`

Centralized HTTP client using axios.

**Methods:**

```typescript
class HttpWrapper {
  static post<T, R>(url: string, data: T): Promise<AxiosResponse<R>>;
  static get<R>(url: string): Promise<AxiosResponse<R>>;
}
```

**Usage:**
```typescript
import { HttpWrapper } from 'services';

// POST request
const response = await HttpWrapper.post<UserFieldsToLogin, LoginResponse>(
  'api/users/login',
  { email: 'user@example.com', password: 'pass123' }
);

// GET request
const games = await HttpWrapper.get<Game[]>('api/games/get-games');
```

---

### Validation Utilities

#### `isEmpty(value: any): boolean`

Checks if a value is empty (null, undefined, empty string, empty array, empty object).

**Usage:**
```typescript
import { isEmpty } from 'utils';

isEmpty('');           // true
isEmpty(null);         // true
isEmpty([]);           // true
isEmpty({});           // true
isEmpty('text');       // false
isEmpty([1, 2, 3]);    // false
```

---

#### `isObjectsEqual(obj1: any, obj2: any): boolean`

Deep comparison of two objects.

---

### i18n Utilities

#### `getLanguage(): string`

Gets the current user's language preference.

**Returns:** 'en' or 'ru'

---

#### `translateNumberOfWeekToItsName(dayNumber: DaysOfWeek): string`

Converts day number to localized day name.

---

### History Utility

```typescript
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
```

**Usage:**
```typescript
import { history } from 'utils';

// Navigate programmatically
history.push('/homepage');
history.replace('/login');
history.goBack();
```

---

## WebSocket Communication

### Socket Events

The application uses Socket.io for real-time communication.

#### Client-Side Events

**Connection:**
```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

---

**Game Registration:**
```typescript
// Join a game
socket.emit('registration-event-name', {
  userId: 123,
  gameId: 1,
  userToken: 'uuid-token'
});

// Leave a game
socket.emit('leave-event-name', {
  userId: 123,
  gameId: 1
});
```

---

**Room Updates:**
```typescript
// Listen for room info updates
socket.on('update-rooms-info', (rooms: RoomInfo[]) => {
  console.log('Updated rooms:', rooms);
});
```

---

**Countdown Notifications:**
```typescript
// Listen for countdown updates
socket.on('notify-countdown', (data: { time: number, roomId: number }) => {
  console.log(`Game starting in ${data.time} seconds`);
});
```

---

#### Server-Side Events

**Broadcasting to All Clients:**
```typescript
// Server-side service
socketService.notifyAllClients('update-rooms-info', JSON.stringify(roomsData));
```

---

### Socket Service (Frontend)

```typescript
class SocketService {
  private socket?: SocketIOClient.Socket;

  connect(url: string): void {
    this.socket = io(url);
  }

  emit(eventName: string, data: any): void {
    this.socket?.emit(eventName, data);
  }

  on(eventName: string, callback: (data: any) => void): void {
    this.socket?.on(eventName, callback);
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}
```

**Usage:**
```typescript
import { SocketService } from 'services';

const socketService = new SocketService();
socketService.connect('http://localhost:3001');

socketService.on('game-started', (data) => {
  console.log('Game started!', data);
});

socketService.emit('join-game', { gameId: 1, userId: 123 });
```

---

## Error Handling

### Error Structure

```typescript
interface ErrorBlock {
  code?: number;
  msg: string;
}

interface ErrorsFromServer {
  [key: string]: ErrorBlock;
}
```

---

### Error Types

**Logic Errors (code < 2000):**
- User already registered
- User not found
- Wrong password
- Invalid email
- Token required

**Technical Errors (code >= 2000):**
- Database crash
- Cannot create hash
- Salt not generated
- Server error

---

### Error Handling Example

```typescript
try {
  const response = await HttpWrapper.post('api/users/login', credentials);
  // Handle success
} catch (error) {
  if (error.response) {
    const errors = error.response.data;
    
    if (errors.code >= 2000) {
      // Technical error - show generic message
      dispatch(new ShowSnackbar({
        type: SnackbarType.Error,
        messages: [{ msg: 'Server error. Please try again later.' }]
      }));
    } else {
      // Logic error - show specific message
      dispatch(new ShowSnackbar({
        type: SnackbarType.Error,
        messages: [errors]
      }));
    }
  }
}
```

---

## Best Practices and Tips

### Authentication

1. **Store JWT Token Securely:**
   ```typescript
   localStorage.setItem('jwtToken', token);
   setAuthToken(token);
   ```

2. **Check Authentication on App Load:**
   ```typescript
   const token = localStorage.getItem('jwtToken');
   if (token) {
     setAuthToken(token);
     const decoded = jwt_decode(token);
     dispatch(new SetCurrentUser(decoded));
   }
   ```

3. **Handle Token Expiration:**
   ```typescript
   const decoded = jwt_decode(token);
   const currentTime = Date.now() / 1000;
   
   if (decoded.exp < currentTime) {
     dispatch(new LogoutUser());
     localStorage.removeItem('jwtToken');
   }
   ```

---

### API Calls

1. **Use TypeScript Interfaces:**
   ```typescript
   const response = await HttpWrapper.post<LoginRequest, LoginResponse>(
     'api/users/login',
     loginData
   );
   ```

2. **Handle Loading States:**
   ```typescript
   dispatch(new GetGames());  // Sets loadStatus to Fetching
   // ... API call
   dispatch(new GetGamesSuccess(games));  // Sets loadStatus to Success
   ```

3. **Error Handling:**
   Always wrap API calls in try-catch blocks and dispatch appropriate error actions.

---

### Component Development

1. **Use TypeScript Props:**
   ```typescript
   interface MyComponentProps {
     title: string;
     onSave: (data: GameModel) => void;
   }
   
   const MyComponent: React.FC<MyComponentProps> = ({ title, onSave }) => {
     // Component logic
   };
   ```

2. **Connect to Redux:**
   ```typescript
   const mapStateToProps = (state: AppState) => ({
     games: state.games.games,
     loading: state.games.loadStatus === LoadStatus.Fetching
   });
   
   const mapDispatchToProps = (dispatch: Dispatch) => ({
     getGames: () => dispatch(new GetGames())
   });
   
   export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
   ```

3. **Use i18n for Text:**
   ```tsx
   <I18n>{(t) => (
     <button>{t('login')}</button>
   )}</I18n>
   ```

---

### WebSocket Usage

1. **Connect on Authentication:**
   ```typescript
   useEffect(() => {
     if (authStatus === AuthStatus.Authorized) {
       dispatch(new OpenSocket());
     }
     return () => {
       dispatch(new CloseSocket());
     };
   }, [authStatus]);
   ```

2. **Listen for Events:**
   ```typescript
   useEffect(() => {
     if (socket) {
       socket.on('room-update', handleRoomUpdate);
       return () => {
         socket.off('room-update', handleRoomUpdate);
       };
     }
   }, [socket]);
   ```

---

## Testing

### Running Tests

```bash
# Server tests
cd server
npm test

# Frontend tests
cd frontend
npm test
```

---

### Example Test

```typescript
describe('LoginForm', () => {
  it('should validate email format', () => {
    const email = 'invalid-email';
    const isValid = validateEmail(email);
    expect(isValid).toBe(false);
  });

  it('should submit valid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await loginUser(credentials);
    expect(response.success).toBe(true);
    expect(response.token).toBeDefined();
  });
});
```

---

## Configuration

### Server Configuration

**Location:** `server/src/config/app.config.json`

```json
{
  "port": 3001,
  "production": "production"
}
```

---

### Database Configuration

**Location:** `server/src/config/dbconfig.ts`

Configure MySQL connection and model names.

---

### Frontend Configuration

**Location:** `frontend/src/config.json`

```json
{
  "backEndPath": {
    "schema": "http",
    "host": "localhost",
    "port": 3001
  }
}
```

---

## Deployment

### Build Commands

```bash
# Build entire application
npm run build

# Build and install dependencies
npm run full-build

# Start application
npm run start

# Full install and start
npm run full-start
```

---

### Production Build

```bash
# Server production build
cd server
npm run prod

# Frontend production build
cd frontend
npm run build
```

---

## Support and Resources

### Project Structure

```
community-app/
├── server/              # Backend Node.js application
│   ├── src/
│   │   ├── controller/  # REST API controllers
│   │   ├── service/     # Business logic services
│   │   └── config/      # Configuration files
│   ├── models/          # Sequelize models
│   └── Interfaces/      # TypeScript interfaces
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── store/       # Redux store modules
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── acceptance_tests/    # End-to-end tests
```

---

### Additional Documentation

- **TypeScript:** https://www.typescriptlang.org/docs/
- **React:** https://react.dev/
- **Redux:** https://redux.js.org/
- **Material-UI:** https://mui.com/
- **Socket.io:** https://socket.io/docs/
- **Sequelize:** https://sequelize.org/docs/

---

## Changelog

### Version 0.1.0
- Initial release
- User authentication and registration
- Game management system
- Real-time room management
- Statistics and leaderboards
- Event management
- Social network integration
- Multi-language support (EN/RU)

---

## License

This project is proprietary software. All rights reserved.

---

## Contributors

For questions or support, please contact the development team.
