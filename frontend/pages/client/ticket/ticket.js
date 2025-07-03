const exit = () => {
    localStorage.clear();
    moveToWelcome();
}

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
