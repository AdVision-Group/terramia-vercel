import React from "react";
import { Link, withRouter } from "react-router-dom";

import { animate } from "../config/Animation";
import SmoothScroll from "../config/SmoothScroll";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";

import "../styles/aromatherapy.css";

class Aromatherapy extends React.Component {

    state = {
        offset: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        animate();

        if (this.props.location.section) {
            SmoothScroll.scroll(this.props.location.section)
        }
    }

    render() {
        return(
            <div className="screen" id="aromatherapy">
                <Title title="Spoznajte silu esenciálnych olejov" image="title-background-4.jpg" />

                <div className="content">
                    <div className="section-1" id="aromatherapy-section-1">
                        <h2 className="title fade-in-up">Tri najdôležitejšie fakty o esenciálnych olejoch</h2>

                        <div className="list">
                            <div className="item fade-in-up">
                                <ion-icon name="leaf" style={{ backgroundColor: "rgb(97, 139, 84)" }}></ion-icon>
                                <h4 className="title">100% prírodné</h4>
                                <p className="text">
                                    Esenciálne oleje doTERRA neobsahujú žiadne umelé látky alebo prísady.
                                </p>
                            </div>

                            <div className="item fade-in-up">
                                <ion-icon name="heart" style={{ backgroundColor: "rgb(240, 211, 66)" }}></ion-icon>
                                <h4 className="title">Bezpečné a účinné</h4>
                                <p className="text">
                                    Esenciálne oleje doTERRA sú dôsledne a nadštandardne testované.
                                </p>
                            </div>

                            <div className="item fade-in-up">
                                <ion-icon name="card" style={{ backgroundColor: "rgb(224, 122, 166)" }}></ion-icon>
                                <h4 className="title">Cenovo dostupné</h4>
                                <p className="text">
                                    Esenciálne oleje doTERRA sú koncentrované a efektívne použiteľné substancie.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="section-2">
                        <h2 className="title fade-in-up">Viete, že?</h2>
                        <p className="description fade-in-up delay-1s">
                            Potrebujeme skutočne veľké množstvo rastlinného materiálu na výrobu 15 ml fľaštičky esenciálneho oleja doTERRA?
                        </p>
                        <div className="list">
                            <div className="item fade-in-up" id="aromatherapy-image-1">
                                <div className="heading">75 ks citrónov</div>
                            </div>

                            <div className="item fade-in-up" id="aromatherapy-image-2">
                               <div className="heading">400 listov mäty</div>
                            </div>

                            <div className="item fade-in-up" id="aromatherapy-image-3">
                                <div className="heading">7 kg levandule</div>
                            </div>
                        </div>
                    </div>

                    <div className="section-3">
                        <h2 className="title fade-in-up">Prírodné esenciálne oleje sú účinné bez vedľajších účinkov na rozdiel od ich syntetických napodobenín</h2>
                        <p className="description fade-in-up delay-1s">
                            Sila prírody ponúka svoje dary už po stáročia a ich správnym používaním môže výrazne ovplyvniť kvalitu nášho života.
                        </p>

                        <br />
                        <br />
                        <br />

                        <div className="panel">
                            <div className="image-panel">
                                <img className="image" src={require("../assets/image-aromatherapy-1.png")} style={{ marginLeft: -100 }} />
                            </div>

                            <div className="box-panel">
                                <div className="box fade-in-right">
                                    <h4 className="heading">Dokážu chrániť a podporovať funkcie ľudského tela</h4>
                                    <div className="text">
                                        Mnohé z účinných látok chrániacich rastlinu pozitívne vplývajú aj na ľudský organizmus. Aromatické účinky navyše upokojujú telo aj myseľ. Čistota a kvalita olejov doTERRA je zárukou bezpečného použitia ľuďmi bez vekového obmedzenia a umožňuje niektoré oleje užívať aj vnútorne.
                                    </div>
                                </div>

                                <div className="box fade-in-right" style={{ alignSelf: "flex-end" }}>
                                    <h4 className="heading">Sú 50 - 70 krát účinnejšie ako samotné rastliny</h4>
                                    <div className="text">
                                        Pomocou destilácie, lisovania za studena a enfleurage získavame z rastlín veľmi silné a koncentrované esenciálne oleje, s mnohonásobne silnejšími účinkami ako majú samotné rastliny.
                                    </div>
                                </div>

                                <div className="box fade-in-right">
                                    <h4 className="heading">Dokážu preniknúť cez bunkovú membránu</h4>
                                    <div className="text">
                                        Esenciálne oleje a ich molekuly sú tak drobné, že dokážu preniknúť cez bunkovú membránu do bunky a transportovať tak účinné látky podporujúce všetky telové systémy.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section-4" id="aromatherapy-section-4">
                        <h2 className="title fade-in-up">Odkiaľ sa získavajú esenciálne oleje</h2>
                        <p className="description fade-in-up delay-1s">
                            Samotné esenciálne oleje sú vonné prchavé látky uložené v miniatúrnych váčkoch v tej časti rastliny, ktorú si rastlina potrebuje chrániť. Môžu to byť plody, kvety, listy, vetvičky, kôra, živica alebo korene. Niektoré rastliny produkujú aj viac druhov esenciálnych olejov, napríklad pomarančovník (Wild Orange/kôra, Neroli/kvety, Petitgrain/listy).
                        </p>

                        <div className="list">
                            <div className="item fade-in-up">
                                <img className="image" src={require("../assets/icon-1.jpg")} />
                                <div className="title">Plody</div>
                            </div>

                            <div className="item fade-in-up">
                            <img className="image" src={require("../assets/icon-2.jpg")} />
                                <div className="title">Kvety</div>
                            </div>

                            <div className="item fade-in-up">
                            <img className="image" src={require("../assets/icon-3.jpg")} />
                                <div className="title">Listy a vetvičky</div>
                            </div>

                            <div className="item fade-in-up">
                            <img className="image" src={require("../assets/icon-4.jpg")} />
                                <div className="title">Kôra a živica</div>
                            </div>

                            <div className="item fade-in-up">
                            <img className="image" src={require("../assets/icon-5.jpg")} />
                                <div className="title">Korene</div>
                            </div>
                        </div>
                    </div>

                    <div className="section-5">
                        <h2 className="title fade-in-up">Metódy získavania esenciálnych olejov</h2>
                        <p className="description fade-in-up delay-1s">
                            Účinné látky môžeme získať z rastlín rôznymi spôsobmi/metódami. Každému jednozložkovému oleju vyhovuje iný spôsob spracovania, aby výsledok vo forme esenciálneho oleja mal čo najvyššiu kvalitu.
                        </p>

                        <div className="list">
                            <div className="item fade-in-up">
                                <ion-icon name="water" style={{ backgroundColor: "rgb(43, 126, 161)" }}></ion-icon>
                                <div className="heading">Destilácia vodnou parou</div>
                                <div className="text">Byliny, stromy</div>
                            </div>

                            <div className="item fade-in-up">
                                <ion-icon name="thermometer" style={{ backgroundColor: "#678fcf" }}></ion-icon>
                                <div className="heading">Lisovanie za studena</div>
                                <div className="text">Citrusy</div>
                            </div>

                            <div className="item fade-in-up">
                                <ion-icon name="flower" style={{ backgroundColor: "#da77e0" }}></ion-icon>
                                <div className="heading">Enfleurage</div>
                                <div className="text">Jemné kvety</div>
                            </div>
                        </div>
                    </div>

                    <div className="section-6">
                        <h2 className="title fade-in-up">Ako používať esenciálne oleje</h2>
                        <p className="description fade-in-up delay-1s">
                            Poznáme 3 spôsoby použitia esenciálnych olejov. Vhodný spôsob použitia volíme podľa želaného efektu a telového systému, ktorý chceme podporiť. Efektívne použitie konkrétnych esenciálnych olejov odporúčame pri každom produkte v e-shope.
                        </p>

                        <div className="list">
                            <div className="item fade-in-up">
                                <img className="image" src={require("../assets/icon-blue.png")} />
                                <div className="title">Aromaticky</div>
                            </div>

                            <div className="item fade-in-up">
                                <img className="image" src={require("../assets/icon-red.png")} />
                                <div className="title">Masážne</div>
                            </div>

                            <div className="item fade-in-up">
                                <img className="image" src={require("../assets/icon-purple.png")} />
                                <div className="title">Vnútorne</div>
                            </div>
                        </div>
                    </div>

                    <div className="section-7" id="aromatherapy-section-7">
                        <h2 className="title fade-in-up">Zásady bezpečného používania</h2>

                        <div className="list">
                            <span className="bullet fade-in-up"></span>
                            <div className="item fade-in-up">Nekvapkáme priamo do očí, uší, nosa</div>
                            <span className="bullet fade-in-up"></span>
                            <div className="item fade-in-up">Vnútorne užívame v kapsuliach, okrem citrusových olejov</div>
                            <span className="bullet fade-in-up"></span>
                            <div className="item fade-in-up">Pri aplikácií na citlivú pokožku riedime podkladovým olejom</div>
                            <span className="bullet fade-in-up"></span>
                            <div className="item fade-in-up">Oregáno, Tymián, Škorica, Kassia, Klinček, Zázvor, Saturejka (pri deťoch do 6 rokov aj Mäta) vždy riedime v pomere minimálne 10 kvapiek podkladového oleja a 1 kvapku esenciálneho oleja</div>
                        </div>

                        <div className="motto fade-in-up">
                            <b>Menej je vždy viac</b> - účinok zosilňujeme vodou a zoslabujeme podkladovým olejom
                        </div>
                    </div>

                    <Link className="button-filled" to="/blog" style={{ alignSelf: "center", marginTop: 30 }}>Čítaj viac</Link>
                </div>
            </div>
        )
    }
}

export default withRouter(Aromatherapy);