import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

import { API_URL, isLogged, getStorageItem, removeStorageItem, setStorageItem, shop } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";
import Loading from "../components/Loading";

import { showTransition, hideTransition } from "../components/Transition";

import Order from "../components/Order";

import "../styles/admin.css";

class AdminOrders extends React.Component {

    state = {
        status: "ordered",
        limit: 10,
        skip: 0,
        type: "normal",

        orders: [],
        selectedOrders: [],

        loading: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.fulfillOrder = this.fulfillOrder.bind(this);
        this.sendOrder = this.sendOrder.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
        this.changeOrderType = this.changeOrderType.bind(this);
        this.downloadExcelTable = this.downloadExcelTable.bind(this);
        this.selectOrder = this.selectOrder.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.fulfillSelected = this.fulfillSelected.bind(this);
        this.sendSelected = this.sendSelected.bind(this);
        this.forwardSelected = this.forwardSelected.bind(this);
        this.handleScrollLoading = this.handleScrollLoading.bind(this);
    }

    clearSelection(event) {
        event.stopPropagation();

        this.setState({ selectedOrders: [] });
    }

    selectOrder(id) {
        var { selectedOrders } = this.state;

        if (selectedOrders.includes(id)) {
            const index = selectedOrders.indexOf(id);
            selectedOrders.splice(index, 1);
        } else {
            selectedOrders.push(id);
        }

        this.setState({ selectedOrders: selectedOrders });
    }

    selectAll() {
        const { orders } = this.state;

        var selectedOrders = [];

        for (let i = 0; i < orders.length; i++) {
            selectedOrders.push(orders[i].order._id);
        }

        this.setState({ selectedOrders: selectedOrders });
    }

    forwardSelected() {
        const { status } = this.state;

        if (status === "ordered") {
            this.fulfillSelected();
        } else if (status === "fulfilled") {
            this.sendSelected();
        }
    }

    async fulfillSelected() {
        const { selectedOrders } = this.state;

        for (let i = 0; i < selectedOrders.length; i++) {
            await this.fulfillOrder(selectedOrders[i]);
        }

        this.setState({ orders: [], selectedOrders: [] }, () => this.loadData());
    }

    async sendSelected() {
        const { selectedOrders } = this.state;

        for (let i = 0; i < selectedOrders.length; i++) {
            await this.sendOrder(selectedOrders[i]);
        }

        this.setState({ orders: [], selectedOrders: [] }, () => this.loadData());
    }

    async downloadExcelTable(event) {
        const token = getStorageItem("token");

        const { status, type } = this.state;

        var data = {
            mode: "complex",
            filters: {
                status: status
            }
        }

        if (type === "normal") {
            delete data["filters"]["value"];
            delete data["filters"]["applyDiscount"];

            data["filters"]["valueOverZero"] = true;
        } else if (type === "samples") {
            delete data["filters"]["applyDiscount"];
            delete data["filters"]["valueOverZero"];

            data["filters"]["value"] = 0;
        } else if (type === "doterra") {
            delete data["filters"]["value"];
            delete data["filters"]["valueOverZero"];

            data["filters"]["applyDiscount"] = true;
        }

        const call = await Api.generateExcelTable(data, token);

        if (call.path) {
            event.stopPropagation();

            const pathname = API_URL + "/uploads/excel/" + call.path;

            var link = document.createElement("a");
            link.href = pathname;
            link.download = call.path;
            link.dispatchEvent(new MouseEvent("click"));
        }
    }

    async loadData() {
        this.setState({ loading: true });

        const token = getStorageItem("token");
        const { status, skip, limit, type } = this.state;

        var filters = {
            filters: {
                status: status
            },
            sortBy: {
                date: status === "sent" ? -1 : 1
            },
            limit: limit,
            skip: skip
        }

        if (type === "normal") {
            delete filters["filters"]["value"];
            filters["filters"]["applyDiscount"] = false;
            filters["filters"]["valueOverZero"] = true;
        } else if (type === "samples") {
            delete filters["filters"]["valueOverZero"];
            filters["filters"]["applyDiscount"] = false;
            filters["filters"]["value"] = 0;
        } else if (type === "doterra") {
            delete filters["filters"]["value"];
            delete filters["filters"]["valueOverZero"];
            filters["filters"]["applyDiscount"] = true;
        }

        const call = await Api.getOrders(filters, token);

        if (call.orders) {
            var orders = [];

            for (let oi = 0; oi < call.orders.length; oi++) {
                const order = call.orders[oi];

                var ids = [];

                for (let i = 0; i < order.products.length; i++) {
                    const id = order.products[i];

                    if (ids.length === 0) {
                        ids.push({
                            id: id,
                            amount: 1
                        });

                        continue;
                    }

                    for (let j = 0; j < ids.length; j++) {
                        if (ids[j].id === id) {
                            ids[j].amount = ids[j].amount + 1;
                        } else {
                            if (j === ids.length - 1) {
                                ids.push({
                                    id: id,
                                    amount: 1
                                });

                                break;
                            }
                        }
                    }
                }

                var products = [];

                for (let i = 0; i < ids.length; i++) {
                    const id = ids[i]
                    
                    const product = await Api.getProduct(id.id);
                    
                    if (product.product) {
                        products.push({
                            ...product.product,
                            amount: id.amount
                        });
                    }
                }

                const clientId = order.orderedBy;
                const client = await Api.getClient(clientId, token);

                orders.push({
                    order: order,
                    products: products,
                    client: client.user,
                    date: order.date
                })
            }

            this.setState((state) => ({
                orders: state.orders.concat(orders),
                selectedOrders: [],
                
                loading: false
            }));
        } else {
            this.setState({ loading: false });
        }
    }

    async fulfillOrder(id) {
        const token = getStorageItem("token");

        const fulfill = await Api.fulfillOrder(id, token);

        this.setState({ orders: [], selectedOrders: [] }, () => this.loadData())
    }

    async sendOrder(id) {
        const token = getStorageItem("token");

        const send = await Api.sendOrder(id, token);

        this.setState({ orders: [], selectedOrders: [] }, () => this.loadData())
    }

    async cancelOrder(id) {
        const token = getStorageItem("token");

        const cancel = await Api.cancelOrder(id, token);

        this.setState({ orders: [] }, () => this.loadData());
    }

    changeCategory(status) {
        this.setState({
            orders: [],
            selectedOrders: [],

            status: status,
            skip: 0
        }, async () => await this.loadData());
    }

    changeOrderType(type) {
        this.setState({
            orders: [],
            selectedOrders: [],

            type: type,
            skip: 0
        }, async () => await this.loadData());
    }

    async componentDidMount() {
        showTransition();

        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }

        await this.loadData();

        window.addEventListener("scroll", this.handleScrollLoading);

        hideTransition();
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScrollLoading);
    }

    componentDidUpdate() {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }
    }

    handleScrollLoading() {
        var ordersPanel = document.getElementById("orders-panel");

        if (ordersPanel) {
            if (ordersPanel.getBoundingClientRect().bottom < window.innerHeight && this.state.orders.length === this.state.skip + 10) {
                this.setState((state) => ({ skip: state.skip + 10 }), () => this.loadData());
                return;
            }
        }
    }

    render() {
        return(
            <div className="screen admin" id="admin-orders">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Objednávky</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.title}
                        onClick={() => {
                            this.setState({ popup: false })
                            this.props.history.push("/profil")
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content">
                    <div className="title">Administrácia objednávok</div>

                    <div className="menu">
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.status === "pending" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeCategory("pending")}>Čaká sa na zaplatenie</div>
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.status === "ordered" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeCategory("ordered")}>Objednané</div>
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.status === "fulfilled" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeCategory("fulfilled")}>Spracované</div>
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.status === "sent" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeCategory("sent")}>Odoslané</div>
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.status === "cancelled" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeCategory("cancelled")}>Zrušené</div>

                        <div style={{ flex: 1 }} />

                        {this.state.status === "fulfilled" || this.state.status === "sent" ? <div className="button-filled" onClick={(event) => this.downloadExcelTable(event)} style={{ marginRight: 20 }}>Stiahnuť tabuľku</div> : null}

                        {this.state.selectedOrders.length > 0 ? (
                            <div className="button-filled selection" onClick={() => this.setState({ selectedOrders: [] })} onClick={() => this.forwardSelected()}>
                                Do
                                {this.state.status === "pending" ? " objednaných " : this.state.status === "ordered" ? " spracovaných " : this.state.status === "fulfilled" ? " odoslaných " : ""}
                                ({this.state.selectedOrders.length})
                                <ion-icon name="close-outline" onClick={(event) => this.clearSelection(event)}></ion-icon>
                            </div>
                        ) : null}
                        
                        {this.state.selectedOrders.length === 0 && this.state.orders.length > 0 ? (
                            this.state.status !== "pending" && this.state.status !== "sent" && this.state.status !== "cancelled" ? (
                                <div className="button-filled" onClick={() => this.selectAll()}>Označiť všetky</div>
                            ) : null
                        ) : null}
                    </div>

                    <div className="menu" style={{ marginTop: 0 }}>
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.type === "normal" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeOrderType("normal")}>Normálne</div>
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.type === "samples" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeOrderType("samples")}>Vzorky</div>
                        <div className={"item" + (this.state.loading ? " faded" : "")} style={this.state.type === "doterra" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.state.loading ? {} : this.changeOrderType("doterra")}>Registrácie doTERRA</div>
                    </div>

                    <div className="orders" id="orders-panel">
                        {this.state.orders.map((order) => <Order order={order} fulfill={this.fulfillOrder} send={this.sendOrder} cancel={this.cancelOrder} selectOrder={this.selectOrder} isSelected={this.state.selectedOrders.includes(order.order._id)} />)}
                    </div>

                    {this.state.loading && <Loading />}

                    {this.state.orders.length === 0 && !this.state.loading ? <div className="empty-message">Nenašli sa žiadne objednávky pre danú kategóriu</div> : null}
                </div>
            </div>
        )
    }
}

export default withRouter(AdminOrders);