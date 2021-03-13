import { data } from "jquery";
import React from "react";

import { API_URL } from "./config";

export default class Api extends React.Component {

    constructor() {
        super();
    }
    
    // EXCEL FILE FOR ORDERS

    static async generateExcelTable(token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({});

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/orders/createExcel", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // TROUBLESHOOTING

    static async help(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify(data);

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/contact/help", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // STATUS

    static async getStatus() {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/status", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // AUTHENTIFICATION

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

    static async preRegister(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email: data.email,
            registeredInDoTerra: data.registeredInDoTerra,
            sampleId: data.sampleId
        });

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/auth/register/pre", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async billingRegister(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email: data.email,
            name: data.name,
            address: data.address,
            psc: data.psc,
            city: data.city,
            country: data.country,
            phone: data.phone
        });

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/auth/register/billing", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async codeRegister(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email: data.email
        });

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/auth/register/sendCode", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async passwordRegister(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email: data.email,
            code: data.code,
            password: data.password
        });

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/auth/register/finish", requestOptions)
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

    // PROFILE

    static async editUser(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify(data);

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

    // ADMIN

    static async getClient(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/users/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // STORE

    static async getProducts(filters) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify(filters)

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

    static async editProduct(id, data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify(data)

        var requestOptions = {
            method: "PATCH",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/products/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async deleteProduct(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var requestOptions = {
            method: "DELETE",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/products/" + id, requestOptions)
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
            isDoTerraProduct: data.isDoTerraProduct,
            points: data.points,
            name: data.name,
            description: data.description,
            tips: data.tips,
            eshop: data.eshop,
            problemType: data.problemType,
            topProduct: data.topProduct,
            label: data.label,
            link: data.link
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

    static async createOrder(data, action, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = {}

        if (action === "logged") {
            headers.append("auth-token", data.token);

            raw = JSON.stringify({
                products: data.products,
                applyDiscount: data.applyDiscount,
                buyingAsCompany: data.buyingAsCompany,
                shouldDeliver: data.shouldDeliver,
                birthDate: data.birthDate
            })
        } else if (action === "temp") {
            raw = JSON.stringify({
                products: data.products,
                userId: data.tempId,
                applyDiscount: data.applyDiscount,
                buyingAsCompany: data.buyingAsCompany,
                shouldDeliver: data.shouldDeliver,
                birthDate: data.birthDate
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

    static async skipPayment(orderId, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({
            orderId: orderId
        });

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/payments/skip", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // ORDERS

    static async getOrders(filters, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({
            filters: filters.filters,
            limit: filters.limit,
        })

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/orders", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }
    
    static async fulfillOrder(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var requestOptions = {
            method: "POST",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/orders/" + id + "/fulfill", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async sendOrder(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var requestOptions = {
            method: "POST",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/orders/" + id + "/send", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async cancelOrder(id, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var requestOptions = {
            method: "POST",
            headers: headers,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/orders/" + id + "/cancel", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // CONTACT

    static async sendMail(data) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message
        })
        
        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };
        
        return fetch(API_URL + "/api/contact/form", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    // BLOG AND NEWS

    static async createPost(data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify({
            name: data.name,
            description: data.description,
            html: data.html,
            type: data.type,
            locked: data.locked,
            link: data.link
        });

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/blogs", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async addImageToBlog(id, image, token) {
        var headers = new Headers();
        headers.append("auth-token", token);

        var formdata = new FormData();
        formdata.append("blogImage", image, "image.png");

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: formdata,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/blogs/" + id + "/image", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getPosts(filters) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var raw = JSON.stringify(filters);

        var requestOptions = {
            method: "POST",
            headers: headers,
            body: raw,
            redirect: "follow"
          };
          
        return fetch(API_URL + "/api/blogs/filter", requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async getPost(id) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");

        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
          
        return fetch(API_URL + "/api/blogs/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }

    static async editPost(id, data, token) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("auth-token", token);

        var raw = JSON.stringify(data);

        var requestOptions = {
            method: "PATCH",
            headers: headers,
            body: raw,
            redirect: "follow"
        };

        return fetch(API_URL + "/api/admin/blogs/" + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                return result
            })
            .catch(error => {
                return error
            });
    }
}