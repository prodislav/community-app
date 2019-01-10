import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  AppState,
} from 'store';

import { isEmpty } from 'utils';

import {
  AuthStatus, LoadStatus,
} from 'models';

import { EventsProps } from './Events.model';

import './Events.scss';
import { LoadEvents } from 'store/events';
import {
  CaSpinner,
  GithubButton,
} from 'components';

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
    const { events, children, status } = this.props;
    return (
      <div className='ca-about'>
        {children}
        <GithubButton url='https://github.com/js-machine/community-app' />
        {!isEmpty(events) && (
          <div className='ca-about__container ca-global-fadeIn'>
            {events.map((event) => (
              <div className='ca-about__container-for-event' >
                <div>{event.title}</div>
                <div>{event.description}</div>
                <div>{event.city}</div>
                <div>{event.place}</div>
                <div>{event.address}</div>
                <div>{event.begginingInTime}</div>
                <div>{event.begginingDate}</div>
              </div>
            ))}
          </div>
        )}
        {status === LoadStatus.Fetching && (
          <div className='ca-homepage__spinner-container'>
            <CaSpinner isActive={status === LoadStatus.Fetching} />
          </div>
        )}
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
