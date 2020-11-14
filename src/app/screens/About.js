import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/about.css";

export default class About extends React.Component {

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
            <div className="screen" id="about">
                <Header />

                <div className="title-panel" style={{ paddingTop: this.state.offset + offset }}>
                    <div className="title">O nás</div>
                </div>

                <div className="content">
                    <p className="text">
                        Sme pár, ktorý sa spoznal pri spoločnej práci pred mnohými rokmi. Obaja sme vyštudovali ekonómiu a máme za sebou kariéry v oblasti bankovníctva, kde sme riadili veľké tímy zamestnancov.
                    </p>

                    <p className="text">
                        Práca v korporácii znamenala obetovanie voľného času a firma si za vytvorenie kvalitných pracovných podmienok v prostredí nabitom stresom, vzala naspäť veľa z našej slobody.
                    </p>

                    <p className="text">
                        Stále viac a viac sme boli konfrontovaní s faktom, že netrávime čas ako chceme, netrávime ho s tými, s ktorými chceme, naša zdravotná situácia kvôli stresu a nedostatku pohybu sa nevyvíja tak ako chceme a ani nezarábame toľko, aby sme mali životný štandard po akom túžime.
                    </p>

                    <img className="image" src={require("../assets/about-1.png")} />

                    <p className="text">
                        Rozhodli sme sa preto pre komplexnú zmenu, nielen výmenu zlatej klietky. Verili sme vo svoje schopnosti a túžili sme stáť na vlastných nohách, podnikať a vytvárať pracovné príležitosti pre ostatných.
                    </p>

                    <p className="text">
                        Miška spoznala silu aromaterapie už dávno, pred 16-timi rokmi. No až po „objavení“ doTERRA v roku 2014 pochopila svoje životné poslanie. Vlastné skúsenosti s používaním a  samovzdelávanie jej umožnili pochopiť úžasnú silu esenciálnych olejov najvyššej testovanej triedy. Zmyslom jej života je odvtedy zdieľanie skúseností s esenciálnymi olejmi doTERRA a začala to robiť s vášňou a nadšením, ktoré sú pre ňu príznačné.
                    </p>

                    <img className="image" src={require("../assets/about-2.png")} />

                    <p className="text">
                        Až neskôr sa Miška začala zaujímať o formu podnikania doTERRA, ktorou je MLM a uvedomila si jeho výhody. Jej energia, schopnosti a skúsenosti umožnili využiť podnikateľskú príležitosť veľmi efektívne, najmä po tom, čo sa k podnikaniu pridal jej manžel Roman. Synergia páru umožnila dynamický rast vetvy TerraMia, ktorá sa stala jednou z najväčších a najúspešnejších nielen v kontexte Slovenska, ale celej Európy. TerraMia, organizácia manželov Začkovcov je pevným prístavom pre tých, ktorí podnikanie v tom, čo ich baví robia vážne a s nasadením, ale aj pre tých, ktorí nič iné ako užívanie produktov nehľadajú.
                    </p>

                    <p className="text">
                        Pre Začkovcov je spokojnosť členov TerraMia všetkým.
                    </p>

                    <img className="image" src={require("../assets/about-3.png")} />
                </div>

                <Footer />
            </div>
        )
    }
}