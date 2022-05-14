import React from 'react'
import ThemeWatcher from "../../settings/watchers/ThemeWatcher";

// className={mainClasses} ref={this.roomView} onKeyDown={this.onReactKeyDown}
const RoomViewBackground = (props) => {
    let rndNember= Math.floor(Math.random() * 1000) + 1;
    let BackgroundImage = "https://static.fanoos.app/stellarium_night_compress.png";
    let theme = new ThemeWatcher().getEffectiveTheme();
    if (theme.includes("light")) {
        BackgroundImage = "https://static.fanoos.app/stellarium_day_compress.png";
    }
    return (
        <div className={props.className}
            ref={props.ref}
            onKeyDown={props.onKeyDown}
            style={{backgroundImage:`url(${BackgroundImage}?v=${rndNember})`}}>
            {props.children}
        </div>
    )
}


export default RoomViewBackground;