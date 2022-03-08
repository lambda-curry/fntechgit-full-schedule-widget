import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const eventWrapperHeight = 63;

const LiveLine = ({now, start, end, offset}) => {
    if (now < start || now > end) return null;

    const eventDuration = end - start;
    const eventProgress = now - start;
    const eventProgressFraction = Math.abs(eventProgress / eventDuration);
    const timeDiffMinutes = ( eventProgressFraction * eventWrapperHeight) + (offset * eventWrapperHeight);

    return (
        <div id="live-line" className={styles.wrapper} style={{top: timeDiffMinutes}}>
            <div className={styles.text}>LIVE</div>
            <div className={styles.dot} />
            <div className={styles.line} />
        </div>
    );
};

LiveLine.propTypes = {
    now: PropTypes.number.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
};

export default LiveLine;