import { templates } from './components/templates.js';
import { getHomeController } from './pages/homeController.js';
import { getDetailController } from './pages/detailController.js';
import { getCheckoutController } from './pages/checkoutController.js';
import { getAdminLoginController } from './pages/adminLoginController.js';
import { getAdminProductsController } from './pages/adminProductsController.js';
import { getAdminOrdersController } from './pages/adminOrdersController.js';
import { authService } from './services/authService.js';

export class App {
  constructor() {
    this.currentView = 'home';
    this.init();
  }

  init() {
    this.renderLayout();
    
    window.addEventListener('hashchange', () => {
      this.navigate(window.location.hash);
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#/"]');
      if (link) {
        // Dejamos que el navegador cambie el hash y dispare 'hashchange'
      }

      if (e.target.id === 'nav-login') {
        window.location.hash = '#/login';
      }
    });

    this.navigate(window.location.hash || '#/home');
  }

  renderLayout() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
      ${templates.header}
      <main id="app-content"></main>
      ${templates.footer}
    `;
  }

  navigate(route) {
    if (!route) return;
    
    if (route.startsWith('#/') && window.location.hash !== route) {
      window.location.hash = route;
      return;
    }
    
    const view = route.replace('#/', '').split('?')[0] || 'home';
    const viewMapping = {
      'home': 'home-view',
      'detalle': 'product-detail-view',
      'checkout': 'checkout-view',
      'confirmacion': 'payment-confirmation-view',
      'login': 'admin-login-view',
      'admin': 'admin-dashboard-view'
    };

    const viewId = viewMapping[view] || `${view}-view`;
    this.showView(viewId);
  }

  showView(viewId) {
    const content = document.getElementById('app-content');
    if (!content) return;

    if (viewId === 'admin-dashboard-view' && !authService.isAuthenticated()) {
      this.navigate('#/login');
      return;
    }

    const template = templates[viewId];
    if (template) {
      content.innerHTML = template;
      window.scrollTo(0, 0);
      
      if (viewId === 'home-view') {
        getHomeController().init();
      } else if (viewId === 'product-detail-view') {
        getDetailController().init();
      } else if (viewId === 'checkout-view') {
        getCheckoutController().init();
      } else if (viewId === 'admin-login-view') {
        getAdminLoginController().init();
      } else if (viewId === 'admin-dashboard-view') {
        getAdminProductsController().init();
        getAdminOrdersController().init();
        
        document.getElementById('logout-btn')?.addEventListener('click', () => {
          authService.logout();
          this.navigate('#/home');
        });
      }
    }
  }
}
