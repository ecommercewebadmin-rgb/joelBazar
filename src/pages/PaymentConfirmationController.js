import { airtableService } from '../services/airtableService.js';

export class PaymentConfirmationController {
  constructor() {
    this.order = null;
    this.method = null;
  }

  async init() {
    this.setupElements();
    this.setupEventListeners();
    await this.loadOrderData();
    this.renderConfirmation();
  }

  setupElements() {
    this.orderNumberEl = document.getElementById('order-number');
    this.mpConfirmationEl = document.getElementById('mp-confirmation');
    this.transferConfirmationEl = document.getElementById('transfer-confirmation');
    this.confirmationSummaryEl = document.getElementById('confirmation-summary');
    this.confirmationTotalEl = document.getElementById('confirmation-total');
    this.confirmationAddressEl = document.getElementById('confirmation-address');
    this.returnHomeBtn = document.getElementById('return-home-btn');
    this.bankNameEl = document.getElementById('bank-name');
    this.bankAccountEl = document.getElementById('bank-account');
    this.bankAliasEl = document.getElementById('bank-alias');
    this.transferConceptEl = document.getElementById('transfer-concept');
  }

  setupEventListeners() {
    this.returnHomeBtn?.addEventListener('click', () => {
      window.location.hash = '#/';
    });

    document.getElementById('copy-account-btn')?.addEventListener('click', () => {
      this.copyToClipboard(this.bankAccountEl.value);
    });

    document.getElementById('copy-alias-btn')?.addEventListener('click', () => {
      this.copyToClipboard(this.bankAliasEl.value);
    });
  }

  async loadOrderData() {
    const params = new URLSearchParams(window.location.search);
    const orderId = new URLSearchParams(window.location.hash.split('?')[1]).get('orderId');
    this.method = new URLSearchParams(window.location.hash.split('?')[1]).get('method');

    if (!orderId) {
      alert('Orden no encontrada');
      window.location.hash = '#/';
      return;
    }

    try {
      this.order = await airtableService.getRecord('Ordenes', orderId);
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Error al cargar los datos de la orden');
      window.location.hash = '#/';
    }
  }

  renderConfirmation() {
    if (!this.order) return;

    this.orderNumberEl.textContent = this.order.numero_orden;
    this.confirmationAddressEl.textContent = this.order.cliente_direccion;
    this.confirmationTotalEl.textContent = `$${this.order.total.toLocaleString('es-AR')}`;

    const products = JSON.parse(this.order.productos || '[]');
    this.confirmationSummaryEl.innerHTML = products
      .map(item => `
        <div class="d-flex justify-content-between mb-1 small">
          <span>${item.nombre} x${item.cantidad}</span>
          <span>$${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}</span>
        </div>
      `).join('');

    if (this.method === 'mp') {
      this.mpConfirmationEl.style.display = 'block';
      this.transferConfirmationEl.style.display = 'none';
    } else {
      this.mpConfirmationEl.style.display = 'none';
      this.transferConfirmationEl.style.display = 'block';
      this.setupTransferData();
    }
  }

  setupTransferData() {
    const bankData = this.method === 'transferencia_bbva' 
      ? { name: 'BBVA Argentina', account: '000000123456789012', alias: 'joel.bazar.bbva' }
      : { name: 'Banco Galicia', account: '000000987654321098', alias: 'joel.bazar.galicia' };

    this.bankNameEl.textContent = bankData.name;
    this.bankAccountEl.value = bankData.account;
    this.bankAliasEl.value = bankData.alias;
    this.transferConceptEl.value = this.order.numero_orden;
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copiado al portapapeles');
    });
  }
}

let paymentConfirmationController;
export function getPaymentConfirmationController() {
  if (!paymentConfirmationController) {
    paymentConfirmationController = new PaymentConfirmationController();
  }
  return paymentConfirmationController;
}
