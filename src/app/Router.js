import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import AppContaner from "./AppContainer";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Offset from "./components/Offset";
import Cookies from "./components/Cookies";

import ScrollToTop from "./components/ScrollToTop";

import AdminShop from "./screens/AdminShop";
import AdminOrders from "./screens/AdminOrders";
import AdminBlog from "./screens/AdminBlog";

import AutoLogin from "./screens/AutoLogin";

import Home from "./screens/Home";
import Shop from "./screens/Shop";
import Product from "./screens/Product";
import Aromatherapy from "./screens/Aromatherapy";
import Business from "./screens/Business";
import News from "./screens/News";
import Blog from "./screens/Blog";
import Article from "./screens/Article";
import About from "./screens/About";
import Contact from "./screens/Contact";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import Payment from "./screens/Payment";
import Success from "./screens/Success";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
import Reset from "./screens/Reset";
import MobileMenu from "./components/MobileMenu";

import NotFound from "./screens/NotFound";

export default class Router extends React.Component {
    render() {
        return(
            <BrowserRouter basename="/">
                <AppContaner>
                <div id="top" style={{ position: "absolute", left: 0, top: 0 }}></div>

                <ScrollToTop />

                <MobileMenu />

                <div style={{ width: "100%", flexDirection: "column" }}>
                    <Header />
                    <Offset />
                    <Cookies />

                    <Switch>
                        <Route exact path="/"><Home /></Route>

                        <Route path="/autologin/:email/:password" render={(props) => { return ( <AutoLogin {...props } /> )}} />

                        <Route exact path="/e-shop/kategoria/:type/:category"><Shop /></Route>
                        <Route path="/e-shop/:link" render={(props) => { return ( <Product {...props } /> )}} />
                        <Route exact path="/e-shop"><Shop /></Route>

                        <Route exact path="/aromavzdelavanie"><Aromatherapy /></Route>
                        <Route exact path="/podnikanie"><Business /></Route>
                        <Route path="/novinky/:link" render={(props) => { return ( <Article {...props } /> ) }} />
                        <Route exact path="/novinky"><News /></Route>
                        <Route path="/blog/:link" render={(props) => { return ( <Article {...props } /> ) }} />
                        <Route exact path="/blog"><Blog /></Route>
                        <Route exact path="/o-nas"><About /></Route>
                        <Route exact path="/kontakt"><Contact /></Route>

                        <Route exact path="/prihlasenie"><Login /></Route>
                        <Route exact path="/registracia-vzorky-zadarmo"><Register stage={1} /></Route>
                        <Route exact path="/registracia-fakturacne-udaje"><Register stage={2} /></Route>
                        <Route exact path="/registracia-vytvorit-ucet"><Register stage={3} /></Route>
                        <Route exact path="/registracia-suhrn-objednavky"><Register stage={4} /></Route>
                        <Route exact path="/profil"><Profile /></Route>

                        <Route exact path="/admin/pridat-produkt"><AdminShop /></Route>
                        <Route exact path="/admin/objednavky"><AdminOrders /></Route>
                        <Route exact path="/admin/pridat-prispevok"><AdminBlog /></Route>

                        <Route path="/admin/upravit-produkt/:id" render={(props) => { return ( <AdminShop {...props } /> ) }} />
                        <Route path="/admin/upravit-prispevok/:id" render={(props) => { return ( <AdminBlog {...props } /> ) }} />

                        <Route exact path="/kosik"><Cart /></Route>
                        <Route exact path="/fakturacne-udaje"><Checkout /></Route>
                        <Route exact path="/platba"><Payment /></Route>
                        <Route exact path="/uspech"><Success /></Route>

                        <Route path="/reset/:secret" render={(props) => { return ( <Reset {...props } /> ) }} />

                        <Route><NotFound /></Route>
                    </Switch>

                    <Footer />
                </div>
                </AppContaner>
            </BrowserRouter>
        )
    }
}