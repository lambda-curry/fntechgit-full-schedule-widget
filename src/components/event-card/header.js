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
import {CircleButton, RawHTML, useFitText} from 'openstack-uicore-foundation/lib/components';
import {getLocation} from "../../tools/utils";
import FallbackImage from '../fallbackImage';
import Speakers from "./speakers";

import styles from './event.module.scss';
import { link, circleButton } from '../../styles/general.module.scss';

const EventHeader = ({
    summit,
    event,
    nowUtc,
    showEventPic,
    defaultImage,
    onEventClick,
    addToSchedule,
    removeFromSchedule,
    startChat,
    sendEmail,
    isOpen
}) => {
    const { fontSize, lineHeight, ref } = useFitText();

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

    const goToEvent = (event) => {
        if (onEventClick) {
            onEventClick(event);
        }
    };

    const getEventImage = () => {
        let image;

        if (event.image) image = event.image;
        else if (event.stream_thumbnail) image = `${event.stream_thumbnail}?width=300&time=60`;
        else if (defaultImage) image = defaultImage;

        if (image) return (<FallbackImage src={image} fallbackSrc={defaultImage} />);
        return (<i className="fa fa-picture-o" aria-hidden="true" />);
    };

    const eventDate = event.startTimeAtSummit.format('ddd, MMMM D');
    const eventStartTime = event.startTimeAtSummit.format('h:mma');
    const eventEndTime = event.endTimeAtSummit.format('h:mma');

    return (
        <div className={styles.header}>
            {showEventPic &&
            <div className={styles.eventImage}>
                {getEventImage()}
            </div>
            }
            <div className={styles.eventInfo}>
                <div className={styles.locationWrapper}>
                    {`${eventDate}, ${eventStartTime} - ${eventEndTime} | ${getLocation(event, summit, nowUtc)}`}
                </div>
                <div ref={ref} style={{ fontSize, lineHeight, height: 48, width: '100%' }} className={styles.title}>
                    {getTitleTag()}
                </div>
                <div className={`${styles.detailWrapper} ${!isOpen && styles.hidden}`}>
                    <RawHTML>{event.description}</RawHTML>
                </div>
                <div className={styles.footer}>
                    <div className={styles.leftCol}>
                        {event.track &&
                        <div className={styles.trackWrapper}>
                            {event.track?.name}
                        </div>
                        }
                        {(event.speakers?.length > 0 || event.moderator) &&
                        <Speakers event={event} withPic={isOpen} onEmail={sendEmail} onChat={startChat} />
                        }
                    </div>
                    <div className={styles.rightCol}>
                        <div className={styles.attendeesWrapper}>0 in the room</div>
                        <div className={styles.tagsWrapper}>
                            {event.tags.map(t => <span key={`tag-${t.id}-${event.id}`} className={styles.tag}>{t.tag}</span> )}
                        </div>
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
        </div>
    );
};

EventHeader.propTypes = {
    event: PropTypes.object.isRequired,
    summit: PropTypes.object.isRequired
};

export default EventHeader;
