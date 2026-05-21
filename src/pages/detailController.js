import { airtableService } from '../services/airtableService.js';
import { cartService } from '../services/cartService.js';
import { confirmationModal } from '../components/ConfirmationModal.js';
import { Skeleton } from '../components/SkeletonLoader.js';
import { Toast } from '../components/Toast.js';

export class DetailController {
  constructor() {
    this.product = null;
    this.selectedColor = null;
    this.selectedSize = null;
    this.quantity = 1;
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.loadProduct();
  }

  setupElements() {
    this.view = document.getElementById('product-detail-view');
    this.content = document.getElementById('detail-content');
    this.backBtn = document.getElementById('back-btn');
  }

  setupEventListeners() {
    this.backBtn?.addEventListener('click', () => window.location.hash = '#/home');
  }

  async loadProduct() {
    try {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.split('?')[1]);
      const productId = params.get('id');

      if (!productId) {
        this.content.innerHTML = '<div class="text-center py-5"><p class="text-danger">Producto no encontrado</p></div>';
        return;
      }

      // Resetear selecciones al cargar un nuevo producto
      this.selectedColor = null;
      this.selectedSize = null;
      this.quantity = 1;

      Skeleton.renderProductDetail(this.content);

      const [product, categories] = await Promise.all([
        airtableService.getRecord('Productos', productId),
        airtableService.getCategories()
      ]);

      this.product = product;
      this.categories = categories;
      this.renderProduct();
    } catch (error) {
      this.content.innerHTML = '<div class="text-center py-5"><p class="text-danger">Error cargando producto</p></div>';
    }
  }

  renderProduct() {
    if (!this.product) return;

    const product = this.product;
    
    // Resolver nombre de categoría
    const categoryId = Array.isArray(product.categoria_id) ? product.categoria_id[0] : product.categoria_id;
    const category = this.categories?.find(c => c.id === categoryId);
    const categoryName = category ? category.nombre : (categoryId || 'General');
    
    // Procesar atributos
    let colorsHtml = '';
    if (product.colores) {
      try {
        const colors = JSON.parse(product.colores);
        if (colors.length > 0) {
          colorsHtml = `
            <div class="mb-4" id="colors-section">
              <label class="form-label"><strong>Color</strong></label>
              <div class="d-flex gap-2" id="colors-list">
                ${colors.map(c => `<button class="btn btn-outline-secondary btn-color" data-color="${c}">${c}</button>`).join('')}
              </div>
            </div>`;
        }
      } catch (e) {}
    }

    let sizesHtml = '';
    if (product.tallas) {
      try {
        const sizes = JSON.parse(product.tallas);
        if (sizes.length > 0) {
          sizesHtml = `
            <div class="mb-4" id="sizes-section">
              <label class="form-label"><strong>Talla</strong></label>
              <div class="d-flex gap-2 flex-wrap" id="sizes-list">
                ${sizes.map(s => `<button class="btn btn-outline-secondary btn-size" data-size="${s}">${s}</button>`).join('')}
              </div>
            </div>`;
        }
      } catch (e) {}
    }

    const isOutOfStock = product.stock <= 0;

    this.content.innerHTML = `
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="card border-0">
            <img src="${product.imagen_url}" class="card-img-top object-fit-contain bg-light p-3" 
                 alt="${product.nombre}" style="height: 400px; object-fit: contain;">
          </div>
        </div>
        <div class="col-12 col-md-6">
          <h1 class="mb-3">${product.nombre}</h1>
          <div class="mb-3"><span class="badge bg-secondary">${categoryName}</span></div>
          <div class="mb-4"><span class="fs-3 fw-bold text-success">$${product.precio}</span></div>
          <div class="mb-4 p-3 bg-light rounded">
            <strong id="stock-status">${isOutOfStock ? 'Producto no disponible' : `Stock disponible: ${product.stock}`}</strong>
          </div>
          <div class="mb-4">
            <h6>Descripción</h6>
            <p class="text-muted">${product.descripcion || 'Sin descripción disponible'}</p>
          </div>
          ${colorsHtml}
          ${sizesHtml}
          <div class="mb-4">
            <label class="form-label"><strong>Cantidad</strong></label>
            <div class="input-group" style="width: fit-content;">
              <button class="btn btn-outline-secondary" id="qty-decrease">−</button>
              <input type="number" class="form-control text-center" id="qty-input" value="1" min="1" style="width: 60px;">
              <button class="btn btn-outline-secondary" id="qty-increase">+</button>
            </div>
          </div>
           <div class="d-grid gap-3 d-md-flex">
              <button class="btn btn-outline-primary btn-lg flex-grow-1 fw-bold" id="add-to-cart-btn" ${isOutOfStock ? 'disabled' : ''}>🛒 Agregar al carrito</button>
              <button class="btn btn-primary btn-lg flex-grow-1 fw-bold" id="buy-now-btn" ${isOutOfStock ? 'disabled' : ''}>⚡ Comprar ahora</button>
            </div>
        </div>
      </div>
    `;

    this.setupDynamicEventListeners();
  }

  setupDynamicEventListeners() {
    const qtyInput = document.getElementById('qty-input');
    const qtyDecrease = document.getElementById('qty-decrease');
    const qtyIncrease = document.getElementById('qty-increase');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');

    if (qtyDecrease) qtyDecrease.addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        qtyInput.value = this.quantity;
      }
    });

    if (qtyIncrease) qtyIncrease.addEventListener('click', () => {
      if (this.quantity < this.product.stock) {
        this.quantity++;
        qtyInput.value = this.quantity;
      } else {
        confirmationModal.alert('Stock agotado', 'No hay más unidades disponibles de este producto.');
      }
    });

    if (addToCartBtn) addToCartBtn.addEventListener('click', () => this.handleAddToCart());
    if (buyNowBtn) buyNowBtn.addEventListener('click', () => this.handleBuyNow());

    document.querySelectorAll('.btn-color').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.btn-color').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedColor = e.target.dataset.color;
      });
    });

    document.querySelectorAll('.btn-size').forEach(btn => {
      btn.addEventListener('click', e => {
        document.querySelectorAll('.btn-size').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedSize = e.target.dataset.size;
      });
    });
  }

  validateSelection() {
    if (this.product.colores) {
      try {
        const colors = JSON.parse(this.product.colores);
        if (colors.length > 0 && !this.selectedColor) {
          confirmationModal.alert('Selección requerida', 'Por favor, selecciona un color antes de agregar al carrito.');
          return false;
        }
      } catch (e) {}
    }
    if (this.product.tallas) {
      try {
        const sizes = JSON.parse(this.product.tallas);
        if (sizes.length > 0 && !this.selectedSize) {
          confirmationModal.alert('Selección requerida', 'Por favor, selecciona una talla antes de agregar al carrito.');
          return false;
        }
      } catch (e) {}
    }
    return true;
  }

  handleAddToCart() {
    if (!this.validateSelection()) return;

    try {
      cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
      Toast.show(`${this.product.nombre} ha sido agregado al carrito correctamente`, 'success');
      const cartBtn = document.querySelector('[data-bs-target="#cartOffcanvas"]');
      if (cartBtn) cartBtn.click();
      this.quantity = 1;
      const qtyInput = document.getElementById('qty-input');
      if (qtyInput) qtyInput.value = 1;
    } catch (error) {
      confirmationModal.alert('Error', error.message || 'Hubo un problema al agregar el producto al carrito.');
    }
  }

  handleBuyNow() {
    if (!this.validateSelection()) return;

    try {
      cartService.addToCart(this.product, this.quantity, this.selectedColor, this.selectedSize);
      window.location.hash = '#/checkout';
    } catch (error) {
      alert('Error en la compra');
    }
  }
}

let detailController;
export function getDetailController() {
  if (!detailController) {
    detailController = new DetailController();
  }
  return detailController;
}
