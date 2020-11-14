import React from "react";

import { changeMenu } from "../config/config";

import "../styles/menu.css";

export default class MenuButton extends React.Component {

    constructor() {
        super();
    }

    render() {
        return(
            <div id="menu-button" onClick={() => changeMenu()}>
                <div className="line" id="menu-line-1"></div>
                <div className="line" id="menu-line-2"></div>
                <div className="line" id="menu-line-3"></div>
            </div>
        )
    }
}