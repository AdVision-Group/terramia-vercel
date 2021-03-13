import React from "react";

import { getStorageItem, API_URL, formatDate } from "../config/config";

import Loading from "../components/Loading";

import Api from "../config/Api";

import "../styles/order.css";

export default class Order extends React.Component {

    state = {
        client: {},
        products: [],
        value: 0,
        date: "",

        category: "products",
        dropdown: false
    }

    constructor() {
        super();

        this.showDropdown = this.showDropdown.bind(this);
        this.hideDropdown = this.hideDropdown.bind(this);

        this.loadData = this.loadData.bind(this);
        this.filter = this.filter.bind(this);
    }

    showDropdown(category) {
        if (this.state.dropdown) {
            if (this.state.category === category) {
                this.hideDropdown();
            } else {
                this.setState({ category: category }, () => document.getElementById("dropdown-" + this.props.order._id).style.display = "flex");
            }
        } else {
            this.setState({ dropdown: true, category: category }, () => document.getElementById("dropdown-" + this.props.order._id).style.display = "flex");
        }
    }

    hideDropdown() {
        this.setState({ dropdown: false }, () => document.getElementById("dropdown-" + this.props.order._id).style.display = "none");
    }

    async loadData() {
        const token = getStorageItem("token");
        const order = this.props.order;

        console.log(order);

        // LOAD PRODUCTS
        var ids = this.filter(order.products);
        var products = [];

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i]
            
            const product = await Api.getProduct(id.id);
            
            products.push({
                ...product.product,
                amount: id.amount
            });
        }

        this.setState({ products: products })

        // LOAD CLIENT
        const clientId = order.orderedBy;
        const client = await Api.getClient(clientId, token);

        this.setState({ client: client.user });

        // LOAD DATE
        this.setState({ date: formatDate(order.date) });
    }

    filter(ids) {
        var products = [];

        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];

            if (products.length === 0) {
                products.push({
                    id: id,
                    amount: 1
                });

                continue;
            }

            for (let j = 0; j < products.length; j++) {
                if (products[j].id === id) {
                    products[j].amount = products[j].amount + 1;
                } else {
                    if (j === products.length - 1) {
                        products.push({
                            id: id,
                            amount: 1
                        });

                        break;
                    }
                }
            }
        }

        return products;
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        const order = this.props.order;

        return(
            <div className="order" id={"order-" + order._id}>
                <div className="main-panel">
                    {order.status !== "pending" && order.status !== "sent" && order.status !== "cancelled" ? <div className={"selector" + (this.props.isSelected ? " selected" : "")} onClick={() => this.props.selectOrder(order._id)} /> : null}

                    <div className="name item">{this.state.client.name} {parseInt(order.value) === 0 ? "(Vzorky)" : null}</div>
                    <div className="date item">{this.state.date}</div>
                    
                    <div className="trigger item" style={this.state.dropdown && this.state.category === "info" ? { fontWeight: "700" } : null}>Kontaktné údaje<ion-icon name={"caret-" + (this.state.dropdown && this.state.category === "info" ? "up" : "down") + "-outline"} onClick={() => this.showDropdown("info")}></ion-icon></div>
                    <div className="trigger item" style={this.state.dropdown && this.state.category === "products" ? { fontWeight: "700" } : null}>Produkty<ion-icon name={"caret-" + (this.state.dropdown && this.state.category === "products" ? "up" : "down") + "-outline"} onClick={() => this.showDropdown("products")}></ion-icon></div>

                    <div style={{ flex: 1 }} />

                    <div className="button-panel">
                        {order.status === "ordered" ? <div className="button-filled item" onClick={() => this.props.fulfill(order._id)}>Do spracovaných</div> : null}
                        {order.status === "fulfilled" ? <div className="button-filled item" onClick={() => this.props.send(order._id)}>Do odoslaných</div> : null}
                        {order.status !== "cancelled" && order.status !== "sent" ? <div className="button-outline item" onClick={() => this.props.cancel(order._id)}>Zrušiť</div> : null}
                    </div>

                    <div className="price item"><b>{(this.props.order.value / 100).toFixed(2)}€</b></div>
                </div>

                <div className="dropdown" id={"dropdown-" + order._id}>
                    {this.state.category === "products" ? (
                        <div className="body" id="products">
                            {this.state.products.map((product) => <Product product={product} />)}
                        </div>
                    ) : null}

                    {this.state.category === "info" ? (
                        <div className="body" id="info">
                            <div className="left">
                                <div className="heading">E-mail</div>
                                <div className="info">{this.state.client.email}</div>

                                <div className="heading">Telefónne číslo</div>
                                <div className="info">{this.state.client.phone}</div>

                                {order.applyDiscount ? <div className="heading">Dátum narodenia</div> : null}
                                {order.applyDiscount ? <div className="info">{this.state.client.birthDate}</div> : null}

                                <div className="heading">Adresa</div>
                                <div className="info">{this.state.client.address}</div>

                                <div className="heading">PSČ</div>
                                <div className="info">{this.state.client.psc}</div>

                                <div className="heading">Mesto</div>
                                <div className="info">{this.state.client.city}</div>

                                <div className="heading">Krajina</div>
                                <div className="info">{this.state.client.country}</div>

                                {parseInt(order.value) !== 0 ? <div className="heading">Registrovať do doTERRA</div> : null}
                                {parseInt(order.value) !== 0 ? <div className="info">{order.applyDiscount ? "ÁNO" : "NIE"}</div> : null}
                            </div>
                            
                            <div className="right">
                                <div className="heading">Doručenie</div>
                                <div className="info">{order.shouldDeliver ? "Doručenie kuriérom" : "Osobný odber"}</div>

                                <div className="heading">Platba</div>
                                <div className="info">{order.paidOnline ? "Kartou" : "Hotovosť"}</div>

                                <div className="heading">Na firmu</div>
                                <div className="info">{order.buyingAsCompany ? "ÁNO" : "NIE"}</div>

                                {order.buyingAsCompany ? <div className="heading">Názov firmy</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.name}</div> : null}
                                {order.buyingAsCompany ? <div className="heading">IČO</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.ico}</div> : null}
                                {order.buyingAsCompany ? <div className="heading">DIČ</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.dic}</div> : null}
                                {order.buyingAsCompany ? <div className="heading">IČDPH</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.icdph}</div> : null}

                                {order.buyingAsCompany ? <div className="heading">Adresa firmy</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.address}</div> : null}
                                {order.buyingAsCompany ? <div className="heading">PSČ</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.psc}</div> : null}
                                {order.buyingAsCompany ? <div className="heading">Mesto</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.city}</div> : null}
                                {order.buyingAsCompany ? <div className="heading">Krajina</div> : null}
                                {order.buyingAsCompany ? <div className="info">{this.state.client.company.country}</div> : null}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
}

function Product(props) {
    const product = props.product;
    const src = API_URL + "/uploads/" + product.imagePath

    return(
        <div className="product">
            <img className="image" src={src} />
            <div className="name">{product.name}</div>
            <div style={{ flex: 1 }} />
            <div className="amount">{product.amount}x</div>
        </div>
    )
}