import { airtableService } from '../services/airtableService.js';
import { cartService } from '../services/cartService.js';
import { confirmationModal } from '../components/ConfirmationModal.js';
import { Skeleton } from '../components/SkeletonLoader.js';
import { debounce } from '../utils/helpers.js';
import { Toast } from '../components/Toast.js';

export class HomeController {
  constructor() {
    this.products = [];
    this.categories = [];
    this.filteredProducts = [];
    this.activeCategory = null;
    this.searchTerm = '';
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadData();
  }

  setupElements() {
    this.container = document.getElementById('products-container');
    this.searchInput = document.getElementById('search-input');
    this.searchForm = document.getElementById('search-form');
    this.categoryContainer = document.getElementById('categories-container');
    this.noProductsMsg = document.getElementById('no-products-message');
  }

  setupEventListeners() {
    this.searchInput?.addEventListener(
      'input',
      debounce(() => this.handleSearch(), 300)
    );

    this.searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    this.categoryContainer?.addEventListener('click', (e) => {
      if (e.target.dataset.category) {
        this.handleCategoryFilter(e.target.dataset.category);
      }
    });

    this.container?.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-add-to-cart')) {
        this.handleAddToCart(e.target.dataset.productId);
      }
    });

    this.container?.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-view-detail')) {
        const productId = e.target.dataset.productId;
        window.location.hash = `#/detalle?id=${productId}`;
      }
    });
  }

  async loadData() {
    try {
      Skeleton.renderProductCards(this.container);

      const [products, categories] = await Promise.all([
        airtableService.getProducts(),
        airtableService.getCategories(),
      ]);

      this.products = products;
      this.categories = categories;

      this.renderCategories();
      this.applyFilters();
    } catch (error) {
      if (this.container) {
        this.container.innerHTML = '<p class="text-danger">Error cargando productos. Verifica las credenciales en el .env</p>';
      }
    }
  }

  renderCategories() {
    if (!this.categoryContainer) return;
    const html = `
      <button class="btn btn-outline-primary ${!this.activeCategory ? 'active' : ''}" 
              data-category="all">
        Todas
      </button>
      ${this.categories
        .map(
          cat => `
        <button class="btn btn-outline-primary ${
          this.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
          ${cat.nombre}
        </button>
      `
        )
        .join('')}
    `;

    this.categoryContainer.innerHTML = html;
  }

  handleSearch() {
    this.searchTerm = (this.searchInput?.value || '').toLowerCase();
    this.applyFilters();
  }

  handleCategoryFilter(categoryId) {
    this.activeCategory = categoryId === 'all' ? null : categoryId;
    this.renderCategories();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      let matchCategory = !this.activeCategory;

      if (this.activeCategory) {
        const productCat = product.categoria_id;
        const activeCatObj = this.categories.find(c => c.id === this.activeCategory);
        const activeCatName = activeCatObj ? activeCatObj.nombre : null;

        if (Array.isArray(productCat)) {
          matchCategory = productCat.includes(this.activeCategory) || 
                         productCat.some(id => id === activeCatName);
        } else if (typeof productCat === 'string') {
          matchCategory = (productCat === this.activeCategory || productCat === activeCatName);
        }
      }

      const matchSearch =
        !this.searchTerm ||
        (product.nombre && product.nombre.toLowerCase().includes(this.searchTerm)) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(this.searchTerm));

      return matchCategory && matchSearch;
    });



    this.renderProducts();
  }

  renderProducts() {
    if (!this.container) return;
    if (this.filteredProducts.length === 0) {
      this.container.innerHTML = '';
      if (this.noProductsMsg) this.noProductsMsg.style.display = 'block';
      return;
    }

    if (this.noProductsMsg) this.noProductsMsg.style.display = 'none';

    const html = this.filteredProducts
      .map(
        product => `
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card h-100 shadow-sm">
           <img src="${product.imagen_url}" class="card-img-top" 
                alt="${product.nombre}" style="height: 220px; object-fit: contain; width: 100%; background-color: #f8f9fa;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.nombre}</h5>
            <p class="card-text text-muted small">${product.descripcion?.substring(0, 100)}...</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <span class="fw-bold fs-5 text-success">$${product.precio}</span>
              <small class="text-muted">Stock: ${product.stock}</small>
            </div>
             <div class="d-flex gap-2 mt-3">
               <button class="btn btn-light border flex-grow-1 fw-semibold btn-view-detail" 
                       data-product-id="${product.id}">
                 Ver detalle
               </button>
                <button class="btn btn-primary flex-grow-1 fw-semibold btn-add-to-cart" 
                       data-product-id="${product.id}"
                       ${product.stock <= 0 ? 'disabled' : ''}>
                  ${product.stock <= 0 ? 'Agotado' : 'Agregar'}
                </button>
             </div>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    this.container.innerHTML = html;
  }

  handleAddToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
      confirmationModal.alert('No disponible', 'Este producto ya no tiene stock disponible.');
      return;
    }
    cartService.addToCart(product);
    Toast.show(`${product.nombre} ha sido agregado al carrito correctamente`, 'success');
  }
}

let homeController;
export function getHomeController() {
  if (!homeController) {
    homeController = new HomeController();
  }
  return homeController;
}
