import React from 'react';
import PropTypes from 'prop-types';
import Hour from '../hour';

import styles from './index.module.scss';


const Day = ({dateString, dateStringDay, hours, eventInfoProps}) => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.dayLabel}>
                <span className={styles.day}>{dateStringDay}</span>, {dateString}
            </div>
            <div>
                {hours.map(hour => <Hour {...hour} eventInfoProps={eventInfoProps} key={`cal-hr-${hour.hour}`} />)}
            </div>
        </div>
    );
};

Day.propTypes = {
    dateString: PropTypes.string.isRequired,
    dateStringDay: PropTypes.string.isRequired,
    hours: PropTypes.array.isRequired,
};

export default Day;