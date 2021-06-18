import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';


const LiveLine = ({now, hour}) => {
    if (now < hour || now > (hour + (60*60))) return null;

    const timeDiffMinutes = Math.abs(now - hour) / 60;

    return (
        <div className={styles.wrapper} style={{top: timeDiffMinutes}}>
            <div className={styles.text}>LIVE</div>
            <div className={styles.dot} />
            <div className={styles.line} />
        </div>
    );
};

LiveLine.propTypes = {
    now: PropTypes.number.isRequired,
    hour: PropTypes.number.isRequired,
};

export default LiveLine;