## Base URL
- http://localhost:3030

## Authentication
- Some endpoints require JWT via Authorization header: `Bearer <token>`

## Users
- POST /api/users/register
  - Body: { name, email, password, password2, language }
  - 200: user data; 400/500: errors
- POST /api/users/login
  - Body: { email, password }
  - 200: { success: boolean, token: string }
- POST /api/users/user-language
  - Body: { userEmail, userLanguage }
  - 200 on success
- GET /api/users/get-user-language?email=string
  - 200: language string
- POST /api/users/google-auth
  - Body: { email, name, language, accessToken, imageUrl }
  - 200: { success: boolean, token: string }

## Events
- POST /api/events/add-event
  - Body: Event
- POST /api/events/delete-event
  - Body: { id: number }
- POST /api/events/edit-event
  - Body: Event
- GET /api/events/get-events
  - 200: Event[]
- GET /api/events/get-event?id=number
  - 200: Event

## Games
- GET /api/games/get-games
  - 200: approved games array

## My Games (v1)
- POST /api/v1/my-games/delete-game
  - Body: Game
  - 200: Game[]
- POST /api/v1/my-games/edit-game
  - Body: Game
  - 200: Game[]
- POST /api/v1/my-games/add-game
  - Body: Game (appToken added server-side)
  - 200: Game
- GET /api/v1/my-games/get-games?userId=number
  - 200: Game[]

## Statistic (v1)
- POST /api/v1/statistic/set-game-result
  - Body: GameData[]
  - Headers: Authorization: Bearer <appToken>
  - 200 on success; 400/500 with error codes
- GET /api/v1/statistic/recent-games?userId=string
  - JWT required
  - 200: RecentGames[]
- GET /api/v1/statistic/most-popular-games
  - JWT required
  - 200: MostPopularGames[]
- GET /api/v1/statistic/best-users
  - JWT required
  - 200: BestUser[]
- GET /api/v1/statistic/statistic
  - JWT required
  - 200: MostPopularGames[]
- GET /api/v1/statistic/get-leaders?appName=string
  - 200: Leaders[]

## User Settings (v1)
- POST /api/v1/user-settings/change-password
  - JWT required
  - Body: { oldPassword, newPassword, repeatNewPassword, userId }
  - 200 on success or 400 with validation errors

## Types
- User, UserFieldsToRegister, Game, Event, GameData, ErrorBlock, etc. See `server/models` and `frontend/src/models.ts`.

## Examples
```bash
curl -X POST http://localhost:3030/api/users/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","password":"secret123","password2":"secret123","language":"en"}'
```

```bash
curl -X POST http://localhost:3030/api/v1/statistic/set-game-result \
  -H 'Authorization: Bearer APP_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '[{"userToken":"u1","playedTime":120,"scores":100,"resultStatus":1,"participationStatus":1}]'
```
