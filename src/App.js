import React from 'react';

import Router from "./app/Router";
import Maintenance from "./app/Maintenance";

import Api from "./app/config/Api";

export default class App extends React.Component {

  state = {
    maintenance: false,
    loading: true
  }

  constructor() {
    super();

    this.loadLocalStorage = this.loadLocalStorage.bind(this);
  }

  async componentDidMount() {
    this.setState({ loading: true });
    this.loadLocalStorage();

    const call = await Api.getStatus();

    if (call.status) {
      const status = call.status;

      this.setState({
        maintenance: status.underMaintenance
      });
    } else {
      this.setState({ maintenance: false });
    }

    this.setState({ loading: false });
  }

  loadLocalStorage() {
    if (!localStorage.getItem("cart")) { 
      localStorage.setItem("cart", JSON.stringify([]))
    }

    if (!localStorage.getItem("cookies")) {
      localStorage.setItem("cookies", JSON.stringify("disabled"));
    }
  }

  render() {
    if (this.state.loading) return null;

    if (this.state.maintenance) return <Maintenance />;

    return <Router />;
  }
}