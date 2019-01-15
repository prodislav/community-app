import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  AppState,
} from 'store';

import {
  AuthStatus
} from 'models';

import { CaEventCard } from 'components/EventCard';

import { EventsProps } from './Events.model';

import './Events.scss';
import { LoadEvents } from 'store/events';
/* import {
  CaSpinner,
  GithubButton,
} from 'components';
 */
export class CaEventsPageComponent extends React.Component<EventsProps> {

  public componentWillMount(): void {
    const isAuthenticated = this.props.authStatus === AuthStatus.Authorized;

    if (!isAuthenticated) {
      this.props.history.push('/login');
    }

    this.props.initEvents();
  }

  // TODO: add check events for empty.
  // TODO: add spinner
  // TODO: add snackbar
  public render(): JSX.Element {

    return (
      <div className='ca-about'>
        {this.props.children}
        <CaEventCard />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  authStatus: state.auth.status,
  events: state.events.events,
  status: state.events.loadEventsStatus,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  initEvents: () => dispatch(new LoadEvents()),
});

export const CaEvents = connect(
  mapStateToProps,
  mapDispatchToProps
)(CaEventsPageComponent);
