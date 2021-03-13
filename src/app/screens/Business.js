import React from "react";
import { Link, withRouter } from "react-router-dom";

import { animate } from "../config/Animation";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";
import Banner from "../components/Banner";

import "../styles/business.css";
import { getStorageItem } from "../config/config";

class Business extends React.Component {

    state = {
        offset: 0,

        banner: false
    }

    constructor() {
        super();

        this.closeBanner = this.closeBanner.bind(this);
    }

    closeBanner() {
        this.setState({ banner: false })
    }

    componentDidMount() {
        animate();
    }

    render() {
        const width = window.innerWidth;
        const offset = (width > 1100 ? 75 : 50);

        return(
            <div className="screen" id="business">
                <Title title="Podnikajte s TerraMia" image="title-background-3.jpg" />

                <div className="content">
                    <div className="section">
                        <div className="image-panel fade-in">
                            <img className="image" src={require("../assets/family-business-1.png")} />
                        </div>

                        <div className="divider"></div>

                        <div className="text-panel fade-in-right">
                            <div className="bubble">
                                <div className="number">1</div>
                                <h3 className="title">Prečo podnikať s doTERRA?</h3>
                                <p className="text">
                                    doTERRA je americká spoločnosť s 12-ročnou históriou s takmer 10 miliónmi zákazníkov v 100 krajinách sveta. Okrem špičkových produktov – esenciálnych olejov a prírodných riešení umožňuje svojim členom aj možnosť zarobiť si púhym zdieľaním skúseností. Nezameriava sa predaj, ale na vzdelávanie a zdieľanie informácií o účinkoch produktov. Zákazníkom tejto mimoriadne úspešnej spoločnosti podnikajúcej formou sieťového marketingu, sú produkty distribuované sieťou nezávislých konzultantov. Konzultantom sa môže stať každý zákazník doTERRA, ktorý okrem najvýhodnejšieho nakupovania produktov chce získať aj finančné bonusy.
                                </p>
                                <div className="button-filled" onClick={() => getStorageItem("token") ? this.props.history.push("/blog/podnikanie") : this.setState({ banner: true })}>Zisti viac</div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="text-panel fade-in-left">
                            <div className="bubble">
                                <div className="number">2</div>
                                <h3 className="title">Prečo patriť do vetvy TerraMia?</h3>
                                <p className="text">
                                    Skúsení konzultanti vytvárajú silné tímy pripravené vzdelávať zákazníkov a venovať novým konzultantom čas k rozvoju potrebných zručností. Pomáhajú im pochopiť systém podnikania v sieťovom marketingu tak, aby bol príjemný a vzrušujúci. Jedným z najsilnejších a najúspešnejších tímov v Európe je TerraMia. Ako je to na Slovensku možné?
                                </p>
                                <div className="button-filled" onClick={() => getStorageItem("token") ? this.props.history.push("/blog/pochopenie-systemu-prace") : this.setState({ banner: true })}>Zisti viac</div>
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="image-panel fade-in">
                            <img className="image" src={require("../assets/family-business-2.png")} />
                        </div>
                    </div>

                    <div className="section">
                        <div className="image-panel fade-in">
                            <img className="image" src={require("../assets/family-business-3.png")} />
                        </div>

                        <div className="divider"></div>

                        <div className="text-panel fade-in-right">
                            <div className="bubble">
                                <div className="number">3</div>
                                <h3 className="title">Skutočnú slobodu nedosiahnete ako zamestnanec</h3>
                                <p className="text">
                                    Viete si predstaviť robiť celý deň čo Vás baví, stretávať sa s priateľmi, zarábať a zároveň sa starať o zdravie svojej rodiny? My v TerraMia veríme, že každý človek si zaslúži slušne zarábať a pritom byť časovo i vzťahovo slobodný. Dá sa to, lebo SLOBODA je vecou voľby. Nedosiahneme ju však ako zamestnanci. Nikdy. Šancu máme len, keď budeme úspešní v podnikaní. Z neho má však väčšina ľudí obavy. Majú strach, či ich schopnosti sú dostatočné pre úspech, či si vybrali „vhodnú“ oblasť, či sú pripravení investovať čas a peniaze, či sa im nezníži životná úroveň, než podnikanie začne zarábať a mnoho ďalších “či”. Ten, kto neprekoná svoje strachy, prežije svoj život pod svoje možnosti. Voľbu má totiž každý a aj úspešne podnikať sa dá naučiť.
                                </p>
                                <div className="button-filled" onClick={() => getStorageItem("token") ? this.props.history.push("/blog/ako-ziskat-maximalny-prijem") : this.setState({ banner: true })}>Zisti viac</div>
                            </div>
                        </div>
                    </div>

                    <p className="motto-text">
                    Ak sa vidíte v pozícii šíriteľa posolstva sily esenciálnych olejov doTERRA so záujmom eticky podnikať a zarábať, neváhajte a pridajte sa do vetvy TerraMia - <a className="link" href="https://www.mydoterra.com/Application/index.cfm?EnrollerID=756332">staň sa členom doTERRA</a>
                    </p>

                    <div className="contact-panel">
                        <div className="links">
                            <div className="link">
                                <div className="name">Roman Začka</div>
                                <a className="phone" href="tel: +421-903-789-837">0903 789 837</a>
                            </div>
                            <div className="link">
                                <div className="name">Michaela Začková</div>
                                <a className="phone" href="tel: +421-903-225-337">0903 225 337</a>
                            </div>
                        </div>

                        <img className="photo" src={require("../assets/zackovci.jpg")} />
                    </div>
                </div>

                {this.state.banner && !getStorageItem("token") ? (
                    <Banner
                        title="Chcete sa dozvedieť viac o podnikaní?"
                        text="Staňte sa členom klubu TerraMia a získajte prístup ku všetkým materiálom o podnikaní, blogom a novinkám"
                        button="Staň sa členom klubu"
                        business={true}
                        closeBanner={this.closeBanner}
                    />
                ) : null}
            </div>
        )
    }
}

export default withRouter(Business);