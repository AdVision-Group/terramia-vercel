import React from "react";
import { withRouter } from "react-router-dom";

import ReactGA from "react-ga";
import TagManager from "react-gtm-module";
import ReactPixel from "react-facebook-pixel";
import Api from "./config/Api";

class AppContainer extends React.Component {

    constructor() {
        super();

        this.track = this.track.bind(this);
        this.initAnalytics = this.initAnalytics.bind(this);
    }

    async componentDidMount() {
        this.initAnalytics();

        let query = new URLSearchParams(this.props.location.search);
        if (query.get("te")) this.track(query.get("te"), this.props.location.pathname);

        /*
        this.unlisten = this.props.history.listen((location, action) => {
            let query = new URLSearchParams(location.search);
            if (query.get("te")) this.track(query.get("te"), location.pathname);
        });
        */
    }

    async track(email, url) {
        await Api.track({
            email: email,
            url: url
        });
    }
 
    initAnalytics() {
        //ReactGA.initialize("G-MVCRM3Q9JP");
        TagManager.initialize({ gtmId: "GTM-56RGKGP" });
        //ReactPixel.init("229916505302638", {}, { autoConfig: true, debug: false });
    }

    componentWillUnmount() {
        //this.unlisten();
    }

    render() {
        return(
            <div style={{ width: "100%" }}>{this.props.children}</div>
        )
    }
}

export default withRouter(AppContainer);