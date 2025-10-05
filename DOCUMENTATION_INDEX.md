# Documentation Index

## Overview

This documentation provides comprehensive coverage of all public APIs, functions, and components in the Community Application. The documentation is organized into multiple guides to make it easier to find the information you need.

---

## Documentation Files

### 1. [API Documentation](./API_DOCUMENTATION.md)
**Complete REST API reference with examples**

Covers:
- Server-side REST API endpoints
- Request/response formats
- Authentication and authorization
- Server-side services and business logic
- WebSocket communication
- Data models and interfaces
- Error handling
- Best practices

**Use this when:**
- Integrating with the backend API
- Understanding API endpoints and parameters
- Learning about data models
- Implementing authentication
- Working with WebSocket events

---

### 2. [Components Guide](./COMPONENTS_GUIDE.md)
**Frontend React components documentation**

Covers:
- Component architecture
- Form components (LoginForm, RegistrationForm, GameForm, etc.)
- UI components (Buttons, Dialogs, Snackbars, Tables, etc.)
- Data display components (GameCard, Charts, Statistics, etc.)
- Navigation components
- Utility components
- Props and state interfaces
- Usage examples
- Accessibility guidelines

**Use this when:**
- Building new UI components
- Understanding component props and interfaces
- Implementing forms
- Working with Material-UI components
- Styling components

---

### 3. [Redux Store Guide](./REDUX_STORE_GUIDE.md)
**Redux state management architecture**

Covers:
- Store structure and modules
- Actions and action creators
- Reducers and state updates
- Epics (side effects) with Redux-Observable
- Usage patterns (hooks, connect)
- Async operations handling
- State selectors
- Testing Redux code
- Best practices

**Use this when:**
- Managing application state
- Creating new Redux modules
- Handling async operations
- Connecting components to Redux
- Understanding data flow
- Writing tests for state management

---

### 4. [Developer Guide](./DEVELOPER_GUIDE.md)
**Quick start guide for developers**

Covers:
- Getting started and initial setup
- Project structure
- Development workflow
- Common tasks (adding endpoints, components, models)
- Code examples
- Troubleshooting common issues
- Testing strategies
- Deployment process
- Code style guidelines

**Use this when:**
- Setting up the development environment
- Learning the project structure
- Following development workflows
- Solving common problems
- Preparing for deployment

---

## Quick Navigation

### By Role

#### **Frontend Developers**
1. Start with: [Developer Guide](./DEVELOPER_GUIDE.md) - Setup and structure
2. Then read: [Components Guide](./COMPONENTS_GUIDE.md) - UI components
3. Reference: [Redux Store Guide](./REDUX_STORE_GUIDE.md) - State management
4. API calls: [API Documentation](./API_DOCUMENTATION.md) - REST endpoints

#### **Backend Developers**
1. Start with: [Developer Guide](./DEVELOPER_GUIDE.md) - Setup and structure
2. Then read: [API Documentation](./API_DOCUMENTATION.md) - REST API and services
3. Reference: [API Documentation](./API_DOCUMENTATION.md) - Data models and interfaces

#### **Full-Stack Developers**
1. Start with: [Developer Guide](./DEVELOPER_GUIDE.md) - Complete setup
2. Then read: [API Documentation](./API_DOCUMENTATION.md) - Backend APIs
3. Follow with: [Components Guide](./COMPONENTS_GUIDE.md) - Frontend components
4. Reference: [Redux Store Guide](./REDUX_STORE_GUIDE.md) - State management

#### **New Contributors**
1. Start with: [Developer Guide](./DEVELOPER_GUIDE.md) - Complete introduction
2. Read all other guides to understand the full architecture

---

## Quick Reference

### Technology Stack

**Backend:**
- Node.js + Express
- TypeScript
- Inversify (IoC container)
- Sequelize (ORM)
- MySQL
- Passport.js (Authentication)
- Socket.io (WebSocket)

**Frontend:**
- React 16
- TypeScript
- Redux + Redux-Observable
- Material-UI
- Socket.io Client
- i18next (Internationalization)
- D3.js & ECharts (Visualization)

---

## Common Use Cases

### User Authentication

**Backend:**
```typescript
// See: API_DOCUMENTATION.md > User Authentication API
POST /api/users/register
POST /api/users/login
POST /api/users/google-auth
```

**Frontend:**
```typescript
// See: COMPONENTS_GUIDE.md > LoginForm Component
// See: REDUX_STORE_GUIDE.md > Auth Module
import { LoginUser } from 'store/auth';
dispatch(new LoginUser({ email, password }));
```

---

### Creating a Game

**Backend:**
```typescript
// See: API_DOCUMENTATION.md > My Games API
POST /api/v1/my-games/add-game
```

**Frontend:**
```typescript
// See: COMPONENTS_GUIDE.md > GameForm Component
// See: REDUX_STORE_GUIDE.md > My Games Module
import { AddGame } from 'store/my-games';
dispatch(new AddGame(gameData));
```

---

### Displaying Statistics

**Backend:**
```typescript
// See: API_DOCUMENTATION.md > Statistics API
GET /api/v1/statistic/best-users
GET /api/v1/statistic/most-popular-games
```

**Frontend:**
```typescript
// See: COMPONENTS_GUIDE.md > StatisticTables Component
// See: REDUX_STORE_GUIDE.md > Statistics Module
import { GetBestUsers } from 'store/statistic';
dispatch(new GetBestUsers());
```

---

### Real-time Communication

**Backend:**
```typescript
// See: API_DOCUMENTATION.md > WebSocket Communication
socketService.notifyAllClients('event-name', data);
```

**Frontend:**
```typescript
// See: REDUX_STORE_GUIDE.md > Socket Module
import { OpenSocket, EmitEvent } from 'store/socket';
dispatch(new OpenSocket());
dispatch(new EmitEvent('join-game', { gameId, userId }));
```

---

## API Endpoints Summary

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | User login |
| POST | `/api/users/google-auth` | Google OAuth login |
| POST | `/api/users/user-language` | Set user language |
| GET | `/api/users/get-user-language` | Get user language |
| GET | `/api/games/get-games` | Get all approved games |
| GET | `/api/events/get-events` | Get all events |
| GET | `/api/events/get-event` | Get specific event |
| POST | `/api/events/add-event` | Add new event |
| POST | `/api/events/edit-event` | Edit event |
| POST | `/api/events/delete-event` | Delete event |
| GET | `/api/v1/statistic/get-leaders` | Get game leaderboard |
| POST | `/api/restore-password/send-mail` | Send password reset email |

### Protected Endpoints (Authentication Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/my-games/get-games` | Get user's games |
| POST | `/api/v1/my-games/add-game` | Create new game |
| POST | `/api/v1/my-games/edit-game` | Edit game |
| POST | `/api/v1/my-games/delete-game` | Delete game |
| POST | `/api/v1/statistic/set-game-result` | Submit game results |
| GET | `/api/v1/statistic/recent-games` | Get recent games |
| GET | `/api/v1/statistic/most-popular-games` | Get popular games |
| GET | `/api/v1/statistic/best-users` | Get best users |
| POST | `/api/v1/user-settings/change-password` | Change password |

---

## Component Hierarchy

```
App
├── Router
│   ├── LoginPage
│   │   └── LoginForm
│   │       └── SocialNetworksBlock
│   ├── RegistrationPage
│   │   └── RegistrationForm
│   ├── HomePage (Protected)
│   │   ├── Navbar
│   │   ├── GamesList
│   │   │   └── GameCard (multiple)
│   │   └── AppMenu
│   ├── MyGamesPage (Protected)
│   │   ├── MyGamesList
│   │   ├── AddGameComponent
│   │   │   └── GameForm
│   │   └── EditGameComponent
│   │       └── GameForm
│   ├── StatisticsPage (Protected)
│   │   └── StatisticTables
│   │       ├── CaTabs
│   │       └── CaTable (multiple)
│   └── EventsPage
│       ├── EventsList
│       └── YandexMap
└── GlobalComponents
    ├── CaSnackbar
    └── CaSpinner
```

---

## Redux Store Structure

```
AppState
├── auth: AuthState
│   ├── status: AuthStatus
│   ├── user?: FrontEndUser
│   ├── spinnerRun: boolean
│   └── errors: ErrorBlock[]
├── games: GamesState
│   ├── games: Game[]
│   └── loadStatus: LoadStatus
├── myGames: MyGamesState
│   ├── games: GameModel[]
│   ├── isAddDialogOpened: boolean
│   ├── isEditDialogOpened: boolean
│   ├── loadStatus: LoadStatus
│   └── editingGame?: GameModel
├── statistic: StatisticState
│   ├── bestUsers: BestUser[]
│   ├── mostPopularGames: MostPopularGames[]
│   ├── recentGames: RecentGames[]
│   ├── leaders: Leaders[]
│   ├── selectedTab: StatTab
│   └── loadStatus: LoadStatus
├── socket: SocketState
│   ├── status: SocketStatus
│   └── socket?: SocketIOClient.Socket
├── snackbarUi: SnackbarUiState
│   ├── isOpen: boolean
│   ├── type: SnackbarType
│   └── messages: ErrorBlock[]
├── restorePassword: RestorePasswordState
│   └── status: RestorePasswordStatus
├── userSettings: UserSettingsState
│   ├── loadStatus: LoadStatus
│   └── changePasswordStatus: LoadStatus
└── room: RoomState
    ├── rooms: RoomInfo[]
    └── currentRoom?: RoomInfo
```

---

## Development Checklist

### Before Starting Development

- [ ] Read [Developer Guide](./DEVELOPER_GUIDE.md)
- [ ] Set up development environment
- [ ] Configure database
- [ ] Install all dependencies
- [ ] Verify application runs locally

### When Adding New Features

- [ ] Review relevant documentation sections
- [ ] Follow established patterns
- [ ] Write TypeScript interfaces
- [ ] Add proper error handling
- [ ] Include loading states
- [ ] Write tests
- [ ] Update documentation if needed

### Before Committing

- [ ] Run linter
- [ ] Run tests
- [ ] Verify no console errors
- [ ] Check TypeScript compilation
- [ ] Review changed files
- [ ] Write clear commit message

---

## Frequently Asked Questions

### General

**Q: Where do I start as a new developer?**
A: Start with the [Developer Guide](./DEVELOPER_GUIDE.md) for setup, then read the guide relevant to your role (frontend/backend).

**Q: How do I find a specific API endpoint?**
A: Check the [API Documentation](./API_DOCUMENTATION.md) or the API Endpoints Summary table above.

**Q: How do I add a new component?**
A: See [Components Guide](./COMPONENTS_GUIDE.md) and [Developer Guide](./DEVELOPER_GUIDE.md) > Adding a New React Component.

### Authentication

**Q: How does authentication work?**
A: See [API Documentation](./API_DOCUMENTATION.md) > User Authentication API and [Redux Store Guide](./REDUX_STORE_GUIDE.md) > Auth Module.

**Q: How do I make authenticated API calls?**
A: See [Developer Guide](./DEVELOPER_GUIDE.md) > Making an Authenticated API Call.

### State Management

**Q: When should I use Redux?**
A: Use Redux for shared state across multiple components. For local component state, use component state.

**Q: How do I handle async operations?**
A: Use Redux-Observable epics. See [Redux Store Guide](./REDUX_STORE_GUIDE.md) > Epics.

### Styling

**Q: What styling approach should I use?**
A: Use SCSS modules with BEM naming. See [Developer Guide](./DEVELOPER_GUIDE.md) > Code Style Guidelines.

---

## Getting Help

### Documentation Issues

If you find any issues with the documentation:
1. Check if the issue is already known
2. Create a detailed issue report
3. Suggest improvements

### Code Issues

For code-related issues:
1. Review the troubleshooting section in [Developer Guide](./DEVELOPER_GUIDE.md)
2. Check error messages and logs
3. Search existing issues
4. Ask for help with detailed information

---

## Contributing to Documentation

We welcome documentation improvements! When contributing:

1. Keep documentation clear and concise
2. Include code examples
3. Update all relevant sections
4. Maintain consistent formatting
5. Test all code examples

---

## Version History

### Current Version: 0.1.0

**Documentation Created:** 2025-10-05

**Includes:**
- Complete API documentation
- Frontend components guide
- Redux store architecture guide
- Developer quick start guide
- Comprehensive examples and best practices

---

## Related Files

- [README.md](./README.md) - Project overview and build instructions
- [package.json](./package.json) - Root dependencies and scripts
- [server/package.json](./server/package.json) - Server dependencies
- [frontend/package.json](./frontend/package.json) - Frontend dependencies

---

## External Resources

### Official Documentation

- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://react.dev/)
- [Redux](https://redux.js.org/)
- [Redux-Observable](https://redux-observable.js.org/)
- [Material-UI](https://mui.com/)
- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Socket.io](https://socket.io/docs/)

### Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Tutorial](https://react.dev/learn)
- [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview)
- [RxJS Documentation](https://rxjs.dev/)

---

## Summary

This comprehensive documentation suite provides everything you need to work with the Community Application:

1. **API Documentation** - Complete backend API reference
2. **Components Guide** - Frontend component library
3. **Redux Store Guide** - State management patterns
4. **Developer Guide** - Setup and common tasks

Choose the appropriate guide based on your needs, or read them all for complete understanding of the application architecture.

For quick answers, use the Quick Reference sections above.

Happy coding! 🚀
