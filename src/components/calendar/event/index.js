import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from "react-tooltip";
import EventInfo from "../../event-info";

import styles from './index.module.scss';
import {tooltip, noTip} from '../../../styles/general.module.scss';

const Event = ({event, eventInfoProps}) => {
    let tooltipRef = null;

    const eventStyles = {
      backgroundColor: event.eventColor
    };

    const speakers = event.speakers.map(
        (s, i) => <React.Fragment key={`spkr-${s.id}`}>{i > 0 ? ', ' : ''}<span className={styles.speaker}>{s.first_name} {s.last_name}</span></React.Fragment>
    );

    return (
        <>
            <div className={styles.wrapper} style={eventStyles} data-tip="" data-for={`eventInfo-${event.id}`}>
                <div className={styles.title}>{event.title}</div>
                {speakers.length > 0 &&
                <div className={styles.speakers}>By {speakers}</div>
                }
            </div>
            <ReactTooltip
                className={`${tooltip} ${noTip}`}
                id={`eventInfo-${event.id}`}
                type='light'
                place="right"
                effect="solid"
                event="click"
                clickable={true}
                ref={el => tooltipRef = el}
                offset={{top: -100}}
            >
                <EventInfo
                    event={event}
                    {...eventInfoProps}
                    onClose={() => {tooltipRef.tooltipRef = null; ReactTooltip.hide();}}
                />
            </ReactTooltip>
        </>
    );
};

Event.propTypes = {
    event: PropTypes.object.isRequired
};

export default Event;