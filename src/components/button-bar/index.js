import React from 'react';
import {Button, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

import styles from './index.module.scss';

const ButtonBar = ({view, onChangeView}) => {

    return (
        <div className={styles.wrapper}>
            <Button onClick={console.log} className={`${styles.button} ${styles.cal}`}>
                <i className="fa fa-refresh" aria-hidden="true" />
                Calendar Sync
            </Button>
            <Button onClick={console.log} className={styles.button}>
                <i className="fa fa-share" aria-hidden="true" />
                Share
            </Button>
            <div className={styles.divider} />
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
    );
};


export default ButtonBar;