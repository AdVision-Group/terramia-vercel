import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import { isLogged, getStorageItem, removeStorageItem, setStorageItem, shop, createURLName, API_URL } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import { showTransition, hideTransition } from "../components/Transition";

import "../styles/admin.css";

class AdminShop extends React.Component {

    state = {
        offset: 0,

        user: getStorageItem("user"),

        name: "",
        label: "",
        link: "",
        description: "",
        price: "",
        points: "0",
        imagePath: "",
        image: null,

        isDoTerraProduct: false,

        tip1: "",
        tip2: "",
        tip3: "",

        type: 0,
        category: 0,

        loading: true,
        title: "",
        popup: false,

        problems: [],
        topProduct: false,

        location: ""
    }

    constructor() {
        super();

        this.addProduct = this.addProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.updateType = this.updateType.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.selectProblem = this.selectProblem.bind(this);
        this.isProblemSelected = this.isProblemSelected.bind(this);
    }

    async addProduct() {
        this.setState({ popup: true, loading: true });

        const { name, label, link, description, tip1, tip2, tip3, price, points, isDoTerraProduct, image, imagePath, type, category, problems, topProduct } = this.state;

        if (name.trim() === "" || label.trim() === "" || description.trim() === ""|| tip1.trim() === "" || tip2.trim() === "" || tip3.trim() === "" || price.trim() === "" || points.trim() === "" || imagePath.trim() === "") {
            this.setState({ popup: true, loading: false, title: "Všetky polia musia byť vyplnené" });
            return;
        }
        
        const token = getStorageItem("token")

        const addProduct = await Api.createProduct({
            type: type + 1,
            category: category + 1,
            eshop: true,
            visibility: true,
            name: name,
            label: label,
            link: link,
            description: description,
            tips: [ tip1, tip2, tip3 ],
            price: price,
            points: points,
            isDoTerraProduct: isDoTerraProduct,
            problemType: problems,
            topProduct: topProduct,
        }, token)

        if (addProduct.success === "New product created successfully") {
            const addImage = await Api.addImage(addProduct.product._id, image, token);

            this.props.history.push("/e-shop");
        } else {
            this.setState({ popup: true, loading: false, title: "Produkt sa nepodarilo pridať do e-shopu" });
        }
    }

    async updateProduct() {
        this.setState({ popup: true, loading: true });

        const { name, label, link, description, tip1, tip2, tip3, price, points, isDoTerraProduct, image, imagePath, type, category, problems, topProduct } = this.state

        if (name.trim() === "" || label.trim() === "" || description.trim() === ""|| tip1.trim() === "" || tip2.trim() === "" || tip3.trim() === "" || price.trim() === "" || points.trim() === "" || imagePath.trim() === "") {
            this.setState({ popup: true, loading: false, title: "Všetky polia musia byť vyplnené" });
            return;
        }

        const token = getStorageItem("token");

        const id = this.props.match.params.id;

        const call = await Api.editProduct(id, {
            name: name,
            label: label,
            link: link,
            description: description,
            price: price,
            isDoTerraProduct: isDoTerraProduct,
            points: points,
            tips: [ tip1, tip2, tip3 ],
            
            type: type + 1,
            category: category + 1,

            problemType: problems,
            topProduct: topProduct
        }, token);

        if (call.message === "Product patched successfully") {
            if (image !== null) {
                const addImage = await Api.addImage(id, image, token);
            }

            this.props.history.push("/e-shop");
        } else {
            this.setState({ popup: true, loading: false, title: "Produkt sa nepodarilo upraviť" });
        }
    }

    selectProblem(problem) {
        var problems = this.state.problems

        if (problems.includes(problem)) {
            const index = problems.indexOf(problem);
            problems.splice(index, 1)
        } else {
            problems.push(problem)
        }

        this.setState({ problems: problems })
    }

    isProblemSelected(problem) {
        const problems = this.state.problems

        if (problems.includes(problem)) {
            return true
        }

        return false
    }

    updateType() {
        this.setState({ type: parseInt(document.getElementById("type-select").value) })
    }

    updateCategory() {
        this.setState({ category: parseInt(document.getElementById("category-select").value) })
    }

    changeImage() {
        const photo = document.getElementById("file").files[0];
        this.setState({ image: photo, imagePath: window.URL.createObjectURL(photo) })
    }

    async componentDidMount() {
        showTransition();

        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }

        this.setState({
            location: this.props.location.pathname,
        });

        if (this.props.location.pathname.includes("upravit-produkt")) {
            const id = this.props.match.params.id;
            const call = await Api.getProduct(id);

            if (call.product) {
                const product = call.product;

                this.setState({
                    name: product.name,
                    label: product.label,
                    link: product.link,
                    description: product.description,
                    price: product.price.toString(),
                    isDoTerraProduct: product.isDoTerraProduct,
                    points: product.points.toString(),
                    imagePath: API_URL + "/uploads/" + product.imagePath,

                    tip1: product.tips[0],
                    tip2: product.tips[1],
                    tip3: product.tips[2],

                    type: product.type - 1,
                    category: product.category - 1,

                    problems: product.problemType,
                    topProduct: product.topProduct,
                });

                document.getElementById("type-select").selectedIndex = product.type - 1;
            }
        }

        hideTransition();
    }

    componentDidUpdate() {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }
    }

    render() {
        return(
            <div className="screen admin" id="admin-shop">
                 <Helmet>
                    <meta charSet="utf-8" />
                    <title>TerraMia | {this.props.location.pathname.includes("upravit-produkt") ? "Upraviť produkt" : "Pridať produkt"}</title>
                    <meta name="robots" content="noindex, nofollow"></meta>
                </Helmet>

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title={this.state.title}
                        onClick={() => {
                            this.setState({ popup: false });
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content">
                    <div className="title">Administrácia e-shopu</div>

                    <div className="section">Základné informácie</div>
                    {/*<div className="text">
                        Pridajte produkt do databázy produktov pre e-shop TerraMia. Po vyplnení všetkých políčok bude produkt automaticky v priebehu pár sekúnd pridaný do e-shopu.
                    </div>*/}

                    <div className="panel">
                        <div className="heading">Meno produktu</div>
                        <input className="field" type="text" value={this.state.name} placeholder="Meno produktu" onChange={(event) => this.setState({ name: event.target.value, link: createURLName(event.target.value) })} />
                    </div>

                    <div className="panel">
                        <div className="heading">Motto oleja</div>
                        <input className="field" type="text" value={this.state.label} placeholder="Motto produktu" onChange={(event) => this.setState({ label: event.target.value })} />
                    </div>

                    <div className="panel">
                        <div className="heading">URL link</div>
                        <input className="field" type="text" value={this.state.link} placeholder="URL link produktu" onChange={(event) => this.setState({ link: event.target.value })} />
                    </div>

                    <div className="panel">
                        <div className="heading">Popis</div>
                        <textarea className="area" rows="10" value={this.state.description} placeholder="Popis produktu" onChange={(event) => this.setState({ description: event.target.value })}></textarea>
                    </div>

                    <div className="panel">
                        <div className="heading">Tipy na používanie</div>
                        <div className="tips">
                            <textarea className="area" rows="2" value={this.state.tip1} placeholder="Prvý tip na používanie" onChange={(event) => this.setState({ tip1: event.target.value })} style={{ marginBottom: 15 }}></textarea>
                            <textarea className="area" rows="2" value={this.state.tip2} placeholder="Druhý tip na používanie" onChange={(event) => this.setState({ tip2: event.target.value })} style={{ marginBottom: 15 }}></textarea>
                            <textarea className="area" rows="2" value={this.state.tip3} placeholder="Tretí tip na používanie" onChange={(event) => this.setState({ tip3: event.target.value })}></textarea>
                            {/*<input className="field tip" type="text" value={this.state.tip1} placeholder="Prvý tip" onChange={(event) => this.setState({ tip1: event.target.value })} />
                            <input className="field tip" type="text" value={this.state.tip2} placeholder="Druhý tip" onChange={(event) => this.setState({ tip2: event.target.value })} />
                            <input className="field tip" type="text" value={this.state.tip3} placeholder="Tretí tip" onChange={(event) => this.setState({ tip3: event.target.value })} />*/}
                        </div>
                    </div>

                    <div className="section">Zaradenie</div>

                    <div className="panel">
                        <div className="heading">Typ produktu</div>
                        <select class="select" id="type-select" onChange={() => this.updateType()}>
                            <option value="0">{shop[0].type}</option>
                            <option value="1">{shop[1].type}</option>
                            <option value="2">{shop[2].type}</option>
                            <option value="3">{shop[3].type}</option>
                            <option value="4">{shop[4].type}</option>
                            <option value="5">{shop[5].type}</option>
                        </select>
                    </div>

                    <div className="panel">
                        <div className="heading">Kategória produktu</div>
                        <select class="select" id="category-select" onChange={() => this.updateCategory()}>
                            {shop[this.state.type].categories.map((category, index) => <option value={index}>{category}</option>)}
                        </select>
                    </div>

                    <div className="section">Parametre</div>

                    <div className="panel">
                        <div className="heading">Cena (v centoch)</div>
                        <input className="field" type="text" value={this.state.price} placeholder="Cena v centoch" onChange={(event) =>  this.setState({ price: event.target.value })} />
                    </div>

                    <div className="panel">
                        <div className="heading">Výrobca</div>
                        <div className="chooser">
                            <div className="item" style={this.state.isDoTerraProduct ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ isDoTerraProduct: true })}>doTERRA</div>
                            <div className="item" style={!this.state.isDoTerraProduct ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ isDoTerraProduct: false })}>Iné</div>
                        </div>
                    </div>

                    {this.state.isDoTerraProduct ? (
                        <div className="panel">
                            <div className="heading">doTERRA body</div>
                            <input className="field" type="text" value={this.state.points} placeholder="doTERRA body" onChange={(event) => this.setState({ points: event.target.value })} />
                        </div>
                    )  : null}

                    <div className="panel">
                        <div className="heading">Problémy</div>
                        <div className="chooser">
                            <div className="item" style={this.isProblemSelected(1) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(1)}>Tráviaci systém</div>
                            <div className="item" style={this.isProblemSelected(2) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(2)}>Dýchací systém</div>
                            <div className="item" style={this.isProblemSelected(3) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(3)}>Pohybový systém</div>
                            <div className="item" style={this.isProblemSelected(4) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(4)}>Srdcovo cievny systém</div>
                            <div className="item" style={this.isProblemSelected(5) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(5)}>Vylučovací systém</div>
                            <div className="item" style={this.isProblemSelected(6) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(6)}>Nervový systém</div>
                            <div className="item" style={this.isProblemSelected(7) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(7)}>Lymfatický systém</div>
                            <div className="item" style={this.isProblemSelected(8) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(8)}>Imunitný systém</div>
                            <div className="item" style={this.isProblemSelected(9) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(9)}>Hormonálny systém</div>
                            <div className="item" style={this.isProblemSelected(10) ? { backgroundColor: "#A161B3", color: "white" } : null} onClick={() => this.selectProblem(10)}>Pokožka</div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="heading">Zaradiť medzi TOP produkty</div>
                        <div className="chooser">
                            <div className="item" style={this.state.topProduct ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ topProduct: true })}>Áno</div>
                            <div className="item" style={!this.state.topProduct ? { backgroundColor: "#A161B3", color: "white", fontSize: 16, padding: "10px 20px" } : { fontSize: 16, padding: "10px 20px" }} onClick={() => this.setState({ topProduct: false })}>Nie</div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="heading">Fotka</div>
                        <label className="button-filled" for="file">Vybrať súbor</label>
                    </div>

                    <input className="file-input" name="file" id="file" type="file" onChange={() => this.changeImage()} />

                    <img className="image" id="product-image" src={this.state.imagePath} style={this.state.imagePath ? {} : { display: "none" }} loading="lazy" />

                    <div className="button-filled done-button" onClick={() => this.state.location.includes("pridat-produkt") ? this.addProduct() : this.updateProduct()}>Uložiť</div>
                </div>
            </div>
        )
    }
}

export default withRouter(AdminShop);