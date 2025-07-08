const exit = () => {
    localStorage.clear();
    window.location.href = '../../../index.html';
}

const ticketData = JSON.parse(localStorage.getItem('ticket'));
const clientName = ticketData.customerName;
const ticketNumber = ticketData.ticketCode;
const products = ticketData.products;
const total = ticketData.total;


async function downloadTicketPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    
    if (!ticketData) {
        alert("No hay datos del ticket disponibles.");
        return;
    }


    const now = new Date();
    const formattedDate = now.toLocaleString('es-AR');

    let y = 20;

    // Encabezado
    doc.setFontSize(14);
    doc.text("LA VINOTECA", 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(10);
    doc.text(`Cliente: ${clientName}`, 14, y);
    y += 6;
    doc.text(`Fecha: ${formattedDate}`, 14, y);
    y += 6;
    doc.text(`Ticket #: ${ticketNumber}`, 14, y);

    y += 10;
    doc.setFontSize(12);
    doc.text("Detalle de Productos", 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text("Producto", 14, y);
    doc.text("Cant.", 90, y);
    doc.text("P.Unit.", 120, y);
    doc.text("Subtotal", 160, y);

    y += 4;
    doc.line(14, y, 200, y);
    y += 5;

    // Productos
    products.forEach((product) => {
        if (y > 270) { // salto de página si se pasa
            doc.addPage();
            y = 20;
        }
        doc.text(product.name, 14, y);
        doc.text(String(product.quantity), 95, y, { align: "right" });
        doc.text(`$${product.price}`, 125, y, { align: "right" });
        doc.text(`$${product.subtotal}`, 170, y, { align: "right" });
        y += 6;
    });

    y += 6;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`TOTAL: $${total}`, 14, y);
    doc.setFont(undefined, 'normal');

    y += 20;
    doc.setFontSize(10);
    doc.text("¡Gracias por su compra!", 105, y, { align: "center" });

    doc.save(`ticket_${ticketNumber || 'sin_codigo'}.pdf`);
}


document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    const formattedDate = now.toLocaleString('es-AR', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    document.getElementById('ticket-client').textContent = clientName;
    document.getElementById('ticket-date').textContent = formattedDate;
    document.getElementById('ticket-number').textContent = ticketNumber;
    document.getElementById('ticket-total').textContent = `$${total}`;

    const productsContainer = document.getElementById('ticket-products');
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'ticket-product-item';
        div.innerHTML = `
            <div style="flex:1;min-width:0;">
                <div class="ticket-product-name">${product.name}</div>
                <div class="ticket-product-details">$${product.price} x ${product.quantity}</div>
            </div>
            <span class="ticket-product-subtotal">$${product.subtotal}</span>
        `;
        productsContainer.appendChild(div);
    });
});
