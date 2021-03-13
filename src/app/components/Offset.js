import React from "react";

export default class Offset extends React.Component {
    
    state = {
        height: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        var header = document.getElementById("header");

        this.setState({ height: header.offsetHeight });

        window.addEventListener("resize", this.updateOffset.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateOffset.bind(this));
    }

    transitionCookies() {
        var header = document.getElementById("header");

        this.setState({ height: header.clientHeight });
    }

    updateOffset() {
        var header = document.getElementById("header");

        this.setState({ height: header.clientHeight });
        this.forceUpdate();
    }

    render() {
        const height = parseInt(this.state.height);

        return(
            <div id="offset" style={{ width: "100%", height: height, /*transition: "height 300ms"*/ }}></div>
        )
    }
}