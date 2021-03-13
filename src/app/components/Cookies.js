import React from "react";

import { setStorageItem, getStorageItem } from "../config/config";

import "../styles/cookies.css";

export const showCookies = () => {
    const cookies = getStorageItem("cookies");

    if (cookies === "disabled") {
        document.getElementById("cookies").style.display = "flex";
    } else {
        document.getElementById("cookies").style.display = "none";
    }
}

export const hideCookies = () => {
    document.getElementById("cookies").style.display = "none";
}

export default function Cookies() {
    return(
        <div id="cookies">
            <div className="text">
                Táto stránka používa cookies na ukladanie používateľských nastavení a na marketingové účely.
            </div>
            <div style={{ flex: 1 }} />
            <div className="button-panel">
                <div className="button-filled" onClick={() => {
                    setStorageItem("cookies", "allowed");
                    hideCookies();
                }}>Povoliť</div>
                <div className="button-outline" onClick={() => {
                    setStorageItem("cookies", "disabled");
                    hideCookies();
                }}>Zrušiť</div>
            </div>
        </div>
    )
}