import { History } from 'history';

import {
    AuthStatus,
    Event,
    LoadStatus
} from 'models';

export interface EventsProps {
    children?: JSX.Element;
    history: History;
    authStatus: AuthStatus;
    events: Event[];
    status: LoadStatus;

    initEvents: () => void;
}
