## Backend REST API

- Base URL: `http://localhost:3030`
- Content-Type: `application/json` unless stated
- Authentication:
  - JWT bearer required for marked endpoints: `Authorization: Bearer <JWT>` (obtained from /api/users/login)
  - Some endpoints (statistic set-game-result) expect an application token in the Authorization header: `Authorization: Bearer <APP_TOKEN>`
- Errors: Responses may include `{ code: number, msg: string }` according to error catalogs.

### Auth and User

#### POST /api/users/register
- Description: Register a new user
- Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "password2": "secret123",
  "language": "en"
}
```
- 200: Created user object
- 400: Validation errors (array of ErrorBlock)
- 500: Server errors
- Example:
```bash
curl -X POST http://localhost:3030/api/users/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123","password2":"secret123","language":"en"}'
```

#### POST /api/users/login
- Description: Login and obtain JWT token
- Body:
```json
{ "email": "jane@example.com", "password": "secret123" }
```
- 200: `{ "success": true, "token": "Bearer <JWT>" }`
- 400/500: ErrorBlock
- Example:
```bash
curl -X POST http://localhost:3030/api/users/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

#### POST /api/users/user-language
- Description: Set user language
- Body:
```json
{ "userEmail": "jane@example.com", "userLanguage": "en" }
```
- 200: OK
- 400/500: Error

#### GET /api/users/get-user-language?email=<email>
- Description: Get stored user language by email
- Auth: none
- 200: Language string
- 400/500: Error
- Example:
```bash
curl 'http://localhost:3030/api/users/get-user-language?email=jane@example.com'
```

#### POST /api/users/google-auth
- Description: Login via Google and obtain JWT
- Body:
```json
{
  "email": "jane@example.com",
  "name": "Jane Doe",
  "language": "en",
  "accessToken": "<google_access_token>",
  "imageUrl": "https://..."
}
```
- 200: `{ "success": true, "token": "Bearer <JWT>" }`
- 400/500: Error

### Games (catalog)

#### GET /api/games/get-games
- Description: List approved games
- 200: Array of Game
- Example Game shape:
```json
{
  "id": 1,
  "userId": 42,
  "appName": "Chess",
  "description": "Play chess",
  "maxRoomPlayer": 2,
  "maxRooms": 10,
  "requestUrl": "/chess/match",
  "maxWaitingTime": 15,
  "redirectUrl": "/chess",
  "registrationEventName": "onRegister",
  "leaveEventName": "onLeave",
  "updateRoomsInfoEventName": "onRoomsUpdate",
  "notifyCountdown": "onCountdown",
  "approve": true,
  "appToken": "..."
}
```
- Example:
```bash
curl 'http://localhost:3030/api/games/get-games'
```

### My Games (manage own games)
Base: `/api/v1/my-games`

#### POST /api/v1/my-games/add-game
- Description: Add a game; server issues `appToken`
- Body (Game without `appToken`):
```json
{
  "userId": 42,
  "appName": "Chess",
  "description": "Play chess",
  "maxRoomPlayer": 2,
  "maxRooms": 10,
  "requestUrl": "/chess/match",
  "maxWaitingTime": 20,
  "redirectUrl": "/chess",
  "registrationEventName": "onRegister",
  "leaveEventName": "onLeave",
  "updateRoomsInfoEventName": "onRoomsUpdate",
  "notifyCountdown": "onCountdown",
  "approve": true
}
```
- 200: Created Game (with `appToken`)
- 400: Validation errors
- Example:
```bash
curl -X POST http://localhost:3030/api/v1/my-games/add-game \
  -H 'Content-Type: application/json' \
  -d @game.json
```

#### POST /api/v1/my-games/edit-game
- Description: Edit an existing game
- Body: Game with fields to update (include `id`)
- 200: Array of games after update

#### POST /api/v1/my-games/delete-game
- Description: Delete a game
- Body: `{ "id": <number> }` or Game descriptor
- 200: Array of games after delete

#### GET /api/v1/my-games/get-games?userId=<id>
- Description: List games created by a user
- 200: Array of Game

### Statistic
Base: `/api/v1/statistic`

#### POST /api/v1/statistic/set-game-result
- Description: Submit results for one or more games
- Auth: Header `Authorization: Bearer <APP_TOKEN>` (app token, not JWT)
- Body: Array of `GameData`
```json
[
  {
    "userToken": "user-uuid",
    "playedTime": 360,
    "scores": 1200,
    "resultStatus": 1,          // 0 Init, 1 Win, 2 Lose, 3 Draw
    "participationStatus": 1    // 0 Init, 1 Leave, 2 play
  }
]
```
- 200: OK (true/created)
- 400/500: Error
- Example:
```bash
curl -X POST http://localhost:3030/api/v1/statistic/set-game-result \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <APP_TOKEN>' \
  -d '[{"userToken":"u-1","playedTime":360,"scores":1200,"resultStatus":1,"participationStatus":2}]'
```

#### GET /api/v1/statistic/recent-games?userId=<userToken>
- Description: Recent games for a user
- Auth: JWT required
- 200: `RecentGameFromServer[]`
```json
{
  "game": "Chess",
  "playedTime": 360,
  "scores": 1200,
  "result": true
}
```

#### GET /api/v1/statistic/most-popular-games
- Description: Most popular games
- Auth: JWT required
- 200: `PopularGamesFromServer[]`
```json
{ "name": "Chess", "playedTime": 5000, "playedInWeek": 1200 }
```

#### GET /api/v1/statistic/best-users
- Description: Best users
- Auth: JWT required
- 200: `BestUsersFromServer[]`
```json
{ "userToken": "user-uuid", "name": 123, "playedTime": 5000, "scores": 2000 }
```

#### GET /api/v1/statistic/statistic
- Description: Alias of most-popular-games
- Auth: JWT required
- 200: Same as above

#### GET /api/v1/statistic/get-leaders?appName=<name>
- Description: Top 10 leaders for a game
- 200: `Leaders[]`
```json
{ "userToken": "user-uuid", "name": 123, "scores": 2000 }
```

### Events
Base: `/api/events`

#### POST /api/events/add-event
- Body: `Event`
```json
{
  "title": "Tournament",
  "description": "Weekly event",
  "city": "NYC",
  "place": "Main Hall",
  "address": "123 St",
  "locationX": "40.7",
  "locationY": "-73.9",
  "begginingInTime": "18:00",
  "begginingDate": "2025-10-01"
}
```
- 200: OK

#### POST /api/events/delete-event
- Body: `{ "id": 123 }`
- 200: OK

#### POST /api/events/edit-event
- Body: `Event`
- 200: OK

#### GET /api/events/get-events
- 200: `Event[]`

#### GET /api/events/get-event?id=<id>
- 200: `Event`

### Restore Password

#### POST /api/restore-password/send-mail
- Description: Send password reset email if user exists
- Body: `{ "userEmail": "jane@example.com" }`
- 200: OK, 400/500: Error

### User Settings
Base: `/api/v1`

#### POST /api/v1/user-settings/change-password
- Description: Change password for an authenticated user
- Auth: JWT required
- Body:
```json
{
  "userId": 42,
  "oldPassword": "oldpass",
  "newPassword": "newpass",
  "repeatNewPassword": "newpass"
}
```
- 200: `true`
- 400: Validation errors

### Error Codes
- Logic errors: see `server/errors/errCodes.ts` (1000–1999)
- Technical errors: see `server/errors/errCodes.ts` (2000+)

### JWT Note
- Obtain JWT via `/api/users/login` and pass it in `Authorization` header for protected endpoints.
