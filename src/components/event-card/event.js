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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Swal from 'sweetalert2';
import EventDetails from './details';
import EventHeader from './header';
import EventCountdown from "./countdown";


import styles from '../../styles/event.module.scss'

class Event extends Component {

    constructor(props) {
        super(props);

        this.state = { expanded: false }
    }

    componentDidMount() {
        if (this.detailRef) {
            this.detailRef.addEventListener("transitionend", (ev) => ev.target.style.overflow = 'auto');
        }
    }

    addToSchedule = (event) => {
        const {loggedUser} = this.props;

        if (loggedUser) {
            this.props.onAddEvent(event);
        } else {
            Swal.fire(
                'Login Required!',
                'Please login to manage your schedule.',
                'warning'
            )
        }
    };

    removeFromSchedule = (event) => {
        this.props.onRemoveEvent(event);
    };

    getEventStyle = () => {
        const {event, settings} = this.props;
        let color = null;

        switch (settings.colorSource) {
            case 'track':
                color = event.track?.color;
                break;
            case 'trackGroup':
                color = event.track?.track_group?.color;
                break;
            case 'type':
                color = event.type?.color;
                break;
        }

        return { borderLeft: `5px solid ${color || 'blue'}` };
    };

    render() {
        const { event, summit, loggedUser, settings } = this.props;
        const { expanded } = this.state;
        const isScheduled = !!(loggedUser && loggedUser.schedule_summit_events.includes(event.id));

        return (
            <div className={styles.wrapper} style={this.getEventStyle()} onClick={() => {this.setState({expanded: !expanded})}}>
                <div className={styles.countdown}>
                    <EventCountdown event={event} nowUtc={settings.nowUtc} />
                </div>
                <EventHeader
                    event={event}
                    summit={summit}
                    isScheduled={isScheduled}
                    nowUtc={settings.nowUtc}
                    isOpen={expanded}
                    onEventClick={settings.onEventClick}
                    addToSchedule={this.addToSchedule}
                    removeFromSchedule={this.removeFromSchedule}
                />
                <div className={`${styles.detailWrapper} ${!expanded && styles.hidden}`} ref={el => this.detailRef = el}>
                    <EventDetails event={event} history={history}/>
                </div>
            </div>
        )
    }
}

Event.propTypes = {
    event: PropTypes.object.isRequired,
};

export default Event;
