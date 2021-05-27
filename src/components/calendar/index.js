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

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import moment from "moment-timezone"
import {epochToMomentTimeZone} from 'openstack-uicore-foundation/lib/methods';
import Day from './day';
import {addEventToSchedule, removeEventFromSchedule} from "../../actions";

import styles from '../../styles/general.module.scss';


const Calendar = ({events, settings, summit, addEventToSchedule, removeEventFromSchedule}) => {
    const height = events.length * 155;
    const groupedEvents = [];

    summit.dates_with_events.forEach(d => {
        const epochStart = moment.tz(`${d} 00:00:00`, 'YYYY-MM-DD hh:mm:ss', summit.time_zone_id);
        const epochEnd = moment.tz(`${d} 23:59:59`, 'YYYY-MM-DD hh:mm:ss', summit.time_zone_id);
        const offset = moment.tz.zone(summit.time_zone_id).utcOffset(epochStart.valueOf()); // seconds to add to get to utc

        groupedEvents.push({
            dateString: epochStart.format('MMMM D'),
            dateStringDay: epochStart.format('dddd'),
            epochStart: epochStart.utc().valueOf() / 1000,
            epochEnd: epochEnd.utc().valueOf() / 1000,
            timeStart: 24 ,
            timeEnd: 0,
            offset,
            hours: []
        })
    });

    events.reduce((result, event) => {
        const date = result.find(d => event.start_date > d.epochStart && event.start_date < d.epochEnd);
        const startHour = parseInt(event.startTimeAtSummit.format('H:mm'));
        const hour = date.hours.find(h => h.hour === startHour);

        if ( startHour < date.timeStart) {
            date.timeStart = startHour;
        }

        if (hour) {
            hour.events.push(event);
        } else {
            date.hours.push({hour: startHour, hourLabel: event.startTimeAtSummit.format('h:mm a'),events: [event]});
        }

        return result;

    }, groupedEvents);

    const eventInfoProps = {
        summit,
        nowUtc: settings.nowUtc,
        onEventClick: settings.onEventClick,
        addToSchedule: addEventToSchedule,
        removeFromSchedule: removeEventFromSchedule
    };

    return (
        <div className={styles.eventList} style={{height: `${height}px`}}>
            {groupedEvents.map(date => <Day {...date} eventInfoProps={eventInfoProps} key={`cal-day-${date.dateString}`} />)}
        </div>
    )
};

Calendar.propTypes = {
    events: PropTypes.array.isRequired,
    summit: PropTypes.object.isRequired,
};

function mapStateToProps(scheduleState) {
    return {
        ...scheduleState
    }
};

export default connect(mapStateToProps, {
    addEventToSchedule,
    removeEventFromSchedule,
})(Calendar)

