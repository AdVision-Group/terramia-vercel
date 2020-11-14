import React, { useImperativeHandle } from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, getStorageItem, removeStorageItem, setStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import "../styles/admin.css";

class Admin extends React.Component {

    state = {
        offset: 0,

        user: getStorageItem("user"),

        name: "",
        description: "",
        price: "",
        imagePath: "",
        image: null,

        loading: true,
        popup: false
    }

    constructor() {
        super();

        this.addProduct = this.addProduct.bind(this);
        this.changeImage = this.changeImage.bind(this);
    }

    async addProduct() {
        const { name, description, price, image, imagePath } = this.state
        const token = getStorageItem("token")

        const addProduct = await Api.createProduct({
            type: 1,
            category: 1,
            eshop: true,
            name: name,
            description: description,
            price: price
        }, token)

        console.log(addProduct)

        if (addProduct.success === "New product created successfully") {
            const addImage = await Api.addImage(addProduct.product._id, image, token);

            console.log(addImage);
        }
    }

    changeImage() {
        const photo = document.getElementById("file").files[0];
        this.setState({ image: photo, imagePath: window.URL.createObjectURL(photo) })
    }

    componentDidMount() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        window.addEventListener('resize', this.updateOffset.bind(this));

        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }
    }

    componentDidUpdate() {
        if (!isLogged()) {
            this.props.history.push("/prihlasenie")
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateOffset.bind(this));
    }

    updateOffset() {
        this.setState({ offset: document.getElementById("header").clientHeight });
        this.forceUpdate();
    }

    render() {
        return(
            <div className="screen" id="admin">
                <Header />

                {this.state.popup ? (
                    <Popup
                        type="info"
                        title="Osobné údaje boli úspešne zmenené"
                        onClick={() => {
                            this.setState({ popup: false })
                            window.location.reload()
                        }}
                        loading={this.state.loading}
                    />
                ) : null}

                <div className="content" style={{ paddingTop: this.state.offset + 50 }}>
                    <div className="title">Administrácia e-shopu</div>

                    <div className="section">Pridať produkt</div>
                    <div className="text">
                        Pridajte produkt do databázy produktov pre e-shop TerraMia. Potrebné je meno produktu, popis produktu, cena a obrázok. 
                    </div>

                    <div className="details">
                        <div className="heading">Meno produktu</div>
                        <input className="field" type="text" value={this.state.name} placeholder="Meno produktu" onChange={(event) => this.setState({ name: event.target.value })} />
                        <div className="heading">Popis</div>
                        <textarea className="area" rows="10" value={this.state.description} placeholder="Popis produktu" onChange={(event) => this.setState({ description: event.target.value })}></textarea>
                        <div className="heading">Cena (v centoch)</div>
                        <input className="field" type="text" value={this.state.price} placeholder="Cena v centoch" onChange={(event) => this.setState({ price: event.target.value })} />

                        <div className="heading">Fotka</div>
                        <label className="button-filled" for="file">Vybrať súbor</label>
                    </div>

                    <input className="file-input" name="file" id="file" type="file" onChange={() => this.changeImage()} />

                    <img className="image" id="product-image" src={this.state.imagePath} style={this.state.imagePath ? {} : { display: "none" }} />

                    <div className="button-filled" onClick={() => this.addProduct()}>Pridať produkt</div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default withRouter(Admin);