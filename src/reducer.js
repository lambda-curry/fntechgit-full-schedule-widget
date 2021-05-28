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
} from './actions';
import {epochToMomentTimeZone} from "openstack-uicore-foundation/lib/methods";


const DEFAULT_STATE = {
    settings: {
        title: 'Schedule',
        filters: {tracks: [], dates: [], levels: [], speakers: [], tags: [], locations: []},
        colorSource: 'track',
        defaultImage: '',
        nowUtc: null,
        view: 'calendar',
        withThumbs: false,
        onEventClick: null,
        onStartChat: null,
        getShareLink: null,
        getSyncLink: null,
        triggerAction: null,
    },
    summit: null,
    loggedUser: null,
    events: [],
    allEvents: [],
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
            const {eventsData, summitData: summit, marketingData, userProfile, filters, ...otherSettings} = payload;
            const now = moment().unix();
            const nowQS = getNowFromQS(summit.time_zone_id);
            const nowUtc = nowQS || now;

            const allFilters = {...state.settings.filters, ...filters};

            // user
            const loggedUser = userProfile ? {
                ...userProfile,
                schedule_summit_events: userProfile.schedule_summit_events.map(ev => ev.id)
            } : null;


            let filteredEvents = getFilteredEvents(summit, eventsData, allFilters);

            // add some attributes
            filteredEvents = filteredEvents.map(ev => {
                const startTimeAtSummit = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
                const endTimeAtSummit = epochToMomentTimeZone(ev.end_date, summit.time_zone_id);
                const isScheduled = !!(loggedUser && loggedUser.schedule_summit_events.includes(ev.id));
                const eventColor = ev.track.color;

                return ({...ev, startTimeAtSummit, endTimeAtSummit, isScheduled, eventColor })
            });

            return {
                ...state,
                summit,
                marketingData,
                loggedUser,
                allEvents: eventsData,
                events: filteredEvents,
                settings: {
                    ...state.settings,
                    ...otherSettings,
                    nowUtc,
                    filters: allFilters
                }
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

// filters: tracks, dates, levels, speakers, tags, locations

const getFilteredEvents = (summit, events, filters) => {

    console.log(events);
    console.log(filters);

    const filteredEvents = events.filter(ev => {
        let valid = true;

        if (filters.tracks?.length > 0) {
            valid = filters.tracks.includes(ev.track.id);
            if (!valid) return false;
        }

        if (filters.levels?.length > 0) {
            valid = filters.levels.includes(ev.level);
            if (!valid) return false;
        }

        if (filters.speakers?.length > 0) {
            valid = ev.speakers.some(s => filters.speakers.includes(s.id)) || filters.speakers.includes(ev.moderator?.id);
            if (!valid) return false;
        }

        if (filters.tags?.length > 0) {
            valid = ev.tags.some(t => filters.tags.includes(t.tag));
            if (!valid) return false;
        }

        if (filters.locations?.length > 0) {
            valid = filters.locations.includes(ev.location?.id);
            if (!valid) return false;
        }

        if (filters.dates?.length > 0) {
           valid = filters.dates.includes(ev.startTimeAtSummit.format('YYYY-MM-DD'));
           if (!valid) return false;
       }

        return true;
    });

    return filteredEvents;
};


export default WidgetReducer
