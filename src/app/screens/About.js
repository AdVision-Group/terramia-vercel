import React from "react";
import { Helmet } from "react-helmet";

import Title from "../components/Title";
import ReactPlayer from "react-player";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/about.css";

export default class About extends React.Component {

    state = {
        width: 700,
        height: 400
    }

    constructor() {
        super();

        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        showTransition();

        this.handleResize();
        window.addEventListener("resize", this.handleResize);

        hideTransition();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize() {
        const width = window.innerWidth;

        if (width < 800) {
            this.setState({ width: width - 40, height: 300 });
        } else {
            this.setState({ width: 700, height: 400 });
        }
    }

    render() {
        return(
            <div className="screen" id="about">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>O nás | Príbeh Miška a Roman Začka | TerraMia</title>
                    <meta name="description" content="Sme Miška a Roman Začka a radi Vám povieme náš príbeh s cestou ku slobode, ktorý žijeme vďaka doTERRA. Ukážeme Vám, že podnikať s doTERRA sa dá aj na Slovensku."></meta>
                    <meta name="keywords" content="roman zacka, miska zackova, zackovci, doterra, podnikanie doterra, skusenosti doterra, doterra recenzie"></meta>
                </Helmet>

                <Title title="O nás" image="title-background-12.jpg" />

                <div className="content">
                    <p className="text">
                        Sme Miška a Roman - pár, ktorý sa spoznal pri spoločnej práci pred 20 rokmi. Obaja sme vyštudovali ekonómiu a máme za sebou kariéry v oblasti bankovníctva, kde sme riadili veľké tímy zamestnancov. Manažérska práca v korporácii znamenala obetovanie voľného času a banka si za vytvorenie kvalitných pracovných podmienok v stresujúcom prostredí, vzala naspäť veľa z našej slobody.
                    </p>

                    <p className="text">
                        Stále viac sme boli konfrontovaní s faktom, že netrávime čas ako chceme, netrávime ho s tými, s ktorými chceme, naša zdravotná situácia kvôli stresu a nedostatku pohybu sa nevyvíja tak ako chceme a ani nezarábame toľko, aby sme mali životný štandard po akom túžime. Rozhodli sme sa preto pre komplexnú zmenu, nielen výmenu „zlatej klietky“. Verili sme vo svoje schopnosti a túžili sme stáť na vlastných nohách, podnikať a vytvárať pracovné príležitosti pre ostatných.
                    </p>

                    <ReactPlayer url="https://www.youtube.com/watch?v=XFYvp9_TAU0" width={this.state.width} height={this.state.height} style={{ margin: "50px 0px 75px 0px" }} />

                    <p className="text">
                        Miška spoznala silu aromaterapie už dávno, pred 16-timi rokmi. No až po „objavení“ doTERRA v roku 2014 v nej našla svoje životné poslanie. Vlastné skúsenosti s používaním produktov doTERRA a neustále vzdelávanie v tom ako je možné ovplyvniť kvalitu života jej umožnili pochopiť úžasnú silu esenciálnych olejov najvyššej testovanej triedy. Zmyslom jej života je odvtedy zdieľanie skúseností s esenciálnymi olejmi doTERRA s vášňou a nadšením, ktoré sú pre ňu príznačné.
                    </p>

                    <p className="text">
                        Až neskôr sa Miška začala zaujímať o formu podnikania doTERRA, ktorou je sieťový marketing a uvedomila si jeho mnohé výhody. Jej energia, schopnosti a skúsenosti umožnili využiť podnikateľskú príležitosť veľmi efektívne, najmä po tom, čo sa k jej podnikaniu pridal manžel Roman. Synergia páru umožnila dynamický rast vetvy TerraMia, ktorá sa stala jednou z najväčších a najúspešnejších nielen v kontexte Slovenska, ale celej Európy. <b>TerraMia vedená Miškou a Romanom Začka je pevným prístavom pre tých, ktorí podnikanie myslia vážne a s nasadením, ale aj pre tých, ktorí nič iné ako používanie produktov doTERRA nehľadajú. <a style={{ textDecoration: "none", color: "#A161B3" }} href="https://www.mydoterra.com/Application/index.cfm?EnrollerID=756332">Ak chcete patriť do TerraMia, otvorte si vlastný účet v doTERRA tu.</a></b>
                    </p>

                    <img className="image" src={require("../assets/about-1.png")} loading="lazy" alt="about" />
                </div>
            </div>
        )
    }
}