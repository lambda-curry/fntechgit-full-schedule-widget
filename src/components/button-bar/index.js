import { set } from 'lodash';
import React, { useState } from 'react';
import {Button, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

import styles from './index.module.scss';

const ButtonBar = ({view, timezone, summitTimezoneLabel, onChangeView, onChangeTimezone, onSync, onShare}) => {
    const timezoneLabel = timezone === 'local' ? 'Your Local Timezone' : summitTimezoneLabel;
    
    const timezoneButtonToggle = () => {
        onChangeTimezone(timezone === 'local' ? 'show' : 'local');
        setTimezoneToggle(prevCheck => !prevCheck);
    }

    const [timezoneToggle, setTimezoneToggle] = useState(false);
    const [viewToggle, setViewToggle] = useState();

    return (
        <div className={styles.wrapper}>
            <ToggleButton
                role="button"
                tabIndex={0}
                value={0}
                type="checkbox"
                className={`${styles.button} ${styles.timezoneBtn}`}
                aria-labelledby="timezone"
                aria-pressed={timezoneToggle}
                onChange={() => timezoneButtonToggle()}
            >
                <i className="fa fa-clock-o" aria-hidden="true" /> 
                <span id="timezone">{timezoneLabel}</span>
            </ToggleButton>
            <div className={styles.buttonGroup}>
                <div className={styles.firstGroup}>
                    <Button onClick={onSync} className={`${styles.button} ${styles.cal}`}>
                        <i className="fa fa-refresh" aria-hidden="true" />
                        Calendar Sync
                    </Button>
                    <Button onClick={onShare} className={`${styles.button} ${styles.share}`}>
                        <i className="fa fa-share" aria-hidden="true" />
                        Share
                    </Button>
                </div>
                <div className={styles.divider} />
                <div className={styles.secondGroup}>
                    <ToggleButtonGroup role="group" aria-label="Schedule view" name="view" value={view} onChange={onChangeView}>
                        <ToggleButton 
                            value="calendar" 
                            className={styles.button}
                            role="button"
                            tabIndex={0} 
                            aria-pressed={viewToggle}
                            onChange={() => setViewToggle(prevCheck => !prevCheck)}
                            >
                            <i className="fa fa-calendar-o" aria-hidden="true" />
                            Calendar
                        </ToggleButton>
                        <ToggleButton 
                            value="list" 
                            className={styles.button}
                            role="button"
                            tabIndex={0} 
                            aria-pressed={viewToggle}
                            onChange={() => setViewToggle(prevCheck => !prevCheck)}
                            >
                            <i className="fa fa-list" aria-hidden="true" />
                            List
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
        </div>
    );
};


export default ButtonBar;