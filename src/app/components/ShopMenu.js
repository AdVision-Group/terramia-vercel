import React from "react";
import { withRouter } from "react-router-dom";

import { shop } from "../config/config";

import "../styles/shopmenu.css";

class ShopMenu extends React.Component {

    constructor() {
        super();

        this.setType = this.setType.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.hideFilters = this.hideFilters.bind(this);

        this.setQuery = this.setQuery.bind(this);
        this.getQuery = this.getQuery.bind(this);
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

    componentDidMount() {
        // init default category on eshop redirect
        var query = new URLSearchParams(this.props.location.search);

        var params = "";

        if (!query.get("typ")) query.append("typ", -1);
        if (!query.get("zoradenie")) query.append("zoradenie", "az");

        this.props.history.replace("/e-shop?" + query.toString());
    }

    setQuery(queries) {
        var query = new URLSearchParams(this.props.location.search);

        for (let i = 0; i < queries.length; i++) {
            var element = queries[i];

            if (query.get(element[0])) {
                query.set(element[0], element[1]);
            } else {
                query.append(element[0], element[1]);
            }

            if (element[0] === "problem" && parseInt(element[1]) === 0) {
                query.delete(element[0]);
                //query.set("typ", 0);
                //query.set("kategoria", 0);
            } /*else if (element[0] === "problem" && parseInt(element[1]) !== 0) {
                query.delete("typ");
                query.delete("kategoria");
            }*/ else if (element[0] === "typ" && parseInt(element[1]) === -1) {
                query.delete("kategoria");
            } else if (element[0] === "typ" && parseInt(element[1]) === -2) {
                query.delete("kategoria");
            }
        }

        this.props.history.replace("/e-shop?" + query.toString());
    }

    getQuery(name) {
        var query = new URLSearchParams(this.props.location.search);
        return query.get(name);
    }

    render() {
        var query = new URLSearchParams(this.props.location.search);

        return(
            <div id="shop-menu">
                <div className="shop-menu-content">
                    <div className="heading">Kateg??rie</div>

                    <Item title="Najpred??vanej??ie" selected={parseInt(this.getQuery("typ")) === -1} onClick={() => this.setQuery([[ "typ", -1 ]])} icon={false} />

                    <Item title="Top 12 esenci??lnych olejov" selected={parseInt(this.getQuery("typ")) === -2} onClick={() => this.setQuery([[ "typ", -2 ]])} icon={false} />

                    {shop.map((item, index) => {
                        return <MenuItem
                                    item={item}
                                    setQuery={this.setQuery}
                                    getQuery={this.getQuery}
                                    typeIndex={index}
                                    typeOpened={index === parseInt(this.getQuery("typ"))}
                                    setType={this.setType}
                                    categoryOpened={this.props.category}
                                    setCategory={this.setCategory}
                                    history={this.props.history}
                                    key={index}
                                />
                    })}

                    <div className="heading">Zoradi?? pod??a</div>
                    {/*<Item title="V??etko" selected={this.props.price === 0 && this.props.abc === 0} onClick={() => {
                        this.props.setPrice(0);
                        this.props.setAbc(0);
                    }} icon={false} />*/}
                    <Item title="Od A po Z" selected={this.getQuery("zoradenie") === "az"} onClick={() => this.setQuery([[ "zoradenie", "az" ]])} icon={false} />
                    <Item title="Od Z po A" selected={this.getQuery("zoradenie") === "za"} onClick={() => this.setQuery([[ "zoradenie", "za" ]])} icon={false} />
                    <Item title="Od najlacnej??ieho" selected={this.getQuery("zoradenie") === "najlacnejsie"} onClick={() => this.setQuery([[ "zoradenie", "najlacnejsie" ]])} icon={false} />
                    <Item title="Od najdrah??ieho" selected={this.getQuery("zoradenie") === "najdrahsie"} onClick={() => this.setQuery([[ "zoradenie", "najdrahsie" ]])} icon={false} />

                    <div className="heading">Filtrova?? pod??a probl??mu</div>
                    <Item title="V??etko" selected={!this.getQuery("problem")} onClick={() => this.setQuery([[ "problem", 0 ]])} icon={false} />
                    <Item title="Tr??viaci syst??m" selected={parseInt(this.getQuery("problem")) === 1} onClick={() => this.setQuery([[ "problem", 1 ]])} icon={false} />
                    <Item title="D??chac?? syst??m" selected={parseInt(this.getQuery("problem")) === 2} onClick={() => this.setQuery([[ "problem", 2 ]])} icon={false} />
                    <Item title="Pohybov?? syst??m" selected={parseInt(this.getQuery("problem")) === 3} onClick={() => this.setQuery([[ "problem", 3 ]])} icon={false} />
                    <Item title="Srdcovo cievny syst??m" selected={parseInt(this.getQuery("problem")) === 4} onClick={() => this.setQuery([[ "problem", 4 ]])} icon={false} />
                    <Item title="Vylu??ovac?? syst??m" selected={parseInt(this.getQuery("problem")) === 5} onClick={() => this.setQuery([[ "problem", 5 ]])} icon={false} />
                    <Item title="Nervov?? syst??m" selected={parseInt(this.getQuery("problem")) === 6} onClick={() => this.setQuery([[ "problem", 6 ]])} icon={false} />
                    <Item title="Lymfatick?? syst??m" selected={parseInt(this.getQuery("problem")) === 7} onClick={() => this.setQuery([[ "problem", 7 ]])} icon={false} />
                    <Item title="Imunitn?? syst??m" selected={parseInt(this.getQuery("problem")) === 8} onClick={() => this.setQuery([[ "problem", 8 ]])} icon={false} />
                    <Item title="Hormon??lny syst??m" selected={parseInt(this.getQuery("problem")) === 9} onClick={() => this.setQuery([[ "problem", 9 ]])} icon={false} />
                    <Item title="Poko??ka" selected={parseInt(this.getQuery("problem")) === 10} onClick={() => this.setQuery([[ "problem", 10 ]])} icon={false} />

                    {window.innerWidth < 1100 ? <div className="button-filled" onClick={() => this.hideFilters()}>H??ada??</div> : null}
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
                selected={typeIndex === parseInt(props.getQuery("typ"))}
                onClick={() => props.setQuery([[ "typ", typeIndex ], [ "kategoria", 0 ]])}
                icon={true}
            />

            {item.categories.map((data, index) => {
                return <Item
                        title={data}
                        selected={index === parseInt(props.getQuery("kategoria"))}
                        onClick={() => props.setQuery([[ "kategoria", index ]])}
                        icon={false}
                        key={index}

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

export default withRouter(ShopMenu);