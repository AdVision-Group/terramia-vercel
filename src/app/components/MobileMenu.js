import React from "react";
import { Link, useLocation } from "react-router-dom"

import { changeMenu } from "../config/config";

import "../styles/menu.css";

export default function MobileMenu() {

    const location = useLocation().pathname;

    return(
        <div id="mobile-menu">
            <Link className="link" onClick={() => changeMenu()} to="/" style={location === "/" ? { color: "#A161B3" } : null}>Domov</Link>
            <Link className="link" onClick={() => changeMenu()} to="/e-shop" style={location === "/e-shop" ? { color: "#A161B3" } : null}>E-shop</Link>
            <Link className="link" onClick={() => changeMenu()} to="/aromaterapia" style={location === "/aromaterapia" ? { color: "#A161B3" } : null}>Aromaterapia</Link>
            <Link className="link" onClick={() => changeMenu()} to="/podnikanie" style={location === "/podnikanie" ? { color: "#A161B3" } : null}>Podnikanie</Link>
            <Link className="link" onClick={() => changeMenu()} to="/novinky" style={location === "/novinky" ? { color: "#A161B3" } : null}>Novinky</Link>
            <Link className="link" onClick={() => changeMenu()} to="/blog" style={location === "/blog" ? { color: "#A161B3" } : null}>Blog</Link>
            <Link className="link" onClick={() => changeMenu()} to="/o-nas" style={location === "/o-nas" ? { color: "#A161B3" } : null}>O nás</Link>
            <Link className="link" onClick={() => changeMenu()} to="/kontakt" style={location === "/kontakt" ? { color: "#A161B3" } : null}>Kontakt</Link>
            <Link className="link" onClick={() => changeMenu()} to="/kosik" style={location === "/kosik" ? { color: "#A161B3" } : null}>Košík</Link>
            <Link className="link" onClick={() => changeMenu()} to="/prihlasenie" style={location === "/prihlasenie" || location === "/registracia" || location === "/profil" ? { color: "#A161B3" } : null}>Profil</Link>
        </div>
    )
}