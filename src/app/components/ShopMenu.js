import React from "react";

import { shop } from "../config/config";

import "../styles/shopmenu.css";

export default class ShopMenu extends React.Component {

    constructor() {
        super();

        this.setType = this.setType.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.hideFilters = this.hideFilters.bind(this);
    }

    setType(type) {
        this.props.setType(type);
    }

    setCategory(category) {
        this.props.setCategory(category);
    }

    hideFilters() {
        document.getElementById("shop-menu").style.left = "100vw";
    }

    render() {
        return(
            <div id="shop-menu">
                <div className="content">
                    <div className="heading">Kategórie</div>

                    <Item title="Najpredávanejšie" selected={this.props.type === -1} onClick={() => this.props.setType(-1)} icon={false} />

                    <Item title="Top 12 esenciálnych olejov" selected={this.props.type === -2} onClick={() => this.props.setType(-2)} icon={false} />

                    {shop.map((item, index) => {
                        return <MenuItem
                                    item={item}
                                    typeIndex={index}
                                    typeOpened={index === this.props.type}
                                    setType={this.setType}
                                    categoryOpened={this.props.category}
                                    setCategory={this.setCategory}
                                />
                    })}

                    <div className="heading">Zoradiť podľa</div>
                    {/*<Item title="Všetko" selected={this.props.price === 0 && this.props.abc === 0} onClick={() => {
                        this.props.setPrice(0);
                        this.props.setAbc(0);
                    }} icon={false} />*/}
                    <Item title="Od A po Z" selected={this.props.abc === 1} onClick={() => this.props.setAbc(1)} icon={false} />
                    <Item title="Od Z po A" selected={this.props.abc === -1} onClick={() => this.props.setAbc(-1)} icon={false} />
                    <Item title="Od najlacnejšieho" selected={this.props.price === 1} onClick={() => this.props.setPrice(1)} icon={false} />
                    <Item title="Od najdrahšieho" selected={this.props.price === -1} onClick={() => this.props.setPrice(-1)} icon={false} />

                    <div className="heading">Filtrovať podľa problému</div>
                    <Item title="Všetko" selected={this.props.problem === 0} onClick={() => this.props.setProblem(0)} icon={false} />
                    <Item title="Tráviaci systém" selected={this.props.problem === 1} onClick={() => this.props.setProblem(1)} icon={false} />
                    <Item title="Dýchací systém" selected={this.props.problem === 2} onClick={() => this.props.setProblem(2)} icon={false} />
                    <Item title="Pohybový systém" selected={this.props.problem === 3} onClick={() => this.props.setProblem(3)} icon={false} />
                    <Item title="Srdcovo cievny systém" selected={this.props.problem === 4} onClick={() => this.props.setProblem(4)} icon={false} />
                    <Item title="Vylučovací systém" selected={this.props.problem === 5} onClick={() => this.props.setProblem(5)} icon={false} />
                    <Item title="Nervový systém" selected={this.props.problem === 6} onClick={() => this.props.setProblem(6)} icon={false} />
                    <Item title="Lymfatický systém" selected={this.props.problem === 7} onClick={() => this.props.setProblem(7)} icon={false} />
                    <Item title="Imunitný systém" selected={this.props.problem === 8} onClick={() => this.props.setProblem(8)} icon={false} />
                    <Item title="Hormonálny systém" selected={this.props.problem === 9} onClick={() => this.props.setProblem(9)} icon={false} />
                    <Item title="Pokožka" selected={this.props.problem === 10} onClick={() => this.props.setProblem(10)} icon={false} />

                    {window.innerWidth < 1100 ? <div className="button-filled" onClick={() => this.hideFilters()}>Hľadať</div> : null}
                </div>
            </div>
        )
    }
}

function MenuItem(props) {
    const item = props.item;

    const typeIndex = props.typeIndex;
    const typeOpened = props.typeOpened;
    const setType = props.setType;

    const category = props.categoryOpened;
    const setCategory = props.setCategory;

    return(
        <div className="menu-item" style={typeOpened ? { height: (42 * item.categories.length) + 42 } : { height: 42 }}>
            <Item
                title={item.type}
                selected={typeOpened}
                onClick={() => setType(typeIndex)}
                icon={true}
            />

            {item.categories.map((data, index) => {
                return <Item
                        title={data}
                        selected={index === category}
                        onClick={() => setCategory(index)}
                        icon={false}

                        style={{ paddingLeft: 50 }}
                    />
            })}
        </div>
    )
}

function Item(props) {
    const onClick = props.onClick;
    const selected = props.selected;
    const title = props.title;
    const icon = props.icon;

    const style = props.style;

    return(
        <div className="item" onClick={onClick} style={style}>
            <div className="selected" style={selected ? { opacity: 1 } : { opacity: 0 }} />
            <div className="title">{title}</div>
            <div style={{ flex: 1 }} />
            {icon ? <ion-icon name="chevron-forward" style={selected ? { transform: "rotate(90deg)" } : { transform: "rotate(0deg)" }}></ion-icon> : null}
        </div>
    )
}