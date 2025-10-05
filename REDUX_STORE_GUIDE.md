# Redux Store Architecture Guide

## Table of Contents

1. [Store Overview](#store-overview)
2. [Store Modules](#store-modules)
3. [Actions](#actions)
4. [Reducers](#reducers)
5. [Epics (Side Effects)](#epics-side-effects)
6. [Usage Patterns](#usage-patterns)
7. [Best Practices](#best-practices)

---

## Store Overview

The application uses **Redux** with **Redux-Observable** for managing application state and handling side effects.

### Technology Stack

- **Redux**: State management
- **Redux-Observable**: Side effects management using RxJS
- **React-Redux**: React bindings
- **TypeScript**: Type safety

### Store Configuration

**Location:** `frontend/src/store/store.config.ts`

```typescript
interface AppState {
  auth: AuthState;                    // Authentication state
  games: GamesState;                  // Public games list
  myGames: MyGamesState;              // User's created games
  statistic: StatisticState;          // Game statistics
  socket: SocketState;                // WebSocket connection
  snackbarUi: SnackbarUiState;       // Notification system
  restorePassword: RestorePasswordState;  // Password reset flow
  userSettings: UserSettingsState;    // User preferences
  room: RoomState;                    // Game room management
}
```

---

## Store Modules

Each module follows the same structure:
- `*.action.ts` - Action definitions
- `*.reducer.ts` - State reducer
- `*.effects.ts` - Side effects (epics)
- `*.initial.ts` - Initial state
- `interfaces.ts` - TypeScript interfaces

---

## Auth Module

**Location:** `frontend/src/store/auth/`

### State Interface

```typescript
interface AuthState {
  status: AuthStatus;          // NotAuthorized | Registered | Authorized
  user?: FrontEndUser;         // Current user data
  spinnerRun: boolean;         // Loading indicator
  errors: ErrorBlock[];        // Validation/server errors
}

interface FrontEndUser {
  id: number;
  name: string;
  email: string;
  token: string;
  language: string;
  imageUrl?: string;
}

enum AuthStatus {
  NotAuthorized = 0,
  Registered = 1,
  Authorized = 2
}
```

### Actions

```typescript
// User Registration
export class RegisterUser {
  readonly type = AuthTypes.RegisterUser;
  constructor(public payload: UserFieldsToRegister) {}
}

// User Login
export class LoginUser {
  readonly type = AuthTypes.LoginUser;
  constructor(public payload: UserFieldsToLogin) {}
}

// Social Network Login
export class SocialNetworksLogin {
  readonly type = AuthTypes.SocialNetworksLogin;
  constructor(public payload: SocialNetworksUser) {}
}

// Set Current User (after token decode)
export class SetCurrentUser {
  readonly type = AuthTypes.SetCurrentUser;
  constructor(public payload: FrontEndUser | undefined) {}
}

// Logout
export class LogoutUser {
  readonly type = AuthTypes.LogoutUser;
}

// Success/Error Actions
export class RegistrationSuccess {
  readonly type = AuthTypes.RegistrationSuccess;
  constructor(public payload: string) {}
}

export class RegistrationError {
  readonly type = AuthTypes.RegistrationError;
}

export class LoginError {
  readonly type = AuthTypes.LoginError;
}
```

### Epics (Side Effects)

**Registration Epic:**
```typescript
const registerUserEpic: Epic<AuthActions, AuthActions, AppState> = (action$) =>
  action$.pipe(
    ofType(AuthTypes.RegisterUser),
    mergeMap((action: RegisterUser) =>
      from(HttpWrapper.post('api/users/register', action.payload)).pipe(
        map((response) => {
          // Handle success
          const user = response.data;
          return new RegistrationSuccess('Registration successful');
        }),
        catchError((error) => {
          // Handle error
          return of(new RegistrationError());
        })
      )
    )
  );
```

**Login Epic:**
```typescript
const loginUserEpic: Epic<AuthActions, AuthActions, AppState> = (action$) =>
  action$.pipe(
    ofType(AuthTypes.LoginUser),
    mergeMap((action: LoginUser) =>
      from(HttpWrapper.post('api/users/login', action.payload)).pipe(
        map((response) => {
          const { token } = response.data;
          
          // Store token
          localStorage.setItem('jwtToken', token);
          setAuthToken(token);
          
          // Decode and set user
          const decoded = jwt_decode(token);
          return new SetCurrentUser(decoded);
        }),
        catchError((error) => {
          return of(new LoginError());
        })
      )
    )
  );
```

### Usage Example

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser, RegisterUser } from 'store/auth';
import { AppState } from 'store';

const LoginComponent = () => {
  const dispatch = useDispatch();
  const { status, spinnerRun } = useSelector((state: AppState) => state.auth);
  
  const handleLogin = (credentials: UserFieldsToLogin) => {
    dispatch(new LoginUser(credentials));
  };
  
  return (
    <div>
      {spinnerRun && <Spinner />}
      {status === AuthStatus.Authorized && <Redirect to="/home" />}
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};
```

---

## Games Module

**Location:** `frontend/src/store/games/`

### State Interface

```typescript
interface GamesState {
  games: Game[];               // List of all approved games
  loadStatus: LoadStatus;      // Init | Fetching | Success | Error
}
```

### Actions

```typescript
// Fetch Games
export class GetGames {
  readonly type = GamesTypes.GetGames;
}

// Success
export class GetGamesSuccess {
  readonly type = GamesTypes.GetGamesSuccess;
  constructor(public payload: Game[]) {}
}

// Error
export class GetGamesError {
  readonly type = GamesTypes.GetGamesError;
}
```

### Epic

```typescript
const getGamesEpic: Epic<GamesActions, GamesActions, AppState> = (action$) =>
  action$.pipe(
    ofType(GamesTypes.GetGames),
    mergeMap(() =>
      from(HttpWrapper.get<Game[]>('api/games/get-games')).pipe(
        map((response) => new GetGamesSuccess(response.data)),
        catchError(() => of(new GetGamesError()))
      )
    )
  );
```

### Usage Example

```typescript
import { GetGames } from 'store/games';

const GamesListComponent = () => {
  const dispatch = useDispatch();
  const { games, loadStatus } = useSelector((state: AppState) => state.games);
  
  useEffect(() => {
    dispatch(new GetGames());
  }, [dispatch]);
  
  if (loadStatus === LoadStatus.Fetching) {
    return <Spinner />;
  }
  
  return (
    <div>
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};
```

---

## My Games Module

**Location:** `frontend/src/store/my-games/`

### State Interface

```typescript
interface MyGamesState {
  games: GameModel[];              // User's created games
  isAddDialogOpened: boolean;      // Add game dialog state
  isEditDialogOpened: boolean;     // Edit game dialog state
  loadStatus: LoadStatus;
  editingGame?: GameModel;         // Game being edited
}
```

### Actions

```typescript
// Get User Games
export class GetMyGames {
  readonly type = MyGamesTypes.GetMyGames;
  constructor(public payload: number) {}  // userId
}

// Add New Game
export class AddGame {
  readonly type = MyGamesTypes.AddGame;
  constructor(public payload: GameModel) {}
}

// Edit Game
export class EditGame {
  readonly type = MyGamesTypes.EditGame;
  constructor(public payload: GameModel) {}
}

// Delete Game
export class DeleteGame {
  readonly type = MyGamesTypes.DeleteGame;
  constructor(public payload: GameModel) {}
}

// Dialog Management
export class OpenAddDialog {
  readonly type = MyGamesTypes.OpenAddDialog;
}

export class CloseAddDialog {
  readonly type = MyGamesTypes.CloseAddDialog;
}

export class OpenEditDialog {
  readonly type = MyGamesTypes.OpenEditDialog;
  constructor(public payload: GameModel) {}
}

export class CloseEditDialog {
  readonly type = MyGamesTypes.CloseEditDialog;
}
```

### Epics

**Add Game Epic:**
```typescript
const addGameEpic: Epic<MyGamesActions, MyGamesActions, AppState> = (action$) =>
  action$.pipe(
    ofType(MyGamesTypes.AddGame),
    mergeMap((action: AddGame) =>
      from(HttpWrapper.post('api/v1/my-games/add-game', action.payload)).pipe(
        mergeMap((response) => [
          new AddGameSuccess(response.data),
          new CloseAddDialog(),
          new ShowSnackbar({
            type: SnackbarType.Success,
            messages: [{ msg: 'Game created successfully!' }]
          })
        ]),
        catchError((error) => of(new AddGameError()))
      )
    )
  );
```

### Usage Example

```typescript
import { GetMyGames, AddGame, OpenAddDialog } from 'store/my-games';

const MyGamesComponent = () => {
  const dispatch = useDispatch();
  const { games, isAddDialogOpened } = useSelector(
    (state: AppState) => state.myGames
  );
  const userId = useSelector((state: AppState) => state.auth.user?.id);
  
  useEffect(() => {
    if (userId) {
      dispatch(new GetMyGames(userId));
    }
  }, [userId, dispatch]);
  
  const handleAddGame = (gameData: GameModel) => {
    dispatch(new AddGame(gameData));
  };
  
  return (
    <div>
      <button onClick={() => dispatch(new OpenAddDialog())}>
        Add New Game
      </button>
      
      <GamesList games={games} />
      
      <CaDialog
        open={isAddDialogOpened}
        title="Add New Game"
        content={<GameForm onSubmit={handleAddGame} />}
      />
    </div>
  );
};
```

---

## Statistics Module

**Location:** `frontend/src/store/statistic/`

### State Interface

```typescript
interface StatisticState {
  bestUsers: BestUser[];
  mostPopularGames: MostPopularGames[];
  recentGames: RecentGames[];
  leaders: Leaders[];
  selectedTab: StatTab;
  loadStatus: LoadStatus;
}

enum StatTab {
  BestUsers = 0,
  TheMostPopularGames = 1,
  RecentGames = 2
}
```

### Actions

```typescript
// Get Statistics
export class GetBestUsers {
  readonly type = StatisticTypes.GetBestUsers;
}

export class GetMostPopularGames {
  readonly type = StatisticTypes.GetMostPopularGames;
}

export class GetRecentGames {
  readonly type = StatisticTypes.GetRecentGames;
  constructor(public payload: string) {}  // userToken
}

export class GetLeaders {
  readonly type = StatisticTypes.GetLeaders;
  constructor(public payload: string) {}  // appName
}

// Set Game Results
export class SetGameResult {
  readonly type = StatisticTypes.SetGameResult;
  constructor(public payload: GameData[]) {}
}

// Tab Management
export class ChangeStatTab {
  readonly type = StatisticTypes.ChangeStatTab;
  constructor(public payload: StatTab) {}
}
```

### Usage Example

```typescript
import { GetBestUsers, GetMostPopularGames, ChangeStatTab } from 'store/statistic';

const StatisticsComponent = () => {
  const dispatch = useDispatch();
  const { 
    bestUsers, 
    mostPopularGames, 
    selectedTab 
  } = useSelector((state: AppState) => state.statistic);
  
  useEffect(() => {
    dispatch(new GetBestUsers());
    dispatch(new GetMostPopularGames());
  }, [dispatch]);
  
  return (
    <div>
      <Tabs value={selectedTab} onChange={(tab) => dispatch(new ChangeStatTab(tab))}>
        <Tab label="Best Users" />
        <Tab label="Popular Games" />
      </Tabs>
      
      {selectedTab === StatTab.BestUsers && (
        <BestUsersTable data={bestUsers} />
      )}
      {selectedTab === StatTab.TheMostPopularGames && (
        <PopularGamesTable data={mostPopularGames} />
      )}
    </div>
  );
};
```

---

## Socket Module

**Location:** `frontend/src/store/socket/`

### State Interface

```typescript
interface SocketState {
  status: SocketStatus;                      // Opened | Closed
  socket?: SocketIOClient.Socket;
}

enum SocketStatus {
  Opened = 'Opened',
  Closed = 'Closed'
}
```

### Actions

```typescript
// Socket Lifecycle
export class OpenSocket {
  readonly type = SocketTypes.OpenSocket;
}

export class CloseSocket {
  readonly type = SocketTypes.CloseSocket;
}

export class SocketConnected {
  readonly type = SocketTypes.SocketConnected;
  constructor(public payload: SocketIOClient.Socket) {}
}

// Socket Events
export class EmitEvent {
  readonly type = SocketTypes.EmitEvent;
  constructor(
    public eventName: string,
    public data: any
  ) {}
}
```

### Epic

```typescript
const openSocketEpic: Epic<SocketActions, SocketActions, AppState> = (action$, state$) =>
  action$.pipe(
    ofType(SocketTypes.OpenSocket),
    mergeMap(() => {
      const socket = io('http://localhost:3001');
      
      socket.on('connect', () => {
        console.log('Socket connected');
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
      
      return of(new SocketConnected(socket));
    })
  );

const emitEventEpic: Epic<SocketActions, SocketActions, AppState> = (action$, state$) =>
  action$.pipe(
    ofType(SocketTypes.EmitEvent),
    tap((action: EmitEvent) => {
      const socket = state$.value.socket.socket;
      if (socket) {
        socket.emit(action.eventName, action.data);
      }
    }),
    ignoreElements()
  );
```

### Usage Example

```typescript
import { OpenSocket, EmitEvent, CloseSocket } from 'store/socket';

const GameRoomComponent = () => {
  const dispatch = useDispatch();
  const { socket, status } = useSelector((state: AppState) => state.socket);
  
  useEffect(() => {
    // Open socket on mount
    dispatch(new OpenSocket());
    
    // Listen for events
    if (socket) {
      socket.on('room-update', (data) => {
        console.log('Room updated:', data);
      });
    }
    
    // Close socket on unmount
    return () => {
      dispatch(new CloseSocket());
    };
  }, [socket, dispatch]);
  
  const joinGame = (gameId: number) => {
    dispatch(new EmitEvent('join-game', { gameId, userId: 123 }));
  };
  
  return (
    <div>
      <p>Socket: {status}</p>
      <button onClick={() => joinGame(1)}>Join Game</button>
    </div>
  );
};
```

---

## Snackbar Module

**Location:** `frontend/src/store/snackbar/`

### State Interface

```typescript
interface SnackbarUiState {
  isOpen: boolean;
  type: SnackbarType;
  messages: ErrorBlock[];
}

enum SnackbarType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Success = 'success'
}
```

### Actions

```typescript
export class ShowSnackbar {
  readonly type = SnackbarTypes.ShowSnackbar;
  constructor(public payload: SnackbarPayload) {}
}

export class HideSnackbar {
  readonly type = SnackbarTypes.HideSnackbar;
}

interface SnackbarPayload {
  type: SnackbarType;
  messages: ErrorBlock[];
}
```

### Usage Example

```typescript
import { ShowSnackbar, HideSnackbar } from 'store/snackbar';
import { SnackbarType } from 'models';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { isOpen, type, messages } = useSelector(
    (state: AppState) => state.snackbarUi
  );
  
  const showSuccessMessage = () => {
    dispatch(new ShowSnackbar({
      type: SnackbarType.Success,
      messages: [{ msg: 'Operation completed successfully!' }]
    }));
  };
  
  const showErrorMessage = (errors: ErrorBlock[]) => {
    dispatch(new ShowSnackbar({
      type: SnackbarType.Error,
      messages: errors
    }));
  };
  
  return (
    <div>
      <button onClick={showSuccessMessage}>Show Success</button>
      
      <CaSnackbar
        open={isOpen}
        type={type}
        messages={messages}
        onClose={() => dispatch(new HideSnackbar())}
      />
    </div>
  );
};
```

---

## Room Module

**Location:** `frontend/src/store/room/`

### State Interface

```typescript
interface RoomState {
  rooms: RoomInfo[];
  currentRoom?: RoomInfo;
}

interface RoomInfo {
  id: number;
  gameId: number;
  gameName: string;
  description: string;
  maxWaitingTime: number;
  maxPlayersCount: number;
  playersCount: number;
  status: RoomStatus;
  distance?: number;
}
```

### Actions

```typescript
export class UpdateRooms {
  readonly type = RoomTypes.UpdateRooms;
  constructor(public payload: RoomInfo[]) {}
}

export class JoinRoom {
  readonly type = RoomTypes.JoinRoom;
  constructor(public payload: number) {}  // roomId
}

export class LeaveRoom {
  readonly type = RoomTypes.LeaveRoom;
}
```

---

## Usage Patterns

### 1. Connecting Components to Redux

```typescript
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from 'store';
import { GetGames } from 'store/games';

interface ComponentProps {
  games: Game[];
  loading: boolean;
  getGames: () => void;
}

const MyComponent: React.FC<ComponentProps> = ({ games, loading, getGames }) => {
  useEffect(() => {
    getGames();
  }, [getGames]);
  
  return <div>{/* Component JSX */}</div>;
};

const mapStateToProps = (state: AppState) => ({
  games: state.games.games,
  loading: state.games.loadStatus === LoadStatus.Fetching
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getGames: () => dispatch(new GetGames())
});

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

---

### 2. Using Hooks

```typescript
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'store';
import { GetGames } from 'store/games';

const MyComponent = () => {
  const dispatch = useDispatch();
  const games = useSelector((state: AppState) => state.games.games);
  const loading = useSelector(
    (state: AppState) => state.games.loadStatus === LoadStatus.Fetching
  );
  
  useEffect(() => {
    dispatch(new GetGames());
  }, [dispatch]);
  
  return <div>{/* Component JSX */}</div>;
};
```

---

### 3. Handling Async Operations

```typescript
const saveGameEpic: Epic<GameActions, GameActions, AppState> = (action$) =>
  action$.pipe(
    ofType(GameTypes.SaveGame),
    mergeMap((action: SaveGame) =>
      from(HttpWrapper.post('api/games', action.payload)).pipe(
        // Success case
        mergeMap((response) => [
          new SaveGameSuccess(response.data),
          new ShowSnackbar({
            type: SnackbarType.Success,
            messages: [{ msg: 'Game saved!' }]
          })
        ]),
        // Error case
        catchError((error) => of(
          new SaveGameError(),
          new ShowSnackbar({
            type: SnackbarType.Error,
            messages: error.response.data
          })
        ))
      )
    )
  );
```

---

### 4. Chaining Actions

```typescript
const loginSuccessEpic: Epic<AuthActions, AuthActions, AppState> = (action$) =>
  action$.pipe(
    ofType(AuthTypes.SetCurrentUser),
    mergeMap(() => [
      new OpenSocket(),           // Open WebSocket connection
      new GetGames(),            // Load games
      new GetBestUsers(),        // Load statistics
      new ShowSnackbar({
        type: SnackbarType.Success,
        messages: [{ msg: 'Welcome back!' }]
      })
    ])
  );
```

---

### 5. Accessing State in Epics

```typescript
const myEpic: Epic<MyActions, MyActions, AppState> = (action$, state$) =>
  action$.pipe(
    ofType(MyTypes.DoSomething),
    mergeMap(() => {
      const currentUser = state$.value.auth.user;
      const isAuthenticated = state$.value.auth.status === AuthStatus.Authorized;
      
      if (!isAuthenticated) {
        return of(new ShowError('Not authenticated'));
      }
      
      return from(apiCall(currentUser.id)).pipe(
        map((response) => new DoSomethingSuccess(response.data))
      );
    })
  );
```

---

## Best Practices

### 1. Action Naming

Use descriptive, verb-based names:

```typescript
// Good
export class GetGames { }
export class CreateUser { }
export class UpdateProfile { }

// Bad
export class Games { }
export class User { }
export class Profile { }
```

---

### 2. Action Types

Use enum for action types:

```typescript
export enum AuthTypes {
  RegisterUser = '[auth] Register User',
  LoginUser = '[auth] Login User',
  LogoutUser = '[auth] Logout User'
}
```

---

### 3. Type Safety

Always use TypeScript interfaces:

```typescript
interface GetGamesAction {
  type: GamesTypes.GetGames;
}

interface GetGamesSuccessAction {
  type: GamesTypes.GetGamesSuccess;
  payload: Game[];
}

type GamesActions = 
  | GetGamesAction
  | GetGamesSuccessAction
  | GetGamesErrorAction;
```

---

### 4. Immutable Updates

Always return new state objects:

```typescript
// Good
return {
  ...state,
  games: [...state.games, newGame]
};

// Bad
state.games.push(newGame);
return state;
```

---

### 5. Loading States

Track loading states for better UX:

```typescript
interface MyState {
  data: any[];
  loadStatus: LoadStatus;
  error?: string;
}

enum LoadStatus {
  Init,
  Fetching,
  Success,
  Error
}
```

---

### 6. Error Handling

Always handle errors in epics:

```typescript
const myEpic: Epic = (action$) =>
  action$.pipe(
    ofType(MyTypes.FetchData),
    mergeMap(() =>
      from(apiCall()).pipe(
        map((response) => new FetchDataSuccess(response.data)),
        catchError((error) => {
          console.error('Error:', error);
          return of(
            new FetchDataError(),
            new ShowSnackbar({
              type: SnackbarType.Error,
              messages: [{ msg: 'Failed to fetch data' }]
            })
          );
        })
      )
    )
  );
```

---

### 7. Side Effects Organization

Keep epics focused and single-purpose:

```typescript
// Good - Single responsibility
const fetchGamesEpic: Epic = (action$) => { /* ... */ };
const createGameEpic: Epic = (action$) => { /* ... */ };
const deleteGameEpic: Epic = (action$) => { /* ... */ };

// Bad - Multiple responsibilities
const gamesEpic: Epic = (action$) => { /* handles everything */ };
```

---

### 8. Selector Pattern

Create reusable selectors:

```typescript
// selectors.ts
export const selectGames = (state: AppState) => state.games.games;
export const selectIsLoading = (state: AppState) => 
  state.games.loadStatus === LoadStatus.Fetching;
export const selectApprovedGames = (state: AppState) =>
  state.games.games.filter(game => game.approve);

// Usage
const games = useSelector(selectGames);
const loading = useSelector(selectIsLoading);
const approvedGames = useSelector(selectApprovedGames);
```

---

### 9. Avoid Prop Drilling

Use Redux instead of passing props through many levels:

```typescript
// Bad - Prop drilling
<Parent>
  <Child user={user}>
    <GrandChild user={user}>
      <GreatGrandChild user={user} />
    </GrandChild>
  </Child>
</Parent>

// Good - Use Redux
const GreatGrandChild = () => {
  const user = useSelector((state: AppState) => state.auth.user);
  return <div>{user.name}</div>;
};
```

---

### 10. Testing

Write tests for reducers and epics:

```typescript
describe('authReducer', () => {
  it('should handle LoginUser', () => {
    const action = new LoginUser({ email: 'test@test.com', password: '123456' });
    const newState = authReducer(initialState, action);
    
    expect(newState.spinnerRun).toBe(true);
  });
  
  it('should handle SetCurrentUser', () => {
    const user = { id: 1, name: 'Test', email: 'test@test.com' };
    const action = new SetCurrentUser(user);
    const newState = authReducer(initialState, action);
    
    expect(newState.status).toBe(AuthStatus.Authorized);
    expect(newState.user).toEqual(user);
  });
});
```

---

## Redux DevTools

Enable Redux DevTools for debugging:

```typescript
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && 
  window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(epicMiddleware),
    reduxDevTools
  )
);
```

### Using DevTools

1. Install Redux DevTools browser extension
2. Open browser DevTools
3. Navigate to Redux tab
4. Inspect actions, state, and time-travel debug

---

## Summary

The Redux store architecture provides:
- **Centralized State Management**: Single source of truth
- **Predictable State Updates**: Actions → Reducers → New State
- **Side Effects Handling**: Epics for async operations
- **Type Safety**: TypeScript interfaces throughout
- **Developer Tools**: Time-travel debugging and state inspection

For more information, see:
- **API Documentation**: `API_DOCUMENTATION.md`
- **Components Guide**: `COMPONENTS_GUIDE.md`
- **Redux Documentation**: https://redux.js.org/
- **Redux-Observable**: https://redux-observable.js.org/
