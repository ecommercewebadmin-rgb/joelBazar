import { templates } from './components/templates.js';
import { getHomeController } from './pages/homeController.js';
import { getDetailController } from './pages/detailController.js';
import { getCheckoutController } from './pages/checkoutController.js';

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
        e.preventDefault();
        const route = link.getAttribute('href');
        this.navigate(route);
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
    let view = route.replace('#/', '').split('?')[0] || 'home';
    
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
      }
    }
  }
}
