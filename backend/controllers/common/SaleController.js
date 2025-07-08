
const {getAllProductsById, reduceStock} = require("../../repository/productRepository");
const {createSale, getAllSales} = require("../../repository/saleRepository");
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


        const productsWithSubtotal = products.map(product => ({
            ...product,
            subtotal: product.price * product.quantity
        }));

        res.status(201).json({
            message: "Ticket created successfully",
            success: true,
            ticket: {
                ticketCode: ticketCode,
                customerName: nameCostumer,
                total: totalCalculated,
                products: productsWithSubtotal
            },
        });

    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: error.message, success: false });
    }
};


const getTickets = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        
        const result = await getAllSales(page, limit);
        
        if (!result || result.count === 0) {
            return res.status(404).json({ message: "No tickets found" });
        }
        
        const formattedTickets = result.rows.map(ticket => ({
            ticketCode: ticket.ticket_code,
            customerName: ticket.customer_name,
            total: ticket.total,
            createdAt: ticket.created_at,
            products: ticket.SaleDetails.map(detail => ({
                productName: detail.Product.name,
                quantity: detail.quantity,
                subtotal: detail.subtotal,
                price: detail.Product.price
            }))
        }));

        const totalPages = Math.ceil(result.count / limit);

        res.status(200).json({
            tickets: formattedTickets,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalTickets: result.count,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });        
    } catch (error) {
        console.error("Error getting tickets:", error);
        res.status(500).json({ message: error.message, success: false });
        
    }
}



module.exports = {
    createTicket,
    getTickets
}
