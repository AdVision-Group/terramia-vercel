import React from "react";
import SmoothScroll from "../config/SmoothScroll";

export default class Arrow extends React.Component {

    state = {
        opacity: 0
    }

    constructor() {
        super();

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    
    handleScroll(event) {
        if (window.pageYOffset > 400) {
            this.setState({ opacity: 1 });
        } else {
            this.setState({ opacity: 0 });
        }
    }

    render() {
        return(
            <ion-icon onClick={() => SmoothScroll.scroll("#top")} name="arrow-up-outline" style={{
                position: "fixed",
                right: 50,
                bottom: 50,

                color: "white",
                width: 30,
                height: 30,

                padding: 10,

                borderRadius: "50%",

                backgroundColor: "#A161B3",

                opacity: this.state.opacity,

                transition: "all 300ms"
            }}></ion-icon>
        )
    }
}