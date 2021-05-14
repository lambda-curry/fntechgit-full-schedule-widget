/**
 * Copyright 2020 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import React from 'react';
import PropTypes from 'prop-types';
import {RawHTML} from "openstack-uicore-foundation/lib/components";

import styles from './index.module.scss'

const EventDetails = ({event, settings}) => {

    const getHosts = () => {
        let hosts = [];
        if (event.speakers?.length > 0) {
            hosts = [...event.speakers];
        }
        if (event.moderator) hosts.push(event.moderator);

        return hosts;
    };

    return (
        <div className={styles.wrapper}>
            <div className="row">
                <div className={`col-sm-12 ${styles.speakersWrapper}`}>
                    {getHosts().map((sp,i) => (
                        <div className={styles.speaker} key={`speaker-${sp.id}-${i}`}>
                            <div className={styles.picWrapper}>
                                <div className={styles.pic} style={{backgroundImage: `url(${sp.pic})`}} />
                            </div>
                            <div className={styles.nameWrapper}>
                                <div className={styles.name}>
                                    {sp.first_name} {sp.last_name}
                                </div>
                                {sp.title &&
                                <div className={styles.company}>                                    
                                    <RawHTML>{sp.title}</RawHTML>
                                </div>
                                }
                                {sp.company &&
                                <div className={styles.company}>
                                    at <RawHTML>{sp.company}</RawHTML>
                                </div>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`row ${styles.descWrapper}`}>
                <div className="col-sm-12">
                    <RawHTML>{event.description}</RawHTML>
                </div>
            </div>
            {event.attendees_expected_learnt &&
            <>
                <hr />
                <div className={`row ${styles.learnWrapper}`}>
                    <div className="col-sm-12">
                        <h4>What can attendees expect to learn?</h4>
                        <RawHTML>{event.attendees_expected_learnt}</RawHTML>
                    </div>
                </div>
            </>
            }
        </div>
    );
};

EventDetails.propTypes = {
    event: PropTypes.object.isRequired,
};

export default EventDetails
