/**
 * Copyright 2017 OpenStack Foundation
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
import ReactDOM from 'react-dom';
import Schedule from './full-schedule';

import EventsData from './events.json';
import SummitData from './summit.json';
import MarketingData from './marketing-data.json'

const scheduleProps = {
    eventsData: EventsData,
    summitData: SummitData.summit,
    marketingData: MarketingData.colors,
    userProfile: null,
    filters: null,
    colorSource: 'track',
    now: null,
    title: 'Custom Schedule',
    withThumbs: false,
    defaultImage: 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg',
    onEventClick: console.log,
    onStartChat: console.log,
    triggerAction: (action, {event}) => new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('loading...', action, event);
            resolve(event);
        }, 500)
    })
};


// width 780px or 230px

ReactDOM.render(
    <div style={{width: '720px', margin: '0 auto'}}>
        <Schedule {...scheduleProps} />
    </div>,
    document.querySelector('#root')
);
