import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";


import AppContainer from "./AppContainer";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Offset from "./components/Offset";
import Cookies from "./components/Cookies";

import Transition from "./components/Transition";

import ScrollToTop from "./components/ScrollToTop";

import AdminAnalytics from "./screens/AdminAnalytics";
import AdminEmails from "./screens/AdminEmails";
import AdminOrders from "./screens/AdminOrders";
import AdminShop from "./screens/AdminShop";
import AdminBlog from "./screens/AdminBlog";

import AutoLogin from "./screens/AutoLogin";

import Contest from "./screens/Contest";
import Quiz from "./screens/Quiz";

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
import DoterraRegister from "./screens/DoterraRegister";
import Delivery from "./screens/Delivery";
import Confirm from "./screens/Confirm";
import Success from "./screens/Success";

import Login from "./screens/Login";

import Register from "./screens/Register";

import Register1 from "./screens/register/Register1";
import Register2 from "./screens/register/Register2";
import Register3 from "./screens/register/Register3";
import Register4 from "./screens/register/Register4";

import RegisterContest from "./screens/samples/RegisterContest";
import RegisterSamples from "./screens/samples/RegisterSamples";
import RegisterContact from "./screens/samples/RegisterContact";
import RegisterPassword from "./screens/samples/RegisterPassword";
import RegisterLogin from "./screens/samples/RegisterLogin";
import RegisterSuccess from "./screens/samples/RegisterSuccess";

import Profile from "./screens/Profile";
import Reset from "./screens/Reset";
import MobileMenu from "./components/MobileMenu";

import NotFound from "./screens/NotFound";

export default class Router extends React.Component {
    render() {
        return(
            <BrowserRouter basename="/">
                <AppContainer>
                <div id="top" style={{ position: "absolute", left: 0, top: 0 }}></div>

                <ScrollToTop />

                <MobileMenu />

                <div style={{ width: "100%", flexDirection: "column" }}>
                    <Header />
                    <Offset />
                    <Cookies />

                    <Switch>
                        <Route exact path="/"><Home /></Route>

                        <Route exact path="/kde-kupit-esencialne-oleje"><Contest /></Route>
                        <Route exact path="/kviz"><Quiz /></Route>

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

                        <Route exact path="/registracna-sutaz"><RegisterContest /></Route>
                        <Route exact path="/vzorka-zadarmo"><RegisterSamples /></Route>
                        <Route exact path="/vzorka-zadarmo/fakturacne-udaje"><RegisterContact /></Route>
                        <Route exact path="/vzorka-zadarmo/vytvorenie-hesla"><RegisterPassword /></Route>
                        <Route exact path="/vzorka-zadarmo/prihlasenie"><RegisterLogin /></Route>
                        <Route exact path="/vzorka-zadarmo/suhrn-clenstva"><RegisterSuccess /></Route>

                        <Route exact path="/stan-sa-clenom"><Register1 /></Route>
                        <Route exact path="/stan-sa-clenom/fakturacne-udaje"><Register2 /></Route>
                        <Route exact path="/stan-sa-clenom/vytvorenie-hesla"><Register3 /></Route>
                        <Route exact path="/stan-sa-clenom/vitajte"><Register4 /></Route>

                        {/*
                        <Route exact path="/registracia-vzorky-zadarmo"><Register stage={1} /></Route>
                        <Route exact path="/registracia-fakturacne-udaje"><Register stage={2} /></Route>
                        <Route exact path="/registracia-vytvorit-ucet"><Register stage={3} /></Route>
                        <Route exact path="/registracia-suhrn-objednavky"><Register stage={4} /></Route>
                        */}
                            
                        <Route exact path="/profil"><Profile /></Route>

                        <Route exact path="/admin/analytika"><AdminAnalytics /></Route>
                        <Route exact path="/admin/registracia-novych-clenov"><AdminEmails /></Route>
                        <Route exact path="/admin/objednavky"><AdminOrders /></Route>
                        <Route exact path="/admin/pridat-produkt"><AdminShop /></Route>
                        <Route exact path="/admin/pridat-prispevok"><AdminBlog /></Route>
                        <Route path="/admin/upravit-produkt/:id" render={(props) => { return ( <AdminShop {...props } /> ) }} />
                        <Route path="/admin/upravit-prispevok/:id" render={(props) => { return ( <AdminBlog {...props } /> ) }} />

                        <Route exact path="/kosik"><Cart /></Route>
                        <Route exact path="/fakturacne-udaje"><Checkout /></Route>
                        <Route exact path="/ziskajte-25-percentnu-zlavu"><DoterraRegister /></Route>
                        <Route exact path="/doprava-a-platba"><Delivery /></Route>
                        <Route exact path="/potvrdenie-objednavky"><Confirm /></Route>
                        <Route exact path="/dakujeme-za-objednavku"><Success /></Route>
                        {/*
                        <Route exact path="/platba"><Payment /></Route>
                        <Route exact path="/uspech"><Success /></Route>
                        */}

                        <Route path="/reset/:secret" render={(props) => { return ( <Reset {...props } /> ) }} />

                        <Route><NotFound /></Route>
                    </Switch>

                    <Transition />
                    <Footer />
                </div>
                </AppContainer>
            </BrowserRouter>
        )
    }
}