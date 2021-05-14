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
import { CSSTransitionGroup } from 'react-transition-group';
import Event from './event-card/event';
import {addEventToSchedule, removeEventFromSchedule} from "../actions";

import styles from '../styles/general.module.scss';


const EventList = ({events, settings, summit, loggedUser, addEventToSchedule, removeEventFromSchedule}) => {
    const height = events.length * 155;

    return (
        <div className={styles.eventList} style={{height: `${height}px`}}>
            <CSSTransitionGroup
                transitionName="items"
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={100}
            >
                {events.map(event => (
                    <div key={`event-${event.id}`}>
                        <Event
                            event={event}
                            settings={settings}
                            summit={summit}
                            loggedUser={loggedUser}
                            onAddEvent={addEventToSchedule}
                            onRemoveEvent={removeEventFromSchedule}
                        />
                    </div>
                ))}
            </CSSTransitionGroup>
        </div>
    )
}

EventList.propTypes = {
    events: PropTypes.array.isRequired,
    summit: PropTypes.object.isRequired,
};

function mapStateToProps(scheduleState) {
    return {
        ...scheduleState
    }
}

export default connect(mapStateToProps, {
    addEventToSchedule,
    removeEventFromSchedule,
})(EventList)

