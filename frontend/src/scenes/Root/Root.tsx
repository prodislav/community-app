import {
  AppMenu,
  CaAddGame,
  CaButton,
  CaLogo,
  CaNavbar,
  LoginForm,
  RegistrationForm
} from 'components';
import { CaEditGame } from 'components/EditGameComponent/EditGameComponent';
import { CaSelect } from 'components/form-controls/CaSelect';
import { i18n } from 'i18next';
import * as Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';
import { AppMenuItem, AuthStatus, languages } from 'models';
import * as React from 'react';
import { I18n } from 'react-i18next';
import { connect } from 'react-redux';
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { CaBattles, CurrentBattle } from 'scenes/Battles';
import { Landing } from 'scenes/Landing';
import { CaStatisticPage } from 'scenes/Statistic';
import { CaUserSettings } from 'scenes/UserSettings';
import {
  AppState,
  CleanStatistic,
  FrontEndUser,
  LeaveBattle,
  LogoutUser,
  SetCurrentUser,
  store
} from 'store';
import { getCurrentLanguage, setAuthToken } from 'utils';

import AccountCircle from '@material-ui/icons/AccountCircle';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/SettingsRounded';
import AdminIcon from '@material-ui/icons/SupervisorAccount';

import { CaMyGames } from '../MyGames/MyGames';
import { PageNotFound } from '../PageNotFound';

import { RootProps } from './Root.model';
import './root.scss';

const token = Cookies.get('jwtToken');

if (token) {
  setAuthToken(token);
  const decoded: FrontEndUser = jwt_decode(token);
  store.dispatch(new SetCurrentUser(decoded));
}

export class RootComponent extends React.Component<RootProps> {
  public logoutUser = (): void => {
    this.props.logoutUser();
    this.props.cleanStatistic();
    this.props.history.push('/');

    const userInBattle = !!this.props.battleName;

    if (userInBattle) {
      this.props.leaveBattle(this.props.battleName);
    }
  }

  public redToLogin = (): void => {
    this.props.logoutUser();
    this.props.history.push('/login');
  }

  public handleChange = (event: React.ChangeEvent<HTMLSelectElement>, i18n: i18n) => {
    const language = event.target.value;

    i18n.changeLanguage(language);
  }

  public getMenuProfilePanel = (): JSX.Element => {
    return (
      <div className='app-menu__profile'>
        <div className='app-menu__profile-icon-block'>
          <AccountCircle style={{
              color: 'inherit',
              fontSize: '42px'
            }}
          />
        </div>
        <div className='app-menu__profile-text-block'>
          <div className='app-menu__profile-name'>
            {this.props.user && this.props.user.name}
          </div>
          <div className='app-menu__profile-email'>
            {this.props.user && this.props.user.email}
          </div>
        </div>
      </div>
    );
  }

  public getNavbar(authStatus: number): JSX.Element {
    const isAuthorized = authStatus === AuthStatus.AUTHORIZED;

    const appMenuItems: AppMenuItem[] = [
      {
        icon: <SettingsIcon />,
        title: 'settings',
        action: () => this.props.history.push('/settings')
      },
      {
        icon: <AdminIcon />,
        title: 'adminPage',
        action: () => this.props.history.push('/my-games')
      },
      {
        icon: <LogoutIcon />,
        title: 'logout',
        action: isAuthorized ? this.logoutUser : this.redToLogin
      }
    ];

    return (
      <I18n>
        {
          (t, { i18n }) => (
            <CaNavbar
              linksToRender={[
                {
                  text: t('battles'),
                  to: '/battles',
                  activeClassName: 'ca-navbar__nav-item--active',
                  disabled: !isAuthorized
                },
                {
                  text: t('statistics'),
                  to: '/statistics',
                  activeClassName: 'ca-navbar__nav-item--active',
                  disabled: !isAuthorized
                }
              ]}
            >
              <CaLogo text="battlenet" />
              <div className="ca-navbar__menu-container">
                {
                  isAuthorized
                  ? <AppMenu appMenuItems={appMenuItems} >
                      {this.getMenuProfilePanel()}
                    </AppMenu>
                  : <CaButton onClick={this.redToLogin}>{t('login')}</CaButton>
                }
              </div>


              <div className='ca-navbar__select-language'>
                <CaSelect
                  values={[languages.en, languages.ru]}
                  displayedValues={[t('ENToggle'), t('RUToggle')]}
                  handleChange={this.handleChange}
                  currentValue={getCurrentLanguage(i18n)}
                />
              </div>
            </CaNavbar>
          )
        }
      </I18n>
    );
  }

  public render(): JSX.Element {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route
              exact={true}
              path="/"
              render={props => (
                <Landing {...props}>
                  {this.getNavbar(this.props.status)}
                </Landing>
              )}
            />

            <Route
              exact={true}
              path="/register"
              render={props => (
                <RegistrationForm {...props}>
                  {this.getNavbar(this.props.status)}
                </RegistrationForm>
              )}
            />

            <Route
              exact={true}
              path="/login"
              render={props => (
                <LoginForm {...props}>
                  {this.getNavbar(this.props.status)}
                </LoginForm>
              )}
            />
            <Route
              exact={true}
              path="/homepage"
              render={props => <Redirect to="/battles" />}
            />

            <Route
              exact={true}
              path="/statistics"
              render={props => (
                <CaStatisticPage {...props}>
                  {this.getNavbar(this.props.status)}
                </CaStatisticPage>
              )}
            />

            <Route
              exact={true}
              path="/battles"
              render={props => (
                <CaBattles {...props}>
                  {this.getNavbar(this.props.status)}
                </CaBattles>
              )}
            />

            <Route
              exact={true}
              path="/battles/:id"
              render={props => (
                <CurrentBattle {...props}>
                  {this.getNavbar(this.props.status)}
                </CurrentBattle>
              )}
            />

            <Route
              exact={true}
              path="/my-games"
              render={props => (
                <CaMyGames {...props}>
                  {this.getNavbar(this.props.status)}
                </CaMyGames>
              )}
            />

            <Route
              exact={true}
              path="/my-games/add-game"
              render={props => (
                <CaAddGame {...props}>
                  {this.getNavbar(this.props.status)}
                </CaAddGame>
              )}
            />

            <Route
              exact={true}
              path="/my-games/edit-game/:idOfTheGame"
              render={props => (
                <CaEditGame {...props}>
                  {this.getNavbar(this.props.status)}
                </CaEditGame>
              )}
            />
            <Route
              exact={true}
              path="/settings"
              render={props => (
                <CaUserSettings {...props}>
                  {this.getNavbar(this.props.status)}
                </CaUserSettings>
              )}
            />
            <Route
              path="/*"
              render={() => (
                <PageNotFound>{this.getNavbar(this.props.status)}</PageNotFound>
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  status: state.auth.status,
  battleName: state.battle.battleName,
  user: state.auth.user
});

const mapDispatchToProps = (dispatch: any) => ({
  logoutUser: () => dispatch(new LogoutUser()),
  cleanStatistic: () => dispatch(new CleanStatistic()),
  leaveBattle: (battleName: string) => dispatch(new LeaveBattle(battleName))
});

export const Root = connect(
  mapStateToProps,
  mapDispatchToProps
)(RootComponent);
