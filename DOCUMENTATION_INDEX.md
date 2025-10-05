# Community App - Complete Documentation Index

## 📚 Documentation Overview

This repository contains comprehensive documentation for the Community App, a full-stack gaming community platform built with React, Node.js, and TypeScript. The documentation is organized into multiple specialized guides to provide detailed information for developers, API consumers, and contributors.

## 🗂️ Documentation Structure

### 1. [API Documentation](./API_DOCUMENTATION.md)
**Main API Reference** - Complete overview of all public APIs, functions, and components
- Project overview and architecture
- Backend API endpoints with examples
- Frontend components documentation
- Data models and interfaces
- Authentication and authorization
- Error handling patterns
- Complete usage examples

### 2. [Component Documentation](./COMPONENT_DOCUMENTATION.md)
**Frontend Components Guide** - Detailed documentation of all React components
- UI Components (buttons, spinners, logos)
- Form Components (login, registration, password change)
- Chart Components (bar charts, pie charts, diagrams)
- Layout Components (menus, navigation, containers)
- Game Components (game cards, countdowns, forms)
- Utility Components (protected routes, tables, social auth)
- Styling and internationalization
- State management integration
- Performance considerations

### 3. [Backend Services Documentation](./BACKEND_SERVICES_DOCUMENTATION.md)
**Server-Side Services Guide** - Comprehensive backend service documentation
- Service architecture and dependency injection
- Authentication services (user registration, login, OAuth)
- Game services (CRUD operations, approval workflow)
- Event services (event management, location-based queries)
- Statistics services (analytics, leaderboards, reporting)
- User services (profile management, settings)
- Utility services (logging, sockets, email, timers)
- Database models and relationships
- Error handling and validation
- Service registration and injection patterns

### 4. [API Reference](./API_REFERENCE.md)
**Quick API Reference** - Fast lookup guide for API endpoints
- Authentication API endpoints
- Games API endpoints
- Events API endpoints
- Statistics API endpoints
- User Management API endpoints
- HTTP status codes and error responses
- Rate limiting information
- WebSocket events and real-time communication
- SDK examples and integration code

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 14+ 
- MySQL 8.0+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd community-app

# Install dependencies
npm install

# Start development servers
npm start
```

### Environment Setup
1. Configure database connection in `server/config/`
2. Set up environment variables
3. Run database migrations
4. Start frontend and backend servers

## 🏗️ Architecture Overview

### Frontend (React + TypeScript)
- **Framework**: React 16.4.2 with TypeScript
- **UI Library**: Material-UI components
- **State Management**: Redux with Redux-Observable
- **Routing**: React Router DOM
- **Charts**: D3.js and ECharts
- **Internationalization**: react-i18next
- **Real-time**: Socket.IO client

### Backend (Node.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **Dependency Injection**: InversifyJS
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.IO server
- **Validation**: Custom validation middleware
- **Logging**: Winston logger

### Database Schema
- **Users**: Authentication and profile data
- **Games**: Game configurations and metadata
- **Events**: Community events and locations
- **Statistics**: Game results and analytics
- **Roles**: User role management

## 📋 API Endpoints Summary

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/google-auth` - Google OAuth
- `POST /api/users/user-language` - Update language
- `GET /api/users/get-user-language` - Get language

### Games
- `GET /api/games/get-games` - List approved games

### Events
- `POST /api/events/add-event` - Create event
- `GET /api/events/get-events` - List events
- `GET /api/events/get-event` - Get specific event
- `POST /api/events/edit-event` - Update event
- `POST /api/events/delete-event` - Delete event

### Statistics
- `POST /api/v1/statistic/set-game-result` - Submit game results
- `GET /api/v1/statistic/recent-games` - User's recent games
- `GET /api/v1/statistic/most-popular-games` - Popular games
- `GET /api/v1/statistic/best-users` - Top users
- `GET /api/v1/statistic/get-leaders` - Game leaders

## 🧩 Component Library

### Core Components
- **GameCard**: Game display with join/leave functionality
- **LoginForm**: Authentication with validation
- **RegistrationForm**: User registration
- **Countdown**: Timer component for games
- **BarChart**: D3.js bar chart
- **CircleDiagram**: D3.js pie chart
- **StatisticTables**: Data tables with sorting

### UI Components
- **CaButton**: Custom button component
- **Spinner**: Loading indicator
- **Logo**: Application logo
- **AppMenu**: Navigation menu
- **Navbar**: Top navigation bar

### Utility Components
- **ProtectedRoute**: Authentication guard
- **SocialNetworksBlock**: Social auth buttons
- **VkDialog**: VK authentication
- **YandexMap**: Map integration

## 🔧 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint and TSLint configuration
- Prettier for code formatting
- Consistent naming conventions

### Testing
- Jest for unit testing
- React Testing Library for component tests
- Supertest for API testing
- Coverage reporting

### Performance
- React.memo for expensive components
- Lazy loading for large components
- Bundle splitting and optimization
- Image optimization

## 📖 Usage Examples

### Basic Authentication Flow
```typescript
// Register user
const user = await api.register({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'password123',
  password2: 'password123',
  language: 'en'
});

// Login
const auth = await api.login({
  email: 'user@example.com',
  password: 'password123'
});

// Use authenticated endpoints
const games = await api.getGames();
```

### Component Usage
```tsx
// Game card component
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

// Login form
<LoginForm
  history={history}
  status={authStatus}
  errors={errors}
  spinnerRun={isLoading}
  loginUser={handleLogin}
  socialNetworksLogin={handleSocialLogin}
/>
```

### WebSocket Integration
```typescript
// Connect to socket
const socket = io('http://localhost:3000', {
  auth: { token: 'jwt-token' }
});

// Join game
socket.emit('joinGame', { gameId: 1, userToken: 'user-token' });

// Listen for updates
socket.on('updateRoomsInfo', (data) => {
  console.log('Room updated:', data);
});
```

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Check MySQL service and credentials
2. **CORS Errors**: Verify frontend/backend URL configuration
3. **Authentication**: Ensure JWT tokens are properly formatted
4. **Socket Connection**: Check WebSocket server status

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` and check console output for detailed error information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Check existing documentation
- Review code examples in the guides

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Community App Team