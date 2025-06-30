
const {getAllProductsById, reduceStock} = require("../../repository/productRepository");
const {createSale} = require("../../repository/saleRepository");
const {createSaleDetail} = require("../../repository/saleDetailRepository");


const createTicket = async (req, res) => {
    try {
        const { nameCostumer,
            products,
            total } = req.body;
        
        const id_products = products.map(product =>product.id);

        
        const productData = await getAllProductsById(id_products);

        if(productData.length !== id_products.length){
            return res.status(404).json({ message: "Some products not found" });
        }

        let totalCalculated = 0;
        const saleDetails = [];

        for (let i = 0; i < products.length; i++) {
            const { id, quantity } = products[i];
            const dbProduct = productData.find(p => p.id === id);

            if (!dbProduct) continue;

            const subtotal = dbProduct.price * quantity;
            totalCalculated += subtotal;

            saleDetails.push({
                product_id: dbProduct.id,
                quantity,
                total: parseFloat(dbProduct.price),
                subtotal
            });
        }

        if (totalCalculated !== total) {
            return res.status(400).json({ message: "Total does not match calculated total" });
        }

        for(let i = 0; i < products.length; i++){
            const { id, quantity } = products[i];
            const dbProduct = productData.find(p => p.id === id);

            if (!dbProduct) continue;

            if (dbProduct.stock < quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${dbProduct.name}` });
            }
            await reduceStock(id, quantity);
        }

        
        const newSale = await createSale({
            customer_name: nameCostumer,
            total: totalCalculated
        })


        const saleId = newSale.id;

        const saleDetailsWithSaleId = saleDetails.map(detail => ({
            ...detail,
            sale_id: saleId
        }));

        await createSaleDetail(saleDetailsWithSaleId);


        res.status(201).json({
            message: "Ticket created successfully",
            saleId: newSale.id,
            total: totalCalculated,
            saleDetails: saleDetailsWithSaleId
        });

    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createTicket
}