import React from "react";
import { Link, useLocation } from "react-router-dom"

import { changeMenu, removeStorageItem } from "../config/config";

import "../styles/menu.css";

export default function MobileMenu() {

    const location = useLocation().pathname;

    return(
        <div id="mobile-menu">
            <Link className="link" onClick={() => changeMenu()} to="/" style={location === "/" ? { color: "#A161B3" } : null}>Domov</Link>
            <Link className="link" onClick={() => {
                changeMenu();
                removeStorageItem("shop-type");
                removeStorageItem("shop-category");
            }} to="/e-shop" style={location.includes("e-shop") ? { color: "#A161B3" } : null}>E-shop</Link>
            <Link className="link" onClick={() => changeMenu()} to="/aromavzdelavanie" style={location.includes("aromavzdelavanie") ? { color: "#A161B3" } : null}>Aromavzdelávanie</Link>
            <Link className="link" onClick={() => changeMenu()} to="/podnikanie" style={location.includes("podnikanie") ? { color: "#A161B3" } : null}>Podnikanie</Link>
            <Link className="link" onClick={() => changeMenu()} to="/webinare" style={location.includes("webinare") ? { color: "#A161B3" } : null}>Webináre</Link>
            <Link className="link" onClick={() => changeMenu()} to="/novinky" style={location.includes("novinky") ? { color: "#A161B3" } : null}>Novinky</Link>
            <Link className="link" onClick={() => changeMenu()} to="/blog" style={location.includes("blog") ? { color: "#A161B3" } : null}>Blog</Link>
            <Link className="link" onClick={() => changeMenu()} to="/o-nas" style={location.includes("o-nas") ? { color: "#A161B3" } : null}>O nás</Link>
            <Link className="link" onClick={() => changeMenu()} to="/kontakt" style={location.includes("kontakt") ? { color: "#A161B3" } : null}>Kontakt</Link>
            <Link className="link" onClick={() => changeMenu()} to="/kosik" style={location.includes("kosik") ? { color: "#A161B3" } : null}>Košík</Link>
            <Link className="link" onClick={() => changeMenu()} to="/prihlasenie" style={location.includes("prihlasenie") || location.includes("registracia") || location.includes("profil") || location.includes("admin") ? { color: "#A161B3" } : null}>Profil</Link>
        </div>
    )
}