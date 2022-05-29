/*
Copyright 2015, 2016 OpenMarket Ltd
Copyright 2018 Michael Telatynski <7t3chguy@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import { formatFullDate, formatTime, formatFullTime, formatRelativeTime } from '../../../DateUtils';

interface IProps {
    ts: number;
    showTwelveHour?: boolean;
    showFullDate?: boolean;
    showSeconds?: boolean;
    showRelative?: boolean;
}

export default class MessageTimestamp extends React.Component<IProps> {
    public render() {
        const date = new Date(this.props.ts);
        let timestamp;
        if (this.props.showRelative) {
            timestamp = formatRelativeTime(date, this.props.showTwelveHour);
        } else if (this.props.showFullDate) {
            timestamp = formatFullDate(date, this.props.showTwelveHour, this.props.showSeconds);
        } else if (this.props.showSeconds) {
            timestamp = formatFullTime(date, this.props.showTwelveHour);
        } else {
            timestamp = formatTime(date, this.props.showTwelveHour);
        }

        let persianTimestamp = '';

        for (let i = 0; i < timestamp.length; i++) {
            switch (timestamp[i]) {
                case '0': persianTimestamp += '۰'; break;
                case '1': persianTimestamp += '۱'; break;
                case '2': persianTimestamp += '۲'; break;
                case '3': persianTimestamp += '۳'; break;
                case '4': persianTimestamp += '۴'; break;
                case '5': persianTimestamp += '۵'; break;
                case '6': persianTimestamp += '۶'; break;
                case '7': persianTimestamp += '۷'; break;
                case '8': persianTimestamp += '۸'; break;
                case '9': persianTimestamp += '۹'; break;
                default: persianTimestamp += timestamp[i];
            }
        }

        return (
            <span
                className="mx_MessageTimestamp"
                title={formatFullDate(date, this.props.showTwelveHour)}
                aria-hidden={true}
            >
                { persianTimestamp }
            </span>
        );
    }
}
