import { App } from './app.js';
import { getHomeController } from './pages/homeController.js';

try {
  const app = new App();
  getHomeController();
} catch (error) {
  // Manejo silencioso de errores críticos en producción
}
