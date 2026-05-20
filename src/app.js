import { templates } from './components/templates.js';
import { getHomeController } from './pages/homeController.js';

export class App {
  constructor() {
    this.currentView = 'home';
    this.init();
  }

  init() {
    this.renderLayout();
    
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#/"]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('href');
        this.navigate(route);
      }
    });

    this.navigate('#/home');
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
    const view = route.replace('#/', '').split('?')[0] || 'home';
    this.showView(`${view}-view`);
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
      }
    }
  }
}
