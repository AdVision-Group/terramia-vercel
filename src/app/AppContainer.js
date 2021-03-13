import React from "react";
import { withRouter } from "react-router-dom";

import ReactGA from "react-ga";
import TagManager from "react-gtm-module";
import ReactPixel from "react-facebook-pixel";

class AppContaner extends React.Component {

    constructor() {
        super();

        this.initAnalytics = this.initAnalytics.bind(this);
    }

    componentDidMount() {
        this.initAnalytics();

        /*
        this.unlisten = this.props.history.listen((location, action) => {
            ReactGA.pageview(location.pathname);
        });
        */
    }

    initAnalytics() {
        //ReactGA.initialize("G-MVCRM3Q9JP");
        TagManager.initialize({ gtmId: "GTM-56RGKGP" });
        //ReactPixel.init("229916505302638", {}, { autoConfig: true, debug: false });
    }

    componentWillUnmount() {
        /*
        this.unlisten();
        */
    }

    render() {
        return(
            <div style={{ width: "100%" }}>{this.props.children}</div>
        )
    }
}

export default withRouter(AppContaner);