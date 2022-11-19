import React from 'react'
import ThemeWatcher from "../../settings/watchers/ThemeWatcher";

// className={mainClasses} ref={this.roomView} onKeyDown={this.onReactKeyDown}
const RoomViewBackground = (props) => {
    // let rndNember= Math.floor(Math.random() * 1000) + 1;
    var today = new Date();
    var dateAndTime = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours();
    // BackgroundImage = "https://static.fanoos.app/stellarium_day.png";
    let BackgroundImage = "";
    let _style = {}
    let theme = new ThemeWatcher().getEffectiveTheme();
    if (theme.includes("dark")) {
        BackgroundImage = "https://static.fanoos.app/stellarium_night.png";
        _style = {backgroundImage:`url(${BackgroundImage}?v=${dateAndTime})`}
    }
    return (
        <div className={props.className}
            ref={props.ref}
            onKeyDown={props.onKeyDown}
            style={_style}>
            {props.children}
        </div>
    )
}


export default RoomViewBackground;