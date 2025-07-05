const exit = () => {
    localStorage.clear();
    moveToWelcome();
}

function downloadTicketPDF() {
    const element = document.querySelector('.ticket-card');
    const options = {
        margin: [10, 10, 10, 10],
        filename: 'ticket.pdf',
        image: { type: 'jpeg', quality: 0.9 },
        html2canvas: { 
            scale: 2,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'A4', 
            orientation: 'portrait' 
        }
    };
    console.log(element);
    html2pdf().set(options).from(element).save();
};

// ticket.js - Renderiza el ticket dinámicamente desde localStorage
document.addEventListener('DOMContentLoaded', () => {
    const ticketData = JSON.parse(localStorage.getItem('ticket'));
    const clientName = ticketData?.client || localStorage.getItem('userName') || 'Cliente';
    const ticketNumber = ticketData?.ticketNumber || Date.now();
    const products = ticketData?.products || [];
    const total = ticketData?.total || 0;
    
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
