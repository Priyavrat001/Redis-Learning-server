export const getProductPromise = ()=>new Promise((resolve, reject)=>{
    setTimeout(() => {
        resolve({
            product:[
                {
                    id:1,
                    name: "Product 1",
                    price: "20"
                }
            ]
        })
    }, 2000);
})
export const getProductDetail = (id)=>new Promise((resolve, reject)=>{
    setTimeout(() => {
        resolve({
            product:[
                {
                    id:id,
                    name: `Product ${id}`,
                    price: Math.floor(Math.random() * id * 100)
                }
            ]
        })
    }, 2000);
})