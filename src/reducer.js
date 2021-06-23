/**
 * Copyright 2020 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import moment from "moment";
import {epochToMomentTimeZone} from 'openstack-uicore-foundation/lib/methods';
import {getNowFromQS} from './tools/utils';
import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/actions';


import {
    START_WIDGET_LOADING,
    STOP_WIDGET_LOADING,
    LOAD_INITIAL_VARS,
    UPDATE_CLOCK,
    SET_VIEW,
    ADDED_TO_SCHEDULE,
    REMOVED_FROM_SCHEDULE,
    UPDATE_EVENTS
} from './actions';


const DEFAULT_STATE = {
    settings: {
        title: 'Schedule',
        colorSource: 'track',
        defaultImage: '',
        nowUtc: null,
        view: 'calendar',
        withThumbs: false,
        onEventClick: null,
        onStartChat: null,
        getShareLink: null,
        needsLogin: null,
        triggerAction: null,
    },
    summit: null,
    loggedUser: null,
    events: [],
    widgetLoading: false,
};

const WidgetReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case LOGOUT_USER: {
            return DEFAULT_STATE;
        }
        case START_WIDGET_LOADING: {
            let widgetLoading = state.widgetLoading + 1;
            return {...state, widgetLoading};
        }
        case STOP_WIDGET_LOADING: {
            let widgetLoading = state.widgetLoading < 2 ? 0 : (state.widgetLoading - 1);
            return {...state, widgetLoading};
        }
        case UPDATE_CLOCK: {
            const {timestamp} = payload;
            return {...state, settings: {...state.settings, nowUtc: timestamp}};
        }
        case LOAD_INITIAL_VARS: {
            const {events, summit, marketingSettings, userProfile, colorSource, ...otherSettings} = payload;
            const now = moment().unix();
            const nowQS = getNowFromQS(summit.time_zone_id);
            const nowUtc = nowQS || now;

            // user
            const loggedUser = userProfile ? {
                ...userProfile,
                schedule_summit_events: userProfile.schedule_summit_events.map(ev => ev.id)
            } : null;

            // add some attributes
            const eventsProcessed = events.map(ev => {
                const startTimeAtSummit = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
                const endTimeAtSummit = epochToMomentTimeZone(ev.end_date, summit.time_zone_id);
                const isScheduled = !!(loggedUser && loggedUser.schedule_summit_events.includes(ev.id));
                const eventColor = getEventColor(colorSource, ev);

                return ({...ev, startTimeAtSummit, endTimeAtSummit, isScheduled, eventColor })
            });

            return {
                ...state,
                summit,
                loggedUser,
                events: eventsProcessed,
                marketingSettings,
                settings: {
                    ...state.settings,
                    ...otherSettings,
                    nowUtc,
                    colorSource,
                }
            };
        }
        case UPDATE_EVENTS: {
            const {events} = payload;
            const {summit, loggedUser, settings} = state;

            // add some attributes
            const eventsProcessed = events.map(ev => {
                const startTimeAtSummit = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
                const endTimeAtSummit = epochToMomentTimeZone(ev.end_date, summit.time_zone_id);
                const isScheduled = !!(loggedUser && loggedUser.schedule_summit_events.includes(ev.id));
                const eventColor = getEventColor(settings.colorSource, ev);

                return ({...ev, startTimeAtSummit, endTimeAtSummit, isScheduled, eventColor })
            });

            return {
                ...state,
                widgetLoading: false,
                events: eventsProcessed,
            };
        }
        case SET_VIEW: {
            const {view} = payload;
            return {...state, settings: {...state.settings, view} };
        }
        case ADDED_TO_SCHEDULE: {
            const {event} = payload;
            const loggedUser = {...state.loggedUser};

            if (!loggedUser?.schedule_summit_events.includes(event.id)) {
                loggedUser.schedule_summit_events.push(event.id);
            }

            const events = state.events.map(ev => {
                if (ev.id === event.id) {
                    ev.isScheduled = true;
                }

                return ev;
            });

            return {...state, loggedUser, events};
        }
        case REMOVED_FROM_SCHEDULE: {
            const {event} = payload;
            const loggedUser = {...state.loggedUser};

            loggedUser.schedule_summit_events = loggedUser.schedule_summit_events.filter( evID => evID !== event.id);

            const events = state.events.map(ev => {
                if (ev.id === event.id) {
                    ev.isScheduled = false;
                }

                return ev;
            });

            return {...state, loggedUser, events};
        }
        default: {
            return state;
        }
    }
};

const getEventColor = (colorSource, event) => {
    const defaultColor = 'gray';

    switch (colorSource) {
        case 'event_type':
            return event.type?.color || defaultColor;
        case 'track':
            return event.track?.color || defaultColor;
        case 'track_group':
            return event.track?.track_group?.color || defaultColor;
    }
};


export default WidgetReducer
