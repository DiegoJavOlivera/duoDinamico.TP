class CustomNavbar extends HTMLElement {
    constructor() {
      super();
      const cssURL = new URL('./navbar.css', import.meta.url);
  
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <link rel="stylesheet" href="${cssURL}">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
        />
        <nav class="navbar">
          <div class="navbar-container">
            <div class="navbar-logo" id="go-home">
              <div class="navbar-icon">
                <i class="bi bi-cup"></i>
              </div>
              <div class="navbar-title">
                <h1>BarServe</h1>
                <p>Autoservicio Premium</p>
              </div>
            </div>
            <div class="navbar-actions">
              <button id="go-admin" class="admin-button">
                <i class="bi bi-shield"></i>
                Admin
              </button>
              <button id="toggle-theme" class="theme-toggle">
                <i class="bi bi-moon"></i>
              </button>
            </div>
          </div>
        </nav>
      `;

      this.shadowRoot.getElementById('go-admin').addEventListener('click', () => {
        window.location.href = '/frontend/pages/admin/login/login.html'; // Cambiá esto según tu estructura
      });
    }
    
  }
  
  customElements.define('custom-navbar', CustomNavbar);
  