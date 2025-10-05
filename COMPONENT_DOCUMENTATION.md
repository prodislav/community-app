# Frontend Components Detailed Documentation

## Table of Contents

1. [UI Components](#ui-components)
2. [Form Components](#form-components)
3. [Chart Components](#chart-components)
4. [Layout Components](#layout-components)
5. [Game Components](#game-components)
6. [Utility Components](#utility-components)

## UI Components

### CaButton
Custom button component with Material-UI integration.

**File:** `frontend/src/components/Mui/CaButton/CaButton.tsx`

**Props:**
```typescript
interface CaButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'default';
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}
```

**Usage Examples:**
```tsx
// Basic button
<CaButton onClick={handleClick}>
  Click Me
</CaButton>

// Primary button with custom styling
<CaButton 
  color="primary" 
  variant="contained"
  className="custom-button"
  onClick={handleSubmit}
>
  Submit
</CaButton>

// Disabled button
<CaButton 
  disabled={isLoading}
  onClick={handleAction}
>
  {isLoading ? 'Loading...' : 'Action'}
</CaButton>
```

### Spinner
Loading indicator component.

**File:** `frontend/src/components/Spinner/Spinner.tsx`

**Props:**
```typescript
interface SpinnerProps {
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  className?: string;
}
```

**Usage:**
```tsx
<CaSpinner isActive={isLoading} size="large" />
```

### Logo
Application logo component with customizable styling.

**File:** `frontend/src/components/Logo/Logo.tsx`

**Props:**
```typescript
interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal';
}
```

## Form Components

### LoginForm
Complete login form with validation and social authentication.

**File:** `frontend/src/components/LoginForm/LoginForm.tsx`

**Features:**
- Email and password validation
- Real-time error display
- Social network integration (Google, VK)
- Loading states
- Internationalization support

**Props:**
```typescript
interface LoginFormProps {
  history: History;
  status: AuthStatus;
  errors: Errors;
  spinnerRun: boolean;
  loginUser: (user: UserFieldsToLogin) => void;
  socialNetworksLogin: (user: SocialNetworksUser) => void;
}
```

**State:**
```typescript
interface LoginFormState {
  email: string;
  password: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  touched: {
    email: boolean;
    password: boolean;
  };
  emailErrors: string[];
  passwordErrors: string[];
}
```

**Usage:**
```tsx
<LoginForm
  history={history}
  status={authStatus}
  errors={errors}
  spinnerRun={isLoading}
  loginUser={handleLogin}
  socialNetworksLogin={handleSocialLogin}
/>
```

### RegistrationForm
User registration form with comprehensive validation.

**File:** `frontend/src/components/RegistrationForm/RegistrationForm.tsx`

**Features:**
- Full user data validation
- Password confirmation
- Language selection
- Social registration support

**Props:**
```typescript
interface RegistrationFormProps {
  history: History;
  status: AuthStatus;
  errors: Errors;
  spinnerRun: boolean;
  registerUser: (user: UserFieldsToRegister) => void;
  socialNetworksLogin: (user: SocialNetworksUser) => void;
}
```

### ChangePasswordForm
Password change functionality for authenticated users.

**File:** `frontend/src/components/ChangePasswordForm/ChangePasswordForm.tsx`

**Features:**
- Current password verification
- New password validation
- Password confirmation matching
- Security requirements

### GameForm
Form for adding/editing games (admin functionality).

**File:** `frontend/src/components/GameForm/GameForm.tsx`

**Features:**
- Game configuration
- Validation for all game parameters
- Support for both add and edit modes

## Chart Components

### BarChart
D3.js-based bar chart component.

**File:** `frontend/src/components/BarChart/BarChart.tsx`

**Props:**
```typescript
interface BarChartProps {
  data: any[];
  width: number;
  height: number;
  margin: Margin;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  animation?: boolean;
}
```

**Usage:**
```tsx
<BarChart
  data={chartData}
  width={800}
  height={400}
  margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
  xAxisLabel="Games"
  yAxisLabel="Score"
  color="#1976d2"
  animation={true}
/>
```

### CircleDiagram
D3.js-based pie chart component.

**File:** `frontend/src/components/CircleDiagram/CircleDiagram.tsx`

**Props:**
```typescript
interface CircleDiagramProps {
  data: any[];
  width: number;
  height: number;
  margin: Margin;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
}
```

### ChartContainer
Wrapper component for charts with responsive behavior.

**File:** `frontend/src/components/ChartContainer/ChartContainer.tsx`

**Features:**
- Responsive sizing
- Chart type switching
- Loading states
- Error handling

## Layout Components

### AppMenu
Main navigation menu component.

**File:** `frontend/src/components/AppMenu/AppMenu.tsx`

**Props:**
```typescript
interface AppMenuProps {
  items: AppMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  anchorEl?: HTMLElement;
}
```

**Features:**
- Material-UI drawer integration
- Customizable menu items
- Icon support
- Action callbacks

### Navbar
Top navigation bar component.

**File:** `frontend/src/components/Navbar/Navbar.tsx`

**Features:**
- User authentication state
- Language switching
- Responsive design
- Logo integration

### MoreMenu
Context menu for additional actions.

**File:** `frontend/src/components/MoreMenu/MoreMenu.tsx`

**Props:**
```typescript
interface MoreMenuProps {
  items: MoreMenuItem[];
  anchorEl?: HTMLElement;
  onClose: () => void;
}
```

## Game Components

### GameCard
Main game display component with join/leave functionality.

**File:** `frontend/src/components/GameCard/GameCard.tsx`

**Props:**
```typescript
interface GameCardProps {
  game: GameModel;
  joinGame: (appName: string) => void;
  leaveGame: (appName: string) => void;
  waitBattlePlayersCountAction: number;
  isFull: boolean;
  battleStartTime: Date;
  isWaitBattle: boolean;
  moreMenuItems: MoreMenuItem[];
}
```

**Features:**
- Game information display
- Player count tracking
- Battle timer
- Join/leave functionality
- Responsive design
- Internationalization

**Usage:**
```tsx
<CaGameCard
  game={{
    appName: "Space Battle",
    description: "Epic space combat game",
    maxRoomPlayer: 4,
    // ... other game properties
  }}
  joinGame={handleJoinGame}
  leaveGame={handleLeaveGame}
  waitBattlePlayersCountAction={3}
  isFull={false}
  battleStartTime={new Date(Date.now() + 300000)} // 5 minutes from now
  isWaitBattle={false}
  moreMenuItems={[
    { title: "View Details", action: () => console.log("Details") },
    { title: "Share", action: () => console.log("Share") }
  ]}
/>
```

### AddGameComponent
Component for adding new games (admin functionality).

**File:** `frontend/src/components/AddGameComponent/AddGameComponent.tsx`

**Features:**
- Game configuration form
- Validation
- Image upload
- Real-time preview

### EditGameComponent
Component for editing existing games.

**File:** `frontend/src/components/EditGameComponent/EditGameComponent.tsx`

**Features:**
- Pre-populated form
- Update functionality
- Validation
- Change tracking

### Countdown
Timer component for game countdowns.

**File:** `frontend/src/components/Countdown/Countdown.tsx`

**Props:**
```typescript
interface CountdownProps {
  timeLeft: number; // in seconds
  onTimeUp: () => void;
  format?: 'mm:ss' | 'hh:mm:ss';
  showMilliseconds?: boolean;
}
```

**Usage:**
```tsx
<Countdown
  timeLeft={300} // 5 minutes
  onTimeUp={() => console.log("Time's up!")}
  format="mm:ss"
  showMilliseconds={false}
/>
```

## Utility Components

### ProtectedRoute
Route wrapper for authentication-protected pages.

**File:** `frontend/src/components/ProtectedRoute/ProtectedRoute.tsx`

**Props:**
```typescript
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  isAuthenticated: boolean;
  redirectTo?: string;
}
```

**Usage:**
```tsx
<ProtectedRoute
  path="/dashboard"
  component={Dashboard}
  isAuthenticated={isLoggedIn}
  redirectTo="/login"
/>
```

### StatisticTables
Data table component for displaying statistics.

**File:** `frontend/src/components/StatisticTables/StatisticTables.tsx`

**Props:**
```typescript
interface StatisticTablesProps {
  data: Row[];
  headers: HeaderName[];
  onEdit?: (id: number) => void;
  onDelete?: (item: GameModel) => void;
  onLock?: (appName: string) => void;
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
}
```

**Features:**
- Sortable columns
- Pagination
- Action buttons
- Responsive design
- Custom cell rendering

### SocialNetworksBlock
Social authentication buttons.

**File:** `frontend/src/components/SocialNetworksBlock/SocialNetworksBlock.tsx`

**Props:**
```typescript
interface SocialNetworksBlockProps {
  history: History;
  isRestorePasswordVisible?: boolean;
  onGoogleLogin?: (response: GoogleSuccessResponse) => void;
  onVkLogin?: (response: VkSuccessResponse) => void;
}
```

### VkDialog
VK authentication dialog component.

**File:** `frontend/src/components/VkDialog/VkDialog.tsx`

**Features:**
- VK API integration
- User data extraction
- Error handling
- Loading states

### YandexMap
Yandex Maps integration component.

**File:** `frontend/src/components/YandexMap/YandexMap.tsx`

**Props:**
```typescript
interface YandexMapProps {
  center: [number, number];
  zoom: number;
  markers?: Array<{
    coordinates: [number, number];
    title: string;
    description?: string;
  }>;
  onMarkerClick?: (marker: any) => void;
}
```

## Component Styling

All components use SCSS for styling with the following structure:
- Component-specific styles in `ComponentName.scss`
- Shared styles in `style/` directory
- Material-UI theme integration
- Responsive design patterns
- CSS modules for scoped styling

## Internationalization

Components support multiple languages through `react-i18next`:
- English (en)
- Russian (ru)

Usage in components:
```tsx
import { I18n } from 'react-i18next';

<I18n>
  {(t) => (
    <div>{t('welcomeMessage')}</div>
  )}
</I18n>
```

## State Management

Components integrate with Redux for:
- Authentication state
- Loading states
- Error handling
- Data caching
- User preferences

## Testing

Components include:
- Unit tests with Jest
- Snapshot testing
- Integration tests
- Accessibility testing

## Performance Considerations

- React.memo for expensive components
- Lazy loading for large components
- Virtual scrolling for large lists
- Image optimization
- Bundle splitting