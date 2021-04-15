import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

import { API_URL, isLogged, getStorageItem, removeStorageItem, setStorageItem, shop } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";
import Loading from "../components/Loading";

import Order from "../components/Order";

import "../styles/admin.css";

class AdminOrders extends React.Component {

    state = {
        filters: {
            filters: {
                status: "ordered"
            },
            sortBy: {
                date: 1
            },
            limit: 10,
            skip: 0
        },

        orders: [],
        selectedOrders: [],

        type: "normal",

        loading: false
    }

    constructor() {
        super();

        this.loadData = this.loadData.bind(this);
        this.fulfillOrder = this.fulfillOrder.bind(this);
        this.sendOrder = this.sendOrder.bind(this);
        this.cancelOrder = this.cancelOrder.bind(this);
        this.changeCategory = this.changeCategory.bind(this);
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
        const { selectedOrders } = this.state;

        if (selectedOrders.includes(id)) {
            const index = selectedOrders.indexOf(id);
            selectedOrders.splice(index, 1);
        } else {
            selectedOrders.push(id);
        }

        this.setState({ selectedOrders: selectedOrders });
    }

    selectAll() {
        var selectedOrders = [];

        for (let i = 0; i < this.state.orders.length; i++) {
            selectedOrders.push(this.state.orders[i]._id);
        }

        this.setState({ selectedOrders: selectedOrders });
    }

    forwardSelected() {
        const status = this.state.filters.filters.status;

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
    }

    async sendSelected() {
        const { selectedOrders } = this.state;

        for (let i = 0; i < selectedOrders.length; i++) {
            await this.sendOrder(selectedOrders[i]);
        }
    }

    async downloadExcelTable(event) {
        const token = getStorageItem("token");
        const call = await Api.generateExcelTable(token);

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

        var filters = {
            ...this.state.filters
        }

        if (this.state.type === "normal") {
            delete filters["filters"]["value"];
            filters["filters"]["valueOverZero"] = true;
        } else {
            delete filters["filters"]["valueOverZero"];
            filters["filters"]["value"] = 0;
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
                    
                    products.push({
                        ...product.product,
                        amount: id.amount
                    });
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
        }
    }

    async fulfillOrder(id) {
        const token = getStorageItem("token");

        const fulfill = await Api.fulfillOrder(id, token);

        this.setState({ orders: [] }, () => this.loadData())
    }

    async sendOrder(id) {
        const token = getStorageItem("token");

        const send = await Api.sendOrder(id, token);

        this.setState({ orders: [] }, () => this.loadData())
    }

    async cancelOrder(id) {
        const token = getStorageItem("token");

        const cancel = await Api.cancelOrder(id, token);

        this.setState({ orders: [] }, () => this.loadData())
    }

    changeCategory(category) {
        this.setState({
            filters: {
                filters: {
                    status: category
                },
                sortBy: {
                    date: category === "sent" ? -1 : 1
                },
                limit: 10,
                skip: 0
            },
            orders: [],
            selectedOrders: []
        }, () => {
            this.loadData();
        })
    }

    componentDidMount() {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }

        this.loadData();

        window.addEventListener("scroll", this.handleScrollLoading);
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

        if (ordersPanel.getBoundingClientRect().bottom < window.innerHeight && this.state.orders.length === this.state.filters.skip + 10) {
            this.setState((state) => ({ filters: { ...state.filters, skip: state.filters.skip + 10 } }), () => this.loadData());
            return;
        }
    }

    render() {
        return(
            <div className="screen admin" id="admin-orders">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | Objednávky</title>
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
                        <div className="item" style={this.state.filters.filters.status === "pending" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory("pending")}>Čaká sa na zaplatenie</div>
                        <div className="item" style={this.state.filters.filters.status === "ordered" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory("ordered")}>Objednané</div>
                        <div className="item" style={this.state.filters.filters.status === "fulfilled" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory("fulfilled")}>Spracované</div>
                        <div className="item" style={this.state.filters.filters.status === "sent" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory("sent")}>Odoslané</div>
                        <div className="item" style={this.state.filters.filters.status === "cancelled" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.changeCategory("cancelled")}>Zrušené</div>

                        <div style={{ flex: 1 }} />

                        {this.state.filters.filters.status === "fulfilled" ? <div className="button-filled" onClick={(event) => this.downloadExcelTable(event)} style={{ marginRight: 20 }}>Stiahnuť tabuľku</div> : null}

                        {this.state.selectedOrders.length > 0 ? (
                            <div className="button-filled selection" onClick={() => this.setState({ selectedOrders: [] })} onClick={() => this.forwardSelected()}>
                                Do
                                {this.state.filters.filters.status === "pending" ? " objednaných " : this.state.filters.filters.status === "ordered" ? " spracovaných " : this.state.filters.filters.status === "fulfilled" ? " odoslaných " : ""}
                                ({this.state.selectedOrders.length})
                                <ion-icon name="close-outline" onClick={(event) => this.clearSelection(event)}></ion-icon>
                            </div>
                        ) : null}
                        
                        {this.state.selectedOrders.length === 0 && this.state.orders.length > 0 ? (
                            this.state.filters.filters.status !== "pending" && this.state.filters.filters.status !== "sent" && this.state.filters.filters.status !== "cancelled" ? (
                                <div className="button-filled" onClick={() => this.selectAll()}>Označiť všetky</div>
                            ) : null
                        ) : null}
                    </div>

                    <div className="menu" style={{ marginTop: 0 }}>
                        <div className="item" style={this.state.type === "normal" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ type: "normal", orders: [] }, () => this.loadData())}>Normálne</div>
                        <div className="item" style={this.state.type === "samples" ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.setState({ type: "samples", orders: [] }, () => this.loadData())}>Vzorky</div>
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