## Frontend Components

Import from `frontend/src/components` or specific paths. Below list shows public components and their props.

### AppMenu
- Import: `import { AppMenu } from 'components';`
- Props:
```ts
interface AppMenuProps {
  appMenuItems: AppMenuItem[]; // from models
  children?: JSX.Element;
  imageUrl?: string;
}
```
- Usage:
```tsx
<AppMenu appMenuItems={[{ title: 'logout', action: onLogout, icon: <Exit/> }]} />
```

### StatisticTables
- Import: `import { StatisticTables } from 'components';`
- Props:
```ts
interface StatisticTablesProps {
  statistic: StatisticState; // from store/statistic
  games: GamesState;         // from store
}
```
- Behavior: Renders tabs for Best Users, Most Popular Games, Recent Games and a chart area; uses `CaTable`, `CaTabs`, `ChartContainer`.

### Countdown
- Import: `import { Countdown } from 'components';`
- Props:
```ts
interface CountdownProps { time: number; onTimeChange?: () => number }
```
- Usage:
```tsx
<Countdown time={60000} />
```

### GameCard
- Import: `import { CaGameCard } from 'components';`
- Props:
```ts
interface GameCardProps {
  game: GameModel; status: BattleStatus; battleStatus: BattleStatus;
  waitBattlePlayersCountAction: number; isWaitBattle: boolean; isFull?: boolean;
  battleStartTime: Date; moreMenuItems: MoreMenuItem[];
  joinGame(ev: string): void; leaveGame(ev: string): void;
}
```
- Usage:
```tsx
<CaGameCard game={game} status={status} battleStatus={status}
  waitBattlePlayersCountAction={0} isWaitBattle={false} battleStartTime={new Date()}
  moreMenuItems={items} joinGame={join} leaveGame={leave}
/>
```

### LoginForm
- Import: `import { LoginForm } from 'components';`
- Props:
```ts
interface LoginFormProps {
  status: AuthStatus; history: History; spinnerRun: boolean;
  loginUser(user: UserFieldsToLogin): void;
  socialNetworksLogin(user: SocialNetworksUser): void;
}
```

### RegistrationForm
- Import: `import { RegistrationForm } from 'components';`
- Props:
```ts
interface RegistrationFormProps {
  history: History; status: AuthStatus; spinnerRun: boolean;
  language: string;
  registerUser(user: UserFieldsToRegister): void;
}
```

### ChangePasswordForm
- Import: `import { ChangePasswordForm } from 'components';`
- Props:
```ts
interface ChangePasswordFormProps {
  user: FrontEndUser | undefined;
  changePasswordStatus: LoadStatus;
  submit(data: FieldsToChangePassword): void;
}
```

### Navbar
- Import: `import { CaNavbar } from 'components';`
- Props:
```ts
interface NavbarProps {
  children?: JSX.Element[] | JSX.Element;
  linksToRender?: { text?: string; to: string; activeClassName?: string; disabled: boolean; }[];
}
```

### ProtectedRoute
- Import: `import { ProtectedRoute } from 'components';`
- Props:
```ts
interface ProtectedRouteProps extends RouteProps { status: AuthStatus }
```
- Usage:
```tsx
<ProtectedRoute path="/dashboard" status={status}>
  <Dashboard />
</ProtectedRoute>
```

### Charts
- CircleDiagram
  - Import: `import { CircleDiagram } from 'components';`
  - Props: `interface CircleDiagramProps { diagramData: WinRateDiagramData }`
- BarChart
  - Import: `import { BarChart } from 'components/BarChart';`
  - Props:
```ts
interface BarChartProps { diagramData: WeekReportData[]; config: BarChartConfig }
```
- ChartContainer
  - Import: `import { ChartContainer } from 'components';`
  - Props:
```ts
interface ChartContainerProps {
  statistics: StatisticState; itemName: string; chartList: string[]; games: GameModel[];
}
```

### Mui Wrappers
- CaButton: `({ children, ...ButtonProps })`
- CaDialog: `({ open, onClose, onAccept })`
- CaSnackbar: `CaSnackbarProps extends SnackbarProps { type, transitionDirection, handleClose? }`
- CaSelect: `CaSelectProps extends SelectProps { values, displayedValues, currentValue, handleChange }`
- CaTabs: `(props: TabsProps)` and CaTab: `(props: TabProps)`
- CaTable: `CaTableProps { rowData: Row[]; columnDef: HeaderName[]; handleRowClick? }`
- CaDelete, CaEdit, CaCopy, CaDialogInfo, CaLock: see component folders for props models

### Author
- Import: `import { CaAuthor } from 'components';`
- Props: `AuthorProps { author_name: string; author_picture: string }`

### VkDialog
- Import: `import { VkDialog } from 'components';`
- Props:
```ts
interface VkDialogProps extends IconButtonProps {
  apiId: string; open: boolean; onClose: () => void;
  onSuccess: (response: VkSuccessResponse, email: string) => void;
}
```

