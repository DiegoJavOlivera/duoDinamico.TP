
const {getAllProductsById, reduceStock} = require("../../repository/productRepository");
const {createSale} = require("../../repository/saleRepository");
const {createSaleDetail} = require("../../repository/saleDetailRepository");
const {nanoid} = require("nanoid");

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

        products.forEach(({ id, quantity }) => {
            const dbProduct = productData.find(p => p.id === id);
            if (!dbProduct) return; 

            const subtotal = dbProduct.price * quantity;
            totalCalculated += subtotal;

            saleDetails.push({
                product_id: dbProduct.id,
                quantity,
                subtotal: parseFloat(subtotal)
            });
        });

        if (totalCalculated !== total) {
            return res.status(400).json({ message: "Total does not match calculated total" });
        }

        const ticketCode = nanoid(8);
        
        const newSale = await createSale({
            ticket_code: ticketCode,
            customer_name: nameCostumer,
            total: totalCalculated
        })


        const saleId = newSale.id;

        const saleDetailsWithSaleId = saleDetails.map(detail => ({
            ...detail,
            sale_id: saleId
        }));

        await createSaleDetail(saleDetailsWithSaleId);
        
        for(const {id, quantity} of products) {
            await reduceStock(id, quantity);
        }


        res.status(201).json({
            message: "Ticket created successfully",
            saleId: ticketCode,
        });

    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createTicket
}