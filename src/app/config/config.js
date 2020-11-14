import React from "react";

// default API URL
export const API_URL = "http://localhost:8080";

// returns TRUE if the user is logged, otherwise FALSE
export function isLogged() {
    if (localStorage.getItem("token")) {
        return true
    } else {
        return false
    }
}

// removes an OBJECT from local storage
export function removeStorageItem(name) {
    localStorage.removeItem(name);
}

// returns an OBJECT of the item in local storage depending on its KEY
export function getStorageItem(name) {
    return JSON.parse(localStorage.getItem(name));
}

// stores an OBJECT into local storage assigned to a KEY
export function setStorageItem(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

export function evaluateLogin(response) {
    if (response === "\"email\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"password\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";

    if (response === "\"email\" length must be at least 6 characters long") return "E-mail je príliš krátky";
    if (response === "\"password\" length must be at least 6 characters long") return "Heslo je príliš krátke";

    if (response === "\"email\" must be a valid email") return "E-mail neexistuje";
    if (response === "Email is invalid") return "Používateľ s daným e-mailom neexistuje";

    if (response === "Password is invalid") return "Nesprávne heslo";

    if (response === "Login successful") return "Úspešne ste sa prihlásili";

    return "Nastala chyba pri prihlasovaní. Niektoré údaje môžu byť v zlom formáte"
}

export function evaluateRegister(response) {
    if (response === "Password is in an invalid format") return "Heslo je príliš jednoduché";
    
    if (response === "\"name\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"email\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"phone\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"address\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"psc\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"city\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"country\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";

    if (response === "Phone number already exists") return "Telefónne číslo sa už používa iným účtom";
    if (response === "Email already exists") return "E-mail číslo sa už používa iným účtom";

    if (response === "The user has been successfully registered") return "Úspešne ste sa zaregistrovali";

    return "Nastala chyba pri registrácií. Niektoré údaje môžu byť v zlom formáte"
}

// adds an ITEM and its AMOUNT into the CART
export function addToCart(productId, amount, parent) {
    var cart = getStorageItem("cart");
        
    for (let i = 0; i < cart.length; i++) {
        if (cart[i]._id === productId) {
            cart[i].amount = cart[i].amount + amount
            break;
        } else {
            if (i === cart.length - 1) {
                cart.push({
                    _id: productId,
                    amount: amount
                });

                break;
            }
        }
    }

    if (cart.length === 0) {
        cart.push({
            _id: productId,
            amount: amount
        })
    }

    setStorageItem("cart", cart);
    parent.props.history.push("/kosik");
}

// show and hide mobile menu
export function changeMenu() {
    var menu = document.getElementById("mobile-menu");
    var header = document.getElementById("header");

    var style = window.getComputedStyle(menu);
    var right = style.getPropertyValue("right");

    if (right !== "0px") {
        menu.style.right = "0px";
        menu.style.paddingTop = header.clientHeight + 30 + "px";

        document.getElementById("menu-line-1").style.width = "90%";
        document.getElementById("menu-line-2").style.width = "70%";
        document.getElementById("menu-line-3").style.width = "50%";

        document.getElementById("menu-line-1").style.backgroundColor = "#A161B3";
        document.getElementById("menu-line-2").style.backgroundColor = "#A161B3";
        document.getElementById("menu-line-3").style.backgroundColor = "#A161B3";
    } else  {
        menu.style.right = "-100vw";

        document.getElementById("menu-line-1").style.width = "100%";
        document.getElementById("menu-line-2").style.width = "100%";
        document.getElementById("menu-line-3").style.width = "100%";

        document.getElementById("menu-line-1").style.backgroundColor = "#383838";
        document.getElementById("menu-line-2").style.backgroundColor = "#383838";
        document.getElementById("menu-line-3").style.backgroundColor = "#383838";
    }
}