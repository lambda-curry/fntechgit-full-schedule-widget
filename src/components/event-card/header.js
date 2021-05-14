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
import moment from 'moment-timezone';
import { epochToMomentTimeZone } from 'openstack-uicore-foundation/lib/methods';
import { CircleButton, useFitText } from 'openstack-uicore-foundation/lib/components';

import styles from '../../styles/event.module.scss';
import { link } from '../../styles/general.module.scss';

const EventHeader = ({
    event,
    summit,
    isScheduled,
    nowUtc,
    onEventClick,
    addToSchedule,
    removeFromSchedule,
    isOpen
}) => {

    const { fontSize, lineHeight, ref } = useFitText();

    const getLocation = () => {
        const shouldShowVenues = (summit.start_showing_venues_date * 1000) < nowUtc;
        let locationName = '';
        const { location } = event;

        if (!shouldShowVenues) return null;

        if (!location) return ' - TBA';

        if (location.venue && location.venue.name)
            locationName = location.venue.name;
        if (location.floor && location.floor.name)
            locationName = `${locationName} - ${location.floor.name}`;
        if (location.name)
            locationName = `${locationName} - ${location.name}`;

        locationName = locationName || 'TBA';

        return <span>{` - ${locationName}`}</span>
    };

    const getTitleTag = () => {
        const handleClick = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            onEventClick(event);
        };

        if (onEventClick) {
            return <a className={link} onClick={handleClick}>{event.title}</a>
        } else {
            return event.title;
        }
    };

    const getSpeakerTags = () => {
        return event.speakers.map((s, i) => {
            const spkrName = `${s.first_name} ${s.last_name} ${s.company ? ` - ${s.company}` : ''}`;
            const tag = `${spkrName}`;

            return <span key={`spkr-${s.id}`}>{(i < event.speakers.length - 1) ? (<>{tag}{', '}</>) : tag}</span>;
        });
    };

    const getModeratorTag = () => {
        if (!event.moderator) return null;

        const mod = event.moderator;
        const spkrName = `${mod.first_name} ${mod.last_name} ${mod.company ? ` - ${mod.company}` : ''}`;

        return `${spkrName}, `;
    };

    const goToEvent = (event) => {
        if (onEventClick) {
            onEventClick(event);
        }
    };

    const eventDate = epochToMomentTimeZone(event.start_date, summit.time_zone_id).format('ddd D');
    const eventStartTime = epochToMomentTimeZone(event.start_date, summit.time_zone_id).format('h:mma');
    const eventEndTime = epochToMomentTimeZone(event.end_date, summit.time_zone_id).format('h:mma');
    const utcStartTime = moment.utc(event.start_date * 1000).format('H:mm');
    const utcEndTime = moment.utc(event.end_date * 1000).format('H:mm');

    return (
        <div className={styles.header}>
            <div className={styles.locationWrapper}>
                <div>
                    {`${eventDate}, ${eventStartTime} - ${eventEndTime}`}
                    {getLocation()}
                </div>
            </div>
            <div ref={ref} style={{ fontSize, lineHeight, height: 48, width: '100%' }} className={styles.title}>
                {getTitleTag()}
            </div>
            <div className={styles.speakerNames}>
                {event.speakers?.length > 0 && <span>By </span>}
                {event.moderator && getModeratorTag()}
                {event.speakers && getSpeakerTags()}
            </div>
            {event.track &&
                <div className={styles.trackWrapper}>
                    {event.track?.name}
                </div>
            }
            <CircleButton
                event={event}
                isScheduled={isScheduled}
                nowUtc={nowUtc}
                addToSchedule={addToSchedule}
                removeFromSchedule={removeFromSchedule}
                enterClick={goToEvent}
            />
        </div>
    );
};

EventHeader.propTypes = {
    event: PropTypes.object.isRequired,
    summit: PropTypes.object.isRequired
};

export default EventHeader;
