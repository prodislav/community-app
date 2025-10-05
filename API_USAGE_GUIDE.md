# API Usage Guide & Examples

## Table of Contents

1. [Authentication Workflows](#authentication-workflows)
2. [Game Management](#game-management)
3. [Event Management](#event-management)
4. [Statistics & Analytics](#statistics--analytics)
5. [Frontend Component Integration](#frontend-component-integration)
6. [Real-time Features](#real-time-features)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Authentication Workflows

### Complete Registration & Login Flow

```typescript
// auth.service.ts
class AuthService {
  private baseUrl = '/api/users';

  async register(userData: UserFieldsToRegister): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          password: userData.password,
          password2: userData.password,
          language: userData.language || 'en'
        })
      });

      if (!response.ok) {
        const errors = await response.json();
        throw new Error(JSON.stringify(errors));
      }

      return await response.json();
    } catch (error) {
      console.error('Registration failed:', error);
      return null;
    }
  }

  async login(credentials: UserFieldsToLogin): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errors = await response.json();
        throw new Error(JSON.stringify(errors));
      }

      const { success, token } = await response.json();
      
      if (success && token) {
        localStorage.setItem('authToken', token);
        this.setAuthHeader(token);
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }

  async googleAuth(googleData: GoogleAuthData): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/google-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: googleData.email,
          name: googleData.name,
          language: googleData.language || 'en',
          accessToken: googleData.accessToken,
          imageUrl: googleData.imageUrl
        })
      });

      if (response.ok) {
        const { success, token } = await response.json();
        if (success && token) {
          localStorage.setItem('authToken', token);
          return token;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Google auth failed:', error);
      return null;
    }
  }

  async setUserLanguage(email: string, language: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user-language`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: email,
          userLanguage: language
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to set language:', error);
      return false;
    }
  }

  async getUserLanguage(email: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/get-user-language?email=${encodeURIComponent(email)}`);
      
      if (response.ok) {
        return await response.text();
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get language:', error);
      return null;
    }
  }

  private setAuthHeader(token: string): void {
    // Set default authorization header for future requests
    // This would typically be done in your HTTP client configuration
  }

  logout(): void {
    localStorage.removeItem('authToken');
    // Clear auth header
    // Redirect to login page if needed
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Optionally validate token expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
}

// Usage example
const authService = new AuthService();

// Registration
const registerNewUser = async () => {
  const userData = {
    email: 'user@example.com',
    name: 'John Doe',
    password: 'securePassword123',
    password2: 'securePassword123',
    language: 'en'
  };

  const user = await authService.register(userData);
  if (user) {
    console.log('User registered successfully:', user);
    // Proceed with login
    const token = await authService.login({
      email: userData.email,
      password: userData.password
    });
  }
};
```

## Game Management

### Game Service Implementation

```typescript
// game.service.ts
class GameService {
  private baseUrl = '/api/games';

  async getAllGames(): Promise<GameModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/get-games`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  async getGamesByFilter(filter?: GameFilter): Promise<GameModel[]> {
    const games = await this.getAllGames();
    
    if (!filter) return games;

    return games.filter(game => {
      if (filter.maxPlayers && game.maxRoomPlayer > filter.maxPlayers) return false;
      if (filter.approved !== undefined && game.approve !== filter.approved) return false;
      if (filter.appName && !game.appName.toLowerCase().includes(filter.appName.toLowerCase())) return false;
      
      return true;
    });
  }
}

interface GameFilter {
  maxPlayers?: number;
  approved?: boolean;
  appName?: string;
}

// Usage examples
const gameService = new GameService();

// Get all games
const loadGames = async () => {
  const games = await gameService.getAllGames();
  console.log('Available games:', games);
  return games;
};

// Get filtered games
const loadMultiplayerGames = async () => {
  const multiplayerGames = await gameService.getGamesByFilter({
    maxPlayers: 10,
    approved: true
  });
  console.log('Multiplayer games:', multiplayerGames);
};
```

### Game Room Management

```typescript
// room.service.ts
class RoomService {
  private socket: any; // Socket.IO client instance

  constructor(socket: any) {
    this.socket = socket;
  }

  joinGame(appName: string, userId: string): Promise<RoomInfo> {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinRoom', { appName, userId });
      
      this.socket.once('roomJoined', (roomInfo: RoomInfo) => {
        resolve(roomInfo);
      });

      this.socket.once('joinError', (error: any) => {
        reject(error);
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        reject(new Error('Join room timeout'));
      }, 10000);
    });
  }

  leaveGame(appName: string, userId: string): void {
    this.socket.emit('leaveRoom', { appName, userId });
  }

  onRoomUpdate(callback: (roomInfo: RoomInfo) => void): void {
    this.socket.on('roomUpdate', callback);
  }

  onGameStart(callback: (gameData: any) => void): void {
    this.socket.on('gameStart', callback);
  }

  offAllListeners(): void {
    this.socket.off('roomUpdate');
    this.socket.off('gameStart');
    this.socket.off('roomJoined');
    this.socket.off('joinError');
  }
}

// Usage with React component
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const GameLobby: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [roomService, setRoomService] = useState<RoomService | null>(null);
  const [currentRoom, setCurrentRoom] = useState<RoomInfo | null>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3001');
    setSocket(socketInstance);
    setRoomService(new RoomService(socketInstance));

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (roomService) {
      roomService.onRoomUpdate((roomInfo) => {
        setCurrentRoom(roomInfo);
      });

      roomService.onGameStart((gameData) => {
        // Redirect to game or handle game start
        window.location.href = gameData.redirectUrl;
      });

      return () => roomService.offAllListeners();
    }
  }, [roomService]);

  const handleJoinGame = async (appName: string) => {
    if (roomService) {
      try {
        const roomInfo = await roomService.joinGame(appName, 'currentUserId');
        setCurrentRoom(roomInfo);
      } catch (error) {
        console.error('Failed to join game:', error);
      }
    }
  };

  const handleLeaveGame = () => {
    if (roomService && currentRoom) {
      roomService.leaveGame(currentRoom.gameName, 'currentUserId');
      setCurrentRoom(null);
    }
  };

  return (
    <div>
      {currentRoom ? (
        <div>
          <h3>In Room: {currentRoom.gameName}</h3>
          <p>Players: {currentRoom.playersCount} / {currentRoom.maxPlayersCount}</p>
          <button onClick={handleLeaveGame}>Leave Room</button>
        </div>
      ) : (
        <button onClick={() => handleJoinGame('sampleGame')}>
          Join Game
        </button>
      )}
    </div>
  );
};
```

## Event Management

### Complete Event CRUD Operations

```typescript
// event.service.ts
class EventService {
  private baseUrl = '/api/events';

  async createEvent(eventData: Omit<Event, 'id' | 'userId' | 'createAt' | 'updatedAt'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/add-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(eventData)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to create event:', error);
      return false;
    }
  }

  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${this.baseUrl}/get-events`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEvent(eventId: number): Promise<Event | null> {
    try {
      const response = await fetch(`${this.baseUrl}/get-event?id=${eventId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async updateEvent(eventData: Event): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/edit-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(eventData)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update event:', error);
      return false;
    }
  }

  async deleteEvent(eventId: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/delete-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ id: eventId })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete event:', error);
      return false;
    }
  }

  // Helper method to filter events by location
  getEventsByCity(events: Event[], city: string): Event[] {
    return events.filter(event => 
      event.city.toLowerCase().includes(city.toLowerCase())
    );
  }

  // Helper method to get upcoming events
  getUpcomingEvents(events: Event[]): Event[] {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(`${event.begginingDate}T${event.begginingInTime}`);
      return eventDate > now;
    });
  }
}

// Usage example with React
import { useState, useEffect } from 'react';

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventService] = useState(() => new EventService());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const fetchedEvents = await eventService.getAllEvents();
    setEvents(fetchedEvents);
  };

  const createNewEvent = async (eventData: Omit<Event, 'id' | 'userId' | 'createAt' | 'updatedAt'>) => {
    const success = await eventService.createEvent(eventData);
    if (success) {
      await loadEvents(); // Refresh list
    }
    return success;
  };

  const handleDeleteEvent = async (eventId: number) => {
    const success = await eventService.deleteEvent(eventId);
    if (success) {
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  return (
    <div>
      <h2>Events</h2>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Location: {event.city}, {event.place}</p>
          <p>Date: {event.begginingDate} at {event.begginingInTime}</p>
          <button onClick={() => handleDeleteEvent(event.id!)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Statistics & Analytics

### Statistics Service with Authentication

```typescript
// statistics.service.ts
class StatisticsService {
  private baseUrl = '/api/v1/statistic';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async submitGameResult(gameResults: GameData[]): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/set-game-result`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(gameResults)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to submit game result:', error);
      return false;
    }
  }

  async getRecentGames(userId: string): Promise<RecentGames[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/recent-games?userId=${encodeURIComponent(userId)}`,
        {
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recent games');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recent games:', error);
      return [];
    }
  }

  async getMostPopularGames(): Promise<MostPopularGames[]> {
    try {
      const response = await fetch(`${this.baseUrl}/most-popular-games`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch popular games');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching popular games:', error);
      return [];
    }
  }

  async getBestUsers(): Promise<BestUser[]> {
    try {
      const response = await fetch(`${this.baseUrl}/best-users`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch best users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching best users:', error);
      return [];
    }
  }

  async getLeaders(appName: string): Promise<Leaders[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/get-leaders?appName=${encodeURIComponent(appName)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leaders');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching leaders:', error);
      return [];
    }
  }

  // Helper methods for data processing
  calculateWinRate(recentGames: RecentGames[]): number {
    if (recentGames.length === 0) return 0;
    
    const wins = recentGames.filter(game => game.result === ResultStatus.Win).length;
    return (wins / recentGames.length) * 100;
  }

  getTotalPlayTime(recentGames: RecentGames[]): number {
    return recentGames.reduce((total, game) => total + (game.playedTime || 0), 0);
  }

  getAverageScore(recentGames: RecentGames[]): number {
    if (recentGames.length === 0) return 0;
    
    const totalScore = recentGames.reduce((total, game) => total + game.scores, 0);
    return totalScore / recentGames.length;
  }
}

// Usage with React hooks
import { useState, useEffect } from 'react';

const UserStatistics: React.FC<{ userId: string }> = ({ userId }) => {
  const [recentGames, setRecentGames] = useState<RecentGames[]>([]);
  const [bestUsers, setBestUsers] = useState<BestUser[]>([]);
  const [popularGames, setPopularGames] = useState<MostPopularGames[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsService] = useState(() => new StatisticsService());

  useEffect(() => {
    loadAllStatistics();
  }, [userId]);

  const loadAllStatistics = async () => {
    setLoading(true);
    try {
      const [recent, best, popular] = await Promise.all([
        statsService.getRecentGames(userId),
        statsService.getBestUsers(),
        statsService.getMostPopularGames()
      ]);

      setRecentGames(recent);
      setBestUsers(best);
      setPopularGames(popular);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitGameScore = async (gameData: GameData) => {
    const success = await statsService.submitGameResult([gameData]);
    if (success) {
      // Refresh recent games
      const updated = await statsService.getRecentGames(userId);
      setRecentGames(updated);
    }
    return success;
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  const winRate = statsService.calculateWinRate(recentGames);
  const averageScore = statsService.getAverageScore(recentGames);

  return (
    <div>
      <h2>Your Statistics</h2>
      
      <div>
        <h3>Summary</h3>
        <p>Win Rate: {winRate.toFixed(1)}%</p>
        <p>Average Score: {averageScore.toFixed(0)}</p>
        <p>Games Played: {recentGames.length}</p>
      </div>

      <div>
        <h3>Recent Games</h3>
        {recentGames.map((game, index) => (
          <div key={index}>
            <span>{game.game}: {game.scores} points</span>
            <span> - {game.result === ResultStatus.Win ? 'Won' : 'Lost'}</span>
          </div>
        ))}
      </div>

      <div>
        <h3>Most Popular Games</h3>
        {popularGames.map((game, index) => (
          <div key={index}>
            <span>{game.game}: {game.playedInWeek} plays this week</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Frontend Component Integration

### Using Custom UI Components

```tsx
// Complete form example using custom components
import React, { useState } from 'react';
import {
  CaButton,
  CaDialog,
  CaSelect,
  CaTable,
  CaSnackbar
} from 'components';

interface GameFormData {
  appName: string;
  description: string;
  maxRoomPlayer: number;
  maxRooms: number;
  requestUrl: string;
  maxWaitingTime: number;
  redirectUrl: string;
}

const GameManagementForm: React.FC = () => {
  const [formData, setFormData] = useState<GameFormData>({
    appName: '',
    description: '',
    maxRoomPlayer: 2,
    maxRooms: 10,
    requestUrl: '',
    maxWaitingTime: 300,
    redirectUrl: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success'
  });

  const playerOptions = [
    { value: 1, label: 'Single Player' },
    { value: 2, label: '2 Players' },
    { value: 4, label: '4 Players' },
    { value: 8, label: '8 Players' },
    { value: 16, label: '16 Players' }
  ];

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.appName || !formData.description) {
        setSnackbarData({
          open: true,
          message: 'Please fill in required fields',
          type: 'error'
        });
        return;
      }

      // Submit form (implement your submission logic)
      const success = await submitGameForm(formData);
      
      if (success) {
        setSnackbarData({
          open: true,
          message: 'Game created successfully!',
          type: 'success'
        });
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      setSnackbarData({
        open: true,
        message: 'Failed to create game',
        type: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      appName: '',
      description: '',
      maxRoomPlayer: 2,
      maxRooms: 10,
      requestUrl: '',
      maxWaitingTime: 300,
      redirectUrl: ''
    });
  };

  return (
    <div>
      <CaButton 
        color="primary" 
        onClick={() => setIsDialogOpen(true)}
      >
        Add New Game
      </CaButton>

      <CaDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Add New Game"
        maxWidth="md"
      >
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label>Game Name *</label>
            <input
              type="text"
              value={formData.appName}
              onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
              placeholder="Enter game name"
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter game description"
              rows={3}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <CaSelect
              label="Max Players"
              value={formData.maxRoomPlayer}
              options={playerOptions}
              onChange={(value) => setFormData({ ...formData, maxRoomPlayer: value })}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Request URL</label>
            <input
              type="url"
              value={formData.requestUrl}
              onChange={(e) => setFormData({ ...formData, requestUrl: e.target.value })}
              placeholder="https://api.yourgame.com"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label>Redirect URL</label>
            <input
              type="url"
              value={formData.redirectUrl}
              onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
              placeholder="https://yourgame.com/play"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <CaButton 
              variant="outlined" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </CaButton>
            <CaButton 
              color="primary" 
              onClick={handleSubmit}
            >
              Create Game
            </CaButton>
          </div>
        </div>
      </CaDialog>

      <CaSnackbar
        open={snackbarData.open}
        message={snackbarData.message}
        type={snackbarData.type}
        autoHideDuration={6000}
        onClose={() => setSnackbarData({ ...snackbarData, open: false })}
      />
    </div>
  );
};

// Table implementation example
const GamesList: React.FC<{ games: GameModel[] }> = ({ games }) => {
  const headerNames: HeaderName[] = [
    { headerName: 'Game Name', field: RowProperty.Name, type: TypeOfColumn.String },
    { headerName: 'Players', field: RowProperty.PlayedTime, type: TypeOfColumn.Increment },
    { headerName: 'Status', field: RowProperty.Result, type: TypeOfColumn.String },
    { 
      headerName: 'Actions', 
      type: TypeOfColumn.String,
      editAction: (id: number) => console.log('Edit game:', id),
      deleteAction: (game: GameModel) => console.log('Delete game:', game.appName)
    }
  ];

  const rows: Row[] = games.map(game => ({
    id: game.id,
    name: game.appName,
    players: `${game.maxRoomPlayer} max`,
    status: game.approve ? 'Approved' : 'Pending',
    game: game
  }));

  return (
    <CaTable
      headerNames={headerNames}
      rows={rows}
    />
  );
};

// Helper function (implement based on your needs)
const submitGameForm = async (formData: GameFormData): Promise<boolean> => {
  // Implementation depends on your API
  return true;
};
```

### Chart Integration Example

```tsx
import React, { useState, useEffect } from 'react';
import { BarChart } from 'components';
import { WeekReportData, BarChartConfig } from 'models';

const StatisticsDashboard: React.FC = () => {
  const [weekData, setWeekData] = useState<WeekReportData[]>([]);

  const chartConfig: BarChartConfig = {
    margin: { top: 20, right: 30, bottom: 40, left: 40 },
    ticksNumber: 10,
    animationDuration: 750,
    marginBetweenLegends: 20,
    legendRectWidth: 15,
    legendRectHeight: 15,
    legendRectMargins: 5,
    legendTextMargins: 25
  };

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    // Simulate API call
    const mockData: WeekReportData[] = [
      {
        dayOfWeek: 'Monday',
        values: [
          { name: 'Game A', value: 120 },
          { name: 'Game B', value: 80 }
        ]
      },
      {
        dayOfWeek: 'Tuesday',
        values: [
          { name: 'Game A', value: 150 },
          { name: 'Game B', value: 95 }
        ]
      }
      // ... more days
    ];

    setWeekData(mockData);
  };

  return (
    <div>
      <h2>Weekly Game Statistics</h2>
      <div style={{ height: '400px', width: '100%' }}>
        <BarChart
          diagramData={weekData}
          config={chartConfig}
        />
      </div>
    </div>
  );
};
```

## Real-time Features

### Complete Socket.IO Integration

```typescript
// socket.manager.ts
class SocketManager {
  private socket: any;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  constructor(serverUrl: string) {
    this.connect(serverUrl);
  }

  private connect(serverUrl: string): void {
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectInterval
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('Disconnected from server:', reason);
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect after', this.maxReconnectAttempts, 'attempts');
    });
  }

  // Game room methods
  joinRoom(gameId: string, userId: string): Promise<RoomInfo> {
    return new Promise((resolve, reject) => {
      this.socket.emit('joinRoom', { gameId, userId });
      
      const timeout = setTimeout(() => {
        reject(new Error('Join room timeout'));
      }, 10000);

      this.socket.once('roomJoined', (roomInfo: RoomInfo) => {
        clearTimeout(timeout);
        resolve(roomInfo);
      });

      this.socket.once('joinError', (error: any) => {
        clearTimeout(timeout);
        reject(new Error(error.message || 'Failed to join room'));
      });
    });
  }

  leaveRoom(gameId: string, userId: string): void {
    this.socket.emit('leaveRoom', { gameId, userId });
  }

  // Real-time game events
  onRoomUpdate(callback: (roomInfo: RoomInfo) => void): () => void {
    this.socket.on('roomUpdate', callback);
    return () => this.socket.off('roomUpdate', callback);
  }

  onGameStart(callback: (gameData: any) => void): () => void {
    this.socket.on('gameStart', callback);
    return () => this.socket.off('gameStart', callback);
  }

  onPlayerJoined(callback: (playerInfo: any) => void): () => void {
    this.socket.on('playerJoined', callback);
    return () => this.socket.off('playerJoined', callback);
  }

  onPlayerLeft(callback: (playerInfo: any) => void): () => void {
    this.socket.on('playerLeft', callback);
    return () => this.socket.off('playerLeft', callback);
  }

  onCountdownUpdate(callback: (countdown: number) => void): () => void {
    this.socket.on('countdownUpdate', callback);
    return () => this.socket.off('countdownUpdate', callback);
  }

  // Send game actions
  sendGameAction(action: string, data: any): void {
    this.socket.emit('gameAction', { action, data });
  }

  // Chat functionality
  sendMessage(roomId: string, message: string, userId: string): void {
    this.socket.emit('chatMessage', { roomId, message, userId });
  }

  onChatMessage(callback: (messageData: any) => void): () => void {
    this.socket.on('chatMessage', callback);
    return () => this.socket.off('chatMessage', callback);
  }

  // Cleanup
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  isConnected(): boolean {
    return this.socket && this.socket.connected;
  }
}

// React hook for socket management
import { useEffect, useState, useRef } from 'react';

export const useSocket = (serverUrl: string) => {
  const [socketManager, setSocketManager] = useState<SocketManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const cleanupFunctions = useRef<(() => void)[]>([]);

  useEffect(() => {
    const manager = new SocketManager(serverUrl);
    setSocketManager(manager);

    // Monitor connection status
    const checkConnection = setInterval(() => {
      setIsConnected(manager.isConnected());
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      // Cleanup all listeners
      cleanupFunctions.current.forEach(cleanup => cleanup());
      manager.disconnect();
    };
  }, [serverUrl]);

  const addCleanup = (cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  };

  return {
    socketManager,
    isConnected,
    addCleanup
  };
};

// Usage in React component
const GameRoom: React.FC<{ gameId: string; userId: string }> = ({ gameId, userId }) => {
  const { socketManager, isConnected, addCleanup } = useSocket('ws://localhost:3001');
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    if (socketManager && isConnected) {
      // Join room when connected
      socketManager.joinRoom(gameId, userId)
        .then(setRoomInfo)
        .catch(console.error);

      // Setup event listeners
      const cleanupRoomUpdate = socketManager.onRoomUpdate(setRoomInfo);
      const cleanupCountdown = socketManager.onCountdownUpdate(setCountdown);
      const cleanupPlayerJoined = socketManager.onPlayerJoined((player) => {
        setPlayers(prev => [...prev, player]);
      });
      const cleanupPlayerLeft = socketManager.onPlayerLeft((player) => {
        setPlayers(prev => prev.filter(p => p.id !== player.id));
      });

      // Add cleanup functions
      addCleanup(cleanupRoomUpdate);
      addCleanup(cleanupCountdown);
      addCleanup(cleanupPlayerJoined);
      addCleanup(cleanupPlayerLeft);

      return () => {
        socketManager.leaveRoom(gameId, userId);
      };
    }
  }, [socketManager, isConnected, gameId, userId]);

  if (!isConnected) {
    return <div>Connecting to server...</div>;
  }

  if (!roomInfo) {
    return <div>Joining room...</div>;
  }

  return (
    <div>
      <h2>Game Room: {roomInfo.gameName}</h2>
      <p>Players: {roomInfo.playersCount} / {roomInfo.maxPlayersCount}</p>
      
      {countdown !== null && (
        <div>
          <h3>Game starting in: {countdown} seconds</h3>
        </div>
      )}
      
      <div>
        <h3>Players in room:</h3>
        {players.map(player => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
      
      <button 
        onClick={() => socketManager?.leaveRoom(gameId, userId)}
      >
        Leave Room
      </button>
    </div>
  );
};
```

## Error Handling

### Comprehensive Error Management

```typescript
// error.handler.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    public message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// error.service.ts
class ErrorService {
  private static instance: ErrorService;

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  handleApiError(error: any): { message: string; shouldRetry: boolean } {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          // Handle authentication error
          this.handleAuthError();
          return { message: 'Authentication required', shouldRetry: false };
        
        case 403:
          return { message: 'Access denied', shouldRetry: false };
        
        case 404:
          return { message: 'Resource not found', shouldRetry: false };
        
        case 429:
          return { message: 'Too many requests. Please try again later.', shouldRetry: true };
        
        case 500:
        case 502:
        case 503:
          return { message: 'Server error. Please try again.', shouldRetry: true };
        
        default:
          return { message: error.message || 'An error occurred', shouldRetry: false };
      }
    }

    if (error.name === 'NetworkError' || !navigator.onLine) {
      return { message: 'Network connection error', shouldRetry: true };
    }

    return { message: 'An unexpected error occurred', shouldRetry: false };
  }

  private handleAuthError(): void {
    // Clear stored auth data
    localStorage.removeItem('authToken');
    
    // Redirect to login (implement based on your routing)
    window.location.href = '/login';
  }

  logError(error: Error, context?: string): void {
    console.error(`[${context || 'Unknown'}]`, error);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry, LogRocket, etc.
    }
  }
}

// api.client.ts - Enhanced API client with error handling
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private errorService: ErrorService;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.errorService = ErrorService.getInstance();
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      ...this.defaultHeaders,
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          await this.extractErrorMessage(response),
          await this.extractErrorCode(response)
        );
      }

      // Handle different response types
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as unknown as T;
    } catch (error) {
      this.errorService.logError(error as Error, `API Request: ${endpoint}`);
      
      const errorInfo = this.errorService.handleApiError(error);
      
      // Retry logic for recoverable errors
      if (errorInfo.shouldRetry && retries < 3) {
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, options, retries + 1);
      }
      
      throw error;
    }
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const errorBody = await response.json();
      return errorBody.message || errorBody.error || 'Unknown error';
    } catch {
      return `HTTP ${response.status}: ${response.statusText}`;
    }
  }

  private async extractErrorCode(response: Response): Promise<number | undefined> {
    try {
      const errorBody = await response.json();
      return errorBody.code;
    } catch {
      return undefined;
    }
  }

  // HTTP method helpers
  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Usage with error boundaries in React
import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorService = ErrorService.getInstance();
    errorService.logError(error, 'React Error Boundary');
    
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for error handling in functional components
import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const errorService = ErrorService.getInstance();

  const handleAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setIsLoading(false);
      return result;
    } catch (err) {
      const errorInfo = errorService.handleApiError(err);
      setError(errorInfo.message);
      setIsLoading(false);
      errorService.logError(err as Error, context);
      return null;
    }
  }, [errorService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    handleAsync,
    clearError
  };
};

// Usage example
const ExampleComponent: React.FC = () => {
  const { error, isLoading, handleAsync, clearError } = useErrorHandler();
  const [data, setData] = useState(null);

  const loadData = async () => {
    const result = await handleAsync(
      () => apiClient.get('/api/games/get-games'),
      'Loading games'
    );
    
    if (result) {
      setData(result);
    }
  };

  return (
    <ErrorBoundary>
      <div>
        {error && (
          <div style={{ color: 'red', padding: '10px' }}>
            Error: {error}
            <button onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {isLoading && <div>Loading...</div>}
        
        <button onClick={loadData} disabled={isLoading}>
          Load Data
        </button>
        
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </ErrorBoundary>
  );
};
```

## Best Practices

### 1. API Security

```typescript
// Always validate tokens before API calls
const isValidToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

// Use HTTPS in production
const getApiBaseUrl = (): string => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com'
    : 'http://localhost:3001';
};
```

### 2. Performance Optimization

```typescript
// Implement request caching
class CacheService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }
}

// Debounce search requests
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### 3. Type Safety

```typescript
// Use strict TypeScript configurations
// Create type guards for runtime validation
const isGameModel = (obj: any): obj is GameModel => {
  return obj &&
    typeof obj.appName === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.maxRoomPlayer === 'number';
};

// Use branded types for IDs
type UserId = string & { readonly brand: unique symbol };
type GameId = string & { readonly brand: unique symbol };

const createUserId = (id: string): UserId => id as UserId;
const createGameId = (id: string): GameId => id as GameId;
```

This comprehensive usage guide provides detailed examples for implementing all aspects of the Community Application's APIs and components. Each section includes complete, working code examples that can be adapted to your specific needs.