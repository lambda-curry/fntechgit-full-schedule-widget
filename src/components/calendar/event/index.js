import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

const Event = ({event, onEventClick}) => {
    const eventStyles = {
      backgroundColor: event.eventColor
    };

    const speakers = event.speakers ? event.speakers.map(
        (s, i) =>
            <React.Fragment key={`spkr-${s.id}`}>
                {i > 0 ? ', ' : ''}<span className={styles.speaker}>{s.first_name} {s.last_name}</span>
            </React.Fragment>
    ) : [];

    return (
        <>
            <div className={styles.wrapper} style={eventStyles} onClick={ev => onEventClick(ev, event)}>
                <div className={styles.title}>{event.title}</div>
                {speakers.length > 0 &&
                <div className={styles.speakers}>By {speakers}</div>
                }
            </div>
        </>
    );
};

Event.propTypes = {
    event: PropTypes.object.isRequired
};

export default Event;