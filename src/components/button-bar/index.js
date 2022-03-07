import { set } from 'lodash';
import React from 'react';
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

import styles from './index.module.scss';

const ButtonBar = ({ view, timezone, summitTimezoneLabel, onChangeView, onChangeTimezone, onSync, onShare }) => {
    const timezoneLabel = timezone === 'local' ? 'Your Local Timezone' : summitTimezoneLabel;
    
    return (
        <div className={styles.wrapper}>
            <Button
                role="button"
                tabIndex={0}
                className={`${styles.button} ${styles.timezoneBtn} ${timezone=='local'? 'active':''}`}
                aria-labelledby="timezone"
                aria-pressed={timezone === "local"}
                onChange={() => onChangeTimezone(timezone === 'local' ? 'show' : 'local')}
            >
                <i className="fa fa-clock-o" aria-hidden="true" /> 
                <span id="timezone">{timezoneLabel}</span>
            </Button>
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
                            aria-pressed={view === "calendar"}
                            >
                            <i className="fa fa-calendar-o" aria-hidden="true" />
                            Calendar
                        </ToggleButton>
                        <ToggleButton 
                            value="list" 
                            className={styles.button}
                            role="button"
                            tabIndex={0} 
                            aria-pressed={view === "list"}
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