/*
Copyright 2021 The Matrix.org Foundation C.I.C.

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

import React from "react";

import SettingsStore from "../../../settings/SettingsStore";
import StyledCheckbox from "../elements/StyledCheckbox";
import { _t } from "../../../languageHandler";
import { SettingLevel } from "../../../settings/SettingLevel";

interface IProps {
    // none
}

interface IState {
    items: [];
    itemsName: string[];
}

export default class MainTabsPanel extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            items:SettingsStore.getValue("ActiveTabs"),
            itemsName: ["ساختار", "نقشه","اخبار مهم", "قرآن", "اخبار", "بانک حدیث", "تقویم","رویداد","اتاق گفتگو","پنل کاربری"]

        };
    }


    onActiveTabsChange = (index) => {
        console.log("newActiveTabs",index);
        let newActiveTabs = this.state.items;
        newActiveTabs[index] = newActiveTabs[index] == 1 ? 0 : 1;
        this.setState({items:newActiveTabs});
        // noinspection JSIgnoredPromiseFromCall
        SettingsStore.setValue("ActiveTabs", null, SettingLevel.ACCOUNT, newActiveTabs);
        
    }

    public render(): JSX.Element {
        const { items, itemsName } = this.state;
        return (
            <div className="mx_SettingsTab_section mx_MainTabsPanel">
                <span className="mx_SettingsTab_subheading">
                    { _t("Active Tabs") }
                </span>

                <div className="mx_MainTabsPanel_checkbox">
                    {items.slice(0,itemsName.length).map((item, index) => {
                        return (
                            <label>
                                <StyledCheckbox
                                    name={'activeTabs_'+index}
                                    value={index}
                                    checked={item == 1}
                                    onClick={()=>this.onActiveTabsChange(index)}
                                >
                                     {itemsName[index]}
                                </StyledCheckbox>
                            </label>
                            
                        )}
                    )}

                </div>
            </div>
        );
    }
}
