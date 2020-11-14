import React from "react";

import { API_URL } from "./config";

export default class Api extends React.Component {

    constructor() {
        super();
    }

    static async login(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email : data.email,
            password : data.password
        })
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        var token = null
        
        return fetch(API_URL + "/api/auth/login", requestOptions)
            .then(response => {
                if (response.headers.get("auth-token")) {
                    return {
                        token: response.headers.get("auth-token")
                    }
                } else {
                    return response.json()
                }
            })
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async register(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email: data.email,
            password: data.password,
        });

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/auth/register", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async editUser(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({
            ...data
        });

        var requestOptions = {
            method: "PATCH",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/user/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async changePassword(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({
            oldPassword: data.oldPassword,
            password: data.password
        })

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/user/password", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async resetPassword(password, secret) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            password: password,
            resetSecret: secret
        })
        
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/auth/reset", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async forgotPassword(email) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email: email.trim()
        })
            
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/auth/forgot", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async requestSamples(sample, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({
            type: sample
        })

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/user/requestSamples", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getUser(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/user/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getProducts(filters) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            filterBy: filters.filterBy,
            sortBy: filters.sortBy,
            limit: filters.limit,
            query: filters.query
        })

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/store/products", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getProduct(id) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/store/products/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async createProduct(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({
            type: data.type,
            category: data.category,
            price: data.price,
            name: data.name,
            description: data.description,
            eshop: data.eshop
        })

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/products/create", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async addImage(id, image, token) {
        var headers = new Headers();
        headers.append("auth-token", token);

        var formdata = new FormData();
        formdata.append("productImage", image, "image.png");

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: formdata,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/products/" + id + "/image", requestOptions)
            .then(response => response.text())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async createOrder(ids, id, action, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = {}

        if (action === "logged") {
            headers.append("auth-token", token);
            raw = JSON.stringify({
                products: ids
            })
        } else if (action === "temp") {
            raw = JSON.stringify({
                products: ids,
                userId: id
            })
        }

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/store/order", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async tempUser(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            psc: data.psc,
            country: data.country
        })

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        return fetch(API_URL + "/api/store/tempUser", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }
}