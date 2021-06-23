import React from 'react';
import PropTypes from 'prop-types';
import Event from '../event';
import LiveLine from '../live-line';

import styles from './index.module.scss';

const Hour = ({hour, hourLabel, events, nowUtc, onEventClick}) => {

    return (
        <div className={styles.wrapper}>
            <LiveLine hour={hour} now={nowUtc} />
            <div className={styles.timeWrapper}>
                <div className={styles.time}>{hourLabel}</div>
            </div>
            <div className={styles.eventsWrapper}>
                {events.map(ev => <Event event={ev} onEventClick={onEventClick} key={`cal-ev-${ev.id}`} />)}
            </div>
        </div>
    );
};

Hour.propTypes = {
    hourLabel: PropTypes.string.isRequired,
    events: PropTypes.array.isRequired,
};

export default Hour;