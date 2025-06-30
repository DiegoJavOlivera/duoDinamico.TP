
const {getAllProductsById, reduceStock} = require("../../repository/productRepository");
const {createSale} = require("../../repository/saleRepository");
const {createSaleDetail} = require("../../repository/saleDetailRepository");


const createTicket = async (req, res) => {
    try {
        const { nameCostumer,
            products,
            total } = req.body;
        console.log("Received request to create ticket with data:", req.body);

        const id_products = products.map(product =>product.id);

        console.log("Extracted product IDs:", id_products);
        
        const productData = await getAllProductsById(id_products);

        if(productData.length !== id_products.length){
            return res.status(404).json({ message: "Some products not found" });
        }

        let totalCalculated = 0;
        const saleDetails = [];

        for (let i = 0; i < products.length; i++) {
            const { id, quantity } = products[i];
            const dbProduct = productData.find(p => p.id === id);
            console.log(`Processing product ID ${id} with quantity ${quantity}`);

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
        console.log("Total calculated from products:", totalCalculated);
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
        console.log("All products have sufficient stock and stock has been reduced");
        
        const newSale = await createSale({
            customer_name: nameCostumer,
            total: totalCalculated
        })

        console.log("Sale created successfully:", newSale);

        const saleId = newSale.id;

        const saleDetailsWithSaleId = saleDetails.map(detail => ({
            ...detail,
            sale_id: saleId
        }));
        console.log("Sale details with sale ID:", saleDetailsWithSaleId);

        await createSaleDetail(saleDetailsWithSaleId);
        console.log("Sale details created successfully");

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