/*
Copyright 2016 OpenMarket Ltd
Copyright 2017 Vector Creations Ltd
Copyright 2019 New Vector Ltd

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
import request from 'browser-request';
import sanitizeHtml from 'sanitize-html';
import classnames from 'classnames';
import { logger } from "matrix-js-sdk/src/logger";

import { _t } from '../../languageHandler';
import dis from '../../dispatcher/dispatcher';
import { MatrixClientPeg } from '../../MatrixClientPeg';
import MatrixClientContext from "../../contexts/MatrixClientContext";
import AutoHideScrollbar from "./AutoHideScrollbar";
import { ActionPayload } from "../../dispatcher/payloads";

interface IProps {
    // URL to request embedded page content from
    url?: string;
    // Class name prefix to apply for a given instance
    className?: string;
    // Whether to wrap the page in a scrollbar
    scrollbar?: boolean;
    // Map of keys to replace with values, e.g {$placeholder: "value"}
    replaceMap?: Map<string, string>;
}

interface IState {
    page: string;
}

export default class EmbeddedPage extends React.PureComponent<IProps, IState> {
    public static contextType = MatrixClientContext;
    private unmounted = false;
    private dispatcherRef: string = null;

    constructor(props: IProps, context: typeof MatrixClientContext) {
        super(props, context);

        this.state = {
            page: '',
        };
    }

    protected translate(s: string): string {
        // default implementation - skins may wish to extend this
        return sanitizeHtml(_t(s));
    }

    public componentDidMount(): void {
        this.unmounted = false;

        if (!this.props.url) {
            return;
        }

        // we use request() to inline the page into the react component
        // so that it can inherit CSS and theming easily rather than mess around
        // with iframes and trying to synchronise document.stylesheets.

        request(
            { method: "GET", url: this.props.url },
            (err, response, body) => {
                if (this.unmounted) {
                    return;
                }

                if (err || response.status < 200 || response.status >= 300) {
                    logger.warn(`Error loading page: ${err}`);
                    this.setState({ page: _t("Couldn't load page") });
                    return;
                }

                body = body.replace(/_t\(['"]([\s\S]*?)['"]\)/mg, (match, g1) => this.translate(g1));

                if (this.props.replaceMap) {
                    Object.keys(this.props.replaceMap).forEach(key => {
                        body = body.split(key).join(this.props.replaceMap[key]);
                    });
                    body = '<style type="text/css">\n' +
                        '\n' +
                        '    /* we deliberately inline style here to avoid flash-of-CSS problems, and to avoid\n' +
                        '     * voodoo where we have to set display: none by default\n' +
                        '     */\n' +
                        '    \n' +
                        '    h1::after {\n' +
                        '        content: "!";\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_Parent {\n' +
                        '        display: -webkit-box;\n' +
                        '        display: -webkit-flex;\n' +
                        '        display: -ms-flexbox;\n' +
                        '        display: flex;\n' +
                        '        -webkit-box-orient: vertical;\n' +
                        '        -webkit-box-direction: normal;\n' +
                        '        -webkit-flex-direction: column;\n' +
                        '        -ms-flex-direction: column;\n' +
                        '        flex-direction: column;\n' +
                        '        -webkit-box-pack: center;\n' +
                        '        -webkit-justify-content: center;\n' +
                        '        -ms-flex-pack: center;\n' +
                        '        justify-content: center;\n' +
                        '        -webkit-box-align: center;\n' +
                        '        -webkit-align-items: center;\n' +
                        '        -ms-flex-align: center;\n' +
                        '        align-items: center;\n' +
                        '        text-align: center;\n' +
                        '        padding: 25px 35px;\n' +
                        '        color: #2e2f32;\n' +
                        '        border-radius: 10px;\n' +
                        '        background-color: #ffffff69;\n' +
                        '        box-shadow: 0 30px 35px 5px rgba(255, 255, 255, 0.383), \n' +
                        '        0 30px 35px 5px rgba(255, 255, 255, 0.335),\n' +
                        '        0 -35px 35px 5px rgba(255, 255, 255, 0.335);\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_Logo {\n' +
                        '        height: 150px;\n' +
                        '        margin-top: 10px;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonGroup {\n' +
                        '        margin-top: 10px;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonRow {\n' +
                        '        display: -webkit-box;\n' +
                        '        display: -webkit-flex;\n' +
                        '        display: -ms-flexbox;\n' +
                        '        display: flex;\n' +
                        '        -webkit-justify-content: space-around;\n' +
                        '        -ms-flex-pack: distribute;\n' +
                        '        justify-content: space-around;\n' +
                        '        -webkit-box-align: center;\n' +
                        '        -webkit-align-items: center;\n' +
                        '        -ms-flex-align: center;\n' +
                        '        align-items: center;\n' +
                        '        justify-content: space-between;\n' +
                        '        box-sizing: border-box;\n' +
                        '        margin: 12px 0 0;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonRow > * {\n' +
                        '        margin: 0 10px;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonRow > *:first-child {\n' +
                        '        margin-left: 0;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonRow > *:last-child {\n' +
                        '        margin-right: 0;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonParent {\n' +
                        '        display: -webkit-box;\n' +
                        '        display: -webkit-flex;\n' +
                        '        display: -ms-flexbox;\n' +
                        '        display: flex;\n' +
                        '        padding: 10px 20px;\n' +
                        '        -webkit-box-orient: horizontal;\n' +
                        '        -webkit-box-direction: normal;\n' +
                        '        -webkit-flex-direction: row;\n' +
                        '        -ms-flex-direction: row;\n' +
                        '        flex-direction: row;\n' +
                        '        -webkit-box-pack: center;\n' +
                        '        -webkit-justify-content: center;\n' +
                        '        -ms-flex-pack: center;\n' +
                        '        justify-content: center;\n' +
                        '        -webkit-box-align: center;\n' +
                        '        -webkit-align-items: center;\n' +
                        '        -ms-flex-align: center;\n' +
                        '        align-items: center;\n' +
                        '        border-radius: 4px;\n' +
                        '        width: 150px;\n' +
                        '        background-repeat: no-repeat;\n' +
                        '        background-position: 10px center;\n' +
                        '        text-decoration: none;\n' +
                        '        color: #2e2f32 !important;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonLabel {\n' +
                        '        margin-left: 20px;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_Header_title {\n' +
                        '        font-size: 24px;\n' +
                        '        font-weight: 600;\n' +
                        '        margin: 20px 0 0;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_Header_subtitle {\n' +
                        '        font-size: 12px;\n' +
                        '        font-weight: normal;\n' +
                        '        margin: 8px 0 0;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonSignIn {\n' +
                        '        background-color: #368BD6;\n' +
                        '        color: white !important;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonCreateAccount {\n' +
                        '        background-color: #0DBD8B;\n' +
                        '        color: white !important;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_SecondaryButton {\n' +
                        '        background-color: #FFFFFF;\n' +
                        '        color: #2E2F32;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_Button_iconSignIn {\n' +
                        '        background-image: url(\'welcome/images/icon-sign-in.svg\');\n' +
                        '    }\n' +
                        '    .mx_Button_iconCreateAccount {\n' +
                        '        background-image: url(\'welcome/images/icon-create-account.svg\');\n' +
                        '    }\n' +
                        '    .mx_Button_iconHelp {\n' +
                        '        background-image: url(\'welcome/images/icon-help.svg\');\n' +
                        '    }\n' +
                        '    .mx_Button_iconRoomDirectory {\n' +
                        '        background-image: url(\'welcome/images/icon-room-directory.svg\');\n' +
                        '    }\n' +
                        '    \n' +
                        '    /*\n' +
                        '    .mx_WelcomePage_loggedIn is applied by EmbeddedPage from the Welcome component\n' +
                        '    If it is set on the page, we should show the buttons. Otherwise, we have to assume\n' +
                        '    we don\'t have an account and should hide them. No account == no guest account either.\n' +
                        '     */\n' +
                        '    .mx_WelcomePage:not(.mx_WelcomePage_loggedIn) .mx_WelcomePage_guestFunctions {\n' +
                        '        display: none;\n' +
                        '    }\n' +
                        '    \n' +
                        '    .mx_ButtonRow.mx_WelcomePage_guestFunctions {\n' +
                        '        margin-top: 20px;\n' +
                        '    }\n' +
                        '    .mx_ButtonRow.mx_WelcomePage_guestFunctions > div {\n' +
                        '        margin: 0 auto;\n' +
                        '    }\n' +
                        '    \n' +
                        '    @media only screen and (max-width: 480px) {\n' +
                        '        .mx_ButtonRow {\n' +
                        '            flex-direction: column;\n' +
                        '        }\n' +
                        '    \n' +
                        '        .mx_ButtonRow > * {\n' +
                        '            margin: 0 0 10px 0;\n' +
                        '        }\n' +
                        '    }\n' +
                        '    \n' +
                        '    </style>\n' +
                        '    \n' +
                        '    <div class="mx_Parent">\n' +
                        '        <a href="https://element.io" target="_blank" rel="noopener">\n' +
                        '            <img src="https://static.fanoos.app/img/logo.png" alt="" class="mx_Logo"/>\n' +
                        '        </a>\n' +
                        '        <h1 class="mx_Header_title">فانوس</h1>\n' +
                        '        <h4 class="mx_Header_subtitle">ای روشنای قلب من فانوس راهت میشوم...</h4>\n' +
                        '        <div class="mx_ButtonGroup">\n' +
                        '            <div class="mx_ButtonRow">\n' +
                        '                <a href="#/login" class="mx_ButtonParent mx_ButtonSignIn mx_Button_iconSignIn">\n' +
                        '                    <div class="mx_ButtonLabel">ورود</div>\n' +
                        '                </a>\n' +
                        '                <div style="width: 3px;">\n' +
                        '                </div>\n' +
                        '                <a href="https://fanoos.app/fanoos.apk" class="mx_ButtonParent mx_ButtonCreateAccount mx_Button_iconCreateAccount">\n' +
                        '                    <div class="mx_ButtonLabel">نسخه اندروید</div>\n' +
                        '                </a>\n' +
                        '            </div>\n' +
                        '            <!-- The comments below are meant to be used by Ansible as a quick way\n' +
                        '                 to strip out the marked content when desired.\n' +
                        '                 See https://github.com/vector-im/element-web/issues/8622.\n' +
                        '                 TODO: Strip out these comments and rely on the guest flag -->\n' +
                        '            <!-- BEGIN Ansible: Remove these lines when guest access is disabled -->\n' +
                        '            <div class="mx_ButtonRow mx_WelcomePage_guestFunctions">\n' +
                        '                <div>\n' +
                        '                    <a href="#/directory" class="mx_ButtonParent mx_SecondaryButton mx_Button_iconRoomDirectory">\n' +
                        '                        <div class="mx_ButtonLabel">کاوش اتاق</div>\n' +
                        '                    </a>\n' +
                        '                </div>\n' +
                        '            </div>\n' +
                        '            <!-- END Ansible: Remove these lines when guest access is disabled -->\n' +
                        '        </div>\n' +
                        '    </div>';
                }
                console.log(body);
                this.setState({ page: body });
            },
        );

        this.dispatcherRef = dis.register(this.onAction);
    }

    public componentWillUnmount(): void {
        this.unmounted = true;
        if (this.dispatcherRef !== null) dis.unregister(this.dispatcherRef);
    }

    private onAction = (payload: ActionPayload): void => {
        // HACK: Workaround for the context's MatrixClient not being set up at render time.
        if (payload.action === 'client_started') {
            this.forceUpdate();
        }
    };

    public render(): JSX.Element {
        // HACK: Workaround for the context's MatrixClient not updating.
        const client = this.context || MatrixClientPeg.get();
        const isGuest = client ? client.isGuest() : true;
        const className = this.props.className;
        const classes = classnames({
            [className]: true,
            [`${className}_guest`]: isGuest,
            [`${className}_loggedIn`]: !!client,
        });

        const content = <div className={`${className}_body`}
            dangerouslySetInnerHTML={{ __html: this.state.page }}
        />;

        if (this.props.scrollbar) {
            return <AutoHideScrollbar className={classes}>
                { content }
            </AutoHideScrollbar>;
        } else {
            return <div className={classes}>
                { content }
            </div>;
        }
    }
}
