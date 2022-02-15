import React from 'react';
import {Button, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

import styles from './index.module.scss';

const ButtonBar = ({view, timezone, summitTimezoneLabel, onChangeView, onChangeTimezone, onSync, onShare}) => {
    const timezoneLabel = timezone === 'local' ? 'Your Local Timezone' : summitTimezoneLabel;

    return (
        <div className={styles.wrapper}>
            <ToggleButton
                checked={timezone === 'local'}
                value={0}
                type="checkbox"
                className={`${styles.button} ${styles.timezoneBtn}`}
                onChange={() => onChangeTimezone(timezone === 'local' ? 'show' : 'local')}
            >
                <i className="fa fa-clock-o" aria-hidden="true" /> {timezoneLabel}
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
                    <ToggleButtonGroup name="view" value={view} onChange={onChangeView}>
                        <ToggleButton value="calendar" className={styles.button}>
                            <i className="fa fa-calendar-o" aria-hidden="true" />
                            Calendar
                        </ToggleButton>
                        <ToggleButton value="list" className={styles.button}>
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