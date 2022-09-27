/*
Copyright 2020 The Matrix.org Foundation C.I.C.

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

import * as React from "react";
import { useContext, useState } from "react";

import AutoHideScrollbar from './AutoHideScrollbar';
import { getHomePageUrl } from "../../utils/pages";
import { _tDom } from "../../languageHandler";
import SdkConfig from "../../SdkConfig";
import * as sdk from "../../index";
import dis from "../../dispatcher/dispatcher";
import { Action } from "../../dispatcher/actions";
import BaseAvatar from "../views/avatars/BaseAvatar";
import { OwnProfileStore } from "../../stores/OwnProfileStore";
import AccessibleButton from "../views/elements/AccessibleButton";
import { UPDATE_EVENT } from "../../stores/AsyncStore";
import { useEventEmitter } from "../../hooks/useEventEmitter";
import MatrixClientContext from "../../contexts/MatrixClientContext";
import MiniAvatarUploader, { AVATAR_SIZE } from "../views/elements/MiniAvatarUploader";
import Analytics from "../../Analytics";
import CountlyAnalytics from "../../CountlyAnalytics";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import HomePageChart from "./HomePageChart";
import HomePageMap from "./HomePageMap.js";
import SettingsStore from "../../settings/SettingsStore";
import HomePage3DMap from "./HomePage3DMap.js";
import { SettingLevel } from "../../settings/SettingLevel";

const onClickSendDm = () => {
    Analytics.trackEvent('home_page', 'button', 'dm');
    CountlyAnalytics.instance.track("home_page_button", { button: "dm" });
    dis.dispatch({ action: 'view_create_chat' });
};

const onClickExplore = () => {
    Analytics.trackEvent('home_page', 'button', 'room_directory');
    CountlyAnalytics.instance.track("home_page_button", { button: "room_directory" });
    dis.fire(Action.ViewRoomDirectory);
};

const onClickNewRoom = () => {
    Analytics.trackEvent('home_page', 'button', 'create_room');
    CountlyAnalytics.instance.track("home_page_button", { button: "create_room" });
    dis.dispatch({ action: 'view_create_room' });
};

interface IProps {
    justRegistered?: boolean;
}

const getOwnProfile = (userId: string) => ({
    displayName: OwnProfileStore.instance.displayName || userId,
    avatarUrl: OwnProfileStore.instance.getHttpAvatarUrl(AVATAR_SIZE),
});

const UserWelcomeTop = () => {
    const cli = useContext(MatrixClientContext);
    const userId = cli.getUserId();
    const [ownProfile, setOwnProfile] = useState(getOwnProfile(userId));
    useEventEmitter(OwnProfileStore.instance, UPDATE_EVENT, () => {
        setOwnProfile(getOwnProfile(userId));
    });

    return <div>
        <MiniAvatarUploader
            hasAvatar={!!ownProfile.avatarUrl}
            hasAvatarLabel={_tDom("Great, that'll help people know it's you")}
            noAvatarLabel={_tDom("Add a photo so people know it's you.")}
            setAvatarUrl={url => cli.setAvatarUrl(url)}
        >
            <BaseAvatar
                idName={userId}
                name={ownProfile.displayName}
                url={ownProfile.avatarUrl}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                resizeMethod="crop"
            />
        </MiniAvatarUploader>

        <h1>{_tDom("Welcome %(name)s", { name: ownProfile.displayName })}</h1>
        {/* <h4>{ _tDom("Now, let's help you get started") }</h4> */}
    </div>;
};

const HomePage: React.FC<IProps> = ({ justRegistered = false }) => {
    const config = SdkConfig.get();
    const pageUrl = getHomePageUrl(config);
    const tabsData = [
        {
            'title': 'ساختار',
            'content': <HomePageChart />,
            
        },
        {
            'title': 'نقشه',
            'content': <HomePageMap />,
            
        },
        {
            'title': 'اخبار مهم',
            'content': <HomePage3DMap />,
            
        },
        {
            'title': 'قرآن',
            'url': 'https://ayat.language.ml/'
            
        },
        {
            'title': 'اخبار',
            'url': 'https://www.parseek.com/Latest/'
        },
        {
            'title': 'بانک حدیث',
            'url': 'https://hadith.inoor.ir'
        },
        {
            'title': 'تقویم',
            'url': 'https://www.todaytime.ir/'
        },
        {
            'title': 'رویداد',
            'url': 'https://fanoosai.github.io/fanoos-meet-planner/deploy/'
        },
        {
            'title': 'اتاق گفتگو',
            'url': 'https://fanoosai.github.io/fanoos-streamer'
        },
        {
            'title': 'پنل کاربری',
            'url': 'https://static.fanoos.app/'
        },
    ]

    const ActiveTabs = SettingsStore.getValue("ActiveTabs")

    if(tabsData.length > ActiveTabs.length) {
        for (let i = 0; i < tabsData.length - ActiveTabs.length; i++) {
            ActiveTabs.push(1)
        }
        SettingsStore.setValue("ActiveTabs", null, SettingLevel.ACCOUNT, ActiveTabs);
    }

    if (pageUrl) {
        // FIXME: Using an import will result in wrench-element-tests failures
        const EmbeddedPage = sdk.getComponent('structures.EmbeddedPage');
        return <EmbeddedPage className="mx_HomePage" url={pageUrl} scrollbar={true} />;
    }

    let introSection;
    if (justRegistered) {
        introSection = <UserWelcomeTop />;
    } else {
        const brandingConfig = config.branding;
        let logoUrl = "themes/element/img/logos/element-logo.svg";
        if (brandingConfig && brandingConfig.authHeaderLogoUrl) {
            logoUrl = brandingConfig.authHeaderLogoUrl;
        }

        introSection = <React.Fragment>
            <img src={logoUrl} alt={config.brand} />
            <h1>{_tDom("Welcome to %(appName)s", { appName: config.brand })}</h1>
            {/* <h4>{ _tDom("Own your conversations.") }</h4> */}
        </React.Fragment>;
    }

   
    return <AutoHideScrollbar>

        <Tabs className='mx_HomePage_Tabs'>
            <TabList >
                {ActiveTabs.slice(0,tabsData.length).map((item,index)=>item == 1 ? <Tab>{tabsData[index].title}</Tab> : null)}
            </TabList>
            {ActiveTabs.slice(0,tabsData.length).map((item,index)=>item == 1 ? 
                <TabPanel>
                    {tabsData[index].url?<iframe src={tabsData[index].url} width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>:tabsData[index].content}
                </TabPanel> 
            : null)}
        </Tabs>

        {/* <div className="mx_HomePage_default_buttons">
                <AccessibleButton onClick={onClickSendDm} className="mx_HomePage_button_sendDm">
                    { _tDom("Send a Direct Message") }
                </AccessibleButton>
                <AccessibleButton onClick={onClickExplore} className="mx_HomePage_button_explore">
                    { _tDom("Explore Public Rooms") }
                </AccessibleButton>
                <AccessibleButton onClick={onClickNewRoom} className="mx_HomePage_button_createGroup">
                    { _tDom("Create a Group Chat") }
                </AccessibleButton>
            </div> */}
    </AutoHideScrollbar>;
};

export default HomePage;
