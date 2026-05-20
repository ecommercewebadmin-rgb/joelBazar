import { airtableService } from '../services/airtableService.js';
import { confirmationModal } from '../components/ConfirmationModal.js';

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
        confirmationModal.confirm('Eliminar Producto', '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.', { danger: true }).then(confirmed => {
          if (confirmed) {
            this.deleteProduct(productId);
          }
        });
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
        p => {
          const catId = Array.isArray(p.categoria_id) ? p.categoria_id[0] : p.categoria_id;
          const category = this.categories.find(c => c.id === catId);
          const categoryName = category ? category.nombre : (catId || '-');
          
          return `
          <tr>
            <td>${p.nombre}</td>
            <td>${categoryName}</td>
            <td>$${p.precio}</td>
            <td>${p.stock}</td>
            <td>
              <button class="btn btn-sm btn-primary btn-edit" data-product-id="${p.id}">Editar</button>
              <button class="btn btn-sm btn-danger btn-delete" data-product-id="${p.id}">Eliminar</button>
            </td>
          </tr>
        `;
        }
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
      
      const catId = Array.isArray(product.categoria_id) ? product.categoria_id[0] : product.categoria_id;
      categorySelect.value = catId || '';
      
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
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

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
      confirmationModal.alert('Error', 'Hubo un problema al guardar el producto. Por favor, verifica los datos e intenta nuevamente.');
    }
  }

  async deleteProduct(productId) {
    try {
      await airtableService.deleteProduct(productId);
      this.loadInitialData();
    } catch (error) {
      confirmationModal.alert('Error', 'No se pudo eliminar el producto.');
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
