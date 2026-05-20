import { cartService } from '../services/cartService.js';

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

    this.clearBtn?.addEventListener('click', () => {
      if (confirm('¿Vaciar carrito?')) {
        cartService.clearCart();
        this.render();
      }
    });

    this.checkoutBtn?.addEventListener('click', () => {
      const cart = cartService.getCart();
      if (cart.length > 0) {
        window.location.hash = '#/checkout';
      }
    });
  }

  render() {
    const cart = cartService.getCart();
    const total = cartService.getTotal();

    if (!this.itemsContainer) return;

    if (cart.length === 0) {
      this.itemsContainer.innerHTML = '<p class="text-muted text-center">Tu carrito está vacío</p>';
      if (this.checkoutBtn) this.checkoutBtn.disabled = true;
      if (this.cartCountBadge) this.cartCountBadge.textContent = '0';
      if (this.totalElement) this.totalElement.textContent = '$0';
      return;
    }

    if (this.checkoutBtn) this.checkoutBtn.disabled = false;
    if (this.cartCountBadge) this.cartCountBadge.textContent = cartService.getItemCount();
    if (this.totalElement) this.totalElement.textContent = `$${total.toLocaleString('es-AR')}`;

    const html = cart
      .map(
        item => `
      <div class="card mb-2 cart-item-card position-relative">
        <button class="btn btn-sm cart-remove-btn" data-item-key="${item.itemKey}">×</button>
        <div class="card-body d-flex gap-3">
          <img src="${item.imagen_url}" class="cart-item-img" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;">
          <div class="cart-item-info flex-grow-1">
            <h6 class="mb-1">${item.nombre}</h6>
            ${item.selectedColor ? `<small class="text-muted">Color: ${item.selectedColor}</small><br>` : ''}
            ${item.selectedSize ? `<small class="text-muted">Talla: ${item.selectedSize}</small><br>` : ''}
            <strong>$${item.precio}</strong>
          </div>
          <div class="cart-quantity-row d-flex flex-column align-items-end">
            <div class="cart-quantity-controls d-flex">
              <button class="btn btn-sm btn-outline-secondary qty-decrease" data-item-key="${item.itemKey}">−</button>
              <input type="text" class="form-control form-control-sm cart-quantity-value" value="${item.quantity}" readonly style="width: 40px; text-align: center;">
              <button class="btn btn-sm btn-outline-secondary qty-increase" data-item-key="${item.itemKey}">+</button>
            </div>
            <small class="text-muted mt-2">Subtotal: $${(item.precio * item.quantity).toLocaleString('es-AR')}</small>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    this.itemsContainer.innerHTML = html;

    document.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', e => {
        const itemKey = e.target.dataset.itemKey;
        const cartItems = cartService.getCart();
        const item = cartItems.find(i => i.itemKey === itemKey);
        if (item && item.quantity > 1) {
          cartService.updateQuantity(itemKey, item.quantity - 1);
        }
      });
    });

    document.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', e => {
        const itemKey = e.target.dataset.itemKey;
        const cartItems = cartService.getCart();
        const item = cartItems.find(i => i.itemKey === itemKey);
        if (item) {
          cartService.updateQuantity(itemKey, item.quantity + 1);
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
