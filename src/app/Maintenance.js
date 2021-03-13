import React from "react";

import "./styles/maintenance.css";

export default function Maintenance() {
    return(
        <div className="screen" id="maintanance">
            <div className="image-panel">
                <img className="image" src={require("./assets/family-business-1.png")} />
            </div>

            <div className="info-panel">
                <div className="title">Stránka je momentálne pod údržbou</div>
                <div className="text">
                    Stránka TerraMia momentálne nie je dostupná. Pridávame na ňu nové funckie a vylepšenia, aby ste sa na nej cítili čo najlepšie. Vráťte sa neskôr prosím.
                </div>
            </div>
        </div>
    )
}