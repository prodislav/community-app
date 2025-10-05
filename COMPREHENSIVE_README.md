# Community Application - Complete Documentation

## 📚 Documentation Overview

This repository contains comprehensive documentation for the Community Application, a full-stack TypeScript gaming platform with real-time features.

### 📋 Documentation Structure

| Document | Description | Target Audience |
|----------|-------------|----------------|
| [**API Documentation**](./API_DOCUMENTATION.md) | Complete reference of all APIs, components, and interfaces | Developers, API consumers |
| [**Usage Guide**](./API_USAGE_GUIDE.md) | Detailed implementation examples and best practices | Developers, integrators |
| [**README**](./README.md) | Quick start and development setup | All users |

## 🚀 Quick Start

### For API Consumers
```bash
# Authentication
POST /api/users/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Get games
GET /api/games/get-games
Authorization: Bearer <token>
```

### For Frontend Developers
```tsx
import { LoginForm, CaGameCard, BarChart } from 'components';

// Use pre-built components
<LoginForm history={history} />
<CaGameCard game={gameData} joinGame={handleJoin} />
```

### For Backend Integration
```typescript
// Service classes with full error handling
const authService = new AuthService();
const gameService = new GameService();
const statsService = new StatisticsService();
```

## 🏗️ Architecture Overview

```
Community Application
├── 🌐 Frontend (React + TypeScript)
│   ├── Components (20+ reusable UI components)
│   ├── Services (API clients, Socket.IO)
│   ├── Store (Redux with effects)
│   └── Utils (Validation, i18n, routing)
│
├── 🔧 Backend (Node.js + Express)
│   ├── Controllers (REST API endpoints)
│   ├── Services (Business logic)
│   ├── Models (Sequelize ORM)
│   └── Socket.IO (Real-time features)
│
└── 🧪 Testing (Java + Cucumber)
    └── Acceptance tests
```

## 📊 Feature Matrix

| Feature | Frontend | Backend | Real-time | Documentation |
|---------|----------|---------|-----------|---------------|
| **Authentication** | ✅ LoginForm, Registration | ✅ JWT, OAuth | ➖ | ✅ Complete |
| **Game Management** | ✅ GameCard, Tables | ✅ CRUD APIs | ✅ Socket rooms | ✅ Complete |
| **Statistics** | ✅ Charts, Tables | ✅ Analytics APIs | ➖ | ✅ Complete |
| **Events** | ✅ Forms, Maps | ✅ CRUD APIs | ➖ | ✅ Complete |
| **Real-time Gaming** | ✅ Socket integration | ✅ Socket.IO server | ✅ Live updates | ✅ Complete |

## 🔑 Key APIs at a Glance

### Authentication APIs
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication  
- `POST /api/users/google-auth` - OAuth integration
- `POST /api/users/user-language` - Language settings

### Game Management APIs
- `GET /api/games/get-games` - List approved games
- Socket events: `joinRoom`, `leaveRoom`, `gameStart`

### Statistics APIs (🔒 Requires Authentication)
- `GET /api/v1/statistic/recent-games` - User's recent games
- `GET /api/v1/statistic/best-users` - Leaderboards
- `GET /api/v1/statistic/most-popular-games` - Game popularity
- `POST /api/v1/statistic/set-game-result` - Submit scores

### Event Management APIs
- `GET /api/events/get-events` - List events
- `POST /api/events/add-event` - Create event
- `POST /api/events/edit-event` - Update event
- `POST /api/events/delete-event` - Remove event

## 🎯 Component Catalog

### 🔐 Authentication Components
```tsx
<LoginForm />           // Full login with validation
<RegistrationForm />    // User registration
<SocialNetworksBlock /> // OAuth integration
<ProtectedRoute />      // Route protection
```

### 🎮 Gaming Components  
```tsx
<CaGameCard />         // Game display card
<Countdown />          // Game countdown timer
<StatisticTables />    // Game statistics
<YandexMap />          // Location integration
```

### 📊 Data Visualization
```tsx
<BarChart />           // D3.js bar charts
<CircleDiagram />      // Pie/progress charts
<ChartContainer />     // Chart wrapper
```

### 🎨 UI Components (Material-UI Enhanced)
```tsx
<CaButton />           // Styled buttons
<CaTable />            // Enhanced tables
<CaDialog />           // Modal dialogs
<CaSelect />           // Dropdown selects
<CaSnackbar />         // Notifications
<CaTabs />             // Tab navigation
```

## 🛠️ Development Workflow

### 1. Environment Setup
```bash
# Install all dependencies
npm run install

# Start development servers (frontend + backend)
npm run start

# Build for production
npm run build
```

### 2. Database Setup
- MySQL Server with `community-app` schema
- Configure connection in `server/src/config/`

### 3. Configuration Files
```
frontend/src/config.json     # Frontend API endpoints
server/src/config/           # Database and app settings
```

## 🔍 Code Examples

### Authentication Flow
```typescript
// Complete authentication with error handling
const authService = new AuthService();

try {
  const token = await authService.login({
    email: 'user@example.com',
    password: 'securePassword123'
  });
  
  if (token) {
    // Authentication successful
    localStorage.setItem('authToken', token);
    redirect('/dashboard');
  }
} catch (error) {
  console.error('Login failed:', error);
}
```

### Real-time Game Integration
```typescript
// Socket.IO integration for real-time gaming
const socket = io('ws://localhost:3001');

// Join game room
socket.emit('joinRoom', { gameId: 'chess', userId: 'player1' });

// Listen for game events
socket.on('gameStart', (data) => {
  console.log('Game started!', data);
});

socket.on('playerJoined', (player) => {
  console.log('Player joined:', player.name);
});
```

### Component Usage
```tsx
// Using custom components with full TypeScript support
import { CaGameCard, BarChart } from 'components';

const Dashboard = () => {
  const handleJoinGame = (appName: string) => {
    // Game joining logic
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
        diagramData={weeklyStats}
        config={chartConfig}
      />
    </div>
  );
};
```

## 📈 Performance & Scalability

### Optimization Features
- **Caching**: Request caching with TTL
- **Debouncing**: Search request optimization
- **Error Recovery**: Automatic retry with exponential backoff
- **Real-time**: Efficient Socket.IO connection management
- **Code Splitting**: Lazy-loaded components

### Production Considerations
- HTTPS enforcement
- JWT token validation
- Rate limiting (429 responses)
- Error logging and monitoring
- Database connection pooling

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing  
```bash
cd server
npm test
```

### E2E Testing
```bash
cd acceptance_tests
mvn test
```

## 🤝 Contributing

### Code Standards
- TypeScript strict mode
- ESLint + TSLint compliance
- Material-UI theming
- Redux pattern for state management
- Socket.IO for real-time features

### Documentation Updates
When adding new features, update:
1. `API_DOCUMENTATION.md` - API reference
2. `API_USAGE_GUIDE.md` - Implementation examples
3. `README.md` - Quick reference

## 📞 Support & Resources

### Getting Help
1. Check the [API Documentation](./API_DOCUMENTATION.md) for complete API reference
2. Review the [Usage Guide](./API_USAGE_GUIDE.md) for implementation examples
3. Examine the source code for detailed implementations

### Common Issues

**Authentication Problems**
- Verify JWT token format and expiration
- Check CORS settings for cross-origin requests
- Ensure proper Authorization header format: `Bearer <token>`

**Socket Connection Issues**  
- Verify WebSocket support in your environment
- Check server URL and port configuration
- Monitor connection events for debugging

**Component Styling**
- Import Material-UI theme provider
- Use provided CSS classes and SCSS files
- Follow the established design system

---

## 📋 Quick Reference Tables

### HTTP Status Codes
| Code | Meaning | Action |
|------|---------|---------|
| 200 | Success | Continue |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Refresh authentication |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify endpoint URL |
| 429 | Rate Limited | Implement retry logic |
| 500 | Server Error | Retry or contact support |

### Socket.IO Events
| Event | Direction | Purpose |
|-------|-----------|---------|
| `joinRoom` | Client → Server | Join game room |
| `leaveRoom` | Client → Server | Leave game room |
| `roomUpdate` | Server → Client | Room status change |
| `gameStart` | Server → Client | Game beginning |
| `playerJoined` | Server → Client | New player in room |
| `playerLeft` | Server → Client | Player left room |

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ | Environment (development/production) |
| `DATABASE_URL` | ✅ | MySQL connection string |
| `JWT_SECRET` | ✅ | JWT signing key |
| `SENDGRID_API_KEY` | ❌ | Email service key |

---

*For detailed implementation guides and complete API reference, see the linked documentation files above.*