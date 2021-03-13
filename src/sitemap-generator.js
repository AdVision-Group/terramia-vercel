require("babel-register")({
    presets: ["es2015", "react"]
});

const API_URL = "https://coronashop.store:8443";

const api = require("./app/config/Api").default;

const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;


async function generateSitemap() {
    try {
        const products = await api.getProducts({ filters: {}, sortBy: {} });

        var productLinks = [];

        for (let i = 0; i < products.products.length; i++) {
            productLinks.push({ id: products.products[i].link });
        }

        const paramsConfig = {
            "/e-shop/:link": productLinks
        };

        return (
            new Sitemap(router)
                .applyParams(paramsConfig)
                .build("localhost:3000")
                .save("./public/sitemap.xml")
        );
    } catch(e) {
        console.log(e);
    } 
}

generateSitemap();