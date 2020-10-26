import React from "react";
import { HashRouter, Switch, Route, Link } from "react-router-dom";

import Home from "./screens/Home";
import Shop from "./screens/Shop";

export default function Router() {
    return(
        <HashRouter basename="/">
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>

                <Route exact path="/e-shop">
                    <Shop />
                </Route>
            </Switch>
        </HashRouter>
    )
}