import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/business.css";

export default class Business extends React.Component {

    state = {
        offset: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        const width = window.innerWidth;
        const offset = (width > 1100 ? 75 : 50);

        return(
            <div className="screen" id="business">
                <Header />

                <div className="title-panel" style={{ paddingTop: this.state.offset + offset }}>
                    <div className="title">Podnikajte s TerraMia</div>
                </div>

                <div className="content">
                    <h2 className="heading">
                        Podnikajte s TerraMia
                    </h2>

                    <p className="text">
                        Viete si predstaviť robiť celý deň čo Vás baví, stretávať sa s priateľmi, zarábať a zároveň sa starať o zdravie svojej rodiny?
                    </p>

                    <p className="text">
                        Odpoveďou je spolupráca s TerraMia.
                    </p>

                    <img className="image" src={require("../assets/business-1.png")} />

                    <p className="text">
                        Určite už máte po krk ponúk nepopulárnych prác z domu, ktoré sľubujú rýchly zárobok. Na druhej strane tu máme podnikanie, ktorého súčasťou sú roky odriekania a driny s neistým. My v TerraMia taký nie sme.
                    </p>

                    <p className="text">
                        My v TerraMia veríme, že každý človek si zaslúži slušne zarábať a byť slobodný.
                    </p>

                    <p className="text">
                        Sloboda je totiž najvyššou úrovňou kvality života.
                    </p>

                    <p className="text">
                        Dá sa sloboda dosiahnuť? Dá sa to, lebo <b>SLOBODA je vecou voľby</b>. Nedosiahneme ju však ako zamestnanci.
                    </p>

                    <p className="text">
                        Nikdy.
                    </p>

                    <p className="text">
                        Šancu máme len, keď budeme úspešní v podnikaní. Z neho má však väčšina ľudí obavy. 
                    </p>

                    <p className="text">
                        Majú strach, či ich schopnosti sú dostatočné pre úspech, či si vybrali „vhodnú“ oblasť, či sú pripravení investovať čas a peniaze, či sa im nezníži životná úroveň, než podnikanie začne zarábať a mnoho ďaľších “či”.
                    </p>

                    <p className="text">
                        Ten, kto neprekoná svoje strachy, prežije svoj život pod svoje možnosti. Voľbu má totiž každý a aj podnikať sa dá naučiť.
                    </p>

                    <h2 className="heading">
                        Prečo podnikať s doTERRA?
                    </h2>

                    <p className="text">
                        doTERRA nie je založená na predaji, preto úspešní konzultanti sa nesprávajú ako predajcovia. Je založená na zdieľaní vzdelania so zameraním sa na potrebu konkrétneho človeka a informácie pre neho zaujímavé – <b>bezpečnosť, účinnosť, cenová dostupnosť, kvalita a 100% prírodná podstata esenciálnych olejov.</b>
                    </p>

                    <p className="text">
                        Perspektíva spoločnosti a prístup k zdrojom, či vzdelávacím nástrojom je v doTERRA výnimočný. Kto podniká s doTERRA, vo vetve <b>TerraMia</b> nie je nikdy sám. Skúsení konzultanti a lídri silných tímov sú pripravení venovať novým konzultantom čas k rozvoju potrebných zručností a pochopiť systém podnikania v sieťovom marketingu.
                    </p>

                    <img className="image" src={require("../assets/business-2.png")} />

                    <h2 className="heading">
                        Čaro sieťového marketingu
                    </h2>

                    <p className="text">
                        Jeden z najbohatších ľudí na svete, Bill Gates sa vyjadril, že ak by dnes opäť začínal s podnikaním, rozhodne by to bolo formou MLM. Nehovoril to náhodou.
                    </p>

                    <p className="text">
                        MLM umožňuje všetky výhody podnikania bez zbytočného finančného rizika. Nízke štartovacie náklady, testované produkty (bez investícií do vývoja, balenia, či doručovania), žiadny vlastný zákaznícky servis, žiadne náklady na budovy (prenájom/ osvetlenie/voda), či zamestnancov, naopak ponúka možnosť pasívneho príjmu a časovú slobodu. Základom úspechu v MLM je rozhodnúť sa podnikať v správnej spoločnosti. V takej, kde je možné sa spoľahnúť, že sľuby platia, kvalita je garantovaná na najvyššej možnej úrovni a energia, ktorú človek do podnikania vloží, sa nestratí.
                    </p>

                    <p className="text">
                        My v doTERRA budujeme už niekoľko rokov svoju vetvu <b>TerraMia</b> na pevných podnikateľských princípoch.
                    </p>

                    <p className="text">
                        Až 85% jej členov sú užívatelia, ktorí nadšenie používajú produkty, kvôli ich kvalite a účinnosti. Títo členovia získavajú produkty doTERRA s 25% zľavou z maloobchodnej ceny. V TerraMia majú možnosť systematického vzdelávania i priamej starostlivosti skúsených konzultantov, takže nikto nezostane sám so svojimi otázkami.
                    </p>

                    <p className="text">
                        Avšak 15% členov TerraMia vníma aj podnikateľskú príležitosť, ktorá je v doTERRA veľmi široká.
                    </p>

                    <p className="text">
                        Ak sa vidíte v pozícii šíriteľa posolstva zdravotných účinkov olejov doTERRA s príjmom bez stropu, neváhajte a pridajte sa! - tu bude link na registráciu
                    </p>

                    <div className="contact-panel">
                        <div className="item">
                            <img className="photo" src={require("../assets/michaela-zackova.png")} />
                            <div className="name">Michaela Začková</div>
                            <div className="phone">0903 225 337</div>
                        </div>

                        <div className="item">
                            <img className="photo" src={require("../assets/roman-zacka.png")} />
                            <div className="name">Roman Začka</div>
                            <div className="phone">0903 789 837</div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }
}