import React from 'react';

import { shop } from "../config/config";

import "../styles/shop.css";

export default class Categories extends React.Component {
    
    state = {
        opened: [],
        price: 0,
        problem: 0
    }

    constructor() {
        super();

        this.animateTypes = this.animateTypes.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.changeProblem = this.changeProblem.bind(this);
        this.loadHeights = this.loadHeights.bind(this);
    }

    changePrice(price) {
        this.setState({ price: price })
        this.props.changeFilters(price, this.state.problem)
    }

    changeProblem(problem) {
        this.setState({ problem: problem })
        this.props.changeFilters(this.state.price, problem)
    }

    animateTypes(type) {
        const dropdown =  document.getElementById("shop-dropdown-" + type);

        var opened = this.state.opened

        if (opened[type - 1].opened) {
            dropdown.style.height = "0px";
            opened[type - 1]["opened"] = false;
        } else {
            dropdown.style.height = opened[type - 1].height + "px";
            opened[type - 1]["opened"] = true;
        }

        this.setState({ opened: opened })
    }

    componentDidMount() {
        this.loadHeights();
    }

    loadHeights() {
        var opened = []

        for (let i = 0; i < 10; i++) {
            const dropdown =  document.getElementById("shop-dropdown-" + (i + 1));

            opened.push({
                opened: false,
                height: dropdown.offsetHeight
            })

            dropdown.style.height = "0px";
        }

        if (window.innerWidth < 800) {
            document.getElementById("category-panel").style.display = "none";
        }

        this.setState({ opened: opened })
    }

    render() { 
        return(
            <div id="categories">
                <div className="title">Kategórie<ion-icon name="close-outline" onClick={() => this.props.hideCategories()}></ion-icon></div>

                <div className="list">
                    <div className="item" onClick={() => this.props.openPopular()}>Najpredávanejšie</div>
                    <div className="item" onClick={() => this.props.openTop12()}>Top 12 esenciálnych olejov</div>

                    <div className="item" onClick={() => this.animateTypes(1)}>{shop[0].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-1">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(1, 1)}>{shop[0].categories[0]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(1, 2)}>{shop[0].categories[1]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(1, 3)}>{shop[0].categories[2]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(2)}>{shop[1].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-2">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(2, 1)}>{shop[1].categories[0]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(2, 2)}>{shop[1].categories[1]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(2, 3)}>{shop[1].categories[2]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(2, 4)}>{shop[1].categories[3]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(2, 5)}>{shop[1].categories[4]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(2, 6)}>{shop[1].categories[5]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(3)}>{shop[2].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-3">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(3, 1)}>{shop[2].categories[0]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(3, 2)}>{shop[2].categories[1]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(3, 3)}>{shop[2].categories[2]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(4)}>{shop[3].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-4">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(4, 1)}>{shop[3].categories[0]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(5)}>{shop[4].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-5">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(5, 1)}>{shop[4].categories[0]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(6)}>{shop[5].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-6">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(6, 1)}>{shop[5].categories[0]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(6, 2)}>{shop[5].categories[1]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(7)}>{shop[6].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-7">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(7, 1)}>{shop[6].categories[0]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(7, 2)}>{shop[6].categories[1]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(7, 3)}>{shop[6].categories[2]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(7, 4)}>{shop[6].categories[3]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(7, 5)}>{shop[6].categories[4]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(8)}>{shop[7].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-8">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(8, 1)}>{shop[7].categories[0]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(9)}>{shop[8].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-9">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 1)}>{shop[8].categories[0]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 2)}>{shop[8].categories[1]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 3)}>{shop[8].categories[2]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 4)}>{shop[8].categories[3]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 5)}>{shop[8].categories[4]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 6)}>{shop[8].categories[5]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 7)}>{shop[8].categories[6]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 8)}>{shop[8].categories[7]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 9)}>{shop[8].categories[8]}</div>
                        <div className="item" onClick={() => this.props.openTypeAndCategory(9, 10)}>{shop[8].categories[9]}</div>
                    </div>

                    <div className="item" onClick={() => this.animateTypes(10)}>{shop[9].type}<ion-icon name="add-outline"></ion-icon></div>
                    <div className="dropdown" id="shop-dropdown-10">
                        <div className="item" onClick={() => this.props.openTypeAndCategory(10, 1)}>{shop[9].categories[0]}</div>
                    </div>
                </div>

                <div className="title">Zoradiť podľa</div>

                <div className="list">
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changePrice(0)}><div className="checkbox" style={this.state.price === 0 ? { backgroundColor: "#A161B3" } : null}></div>Všetko</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changePrice(1)}><div className="checkbox" style={this.state.price === 1 ? { backgroundColor: "#A161B3" } : null}></div>Od najlacnejšieho</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changePrice(-1)}><div className="checkbox" style={this.state.price === -1 ? { backgroundColor: "#A161B3" } : null}></div>Od najdrahšieho</div>
                </div>

                <div className="title">Zoradiť podľa problémov</div>

                <div className="list">
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(0)}><div className="checkbox" style={this.state.problem === 0 ? { backgroundColor: "#A161B3" } : null}></div>Všetko</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(1)}><div className="checkbox" style={this.state.problem === 1 ? { backgroundColor: "#A161B3" } : null}></div>Tráviaci systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(2)}><div className="checkbox" style={this.state.problem === 2 ? { backgroundColor: "#A161B3" } : null}></div>Dýchací systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(3)}><div className="checkbox" style={this.state.problem === 3 ? { backgroundColor: "#A161B3" } : null}></div>Pohybový systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(4)}><div className="checkbox" style={this.state.problem === 4 ? { backgroundColor: "#A161B3" } : null}></div>Srdcovo cievny systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(5)}><div className="checkbox" style={this.state.problem === 5 ? { backgroundColor: "#A161B3" } : null}></div>Vylučovací systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(6)}><div className="checkbox" style={this.state.problem === 6 ? { backgroundColor: "#A161B3" } : null}></div>Nervový systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(7)}><div className="checkbox" style={this.state.problem === 7 ? { backgroundColor: "#A161B3" } : null}></div>Lymfatický systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(8)}><div className="checkbox" style={this.state.problem === 8 ? { backgroundColor: "#A161B3" } : null}></div>Imunitný systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(9)}><div className="checkbox" style={this.state.problem === 9 ? { backgroundColor: "#A161B3" } : null}></div>Hormonálny systém</div>
                    <div className="item" style={{ justifyContent: "flex-start" }} onClick={() => this.changeProblem(10)}><div className="checkbox" style={this.state.problem === 10 ? { backgroundColor: "#A161B3" } : null}></div>Pokožka</div>
                </div>
            </div>
        )
    }
}