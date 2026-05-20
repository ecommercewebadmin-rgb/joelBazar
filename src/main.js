// Punto de entrada de la aplicación
console.log('🚀 joelBazar cargando...');

// Importar servicios y componentes cuando estén listos
// import { initializeApp } from './app.js';

// Elemento raíz de la SPA
const appRoot = document.getElementById('app');

if (!appRoot) {
  console.error('❌ No se encontró elemento #app en el HTML');
} else {
  console.log('✅ Elemento #app encontrado');
  // Aquí se inicializará la aplicación
  // initializeApp(appRoot);
}

// Exportar para testing
export { appRoot };
