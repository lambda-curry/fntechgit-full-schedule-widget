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
import {CircleButton, RawHTML} from 'openstack-uicore-foundation/lib/components';
import EventCountdown from "../countdown";
import Speakers from "../event-card/speakers";
import {getLocation} from "../../tools/utils";

import styles from './index.module.scss';
import {link, circleButton} from "../../styles/general.module.scss";


const EventInfo = ({event, position, summit, nowUtc, onEventClick, addToSchedule, removeFromSchedule, onClose}) => {
    if (!event) return null;

    const eventDate = event.startTimeAtSummit.format('ddd, MMMM D');
    const eventStartTime = event.startTimeAtSummit.format('h:mma');
    const eventEndTime = event.endTimeAtSummit.format('h:mma');

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

    const goToEvent = () => {
        if (onEventClick) {
            onEventClick(event);
        }
    };


    return (
        <div className={styles.wrapper} id="event-info-popup" style={{top: position[0], left: position[1]}}>
            <div className={styles.header}>
                <div className={styles.countdown}>
                    <EventCountdown event={event} nowUtc={nowUtc} />
                </div>
                <div className={styles.closeButton} onClick={onClose}>
                    <i className="fa fa-times" />
                </div>
            </div>
            <div className={styles.eventInfo}>
                <div className={styles.locationWrapper}>
                    {`${eventDate}, ${eventStartTime} - ${eventEndTime} | ${getLocation(event, summit, nowUtc)}`}
                </div>
                <div className={styles.titleWrapper}>
                    <div className={styles.colorBall} style={{backgroundColor: event.eventColor}}/>
                    <div className={styles.title}>
                        {getTitleTag()}
                    </div>
                </div>
                <div className={styles.description}>
                    <RawHTML>{event.description}</RawHTML>
                </div>
                <div className={styles.speakersWrapper}>
                    <div>Speakers</div>
                    <Speakers event={event} withPic={true} onEmail={console.log} onChat={console.log} className={styles.speakers} />
                </div>
            </div>

            <div className={`${styles.circleButton} ${circleButton}`} data-tip={event.isScheduled ? 'added to schedule' : 'Add to my schedule'}>
                <CircleButton
                    event={event}
                    isScheduled={event.isScheduled}
                    nowUtc={nowUtc}
                    addToSchedule={addToSchedule}
                    removeFromSchedule={removeFromSchedule}
                    enterClick={goToEvent}
                />
            </div>
        </div>
    );

};

export default EventInfo;
