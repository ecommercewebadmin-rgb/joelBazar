import { cartService } from '../services/cartService.js';
import { orderService } from '../services/orderService.js';
import { airtableService } from '../services/airtableService.js';
import { confirmationModal } from '../components/ConfirmationModal.js';
import { toggleLoading } from '../utils/helpers.js';

export class CheckoutController {
  constructor() {
    this.selectedPaymentMethod = null;
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.populateSummary();
  }

  setupElements() {
    this.form = document.getElementById('customer-form');
    this.nameInput = document.getElementById('customer-name');
    this.emailInput = document.getElementById('customer-email');
    this.phoneInput = document.getElementById('customer-phone');
    this.addressInput = document.getElementById('customer-address');
    this.summaryDiv = document.getElementById('checkout-summary');
    this.totalDiv = document.getElementById('checkout-total');
    this.confirmBtn = document.getElementById('confirm-payment-btn');
    this.backBtn = document.getElementById('back-to-cart-btn');
  }

  setupEventListeners() {
    this.form?.addEventListener('submit', e => this.handleSubmit(e));

    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
      radio.addEventListener('change', e => {
        this.selectedPaymentMethod = e.target.value;
      });
    });

    this.backBtn?.addEventListener('click', () => {
      window.location.hash = '#/home';
    });
  }

  populateSummary() {
    if (!this.summaryDiv) return;
    const cart = cartService.getCart();
    const total = cartService.getTotal();

    const html = cart
      .map(
        item => `
      <div class="d-flex justify-content-between mb-2">
        <span>${item.nombre} x${item.quantity}</span>
        <span>$${(item.precio * item.quantity).toLocaleString('es-AR')}</span>
      </div>
    `
      )
      .join('');

    this.summaryDiv.innerHTML = html || '<p class="text-muted">No hay productos en el carrito</p>';
    if (this.totalDiv) this.totalDiv.textContent = `$${total.toLocaleString('es-AR')}`;
  }

  async validateForm() {
    const email = this.emailInput?.value || '';
    const phone = this.phoneInput?.value || '';
    const address = this.addressInput?.value || '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;

    if (!this.nameInput?.value) {
      await confirmationModal.alert('Atención', 'Por favor ingresa tu nombre');
      return false;
    }

    if (!emailRegex.test(email)) {
      await confirmationModal.alert('Atención', 'Por favor ingresa un email válido');
      return false;
    }

    if (!phoneRegex.test(phone)) {
      await confirmationModal.alert('Atención', 'Por favor ingresa un teléfono válido (7-15 dígitos)');
      return false;
    }

    if (address.length < 10) {
      await confirmationModal.alert('Atención', 'Por favor ingresa una dirección válida (mínimo 10 caracteres)');
      return false;
    }

    if (!this.selectedPaymentMethod) {
      await confirmationModal.alert('Método de Pago', 'Por favor selecciona un método de pago');
      return false;
    }

    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!(await this.validateForm())) return;

    try {
      toggleLoading(this.confirmBtn, true);

      const customerData = {
        nombre: this.nameInput.value,
        email: this.emailInput.value,
        telefono: this.phoneInput.value,
        direccion: this.addressInput.value,
      };

      const cartItems = cartService.getCheckoutData();

      // Validar stock de todos los productos obteniendo la lista completa una sola vez
      const allProducts = await airtableService.getProducts();
      for (const item of cartItems) {
        const product = allProducts.find(p => p.id === item.product_id);
        if (!product || item.cantidad > product.stock) {
          const stockMsg = product ? `Disponible: ${product.stock}` : 'Producto no encontrado';
          await confirmationModal.alert('Stock insuficiente', `Stock insuficiente para ${item.nombre}. ${stockMsg}`);
          toggleLoading(this.confirmBtn, false);
          throw new Error('Stock insuficiente');
        }
      }

      const order = await orderService.createOrder(
        customerData,
        cartItems,
        this.selectedPaymentMethod
      );

      // Actualizar stock de productos
      for (const item of cartItems) {
        const product = await airtableService.getRecord('Productos', item.product_id);
        const newStock = product.stock - item.cantidad;
        await airtableService.updateRecord('Productos', item.product_id, { stock: newStock });
      }

      cartService.clearCart();

      if (this.selectedPaymentMethod === 'mercadopago') {
        window.location.hash = `#/confirmacion?orderId=${order.id}&method=mp`;
      } else {
        window.location.hash = `#/confirmacion?orderId=${order.id}&method=transfer`;
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      toggleLoading(this.confirmBtn, false);
      if (error.message !== 'Stock insuficiente') {
        await confirmationModal.alert('Error', 'Error procesando el pedido. Por favor, intenta nuevamente.');
      }
    }
  }
}

let checkoutController;
export function getCheckoutController() {
  if (!checkoutController) {
    checkoutController = new CheckoutController();
  }
  return checkoutController;
}
