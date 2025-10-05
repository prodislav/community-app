# API Reference Guide

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Games API](#games-api)
3. [Events API](#events-api)
4. [Statistics API](#statistics-api)
5. [User Management API](#user-management-api)
6. [Error Codes](#error-codes)
7. [Rate Limiting](#rate-limiting)
8. [WebSocket Events](#websocket-events)

## Authentication API

### Base URL
```
http://localhost:3000/api/users
```

### POST /register
Register a new user account.

**Request:**
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "password2": "password123",
  "language": "en"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "language": "en"
  }
}
```

**Response (400):**
```json
{
  "email": "Email is required",
  "password": "Password must be at least 6 characters",
  "name": "Name is required"
}
```

### POST /login
Authenticate user credentials.

**Request:**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401):**
```json
{
  "code": 401,
  "msg": "Invalid credentials"
}
```

### POST /google-auth
Authenticate via Google OAuth.

**Request:**
```http
POST /api/users/google-auth
Content-Type: application/json

{
  "email": "user@gmail.com",
  "name": "John Doe",
  "language": "en",
  "accessToken": "google-access-token",
  "imageUrl": "https://lh3.googleusercontent.com/..."
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /user-language
Update user's language preference.

**Request:**
```http
POST /api/users/user-language
Content-Type: application/json

{
  "userEmail": "user@example.com",
  "userLanguage": "ru"
}
```

**Response (200):**
```
OK
```

### GET /get-user-language
Get user's current language setting.

**Request:**
```http
GET /api/users/get-user-language?email=user@example.com
```

**Response (200):**
```
"en"
```

## Games API

### Base URL
```
http://localhost:3000/api/games
```

### GET /get-games
Retrieve all approved games.

**Request:**
```http
GET /api/games/get-games
```

**Response (200):**
```json
[
  {
    "id": 1,
    "appName": "Space Battle",
    "description": "Epic space combat game",
    "maxRoomPlayer": 4,
    "maxRooms": 10,
    "requestUrl": "https://space-battle.example.com",
    "maxWaitingTime": 300,
    "redirectUrl": "https://space-battle.example.com/redirect",
    "registrationEventName": "joinSpaceBattle",
    "leaveEventName": "leaveSpaceBattle",
    "updateRoomsInfoEventName": "updateSpaceBattleRooms",
    "notifyCountdown": "spaceBattleCountdown",
    "approve": true,
    "createAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Events API

### Base URL
```
http://localhost:3000/api/events
```

### POST /add-event
Create a new event.

**Request:**
```http
POST /api/events/add-event
Content-Type: application/json

{
  "title": "Gaming Tournament",
  "description": "Monthly gaming tournament",
  "city": "New York",
  "place": "Convention Center",
  "address": "123 Main St, New York, NY",
  "locationX": "40.7128",
  "locationY": "-74.0060",
  "begginingInTime": "18:00",
  "begginingDate": "2024-01-15"
}
```

**Response (200):**
```
OK
```

### GET /get-events
Retrieve all events.

**Request:**
```http
GET /api/events/get-events
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Gaming Tournament",
    "description": "Monthly gaming tournament",
    "city": "New York",
    "place": "Convention Center",
    "address": "123 Main St, New York, NY",
    "locationX": "40.7128",
    "locationY": "-74.0060",
    "begginingInTime": "18:00",
    "begginingDate": "2024-01-15",
    "createAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /get-event
Retrieve a specific event.

**Request:**
```http
GET /api/events/get-event?id=1
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Gaming Tournament",
  "description": "Monthly gaming tournament",
  "city": "New York",
  "place": "Convention Center",
  "address": "123 Main St, New York, NY",
  "locationX": "40.7128",
  "locationY": "-74.0060",
  "begginingInTime": "18:00",
  "begginingDate": "2024-01-15",
  "createAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /edit-event
Update an existing event.

**Request:**
```http
POST /api/events/edit-event
Content-Type: application/json

{
  "id": 1,
  "title": "Updated Gaming Tournament",
  "description": "Updated monthly gaming tournament",
  "city": "New York",
  "place": "Convention Center",
  "address": "123 Main St, New York, NY",
  "locationX": "40.7128",
  "locationY": "-74.0060",
  "begginingInTime": "19:00",
  "begginingDate": "2024-01-15"
}
```

**Response (200):**
```
OK
```

### POST /delete-event
Delete an event.

**Request:**
```http
POST /api/events/delete-event
Content-Type: application/json

{
  "id": 1
}
```

**Response (200):**
```
OK
```

## Statistics API

### Base URL
```
http://localhost:3000/api/v1/statistic
```

### POST /set-game-result
Submit game results for statistics.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request:**
```http
POST /api/v1/statistic/set-game-result
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

[
  {
    "userToken": "user-token-123",
    "playedTime": 300,
    "scores": 1500,
    "resultStatus": 1,
    "participationStatus": 1
  }
]
```

**Response (200):**
```
OK
```

### GET /recent-games
Get user's recent games.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
GET /api/v1/statistic/recent-games?userId=user-token-123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
[
  {
    "game": "Space Battle",
    "scores": 1500,
    "result": 1,
    "playedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

### GET /most-popular-games
Get most popular games statistics.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
GET /api/v1/statistic/most-popular-games
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
[
  {
    "game": "Space Battle",
    "playedTime": 12000,
    "playedInWeek": 45
  },
  {
    "game": "Racing Game",
    "playedTime": 8500,
    "playedInWeek": 32
  }
]
```

### GET /best-users
Get best users statistics.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
GET /api/v1/statistic/best-users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
[
  {
    "userToken": "user-token-123",
    "playedTime": 5000,
    "name": "John Doe",
    "scores": 2500
  },
  {
    "userToken": "user-token-456",
    "playedTime": 4500,
    "name": "Jane Smith",
    "scores": 2200
  }
]
```

### GET /get-leaders
Get top 10 leaders for a specific game.

**Request:**
```http
GET /api/v1/statistic/get-leaders?appName=Space Battle
```

**Response (200):**
```json
[
  {
    "userToken": "user-token-123",
    "name": "John Doe",
    "scores": 2500
  },
  {
    "userToken": "user-token-456",
    "name": "Jane Smith",
    "scores": 2200
  }
]
```

## User Management API

### Base URL
```
http://localhost:3000/api/user-settings
```

### GET /profile
Get user profile information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request:**
```http
GET /api/user-settings/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "language": "en",
  "imageUrl": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /profile
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request:**
```http
PUT /api/user-settings/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Updated",
  "language": "ru"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### POST /change-password
Change user password.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request:**
```http
POST /api/user-settings/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Error Codes

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Application Error Codes
- `1000-1999` - Validation errors
- `2000-2999` - Technical errors
- `3000-3999` - Business logic errors
- `4000-4999` - Authentication errors
- `5000-5999` - Authorization errors

### Common Error Responses

#### Validation Error (400)
```json
{
  "code": 1001,
  "msg": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

#### Authentication Error (401)
```json
{
  "code": 4001,
  "msg": "Invalid or expired token"
}
```

#### Not Found Error (404)
```json
{
  "code": 3001,
  "msg": "Resource not found"
}
```

#### Server Error (500)
```json
{
  "code": 2001,
  "msg": "Internal server error",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Rate Limiting

### Limits
- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per IP
- **Statistics endpoints**: 50 requests per minute per user

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded (429)
```json
{
  "code": 4002,
  "msg": "Rate limit exceeded",
  "retryAfter": 60
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'jwt-token'
  }
});
```

### Game Events

#### joinGame
Join a game room.

**Emit:**
```javascript
socket.emit('joinGame', {
  gameId: 1,
  userToken: 'user-token-123'
});
```

**Listen:**
```javascript
socket.on('gameJoined', (data) => {
  console.log('Joined game:', data);
});
```

#### leaveGame
Leave a game room.

**Emit:**
```javascript
socket.emit('leaveGame', {
  gameId: 1,
  userToken: 'user-token-123'
});
```

#### updateRoomsInfo
Receive room information updates.

**Listen:**
```javascript
socket.on('updateRoomsInfo', (data) => {
  console.log('Room info updated:', data);
  // data: { gameId: 1, playersCount: 3, maxPlayers: 4, status: 'waiting' }
});
```

#### gameCountdown
Receive countdown updates.

**Listen:**
```javascript
socket.on('gameCountdown', (data) => {
  console.log('Countdown:', data.timeLeft);
  // data: { gameId: 1, timeLeft: 30 }
});
```

#### gameStarted
Game has started.

**Listen:**
```javascript
socket.on('gameStarted', (data) => {
  console.log('Game started:', data);
  // data: { gameId: 1, players: [...] }
});
```

#### gameEnded
Game has ended.

**Listen:**
```javascript
socket.on('gameEnded', (data) => {
  console.log('Game ended:', data);
  // data: { gameId: 1, results: [...] }
});
```

### Event Events

#### eventCreated
New event has been created.

**Listen:**
```javascript
socket.on('eventCreated', (event) => {
  console.log('New event:', event);
});
```

#### eventUpdated
Event has been updated.

**Listen:**
```javascript
socket.on('eventUpdated', (event) => {
  console.log('Event updated:', event);
});
```

#### eventDeleted
Event has been deleted.

**Listen:**
```javascript
socket.on('eventDeleted', (eventId) => {
  console.log('Event deleted:', eventId);
});
```

### Error Events

#### error
General error event.

**Listen:**
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

#### connectionError
Connection error.

**Listen:**
```javascript
socket.on('connectionError', (error) => {
  console.error('Connection error:', error);
});
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class CommunityAppAPI {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async register(userData: UserFieldsToRegister) {
    return this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: UserFieldsToLogin) {
    const response = await this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Games
  async getGames() {
    return this.request<GameModel[]>('/games/get-games');
  }

  // Events
  async getEvents() {
    return this.request<Event[]>('/events/get-events');
  }

  async addEvent(event: Event) {
    return this.request('/events/add-event', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  // Statistics
  async setGameResult(data: GameData[]) {
    return this.request('/v1/statistic/set-game-result', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRecentGames(userToken: string) {
    return this.request<RecentGames[]>(`/v1/statistic/recent-games?userId=${userToken}`);
  }
}

// Usage
const api = new CommunityAppAPI();

// Register and login
await api.register({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'password123',
  password2: 'password123',
  language: 'en'
});

// Use authenticated endpoints
const games = await api.getGames();
const events = await api.getEvents();
```

This comprehensive API reference provides all the information needed to integrate with the Community App backend services.