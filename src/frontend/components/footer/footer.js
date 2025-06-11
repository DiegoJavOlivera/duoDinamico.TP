class CustomFooter extends HTMLElement {
    constructor() {
      super();
      const cssURL = new URL('./footer.css', import.meta.url);
  
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <link rel="stylesheet" href="${cssURL}">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
        <footer class="footer">
          <div class="footer-container">
            <p class="footer-text">
              Desarrollado con 
              <i class="bi bi-heart-fill heart-icon"></i>
              por
              <span class="highlight">Priscilla Escobar</span>
              y
              <span class="highlight">Diego Olivera</span>
            </p>
          </div>
        </footer>
      `;
    }
  }
  
  customElements.define('custom-footer', CustomFooter);
  