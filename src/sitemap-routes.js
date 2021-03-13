import React from 'react';
import { Route } from 'react-router';
 
export default (
    <Route>
        <Route exact path="/" />

        <Route path="/autologin/:email/:password" />

        <Route exact path="/e-shop/kategoria/:type/:category" />
        <Route path="/e-shop/:link" />
        <Route exact path="/e-shop" />

        <Route exact path="/aromavzdelavanie" />
        <Route exact path="/podnikanie" />
        <Route path="/novinky/:link" />
        <Route exact path="/novinky" />
        <Route path="/blog/:link" />
        <Route exact path="/blog" />
        <Route exact path="/o-nas" />
        <Route exact path="/kontakt" />

        <Route exact path="/prihlasenie" />
        <Route exact path="/registracia-vzorky-zadarmo" />
        <Route exact path="/registracia-fakturacne-udaje" />
        <Route exact path="/registracia-vytvorit-ucet" />
        <Route exact path="/registracia-suhrn-objednavky" />
        <Route exact path="/profil" />

        <Route exact path="/admin/pridat-produkt" />
        <Route exact path="/admin/objednavky" />
        <Route exact path="/admin/pridat-prispevok" />

        <Route path="/admin/upravit-produkt/:id" />
        <Route path="/admin/upravit-prispevok/:id" />

        <Route exact path="/kosik" />
        <Route exact path="/fakturacne-udaje" />
        <Route exact path="/platba" />
        <Route exact path="/uspech" />

        <Route path="/reset/:secret" />
    </Route>
);