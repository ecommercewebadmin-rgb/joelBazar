import { airtableService } from '../services/airtableService.js';

export class AdminProductsController {
  constructor() {
    this.products = [];
    this.categories = [];
  }

  init() {
    this.loadInitialData();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('new-product-btn')?.addEventListener('click', () => {
      this.showProductForm(null);
    });

    window.addEventListener('click', e => {
      if (e.target.classList.contains('btn-edit')) {
        const productId = e.target.dataset.productId;
        const product = this.products.find(p => p.id === productId);
        this.showProductForm(product);
      }

      if (e.target.classList.contains('btn-delete')) {
        const productId = e.target.dataset.productId;
        if (confirm('¿Eliminar este producto?')) {
          this.deleteProduct(productId);
        }
      }
    });

    document.getElementById('save-product-btn')?.addEventListener('click', () => {
      this.saveProduct();
    });
  }

  async loadInitialData() {
    try {
      const [products, categories] = await Promise.all([
        airtableService.getProducts(),
        airtableService.getCategories()
      ]);
      this.products = products;
      this.categories = categories;
      this.renderTable();
    } catch (error) {
      alert('Error cargando datos iniciales');
    }
  }

  renderTable() {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;
    tbody.innerHTML = this.products
      .map(
        p => `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.categoria_id || '-'}</td>
        <td>$${p.precio}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn btn-sm btn-primary btn-edit" data-product-id="${p.id}">Editar</button>
          <button class="btn btn-sm btn-danger btn-delete" data-product-id="${p.id}">Eliminar</button>
        </td>
      </tr>
    `
      )
      .join('');
  }

  showProductForm(product) {
    const modalEl = document.getElementById('productModal');
    const modal = new bootstrap.Modal(modalEl);
    const form = document.getElementById('product-form');
    const categorySelect = document.getElementById('product-category');

    // Poblado del desplegable de categorías
    categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>' + 
      this.categories.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('');

    if (product) {
      document.getElementById('productModalTitle').textContent = 'Editar Producto';
      document.getElementById('product-name').value = product.nombre;
      document.getElementById('product-description').value = product.descripcion;
      document.getElementById('product-price').value = product.precio;
      document.getElementById('product-stock').value = product.stock;
      categorySelect.value = product.categoria_id;
      document.getElementById('product-image').value = product.imagen_url;
      document.getElementById('product-colors').value = product.colores || '';
      document.getElementById('product-sizes').value = product.tallas || '';
      form.dataset.productId = product.id;
    } else {
      document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
      form.reset();
      delete form.dataset.productId;
    }

    modal.show();
  }

  async saveProduct() {
    const form = document.getElementById('product-form');
    const productId = form.dataset.productId;
    const data = {
      nombre: document.getElementById('product-name').value,
      descripcion: document.getElementById('product-description').value,
      precio: parseFloat(document.getElementById('product-price').value),
      stock: parseInt(document.getElementById('product-stock').value),
      categoria_id: document.getElementById('product-category').value,
      imagen_url: document.getElementById('product-image').value,
      colores: document.getElementById('product-colors').value,
      tallas: document.getElementById('product-sizes').value,
    };

    try {
      if (productId) {
        await airtableService.updateRecord('Productos', productId, data);
      } else {
        await airtableService.createRecord('Productos', data);
      }

      bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
      this.loadInitialData();
    } catch (error) {
      alert('Error guardando producto');
    }
  }

  async deleteProduct(productId) {
    try {
      await airtableService.deleteProduct(productId);
      this.loadInitialData();
    } catch (error) {
      alert('Error eliminando producto');
    }
  }
}

let adminProductsController;
export function getAdminProductsController() {
  if (!adminProductsController) {
    adminProductsController = new AdminProductsController();
  }
  return adminProductsController;
}
