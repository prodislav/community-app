import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  AuthStatus,
  GameModel,
  MoreMenuItem,
  RoomInfo
} from 'models';

import { CaGameCard, CaSpinner } from 'components';
import { isEmpty } from 'utils';

import {
  AppState,
  JoinRoom,
  LeaveRoom,
  LoadGames,
  LogoutUser,
} from 'store';

import { BattleProps } from './Battles.model';

import './Battles.scss';

class CaBattlesComponent extends React.Component<BattleProps> {

  public componentWillMount(): void {
    const isAuthenticated = this.props.authStatus === AuthStatus.Authorized;

    if (!isAuthenticated) {
      this.props.history.push('/login');
    }

    this.props.initGames();
  }

  public getGameRooms = (game: GameModel): RoomInfo[] => {
    return this.props.rooms.filter(r => r.gameId === game.id);
  }

  public getNearestCountdown = (rooms: RoomInfo[]): number => {
    const mappedRooms = rooms
      .map(r => r.distance)
      .filter(d => !!d);

    const sortedRooms = mappedRooms && mappedRooms.length ? mappedRooms
      .sort((a: number | undefined, b: number | undefined) => {
        return a && b ? a - b : 1 - 2;
      }) as number[] : [];

    return sortedRooms && sortedRooms[0] ? sortedRooms[0] : 0;
  }

  public getGithubCorner = () => {
    return (
      <svg
        viewBox='0 0 250 250'
        aria-hidden='true'
        className='ca-homepage__github-svg'
      >
        <a
          href='https://github.com/js-machine/community-app'
          className='ca-homepage__github-url'
          aria-label='View source on GitHub'
        >
          <path d='M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z' />
          <path
            d='M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,
            72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2'
            fill='currentColor'
            className='ca-homepage__octo-arm'
          />
          <path
            d='M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,
            98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,
            40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,
            77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,
            112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,
            137.7 141.6,141.9 141.8,141.8 Z'
            fill='currentColor'
            className='octo-body'
          />
        </a>
      </svg>
    );
  }

  public redToWaitRoom = (): void => {
    this.props.history.push('/wait-battle');
  }

  public render(): JSX.Element {
    const {
      children,
      games,
      gameId,
      leaveBattleAction,
      history,
      battleStatus,
      status,
      joinRoom
    } = this.props;
    return (
      <div className='ca-homepage'>
        {children}
        {this.getGithubCorner()}

        {!isEmpty(games) && (
          <div className='ca-homepage__container ca-global-fadeIn'>
            {games.map((game: GameModel, index: number) => {
              const moreMenuItems: MoreMenuItem[] =
                gameId === game.id
                  ? [
                    {
                      title: 'leaders',
                      action: () => history.push(`/leaders/${game.appName}`)
                    },
                    {
                      title: 'leaveTheRoom',
                      action: () => leaveBattleAction(game.appName)
                    }
                  ]
                  : [
                    {
                      title: 'leaders',
                      action: () => history.push(`/leaders/${game.appName}`)
                    }
                  ];

              const gameRooms = this.getGameRooms(game);
              const waitBattlePlayersCount = gameRooms && gameRooms.length ? gameRooms
                .map(r => r.playersCount)
                .reduce((accumulator, currentValue: number) => accumulator + currentValue) : 0;

              return (
                <div className='ca-homepage__container-for-games' key={index}>
                  <CaGameCard
                    game={game}
                    joinGame={($event) => {
                      joinRoom($event);
                      history.push(`/wait-battle`);
                    }}
                    moreMenuItems={moreMenuItems}
                    leaveGame={this.redToWaitRoom}
                    status={battleStatus}
                    battleStatus={battleStatus}
                    waitBattlePlayersCountAction={waitBattlePlayersCount}
                    // (Mikalai) add logic if we don't have empty place for new player
                    isFull={!!gameId && gameId !== game.id}
                    isWaitBattle={gameId === game.id ? true : false}
                    battleStartTime={new Date((new Date()).getTime() + this.getNearestCountdown(gameRooms))}
                  />
                </div>
              );
            })}
          </div>
        )}
        {status === 1 && (
          <div className='ca-homepage__spinner-container'>
            <CaSpinner isActive={status === 1} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  authStatus: state.auth.status,
  battleStatus: state.room.battleStatus,
  gameId: state.room.currentGameId,
  rooms: state.room.rooms,
  games: state.games.games,
  status: state.games.gamesStatus,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  leaveBattleAction: (name: string) => dispatch(new LeaveRoom(name)),
  logoutUser: () => dispatch(new LogoutUser()),
  joinRoom: (name: string) => dispatch(new JoinRoom(name)),
  initGames: () => dispatch(new LoadGames())
});

export const CaBattles = connect(
  mapStateToProps,
  mapDispatchToProps
)(CaBattlesComponent);
