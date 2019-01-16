import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
  AppState,
  LoadEvents
} from 'store';

import {
  AuthStatus
} from 'models';

import { EventsProps } from './Events.model';

import {
  CaEventCard,
  CaSpinner,
  GithubButton,
} from 'components';

import { isEmpty } from 'utils';

import './Events.scss';

export class CaEventsPageComponent extends React.Component<EventsProps> {

  public componentWillMount(): void {
    const isAuthenticated = this.props.authStatus === AuthStatus.Authorized;

    if (!isAuthenticated) {
      this.props.history.push('/login');
    }

    this.props.initEvents();
  }

  public render(): JSX.Element {
    const { events, status } = this.props;
    return (
      <>
        <GithubButton url='https://github.com/js-machine/community-app' />
        <div className='ca-about'>
          {!isEmpty(events) &&
            events.map((event) => {
              return (
                <CaEventCard
                  key={event.id}
                  model={event}
                />
              );
            })
          }
        </div>
        {status === 1 && (
          <div className='ca-homepage__spinner-container'>
            <CaSpinner isActive={status === 1} />
          </div>
        )}
      </>
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
