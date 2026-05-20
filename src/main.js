import { App } from './app.js';
import { getHomeController } from './pages/homeController.js';
import { getCartUIController } from './components/CartUIController.js';

try {
  const app = new App();
  getHomeController();
  getCartUIController();
} catch (error) {
}
