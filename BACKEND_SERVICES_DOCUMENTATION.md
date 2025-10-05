# Backend Services Detailed Documentation

## Table of Contents

1. [Service Architecture](#service-architecture)
2. [Authentication Services](#authentication-services)
3. [Game Services](#game-services)
4. [Event Services](#event-services)
5. [Statistics Services](#statistics-services)
6. [User Services](#user-services)
7. [Utility Services](#utility-services)
8. [Database Models](#database-models)
9. [Error Handling](#error-handling)
10. [Dependency Injection](#dependency-injection)

## Service Architecture

The backend uses **InversifyJS** for dependency injection and follows a repository pattern for data access.

### Service Registration
All services are registered in `server/src/service/services-registration.ts`:

```typescript
export const CONTAINER = new Container();

// Register services
CONTAINER.bind<UserAuthenticationRepository>(UserAuthenticationRepository).to(UserAuthenticationRepositoryImplementation);
CONTAINER.bind<GamesRepository>(GamesRepository).to(GamesRepositoryImplementation);
// ... other services
```

## Authentication Services

### UserAuthenticationRepository
Handles all user authentication operations.

**File:** `server/src/service/user-authentication/user-authentication.ts`

**Interface:**
```typescript
interface UserAuthenticationRepository {
  registerUser(userData: UserFieldsToRegister): Promise<User>;
  loginUser(userData: UserFieldsToLogin): Promise<{success: boolean, token: string}>;
  socialNetworksLogin(email: string, name: string, language: string, accessToken: string, imageUrl?: string): Promise<{success: boolean, token: string}>;
  setUserLanguage(email: string, language: string): Promise<boolean>;
  getUserLanguage(email: string): Promise<string>;
}
```

**Implementation:** `server/src/service/user-authentication/user-authentication-i.ts`

**Key Methods:**

#### registerUser(userData: UserFieldsToRegister)
Creates a new user account with validation.

**Parameters:**
```typescript
interface UserFieldsToRegister {
  email: string;
  name: string;
  password: string;
  password2: string;
  language: string;
}
```

**Process:**
1. Validates input data
2. Checks if email already exists
3. Hashes password using bcrypt
4. Creates user record in database
5. Generates JWT token
6. Returns user data and token

**Example:**
```typescript
const userData = {
  email: "user@example.com",
  name: "John Doe",
  password: "password123",
  password2: "password123",
  language: "en"
};

const result = await userAuthService.registerUser(userData);
// Returns: { success: true, token: "jwt-token", user: {...} }
```

#### loginUser(userData: UserFieldsToLogin)
Authenticates user credentials.

**Parameters:**
```typescript
interface UserFieldsToLogin {
  email: string;
  password: string;
}
```

**Process:**
1. Validates input data
2. Finds user by email
3. Compares password hash
4. Generates JWT token
5. Returns authentication result

#### socialNetworksLogin(email, name, language, accessToken, imageUrl?)
Handles OAuth authentication (Google, VK, etc.).

**Process:**
1. Validates social network data
2. Checks if user exists
3. Creates or updates user record
4. Generates JWT token
5. Returns authentication result

## Game Services

### GamesRepository
Manages game data operations.

**File:** `server/src/service/games/games.repository.ts`

**Interface:**
```typescript
interface GamesRepository {
  getGames(): Promise<GameModel[]>;
  getGameById(id: number): Promise<GameModel>;
  createGame(gameData: GameModel): Promise<GameModel>;
  updateGame(id: number, gameData: Partial<GameModel>): Promise<GameModel>;
  deleteGame(id: number): Promise<void>;
  approveGame(id: number): Promise<void>;
}
```

**Implementation:** `server/src/service/games/games.repository.implementation.ts`

**Key Methods:**

#### getGames()
Retrieves all approved games.

**SQL Query:**
```sql
SELECT * FROM games WHERE approve = 1 ORDER BY createAt DESC;
```

**Returns:** Array of approved games

**Example:**
```typescript
const games = await gamesRepository.getGames();
// Returns: GameModel[]
```

#### createGame(gameData)
Creates a new game (admin only).

**Process:**
1. Validates game data
2. Sets default values
3. Inserts into database
4. Returns created game

## Event Services

### EventsRepository
Manages event data operations.

**File:** `server/src/service/events/events.repository.ts`

**Interface:**
```typescript
interface EventsRepository {
  addEvent(event: Event): Promise<void>;
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event>;
  editEvent(event: Event): Promise<void>;
  deleteEvent(id: number): Promise<void>;
  getEventsByUser(userId: number): Promise<Event[]>;
  getEventsByLocation(lat: number, lng: number, radius: number): Promise<Event[]>;
}
```

**Implementation:** `server/src/service/events/events.repository.implementation.ts`

**Key Methods:**

#### addEvent(event)
Creates a new event.

**Parameters:**
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
  userId?: number;
}
```

**Process:**
1. Validates event data
2. Sets creation timestamp
3. Inserts into database
4. Returns success status

#### getEvents()
Retrieves all events.

**SQL Query:**
```sql
SELECT * FROM events ORDER BY begginingDate DESC, begginingInTime DESC;
```

#### getEventsByLocation(lat, lng, radius)
Finds events within specified radius.

**SQL Query:**
```sql
SELECT *, 
  (6371 * acos(cos(radians(?)) * cos(radians(locationX)) * 
   cos(radians(locationY) - radians(?)) + sin(radians(?)) * 
   sin(radians(locationX)))) AS distance 
FROM events 
HAVING distance < ? 
ORDER BY distance;
```

## Statistics Services

### StatisticRepository
Manages game statistics and analytics.

**File:** `server/src/service/statistic/statistic.repository.ts`

**Interface:**
```typescript
interface StatisticRepository {
  setGameResult(data: GameData[], token: string): Promise<void>;
  getRecentGames(userToken: string): Promise<RecentGames[]>;
  getMostPopularGames(): Promise<MostPopularGames[]>;
  getBestUsers(): Promise<BestUser[]>;
  getLeaders(appName: string): Promise<Leaders[]>;
  getUserStatistics(userToken: string): Promise<UserStatistics>;
  getGameStatistics(appName: string): Promise<GameStatistics>;
}
```

**Implementation:** `server/src/service/statistic/statistic.repository.implementation.ts`

**Key Methods:**

#### setGameResult(data, token)
Records game results for statistics.

**Parameters:**
```typescript
interface GameData {
  userToken: string;
  playedTime: number;
  scores: number;
  resultStatus: ResultStatus;
  participationStatus: ParticipationStatus;
}
```

**Process:**
1. Validates user token
2. Validates game data
3. Inserts statistics record
4. Updates user rankings
5. Updates game popularity

#### getRecentGames(userToken)
Gets user's recent game history.

**SQL Query:**
```sql
SELECT s.*, g.appName as game 
FROM statistics s 
JOIN games g ON s.gameId = g.id 
WHERE s.userToken = ? 
ORDER BY s.createdAt DESC 
LIMIT 10;
```

#### getMostPopularGames()
Gets games ranked by popularity.

**SQL Query:**
```sql
SELECT g.appName as game, 
       SUM(s.playedTime) as playedTime,
       COUNT(s.id) as playedInWeek
FROM games g 
LEFT JOIN statistics s ON g.id = s.gameId 
WHERE s.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY g.id, g.appName 
ORDER BY playedTime DESC;
```

#### getBestUsers()
Gets top users by overall performance.

**SQL Query:**
```sql
SELECT userToken, 
       SUM(playedTime) as playedTime,
       AVG(scores) as scores,
       COUNT(*) as gamesPlayed
FROM statistics 
GROUP BY userToken 
ORDER BY scores DESC, playedTime DESC 
LIMIT 10;
```

## User Services

### UserSettingsService
Manages user preferences and settings.

**File:** `server/src/service/user-settings/user-settings.ts`

**Interface:**
```typescript
interface UserSettingsService {
  updateUserSettings(userId: number, settings: UserSettings): Promise<void>;
  getUserSettings(userId: number): Promise<UserSettings>;
  updateLanguage(userId: number, language: string): Promise<void>;
  updateNotifications(userId: number, notifications: NotificationSettings): Promise<void>;
}
```

**Implementation:** `server/src/service/user-settings/user-settings-i.ts`

## Utility Services

### LoggerService
Centralized logging service.

**File:** `server/src/service/logger/logger.service.ts`

**Interface:**
```typescript
interface LoggerService {
  infoLog(message: string, meta?: any): void;
  errorLog(message: string, error?: Error, meta?: any): void;
  warnLog(message: string, meta?: any): void;
  debugLog(message: string, meta?: any): void;
}
```

**Implementation:** `server/src/service/logger/logger.service-implementation.ts`

**Usage:**
```typescript
// In any service
constructor(@inject(LoggerService) private logger: LoggerService) {}

// Logging examples
this.logger.infoLog('User registered successfully', { userId: user.id });
this.logger.errorLog('Database connection failed', error, { query: sqlQuery });
```

### SocketService
Real-time communication service.

**File:** `server/src/service/socket/socket.service.ts`

**Interface:**
```typescript
interface SocketService {
  setSocket(io: SocketIO.Server): void;
  emitToRoom(roomId: string, event: string, data: any): void;
  emitToUser(userId: string, event: string, data: any): void;
  broadcast(event: string, data: any): void;
}
```

**Implementation:** `server/src/service/socket/socket.service.implementation.ts`

**Usage:**
```typescript
// Emit to specific room
socketService.emitToRoom('game-room-123', 'playerJoined', { player: userData });

// Emit to specific user
socketService.emitToUser('user-token', 'gameUpdate', { gameState: newState });

// Broadcast to all connected clients
socketService.broadcast('serverMaintenance', { message: 'Server restarting in 5 minutes' });
```

### MailerService
Email service for notifications.

**File:** `server/src/service/mailer/mailer.service.ts`

**Interface:**
```typescript
interface MailerService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
  sendEventNotificationEmail(email: string, event: Event): Promise<void>;
  sendGameInviteEmail(email: string, game: GameModel, inviter: string): Promise<void>;
}
```

### TimerService
Game timing and countdown service.

**File:** `server/src/service/timer/timer.service.ts`

**Interface:**
```typescript
interface TimerService {
  startCountdown(duration: number, callback: () => void): string;
  stopCountdown(timerId: string): void;
  getRemainingTime(timerId: string): number;
  pauseTimer(timerId: string): void;
  resumeTimer(timerId: string): void;
}
```

## Database Models

### User Model
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
  createdAt: Date;
  updatedAt: Date;
}
```

### Game Model
```typescript
interface GameModel {
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
  appToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Event Model
```typescript
interface Event {
  id: number;
  userId: number;
  title: string;
  description: string;
  city: string;
  place: string;
  address: string;
  locationX: string;
  locationY: string;
  begginingInTime: string;
  begginingDate: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Statistics Model
```typescript
interface Statistics {
  id: number;
  userToken: string;
  gameId: number;
  playedTime: number;
  scores: number;
  resultStatus: ResultStatus;
  participationStatus: ParticipationStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

### Error Types
```typescript
// Technical errors (500+)
interface TechnicalError {
  code: number;
  msg: string;
  stack?: string;
}

// Logic errors (400-499)
interface LogicError {
  code: number;
  msg: string;
  field?: string;
}

// Validation errors
interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

### Error Service
**File:** `server/src/service/error/error.service.ts`

**Interface:**
```typescript
interface ErrorService {
  createTechnicalError(code: number, message: string, stack?: string): TechnicalError;
  createLogicError(code: number, message: string, field?: string): LogicError;
  createValidationError(field: string, message: string, value?: any): ValidationError;
  handleDatabaseError(error: Error): TechnicalError;
  handleValidationError(errors: ValidationError[]): LogicError;
}
```

**Usage in Services:**
```typescript
try {
  const result = await this.databaseOperation();
  return result;
} catch (error) {
  if (error.name === 'SequelizeValidationError') {
    throw this.errorService.createValidationError('field', 'Invalid value');
  }
  throw this.errorService.handleDatabaseError(error);
}
```

## Dependency Injection

### Service Registration
All services are registered in the Inversify container:

```typescript
// Repository layer
CONTAINER.bind<GamesRepository>(GamesRepository).to(GamesRepositoryImplementation);
CONTAINER.bind<EventsRepository>(EventsRepository).to(EventsRepositoryImplementation);
CONTAINER.bind<StatisticRepository>(StatisticRepository).to(StatisticRepositoryImplementation);

// Service layer
CONTAINER.bind<LoggerService>(LoggerService).to(LoggerServiceImplementation);
CONTAINER.bind<SocketService>(SocketService).to(SocketServiceImplementation);
CONTAINER.bind<MailerService>(MailerService).to(MailerServiceImplementation);

// Utility services
CONTAINER.bind<ErrorService>(ErrorService).to(ErrorServiceImplementation);
CONTAINER.bind<TimerService>(TimerService).to(TimerServiceImplementation);
```

### Service Injection
Services are injected into controllers and other services:

```typescript
@controller('/api/games')
export class GameController {
  constructor(
    @inject(GamesRepository) private gameRepository: GamesRepository,
    @inject(LoggerService) private logger: LoggerService,
    @inject(ErrorService) private errorService: ErrorService
  ) {}
}
```

## API Service Implementation

### ApiService
Central service for external API calls.

**File:** `server/src/service/api/api.service.ts`

**Interface:**
```typescript
interface ApiService {
  get<T>(url: string, headers?: any): Promise<T>;
  post<T, R>(url: string, data: T, headers?: any): Promise<R>;
  put<T, R>(url: string, data: T, headers?: any): Promise<R>;
  delete<T>(url: string, headers?: any): Promise<T>;
}
```

**Implementation:** `server/src/service/api/api.service.implementation.ts`

**Usage:**
```typescript
// External API call
const response = await this.apiService.get<ExternalData>('https://api.example.com/data', {
  'Authorization': 'Bearer token',
  'Content-Type': 'application/json'
});
```

## Room Service

### RoomService
Manages game rooms and player matching.

**File:** `server/src/service/room/room.service.ts`

**Interface:**
```typescript
interface RoomService {
  createRoom(gameId: number, maxPlayers: number): Promise<Room>;
  joinRoom(roomId: string, userToken: string): Promise<boolean>;
  leaveRoom(roomId: string, userToken: string): Promise<boolean>;
  getRoom(roomId: string): Promise<Room>;
  getAvailableRooms(gameId: number): Promise<Room[]>;
  startGame(roomId: string): Promise<void>;
  endGame(roomId: string, results: GameResult[]): Promise<void>;
}
```

**Room Model:**
```typescript
interface Room {
  id: string;
  gameId: number;
  maxPlayers: number;
  players: string[];
  status: RoomStatus;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}
```

This comprehensive documentation covers all backend services, their interfaces, implementations, and usage patterns. Each service follows the repository pattern and integrates with the dependency injection container for maintainable and testable code.