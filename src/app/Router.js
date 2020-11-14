import React from "react";
import { HashRouter, withRouter, Switch, Route, Link, useLocation } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Dropdown from "./components/Dropdown";

import Admin from "./screens/Admin";

import Home from "./screens/Home";
import Categories from "./screens/Categories";
import Shop from "./screens/Shop";
import Product from "./screens/Product";
import Aromatherapy from "./screens/Aromatherapy";
import Business from "./screens/Business";
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

export default class Router extends React.Component {
    render() {
        return(
            <HashRouter basename="/">
                <div id="top" style={{ position: "absolute", left: 0, top: 0 }}></div>

                <ScrollToTop />

                <MobileMenu />

                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>

                    <Route exact path="/e-shop">
                        <Categories />
                    </Route>

                    <Route path="/e-shop/:category/:name-:id" render={(props) => {
                        return ( <Product {...props } /> )
                    }} />

                    <Route path="/e-shop/:category" render={(props) => {
                        return ( <Shop {...props } /> )
                    }} />

                    <Route exact path="/aromaterapia">
                        <Aromatherapy />
                    </Route>

                    <Route exact path="/podnikanie">
                        <Business />
                    </Route>

                    <Route exact path="/o-nas">
                        <About />
                    </Route>

                    <Route exact path="/kontakt">
                        <Contact />
                    </Route>

                    <Route exact path="/prihlasenie">
                        <Login />
                    </Route>

                    <Route exact path="/registracia-vzorky-zadarmo"><Register stage={1} /></Route>
                    <Route exact path="/registracia-fakturacne-udaje"><Register stage={2} /></Route>
                    <Route exact path="/registracia-suhrn-objednavky"><Register stage={3} /></Route>
                    <Route exact path="/registracia-uspech"><Register stage={4} /></Route>

                    <Route exact path="/profil">
                        <Profile />
                    </Route>

                    <Route exact path="/admin">
                        <Admin />
                    </Route>

                    <Route exact path="/kosik">
                        <Cart />
                    </Route>

                    <Route exact path="/fakturacne-udaje">
                        <Checkout />
                    </Route>

                    <Route path="/platba-:orderId" render={(props) => {
                        return ( <Payment {...props } /> )
                    }} />

                    <Route exact path="/uspech">
                        <Success />
                    </Route>

                    <Route path="/reset-:secret" render={(props) => {
                        return ( <Reset {...props } /> )
                    }} />
                </Switch>
            </HashRouter>
        )
    }
}