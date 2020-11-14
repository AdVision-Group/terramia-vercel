import React from "react";
import { Link, withRouter } from "react-router-dom";

import { isLogged, setStorageItem, getStorageItem } from "../config/config";
import Api from "../config/Api";

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/success.css";

class Success extends React.Component {

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
    
    componentDidUpdate() {
        
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
            <div className="screen" id="success">
                <Header />

                <div className="content" style={{ paddingTop: this.state.offset + 100 }}>
                    <div className="title">Ďakujeme Vám za Váš nákup!</div>
                    <div className="description">
                        Platba prebehla úspešne, o Vašej objednávke Vás budeme ďalej informovať e-mailom. Ďakujeme Vám za Váš nákup!
                    </div>
                    <Link className="button-filled" to="/">Domovská stránka</Link>
                </div>

                <Footer />
            </div>
        )
    }
}

export default withRouter(Success);