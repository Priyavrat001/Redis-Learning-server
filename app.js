import express from "express";
import { getProductDetail, getProductPromise } from "./api/products.js";
import Redis from "ioredis";
import dotenv from "dotenv";
import { getProduct } from "./middleware/cache.js";

dotenv.config({})

const app = express();
const port = 4000;
export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

redis.on("connect", ()=>{
    console.log("Redis connected successfully");
})

app.get("/products", getProduct("products"), async(req, res) => {

    const products = await getProductPromise();

    // seting time limit in products key usin setex
    await redis.setex("products", 20, JSON.stringify(products));

    return res.json({products});
});

app.get("/product/:id", async(req, res)=>{
    const id = req.params.id;

    const key = `product:${id}`;

    let product = await redis.get(key);
    if(product){
        return res.json({product: JSON.parse(product)});
    }
    product = await getProductDetail(id);
    await redis.set(key, JSON.stringify(product))

    res.json({product});
});

app.get("/order/:id", async(req, res)=>{
    const productId = req.params.id;
    const key = `product:${productId}`;

    await redis.del(key)

    return res.json({
        message: `Order placed successfully ${productId}`
    });
})


app.listen(port, ()=>{
    console.log(`app is running on port ${port}`)
})