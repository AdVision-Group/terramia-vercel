import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { animate } from "../config/Animation";

import { getStorageItem, ebooksMain } from "../config/config";
import Api from "../config/Api";

import SmoothScroll from "../config/SmoothScroll";

import Banner from "../components/Banner";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/home.css";

export default class Home extends React.Component {

    state = {
        banner: false,

        bannerEbooks: false,
        chooserEbooks: false,

        offset: 0
    }

    constructor() {
        super();

        this.closeBanner = this.closeBanner.bind(this);
        this.downloadEbook = this.downloadEbook.bind(this);
    }

    downloadEbook(event, pathname) {
        event.stopPropagation();

        var link = document.createElement("a");
        link.href = pathname;
        link.download = pathname.split("/")[2];
        link.dispatchEvent(new MouseEvent("click"));
    }
    
    closeBanner() {
        this.setState({ banner: false, bannerEbooks: false });
    }

    componentDidMount() {
        showTransition();
        
        animate();

        hideTransition();

        setTimeout(async () => {
            const token = getStorageItem("token");
            
            if (token) {
                const call = await Api.getUser(token);

                if (call.user) {
                    if (!call.user.registeredInDoTerra) this.setState({ banner: true });
                } else {
                    this.setState({ banner: true });
                }
            } else {
                this.setState({ banner: true });
            }
        }, 2000);
    }

    render() {
        return(
            <div className="screen" id="home">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Esenciálne oleje doTERRA na Slovensku | TerraMia</title>
                    <meta name="description" content="TerraMia ponúka široký výber esenciálnych olejov doTERRA na Slovensku. V TerraMia Vám ukážeme, kde kúpiť prírodné esenciálne oleje doTERRA."></meta>
                    <meta name="keywords" content="doterra, esenciálne oleje, doterra oleje, esencialne oleje, doterra sk, oleje doterra, doterra slovensko, esenciálne oleje doterra, doterra esenciálne oleje, doterra eshop, kde kupit esencialne oleje, prírodné esenciálne oleje, esencialne oleje doterra"></meta>
                </Helmet>

                {/*
                <div className="slideshow">
                    <h2 className="title fade-in-up animate__delay-1s">
                        {getStorageItem("token") ? "Vyberte si zo širokej ponuky esenciálnych olejov v našom e-shope" : "Klub TerraMia, cesta ku špičkovej starostlivosti"}
                    </h2>
                    <p className="text fade-in-up animate__delay-3s">
                        {getStorageItem("token") ? "Využite cenu pre členov doTERRA v našom e-shope. Zľavu 25% na všetky produkty si môžete uplatniť hneď pri prvom nákupe nad 125€. Radi Vám vysvetlíme, ako to funguje." : "Chcete sa starať o seba a svoju rodinu použitím prírodných riešení čo najvýhodnejšie? Chcete nakupovať a získavať darčeky bezpečne? Esenciálne oleje doTERRA sú 100% prírodné, bezpečné a cenovo výhodné."}
                    </p>
                    <Link className="button-filled fade-in-up animate__delay-5s" to={getStorageItem("token") ? "/sutaz-o-vstupny-balicek" : "/stan-sa-clenom"}>
                        {getStorageItem("token") ? "Získaj 25% zľavu" : " Staň sa členom klubu"}
                    </Link>

                    <div onClick={() => SmoothScroll.scroll("#oils")}><img className="arrow" src={require("../assets/arrow.png")} loading="lazy" /></div>
                </div>
                */}

                <div className="slideshow">
                    <h2 className="title fade-in-up animate__delay-1s">
                        Získajte pri kúpe Veľkého balíka nevyhnutností pre domácnosť 8 esenciálnych darčekov. Akcia platí do konca septembra.
                    </h2>

                    <div className="banner-buttons fade-in-up animate__delay-5s">
                        <Link className="button-filled" to="/e-shop/1-velky-balik-nevyhnutnosti-pre-domacnost">
                            Veľký balík
                        </Link>

                        <Link className="button-filled" to="/blog/8-darcekov-k-nakupu-v-septembri">
                            Viac informácií
                        </Link>
                    </div>

                    <div onClick={() => SmoothScroll.scroll("#oils")}><img className="arrow" src={require("../assets/arrow.png")} loading="lazy" /></div>
                </div>

                <div className="oils" id="oils" style={{ position: "relative" }}>
                    <h3 className="title-large fade-in-up">Balzam na dušu</h3>
                    <div className="panel" id="oils-panel-1">

                        <img className="image fade-in-up" src={require("../assets/landing-oil.jpg")} loading="lazy" />

                        <div className="info">
                            <p className="text">
                                ADAPTIV je zmes esenciálnych olejov, ktorá pomôže účinne zvládnuť stres a ukludniť emócie ako strach, hnev, smútok vyplývajúce z každodenných situácií. Ale esenciálne oleje dokážu omnoho viac. Spoznaj silu prírodných riešení...
                            </p>
                            <Link className="button-filled" to="/e-shop">Získaj</Link>
                        </div>
                    </div>

                    <div className="panel" id="oils-panel-2">
                        <div className="info">
                            <h3 className="title-large fade-in-up">Získaj 25% zľavu</h3>

                            <p className="text">
                                Chceli by ste získať zľavu 25% na všetky produkty od doTERRA a ďalšie výhody? Nebude Vás to stáť nič navyše. Stále neviete ako na to?
                            </p>
                            {/*<a className="button-filled" href="https://www.mydoterra.com/Application/index.cfm?EnrollerID=756332">Staň sa členom doTERRA</a>*/}
                            <Link className="button-filled" to="/kde-kupit-esencialne-oleje">Získaj 25% zľavu</Link>
                        </div>

                        <img className="images fade-in-up" src={require("../assets/family-business-2.png")} loading="lazy" />
                    </div>
                </div>

                <div className="links">
                    <div className="item fade-in-up" id="links-item-1">
                        <h3 className="title">Prečo esenciálne oleje?</h3>
                        <Link className="button-filled" to={{ pathname: "/aromavzdelavanie", section: "#aromatherapy-section-1" }}>Zisti viac</Link>
                    </div>

                    <div className="item fade-in-up" id="links-item-2">
                        <h3 className="title">Ako sa získavajú esenciálne oleje?</h3>
                        <Link className="button-filled" to={{ pathname: "/aromavzdelavanie", section: "#aromatherapy-section-4" }}>Zisti viac</Link>
                    </div>

                    <div className="item fade-in-up" id="links-item-3">
                        <h3 className="title">Ako používať esenciálne oleje?</h3>
                        <Link className="button-filled" to={{ pathname: "/aromavzdelavanie", section: "#aromatherapy-section-7" }}>Zisti viac</Link>
                    </div>

                    <div className="item fade-in-up" id="links-item-4">
                        <h3 className="title">Ako zarobiť s TerraMia?</h3>
                        <Link className="button-filled" to="/podnikanie">Zisti viac</Link>
                    </div>
                </div>

                <div className="ebook">
                    <div className="wrapper">
                        <img className="family-image" src={require("../assets/family-business-1.png")} loading="lazy" />

                        <div className="info-panel">
                            <div className="title">Inšpiruj sa Voňavým pomocníkom</div>
                            <div className="text">
                                Základy používania esenciálnych olejov v kocke, ich benefitov pre kvalitu života, využitie pre konkrétne situácie nájdete vo Voňavom pomocníkovi. Získaj časť z neho bezplatne a nahliadni do sveta esenciálnych olejov najvyššej kvality CPTG.
                            </div>

                            <div
                                className="button-filled"
                                onClick={() => getStorageItem("token") ? this.setState({ banner: false, chooserEbooks: true }) : this.setState({ banner: false, bannerEbooks: true })}
                            >Stiahni si e-book</div>
                        </div>
                    </div>
                </div>

                {this.state.chooserEbooks ? <EBookChooser ebooks={ebooksMain} downloadEbook={this.downloadEbook} close={() => this.setState({ chooserEbooks: false })} /> : null}

                {this.state.banner ? (
                    getStorageItem("token") ?
                        <Banner
                            title="Chcete produkty doTERRA kúpiť s 25% zľavou a získať ďaľšie darčeky?"
                            text="Otvorte si vlastný účet doTERRA a získavajte pravidelné výhody podľa vášho výberu a nakupujte produkty doTERRA oveľa výhodnejšie!"
                            button="Zisti viac"
                            image={require("../assets/popup-rodinka.png")}
                            location="/kde-kupit-esencialne-oleje"
                            closeBanner={this.closeBanner}
                        />
                    :
                        <Banner
                            title="Odpovedzte na otázku a vyhrajte"
                            text="Zapojte sa do súťaže o Malý balík nevyhnutností pre domácnosť v hodnote 184€."
                            button="Zapojiť sa do súťaže"
                            location="/registracna-sutaz"
                            closeBanner={this.closeBanner}
                        />
                ) : null}

                {this.state.bannerEbooks && !getStorageItem("token") ? (
                    <Banner
                        title="Staň sa členom TerraMia"
                        text="Na získanie e-booku zadarmo je potrebné členstvo v klube TerraMia. Staň sa členom a získaj všetky výhody klubu."
                        button="Staň sa členom klubu"
                        business
                        closeBanner={this.closeBanner}
                    />
                ) : null}
            </div>
        )
    }
}

function EBookChooser(props) {
    const ebooks = props.ebooks;

    return(
        <div id="ebook-chooser" onClick={props.close}>
            <div className="panel">
                <div className="title">Vyberte si e-book alebo si objednajte kompletnú verziu Voňavého pomocníka cez náš <a href="https://terramia.sk/e-shop/vonavy-pomocnik-slovencina" style={{ color: "#A161B3", textDecoration: "none", display: "inline-block" }}>e-shop</a></div>

                <div className="ebooks">
                    {ebooks.map((ebook, index) => (
                        <div className="item" style={index === ebooks.length - 1 ? { border: "none" } : null}>
                            <div className="name">{ebook.name}</div>
                            <div style={{ flex: 1 }} />
                            <div className="pdf">PDF</div>
                            <div className="button-filled" onClick={(event) => props.downloadEbook(event, ebook.pathname)}>Stiahnuť</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}