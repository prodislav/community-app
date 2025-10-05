# Frontend Components Guide

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [Form Components](#form-components)
3. [UI Components](#ui-components)
4. [Data Display Components](#data-display-components)
5. [Navigation Components](#navigation-components)
6. [Utility Components](#utility-components)
7. [Component Best Practices](#component-best-practices)

---

## Component Architecture

The frontend follows a modular component architecture with:
- **Container Components**: Connected to Redux store
- **Presentational Components**: Pure UI components
- **Higher-Order Components (HOCs)**: Component wrappers for shared logic

### Component Structure

```
frontend/src/components/
├── Authentication/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.model.ts
│   │   └── LoginForm.scss
│   ├── RegistrationForm/
│   └── ChangePasswordForm/
├── Game/
│   ├── GameCard/
│   ├── GameForm/
│   ├── AddGameComponent/
│   └── EditGameComponent/
├── UI/
│   ├── Mui/              # Material-UI wrapper components
│   ├── Spinner/
│   └── Logo/
└── ...
```

---

## Form Components

### LoginForm Component

**Location:** `frontend/src/components/LoginForm/LoginForm.tsx`

User authentication form with validation and social network integration.

#### Props

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

#### State

```typescript
interface LoginFormState {
  email: string;
  password: string;
  emailErrors: string[];
  passwordErrors: string[];
  isEmailValid: boolean;
  isPasswordValid: boolean;
  touched: {
    email: boolean;
    password: boolean;
  };
}
```

#### Features

- **Email Validation**: Validates email format using regex
- **Password Validation**: Minimum 6 characters
- **Error Display**: Shows validation errors in real-time
- **Loading State**: Displays spinner during authentication
- **Auto-redirect**: Redirects to homepage on successful login
- **Social Networks**: Supports Google, VK, and Facebook login

#### Usage Example

```tsx
import { LoginForm } from 'components';
import { Route } from 'react-router-dom';

<Route path="/login" component={LoginForm} />
```

#### Validation Rules

```typescript
// Email validation
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
- Required: true
- Minimum length: 6 characters
```

#### Connected State

```typescript
const mapStateToProps = (state: AppState) => ({
  status: state.auth.status,
  errors: state.errors,
  spinnerRun: state.auth.spinnerRun
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginUser: (user: UserFieldsToRegister) => 
    dispatch(new LoginUser(user)),
  socialNetworksLogin: (socialNetworksUser: SocialNetworksUser) => 
    dispatch(new SocialNetworksLogin(socialNetworksUser))
});
```

---

### RegistrationForm Component

**Location:** `frontend/src/components/RegistrationForm/RegistrationForm.tsx`

User registration form with comprehensive validation.

#### Fields

- **Email**: Valid email format required
- **Name**: Minimum 3 characters
- **Password**: Minimum 6 characters
- **Password Confirmation**: Must match password
- **Language**: Dropdown selection (English/Russian)

#### Validation Rules

```typescript
interface ValidationRules {
  email: {
    required: true,
    format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  name: {
    required: true,
    minLength: 3
  },
  password: {
    required: true,
    minLength: 6
  },
  password2: {
    required: true,
    mustMatch: 'password'
  }
}
```

#### Usage

```tsx
<Route path="/register" component={RegistrationForm} />
```

---

### ChangePasswordForm Component

**Location:** `frontend/src/components/ChangePasswordForm/ChangePasswordForm.tsx`

Password change form for authenticated users.

#### Props

```typescript
interface ChangePasswordFormProps {
  changePassword: (data: FieldsToChangePassword) => void;
  status: LoadStatus;
}

interface FieldsToChangePassword {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}
```

#### Features

- Old password verification
- New password validation (min 6 characters)
- Password confirmation matching
- Success/error feedback

#### Usage

```tsx
import { ChangePasswordForm } from 'components';

<ChangePasswordForm
  changePassword={handlePasswordChange}
  status={LoadStatus.Init}
/>
```

---

### GameForm Component

**Location:** `frontend/src/components/GameForm/GameForm.tsx`

Form for creating or editing games.

#### Fields

```typescript
interface GameFormFields {
  appName: string;                    // 3-50 characters, unique
  description: string;                // Max 500 characters
  maxRoomPlayer: number;              // 1-100 players
  maxRooms: number;                   // 1-1000 rooms
  requestUrl: string;                 // URL format, unique
  maxWaitingTime: number;             // 5000-300000 milliseconds
  redirectUrl: string;                // URL format, unique
  registrationEventName?: string;     // Optional, 3-50 characters
  leaveEventName?: string;            // Optional, 3-50 characters
  updateRoomsInfoEventName?: string;  // Optional, 3-50 characters
  notifyCountdown?: string;           // Optional, 3-50 characters
}
```

#### Validation

```typescript
const validation = {
  appName: {
    required: true,
    minLength: 3,
    maxLength: 50,
    unique: true
  },
  description: {
    required: true,
    maxLength: 500
  },
  maxRoomPlayer: {
    required: true,
    min: 1,
    max: 100,
    integer: true
  },
  requestUrl: {
    required: true,
    format: 'url',
    unique: true,
    startsWith: '/'
  }
};
```

#### Usage Example

```tsx
import { GameForm } from 'components';

<GameForm
  formType={SettingFormType.AddGame}
  onSubmit={handleGameSubmit}
  initialValues={gameData}
/>
```

---

## UI Components

### CaButton Component

**Location:** `frontend/src/components/Mui/CaButton/CaButton.tsx`

Custom Material-UI button wrapper with consistent styling.

#### Props

```typescript
interface CaButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color?: 'primary' | 'secondary' | 'default';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'text' | 'outlined' | 'contained';
}
```

#### Usage Examples

```tsx
// Primary button
<CaButton color="primary" onClick={handleClick}>
  Click Me
</CaButton>

// Submit button
<CaButton type="submit" disabled={!isValid}>
  Submit Form
</CaButton>

// Secondary outlined button
<CaButton color="secondary" variant="outlined">
  Cancel
</CaButton>
```

---

### CaDialog Component

**Location:** `frontend/src/components/Mui/CaDialog/CaDialog.tsx`

Modal dialog component with customizable content and actions.

#### Props

```typescript
interface CaDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
```

#### Usage Example

```tsx
import { CaDialog } from 'components';

const [open, setOpen] = useState(false);

<CaDialog
  open={open}
  title="Confirm Delete"
  content="Are you sure you want to delete this game?"
  onClose={() => setOpen(false)}
  onConfirm={handleDelete}
  confirmText="Delete"
  cancelText="Cancel"
  maxWidth="sm"
/>
```

---

### CaSnackbar Component

**Location:** `frontend/src/components/Mui/CaSnackbar/CaSnackbar.tsx`

Notification snackbar with multiple types and auto-dismiss.

#### Props

```typescript
interface CaSnackbarProps {
  open: boolean;
  type: SnackbarType;  // 'error' | 'warning' | 'info' | 'success'
  messages: ErrorBlock[];
  onClose: () => void;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

interface ErrorBlock {
  code?: number;
  msg: string;
}
```

#### Usage Example

```tsx
import { CaSnackbar } from 'components';
import { SnackbarType } from 'models';

<CaSnackbar
  open={isOpen}
  type={SnackbarType.Success}
  messages={[
    { msg: 'Game created successfully!' },
    { msg: 'You will be redirected shortly.' }
  ]}
  onClose={() => setIsOpen(false)}
  autoHideDuration={5000}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
/>
```

#### Snackbar Types

```typescript
// Success - Green background
<CaSnackbar type={SnackbarType.Success} ... />

// Error - Red background
<CaSnackbar type={SnackbarType.Error} ... />

// Warning - Orange background
<CaSnackbar type={SnackbarType.Warning} ... />

// Info - Blue background
<CaSnackbar type={SnackbarType.Info} ... />
```

---

### CaSpinner Component

**Location:** `frontend/src/components/Spinner/Spinner.tsx`

Loading spinner overlay.

#### Props

```typescript
interface CaSpinnerProps {
  isActive: boolean;
  size?: number;
  fullScreen?: boolean;
}
```

#### Usage Example

```tsx
import { CaSpinner } from 'components';

// Full screen spinner
<CaSpinner isActive={loading} fullScreen={true} />

// Inline spinner
<CaSpinner isActive={loading} size={30} fullScreen={false} />
```

---

### CaSelect Component

**Location:** `frontend/src/components/Mui/CaSelect/CaSelect.tsx`

Dropdown select component.

#### Props

```typescript
interface CaSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

interface SelectOption {
  value: string | number;
  label: string;
}
```

#### Usage Example

```tsx
import { CaSelect } from 'components';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' }
];

<CaSelect
  options={languageOptions}
  value={selectedLanguage}
  onChange={setSelectedLanguage}
  label="Language"
/>
```

---

### CaTabs / CaTab Components

**Location:** `frontend/src/components/Mui/CaTabs/CaTabs.tsx`

Tab navigation components.

#### Props

```typescript
interface CaTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  children: React.ReactNode;
}

interface CaTabProps {
  label: string;
  icon?: React.ReactNode;
}
```

#### Usage Example

```tsx
import { CaTabs, CaTab } from 'components';

const [selectedTab, setSelectedTab] = useState(0);

<CaTabs value={selectedTab} onChange={(e, val) => setSelectedTab(val)}>
  <CaTab label="Best Users" />
  <CaTab label="Popular Games" />
  <CaTab label="Recent Games" />
</CaTabs>

{selectedTab === 0 && <BestUsersTable />}
{selectedTab === 1 && <PopularGamesTable />}
{selectedTab === 2 && <RecentGamesTable />}
```

---

## Data Display Components

### GameCard Component

**Location:** `frontend/src/components/GameCard/GameCard.tsx`

Displays game information with interactive elements.

#### Props

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

#### Features

- **Game Info Display**: Shows name, description, max players
- **Countdown Timer**: Displays time until game starts
- **Player Count**: Shows current players vs max players
- **Join/Leave Actions**: Interactive buttons for game participation
- **Visual States**: Different styles for full/available games
- **Single Player Mode**: Special display for single-player games
- **Context Menu**: More actions menu (edit, delete, etc.)

#### Visual States

```typescript
// Available game - white border, grey background
isFull = false

// Full game - grey border, black background
isFull = true

// Single player - special layout without timer/players
maxRoomPlayer = 1
```

#### Usage Example

```tsx
import { CaGameCard } from 'components';

const menuItems = [
  {
    title: 'Edit',
    action: () => handleEdit(game.id)
  },
  {
    title: 'Delete',
    action: () => handleDelete(game)
  }
];

<CaGameCard
  game={game}
  joinGame={(appName) => dispatch(joinGameAction(appName))}
  leaveGame={(appName) => dispatch(leaveGameAction(appName))}
  waitBattlePlayersCountAction={3}
  isFull={false}
  battleStartTime={new Date(Date.now() + 60000)}
  isWaitBattle={false}
  moreMenuItems={menuItems}
/>
```

---

### CaTable Component

**Location:** `frontend/src/components/Mui/CaTable/CaTable.tsx`

Data table with sorting and action columns.

#### Props

```typescript
interface CaTableProps {
  headers: HeaderName[];
  rows: Row[];
  defaultSortField?: RowProperty;
  defaultSortOrder?: 'asc' | 'desc';
}

interface HeaderName {
  headerName: string;
  field?: RowProperty;
  type: TypeOfColumn;
  editAction?(payload: number): void;
  deleteAction?(payload: GameModel): void;
  lockAction?(payload: string): void;
}

interface Row {
  [key: string]: any;
}
```

#### Column Types

```typescript
enum TypeOfColumn {
  String = 'String',          // Text display
  TimeCount = 'Spent Time',   // Formatted time display
  Points = 'Points',          // Number with formatting
  Result = 'Result',          // Win/Loss/Draw indicator
  Date = 'Date',              // Formatted date
  Increment = 'Increment'     // Auto-incrementing number
}
```

#### Usage Example

```tsx
import { CaTable } from 'components';
import { RowProperty, TypeOfColumn } from 'models';

const headers = [
  {
    headerName: 'Name',
    field: RowProperty.Name,
    type: TypeOfColumn.String
  },
  {
    headerName: 'Score',
    field: RowProperty.Scores,
    type: TypeOfColumn.Points
  },
  {
    headerName: 'Time Played',
    field: RowProperty.PlayedTime,
    type: TypeOfColumn.TimeCount
  },
  {
    headerName: 'Actions',
    type: TypeOfColumn.String,
    editAction: handleEdit,
    deleteAction: handleDelete
  }
];

const rows = games.map(game => ({
  name: game.appName,
  scores: game.totalScores,
  playedTime: game.totalPlayedTime,
  id: game.id
}));

<CaTable
  headers={headers}
  rows={rows}
  defaultSortField={RowProperty.Scores}
  defaultSortOrder="desc"
/>
```

---

### StatisticTables Component

**Location:** `frontend/src/components/StatisticTables/StatisticTables.tsx`

Tabbed statistics display component.

#### Props

```typescript
interface StatisticTablesProps {
  bestUsers: BestUser[];
  mostPopularGames: MostPopularGames[];
  recentGames: RecentGames[];
  selectedTab: StatTab;
  onTabChange: (tab: StatTab) => void;
}
```

#### Tabs

```typescript
enum StatTab {
  BestUsers = 0,
  TheMostPopularGames = 1,
  RecentGames = 2
}
```

#### Usage Example

```tsx
import { StatisticTables } from 'components';

<StatisticTables
  bestUsers={statistics.bestUsers}
  mostPopularGames={statistics.popularGames}
  recentGames={statistics.recentGames}
  selectedTab={selectedTab}
  onTabChange={setSelectedTab}
/>
```

---

### CircleDiagram Component

**Location:** `frontend/src/components/CircleDiagram/CircleDiagram.tsx`

Pie chart component using ECharts.

#### Props

```typescript
interface CircleDiagramProps {
  options: EChartOption;
  height?: number;
  width?: number;
}
```

#### Usage Example

```tsx
import { CircleDiagram } from 'components';

const options = {
  series: [{
    type: 'pie',
    data: [
      { value: 335, name: 'Wins' },
      { value: 234, name: 'Losses' },
      { value: 154, name: 'Draws' }
    ]
  }]
};

<CircleDiagram
  options={options}
  height={400}
  width={600}
/>
```

---

### BarChart Component

**Location:** `frontend/src/components/BarChart/BarChart.tsx`

Bar chart component using D3.js.

#### Props

```typescript
interface BarChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  margin?: Margin;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface ChartData {
  label: string;
  value: number;
}

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

#### Usage Example

```tsx
import { BarChart } from 'components';

const data = [
  { label: 'Monday', value: 120 },
  { label: 'Tuesday', value: 150 },
  { label: 'Wednesday', value: 180 },
  // ...
];

<BarChart
  data={data}
  width={800}
  height={400}
  margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
  xAxisLabel="Day of Week"
  yAxisLabel="Games Played"
/>
```

---

## Navigation Components

### Navbar Component

**Location:** `frontend/src/components/Navbar/Navbar.tsx`

Main navigation bar with user profile and language switcher.

#### Props

```typescript
interface NavbarProps {
  user?: FrontEndUser;
  isAuthenticated: boolean;
  onLogout: () => void;
  onLanguageChange: (language: Languages) => void;
  currentLanguage: Languages;
}
```

#### Features

- User profile display with avatar
- Language switcher (EN/RU)
- Logout button
- Responsive design
- Logo/branding

#### Usage Example

```tsx
import { Navbar } from 'components';

<Navbar
  user={currentUser}
  isAuthenticated={authStatus === AuthStatus.Authorized}
  onLogout={handleLogout}
  onLanguageChange={handleLanguageChange}
  currentLanguage={currentLanguage}
/>
```

---

### AppMenu Component

**Location:** `frontend/src/components/AppMenu/AppMenu.tsx`

Application menu with navigation items.

#### Props

```typescript
interface AppMenuProps {
  items: AppMenuItem[];
  open: boolean;
  onClose: () => void;
}

interface AppMenuItem {
  icon: JSX.Element;
  title: string;
  action: () => void;
}
```

#### Usage Example

```tsx
import { AppMenu } from 'components';
import HomeIcon from '@material-ui/icons/Home';
import GamesIcon from '@material-ui/icons/SportsEsports';

const menuItems = [
  {
    icon: <HomeIcon />,
    title: 'Home',
    action: () => history.push('/home')
  },
  {
    icon: <GamesIcon />,
    title: 'My Games',
    action: () => history.push('/my-games')
  }
];

<AppMenu
  items={menuItems}
  open={menuOpen}
  onClose={() => setMenuOpen(false)}
/>
```

---

### ProtectedRoute Component

**Location:** `frontend/src/components/ProtectedRoute/ProtectedRoute.tsx`

Route wrapper that requires authentication.

#### Props

```typescript
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  authStatus: AuthStatus;
  path: string;
  exact?: boolean;
}
```

#### Usage Example

```tsx
import { ProtectedRoute } from 'components';

<ProtectedRoute
  path="/profile"
  component={ProfilePage}
  authStatus={authStatus}
  exact
/>

// Redirects to /login if not authenticated
```

---

## Utility Components

### Countdown Component

**Location:** `frontend/src/components/Countdown/Countdown.tsx`

Countdown timer with callback on completion.

#### Props

```typescript
interface CountdownProps {
  startTime: number;      // Milliseconds
  onComplete?: () => void;
  format?: 'HH:MM:SS' | 'MM:SS' | 'SS';
}
```

#### Usage Example

```tsx
import { Countdown } from 'components';

<Countdown
  startTime={60000}  // 1 minute
  onComplete={() => console.log('Time up!')}
  format="MM:SS"
/>
```

---

### MoreMenu Component

**Location:** `frontend/src/components/MoreMenu/MoreMenu.tsx`

Context menu with action items.

#### Props

```typescript
interface MoreMenuProps {
  items: MoreMenuItem[];
}

interface MoreMenuItem {
  title: string;
  action: () => void;
  icon?: JSX.Element;
}
```

#### Usage Example

```tsx
import { MoreMenu } from 'components';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const menuItems = [
  {
    title: 'Edit',
    icon: <EditIcon />,
    action: handleEdit
  },
  {
    title: 'Delete',
    icon: <DeleteIcon />,
    action: handleDelete
  }
];

<MoreMenu items={menuItems} />
```

---

### YandexMap Component

**Location:** `frontend/src/components/YandexMap/YandexMap.tsx`

Yandex Maps integration for event locations.

#### Props

```typescript
interface YandexMapProps {
  latitude: string;
  longitude: string;
  zoom?: number;
  markers?: MapMarker[];
  onLocationChange?: (lat: string, lng: string) => void;
}

interface MapMarker {
  latitude: string;
  longitude: string;
  title?: string;
  description?: string;
}
```

#### Usage Example

```tsx
import { YandexMap } from 'components';

<YandexMap
  latitude="40.7128"
  longitude="-74.0060"
  zoom={12}
  markers={[
    {
      latitude: "40.7128",
      longitude: "-74.0060",
      title: "Event Location",
      description: "Community Center"
    }
  ]}
  onLocationChange={(lat, lng) => {
    console.log('New location:', lat, lng);
  }}
/>
```

---

### Logo Component

**Location:** `frontend/src/components/Logo/Logo.tsx`

Application logo with optional link.

#### Props

```typescript
interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  onClick?: () => void;
}
```

#### Usage Example

```tsx
import { Logo } from 'components';

<Logo
  size="medium"
  clickable={true}
  onClick={() => history.push('/')}
/>
```

---

### SocialNetworksBlock Component

**Location:** `frontend/src/components/SocialNetworksBlock/SocialNetworksBlock.tsx`

Social network authentication buttons.

#### Props

```typescript
interface SocialNetworksBlockProps {
  history: History;
  isRestorePasswordVisible?: boolean;
}
```

#### Features

- Google login button
- VK login button
- Facebook login button
- Optional password restore link

#### Usage Example

```tsx
import { SocNetBlock } from 'components';

<SocNetBlock
  history={history}
  isRestorePasswordVisible={true}
/>
```

---

## Component Best Practices

### 1. TypeScript Props

Always define prop interfaces:

```typescript
interface MyComponentProps {
  title: string;
  onSave: (data: any) => void;
  isLoading?: boolean;  // Optional props with ?
}

const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onSave, 
  isLoading = false  // Default value
}) => {
  // Component logic
};
```

---

### 2. Redux Connection

Use typed selectors and dispatchers:

```typescript
const mapStateToProps = (state: AppState) => ({
  games: state.games.games,
  loading: state.games.loadStatus === LoadStatus.Fetching
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getGames: () => dispatch(new GetGames())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyComponent);
```

---

### 3. Internationalization

Always use i18n for user-facing text:

```tsx
import { I18n } from 'react-i18next';

<I18n>{(t) => (
  <button>{t('login')}</button>
)}</I18n>
```

---

### 4. Component Composition

Break down complex components:

```tsx
// Bad: Single large component
const GamePage = () => {
  return (
    <div>
      {/* 500 lines of JSX */}
    </div>
  );
};

// Good: Composed components
const GamePage = () => {
  return (
    <>
      <GameHeader />
      <GameList />
      <GameFooter />
    </>
  );
};
```

---

### 5. Event Handlers

Use meaningful handler names:

```typescript
// Good
const handleLoginClick = () => { };
const handleEmailChange = (e) => { };
const handleFormSubmit = (e) => { };

// Bad
const click = () => { };
const change = (e) => { };
const submit = (e) => { };
```

---

### 6. Loading States

Always handle loading states:

```tsx
const MyComponent = ({ data, loading }) => {
  if (loading) {
    return <CaSpinner isActive={true} />;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return <div>{/* Render data */}</div>;
};
```

---

### 7. Error Boundaries

Wrap components with error boundaries:

```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error('Error:', error, info);
  }

  render() {
    return this.props.children;
  }
}

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

---

### 8. Styling

Use SCSS modules for component-specific styles:

```scss
// GameCard.scss
.ca-game-card {
  border: 1px solid #ccc;
  padding: 16px;
  
  &__title {
    font-size: 24px;
    font-weight: bold;
  }
  
  &__description {
    color: #666;
  }
}
```

---

### 9. Performance Optimization

Use React.memo for expensive components:

```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

---

### 10. Testing

Write tests for components:

```typescript
import { render, fireEvent } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('validates email format', () => {
    const { getByLabelText, getByText } = render(<LoginForm />);
    
    const emailInput = getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    
    expect(getByText('Invalid email format')).toBeInTheDocument();
  });
});
```

---

## Accessibility Guidelines

### 1. Semantic HTML

Use semantic HTML elements:

```tsx
// Good
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

// Bad
<div>
  <div>
    <div><div onClick={goHome}>Home</div></div>
  </div>
</div>
```

---

### 2. ARIA Labels

Add ARIA labels for screen readers:

```tsx
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <CloseIcon />
</button>
```

---

### 3. Keyboard Navigation

Ensure keyboard accessibility:

```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>
```

---

## Summary

This guide covers all major frontend components in the Community Application. For more detailed API documentation, refer to `API_DOCUMENTATION.md`.

### Key Takeaways

- Use TypeScript for type safety
- Connect components to Redux when needed
- Always use i18n for user-facing text
- Handle loading and error states
- Write accessible, semantic HTML
- Test your components
- Follow consistent naming conventions
- Break down complex components into smaller pieces
