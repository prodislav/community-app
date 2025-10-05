## Redux Store
Location: `frontend/src/store`

### AppState
Defined in `store.config.ts`:
- `auth: AuthState`
- `games: GamesState`
- `statistic: StatisticState`
- `socket: SocketState`
- `snackbarUi: SnackbarUiState`
- `restorePassword: RestorePasswordState`
- `userSettings: UserSettingsState`
- `myGames: MyGamesState`
- `room: RoomState`

### Actions (selected)
- Auth: `RegisterUser`, `LoginUser`, `LogoutUser`, `SetCurrentUser`, `SocialNetworksLogin`
- Games: `LoadGames`, `LoadGamesSuccess`, `LoadGamesError`
- Events: `AddEvent`, `DeleteEvent`, `EditEvent`, `LoadEvents`, `LoadEvent`
- MyGames: `AddGame`, `EditGame`, `DeleteGame`, `InitMyGames`, `LoadMyGamesSuccess`
- Statistic: `InitBestUsers`, `InitMostPopularGames`, `InitRecentGames(userToken)`, `InitLeaders(appName)`
- RestorePassword: `SendRestoreRequest(email)`, `ResetRequest`
- Room: `SetRooms`, `SetPlayerRoom`, `JoinRoom`, `LeaveRoom`, `NotifyCountdown`
- Socket: `InitEvents(games)`, `EmitEvent(name)`, `EmitEventWithOptions({ eventName, options })`, `CloseSocket`

### Effects (Epics)
See `*.effects.ts` files in each module. Root epic combines all.

### Usage
```ts
import { connect } from 'store';
import { LoadGames } from 'store/games';

const mapState = (state: AppState) => ({ games: state.games });
const mapDispatch = (dispatch) => ({ load: () => dispatch(new LoadGames()) });

export default connect(mapState)(Component);
```
