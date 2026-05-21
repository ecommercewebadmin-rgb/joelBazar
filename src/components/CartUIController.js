import { cartService } from '../services/cartService.js';
import { confirmationModal } from './ConfirmationModal.js';

export class CartUIController {
  constructor() {
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.render();
  }

  setupElements() {
    this.itemsContainer = document.getElementById('cart-items-container');
    this.totalElement = document.getElementById('cart-total');
    this.checkoutBtn = document.getElementById('checkout-btn');
    this.clearBtn = document.getElementById('clear-cart-btn');
    this.cartCountBadge = document.getElementById('cart-count');
  }

  setupEventListeners() {
    window.addEventListener('cartChanged', () => this.render());

    this.clearBtn?.addEventListener('click', async () => {
      const confirmed = await confirmationModal.confirm('Vaciar Carrito', '¿Estás seguro de que deseas eliminar todos los productos del carrito?');
      if (confirmed) {
        cartService.clearCart();
        this.render();
      }
    });

    this.checkoutBtn?.addEventListener('click', () => {
      const cart = cartService.getCart();
      if (cart.length > 0) {
        const cartOffcanvas = document.getElementById('cartOffcanvas');
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(cartOffcanvas);
        if (offcanvasInstance) offcanvasInstance.hide();
        window.location.hash = '#/checkout';
      }
    });
  }

  render() {
    const cart = cartService.getCart();
    const total = cartService.getTotal();

    if (!this.itemsContainer) return;

    if (cart.length === 0) {
      this.itemsContainer.innerHTML = `
        <div class="text-center py-5">
          <div class="mb-3">
            <span style="font-size: 4rem; opacity: 0.5;">🛒</span>
          </div>
          <h5 class="fw-bold text-dark">Tu carrito está vacío</h5>
          <p class="text-muted">Parece que aún no has agregado productos.</p>
        </div>
      `;
      if (this.checkoutBtn) this.checkoutBtn.disabled = true;
      if (this.clearBtn) this.clearBtn.disabled = true;
      if (this.cartCountBadge) this.cartCountBadge.textContent = '0';
      if (this.totalElement) this.totalElement.textContent = '$0';
      return;
    }

    if (this.checkoutBtn) this.checkoutBtn.disabled = false;
    if (this.clearBtn) this.clearBtn.disabled = false;
    if (this.cartCountBadge) this.cartCountBadge.textContent = cartService.getItemCount();
    if (this.totalElement) this.totalElement.textContent = `$${total.toLocaleString('es-AR')}`;

    const html = cart
      .map(
        item => `
      <div class="card mb-3 border-0 shadow-sm cart-item-card">
        <div class="card-body p-3">
          <div class="d-flex gap-3">
            <img src="${item.imagen_url}" class="rounded" alt="${item.nombre}" style="width: 70px; height: 70px; object-fit: cover;">
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <h6 class="mb-1 fw-bold">${item.nombre}</h6>
                <button class="btn btn-link text-danger p-0 text-decoration-none fs-6 cart-remove-btn" data-item-key="${item.itemKey}" title="Eliminar">🗑️</button>
              </div>
              <div class="text-muted small mb-2">
                ${item.selectedColor ? `<span>🎨 ${item.selectedColor}</span>` : ''}
                ${item.selectedColor && item.selectedSize ? ' • ' : ''}
                ${item.selectedSize ? `<span>📏 ${item.selectedSize}</span>` : ''}
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold text-success">$${item.precio.toLocaleString('es-AR')}</span>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn btn-sm btn-outline-secondary qty-decrease" data-item-key="${item.itemKey}">−</button>
                  <span class="fw-semibold" style="min-width: 20px; text-align: center;">${item.quantity}</span>
                  <button class="btn btn-sm btn-outline-secondary qty-increase" data-item-key="${item.itemKey}">+</button>
                </div>
              </div>
              <div class="text-end mt-2">
                <small class="text-muted">Subtotal: <span class="fw-semibold text-dark">$${(item.precio * item.quantity).toLocaleString('es-AR')}</span></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    this.itemsContainer.innerHTML = html;

    document.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', async e => {
        const itemKey = e.target.dataset.itemKey;
        const cartItems = cartService.getCart();
        const item = cartItems.find(i => i.itemKey === itemKey);
        if (item && item.quantity > 1) {
          try {
            await cartService.updateQuantity(itemKey, item.quantity - 1);
          } catch (error) {
            alert(error.message);
          }
        }
      });
    });

    document.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', async e => {
        const itemKey = e.target.dataset.itemKey;
        const cartItems = cartService.getCart();
        const item = cartItems.find(i => i.itemKey === itemKey);
        if (item) {
          try {
            await cartService.updateQuantity(itemKey, item.quantity + 1);
          } catch (error) {
            alert(error.message);
          }
        }
      });
    });

    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const itemKey = e.target.dataset.itemKey;
        cartService.removeFromCart(itemKey);
      });
    });
  }
}

let cartUIController;
export function getCartUIController() {
  if (!cartUIController) {
    cartUIController = new CartUIController();
  }
  return cartUIController;
}
