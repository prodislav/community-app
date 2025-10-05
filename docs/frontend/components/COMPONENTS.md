## Components Overview
Re-exported from `frontend/src/components/index.ts`.

### ProtectedRoute
- Props: `ProtectedRouteProps` { status: AuthStatus; path: string; children }
- Usage:
```tsx
<ProtectedRoute status={AuthStatus.Authorized} path="/dashboard">
  <Dashboard />
</ProtectedRoute>
```

### CaButton (Material UI wrapper)
- Props: inherits Material `ButtonProps`
- Usage:
```tsx
<CaButton color="primary" variant="raised">Save</CaButton>
```

### CaSnackbar
- Props: `CaSnackbarProps` { type: SnackbarType; transitionDirection; message; onClose?; ...SnackbarProps }
- Usage:
```tsx
<CaSnackbar open type={SnackbarType.Success} message="Saved" transitionDirection={transitionDirection.Up} />
```

### CaTable
- Props: `CaTableProps` { rowData: Row[]; columnDef: HeaderName[]; handleRowClick? }
- Usage:
```tsx
<CaTable rowData={rows} columnDef={columns} />
```

### CaSelect
- Props: `CaSelectProps` { values: string[]; displayedValues: string[]; currentValue: string; handleChange(evt, i18n) }
- Usage:
```tsx
<CaSelect values={["en","ru"]} displayedValues={["EN","RU"]} currentValue="en" handleChange={onChange} />
```

### AppMenu
- Props: `AppMenuProps` { appMenuItems: AppMenuItem[]; imageUrl?; children? }

### Spinner
- Props: `SpinnerProps` { isActive: boolean }

### GameCard
- Props: `GameCardProps` { game: GameModel; status: BattleStatus; battleStartTime: Date; moreMenuItems: MoreMenuItem[]; joinGame(id); leaveGame(id) }

### Charts
- CircleDiagram: `CircleDiagramProps` { diagramData: WinRateDiagramData }
- BarChart: `BarChartProps` { diagramData: WeekReportData[]; config: BarChartConfig }

### Forms
- LoginForm: `LoginFormProps` { status: AuthStatus; history; spinnerRun; loginUser(); socialNetworksLogin() }
- RegistrationForm: `RegistrationFormProps` { history; status; spinnerRun; language; registerUser() }
- ChangePasswordForm: `ChangePasswordFormProps` { user: FrontEndUser | undefined; changePasswordStatus: LoadStatus; submit(data) }
- GameForm: `GameFormProps` { userId; config: SettingFormType; model: GameForSettingForm; submit(GameModel) }
- AddGameComponent: `AddGameComponentProps` { authStatus; history; user; addGame(GameModel) }
- EditGameComponent: `EditGameComponentProps` { authStatus; history; user; games; match; editGame(GameModel) }

### Misc
- Navbar: `NavbarProps` { linksToRender?: Link[]; children? }
- Logo: `LogoProps` { text: string; onClick: () => void }
- VkDialog: `VkDialogProps` { apiId; open; onClose; onSuccess }
- Countdown: `CountdownProps` { time: number; onTimeChange? }
- Author: `AuthorProps` { author_name; author_picture }

