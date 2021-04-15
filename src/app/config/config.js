import React from "react";

// default API URL
export const API = "http://141.136.35.33:8080";
export const API_URL = "https://coronashop.store:8443";

const TITLE = "title";
const TEXT = "text";
const POINT = "point";
const HEADING = "heading";

export const shop = [
    {
        type: "Esenciálne oleje",
        categories: [
            "Samostatné oleje",
            "Patentované Zmesi"
        ]
    },
    {
        type: "Kozmetika a osobná hygiena",
        categories: [
            "Vlasová kozmetika",
            "Tvárová kozmetika",
            "Telová kozmetika a osobná hygiena"
        ]
    },
    {
        type: "Výživové doplnky",
        categories: [
            "Výživové doplnky"
        ]
    },
    {
        type: "Zvýhodnené balíky",
        categories: [
            "Zvýhodnené balíky"
        ]
    },
    {
        type: "Špeciálne ponuky",
        categories: [
            "Špeciálne ponuky",
        ]
    },
    {
        type: "Produkty TerraMia",
        categories: [
            "Produkty TerraMia"
        ]
    }
]

export const ebooks = [
    {
        image: require("../assets/slabikar-1.jpg"),
        name: "AromaŠlabikár 1",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-terramia-academy-4-20.pdf",
        description: "Chcete vedieť čo najviac o produktoch Copaiba, Deep Blue, Spearmint, Lime, Purify, ZenGest, Smart & Sassy, ktoré boli ponúknuté v BOGO v apríli 2020? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    },
    {
        image: require("../assets/slabikar-2.jpg"),
        name: "AromaŠlabikár 2",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-krotitelia-napatia.pdf",
        description: "Chcete vedieť čo najviac o zmesiach AromaTouch, Balance, PastTense, ktoré poznáme ako Krotiteľov napätia? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    },
    {
        image: require("../assets/slabikar-3.jpg"),
        name: "AromaŠlabikár 3",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-terramia-academy-7-20-1.pdf",
        description: "Chcete vedieť čo najviac o produktoch Serenity, Cedarwood, Turmeric, Island Mint, Thyme a Marjoram, ktoré boli ponúknuté v BOGO v júli 2020? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    },
    {
        image: require("../assets/slabikar-4.jpg"),
        name: "AromaŠlabikár 4",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-terramia-academy-7-20-2.pdf",
        description: "Chcete vedieť čo najviac o produktoch Bergamot, Clementine, Clary Sage, Laurel Leaf, Console, Cheer, Forgive, ktoré boli ponúknuté v BOGO v júli 2020? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    },
    {
        image: require("../assets/slabikar-5.jpg"),
        name: "AromaŠlabikár 5",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-emocionalna-aromaterapia.pdf",
        description: "Chcete vedieť čo najviac o zmesiach Balíka emocionálnej aromaterapie Peace, Motivate, Cheer, Passion, Forgive, Console? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    },
    {
        image: require("../assets/slabikar-6.jpg"),
        name: "AromaŠlabikár 6",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-terramia-academy-8-20.pdf",
        description: "Chcete vedieť čo najviac o produktoch Serenity, Siberian Fir, Green Mandarin, Grapefruit, ktoré boli ponúknuté v BOGO v auguste 2020? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    },
    {
        image: require("../assets/slabikar-7.jpg"),
        name: "AromaŠlabikár 7",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-onguard-prirucka.pdf",
        description: "Chcete vedieť čo najviac o úžasnej produktovej rade OnGuard ktorá je dlhodobo najžiadanejšou a najúspešnejšou zmesou doTERRA? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    },
    {
        image: require("../assets/slabikar-8.jpg"),
        name: "AromaŠlabikár 8",
        date: "20.1.2021, 12:00",
        pathname: "/ebooks/ebook-terramia-academy-10-20.pdf",
        description: "Chcete vedieť čo najviac o produktoch Cardamom, Pink Pepper, Balance, Helichrysum, Black Spruce, Neroli, Ylang Ylang, Frankincense, Lavender, Motivate, ktoré boli ponúknuté v BOGO v októbri 2020? V špeciálnom vydaní ponúkame hĺbkovú sondu do poznania účinkov a praktického využitia práve týchto skvelých produktov doTERRA."
    }
]

export const ebooksMain = [
    {
        name: "Voňavý pomocník (SK)",
        pathname: "/ebooks/ebook-vonavy-pomocnik-sk.pdf"
    },
    {
        name: "Voňavý pomocník (CZ)",
        pathname: "/ebooks/ebook-vonavy-pomocnik-cz.pdf"
    }
]

export function formatDate(text) {
    const dateString = text.split("T")[0].split("-");
    const timeString = text.split("T")[1].split(".")[0].split(":");

    const date = dateString[2] + "." + dateString[1] + "." + dateString[0];
    const time = (parseInt(timeString[0]) + 1) + ":" + timeString[1];

    return date + ", " + time;
}

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
    if (response === "Password is in an invalid format") return "Heslo je príliš jednoduché. Heslo musí byť dlhé aspoň 8 znakov a obsahovať aspoň jedno veľké písmeno a aspoň jedno číslo.";
    
    if (response === "\"name\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"email\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"phone\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"address\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"psc\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"city\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";
    if (response === "\"country\" is not allowed to be empty") return "Všetky polia musia byť vyplnené";

    if (response === "Phone number already exists") return "Telefónne číslo sa už používa iným účtom";
    if (response === "Email already exists") return "Zadaný e-mail je už zaregistrovaný";

    if (response === "The user has been successfully registered") return "Úspešne ste sa zaregistrovali";

    if (response === "\"email\" must be a valid email" || "\"email\" length must be at least 6 characters long") return "Zadaný e-mail neexistuje"

    return "Nastala chyba pri registrácií. Niektoré údaje môžu byť v zlom formáte"
}

// adds an ITEM and its AMOUNT into the CART
export function addToCart(productId, points, amount, parent) {
    var cart = getStorageItem("cart");
        
    for (let i = 0; i < cart.length; i++) {
        if (cart[i]._id === productId) {
            cart[i].amount = cart[i].amount + amount;
            break;
        } else {
            if (i === cart.length - 1) {
                cart.push({
                    _id: productId,
                    amount: amount,
                    points: points
                });

                break;
            }
        }
    }

    if (cart.length === 0) {
        cart.push({
            _id: productId,
            amount: amount,
            points: points
        });
    }

    setStorageItem("cart", cart);
    parent.props.history.push("/kosik");
}

// show and hide mobile menu
export function changeMenu() {
    var menu = document.getElementById("mobile-menu");
    var header = document.getElementById("header");

    var style = window.getComputedStyle(menu);
    var display = style.getPropertyValue("display");

    if (display === "none") {
        menu.style.display = "flex";
        setTimeout(() => {
            menu.style.opacity = 1;
        }, 1);

        document.getElementById("menu-line-1").style.width = "90%";
        document.getElementById("menu-line-2").style.width = "70%";
        document.getElementById("menu-line-3").style.width = "50%";

        //document.getElementById("menu-line-1").style.backgroundColor = "#A161B3";
        //document.getElementById("menu-line-2").style.backgroundColor = "#A161B3";
        //document.getElementById("menu-line-3").style.backgroundColor = "#A161B3";
    } else  {
        menu.style.opacity = 0;
        setTimeout(() => {
            menu.style.display = "none";
        }, 301);

        document.getElementById("menu-line-1").style.width = "100%";
        document.getElementById("menu-line-2").style.width = "100%";
        document.getElementById("menu-line-3").style.width = "100%";

        //document.getElementById("menu-line-1").style.backgroundColor = "#383838";
        //document.getElementById("menu-line-2").style.backgroundColor = "#383838";
        //document.getElementById("menu-line-3").style.backgroundColor = "#383838";
    }
}

export function createURLName(name) {
    const url = name.trim().toLowerCase().split(/[ ,]+/).join("-").replace(/[.,\/#!$%\^&\*;:{}=\“\”_`~()""']/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return url;
}