import { airtableService } from '../services/airtableService.js';

export class AdminOrdersController {
  constructor() {
    this.orders = [];
  }

  init() {
    this.loadOrders();
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('click', e => {
      if (e.target.classList.contains('btn-view-order')) {
        const orderId = e.target.dataset.orderId;
        const order = this.orders.find(o => o.id === orderId);
        this.showOrderModal(order);
      }

      if (e.target.classList.contains('btn-update-order')) {
        this.updateOrderStatus();
      }
    });
  }

  async loadOrders() {
    try {
      this.orders = await airtableService.getOrders();
      this.renderTable();
    } catch (error) {
      alert('Error cargando órdenes');
    }
  }

  renderTable() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = this.orders
      .map(
        o => `
      <tr>
        <td>${o.numero_orden}</td>
        <td>${o.cliente_nombre}</td>
        <td>$${o.total}</td>
        <td>${this.translatePaymentMethod(o.metodo_pago)}</td>
        <td><span class="badge" style="background-color: ${this.getStatusColor(o.estado)}">${o.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-info btn-view-order" data-order-id="${o.id}">Ver</button>
        </td>
      </tr>
    `
      )
      .join('');
  }

  showOrderModal(order) {
    const modalEl = document.getElementById('orderModal');
    const modal = new bootstrap.Modal(modalEl);
    document.getElementById('order-id').textContent = order.numero_orden;
    document.getElementById('order-client').textContent = order.cliente_nombre;
    document.getElementById('order-total').textContent = `$${order.total}`;
    document.getElementById('order-status').value = order.estado;
    document.getElementById('update-order-btn').dataset.orderId = order.id;
    modal.show();
  }

  async updateOrderStatus() {
    const updateBtn = document.getElementById('update-order-btn');
    const orderId = updateBtn.dataset.orderId;
    const newStatus = document.getElementById('order-status').value;

    try {
      await airtableService.updateRecord('Ordenes', orderId, {
        estado: newStatus,
      });

      bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
      this.loadOrders();
    } catch (error) {
      alert('Error actualizando orden');
    }
  }


  getStatusColor(status) {
    const colors = {
      pendiente: '#ffc107',
      pagado: '#28a745',
      enviado: '#17a2b8',
      entregado: '#6c757d',
      cancelado: '#dc3545',
    };
    return colors[status] || '#007bff';
  }

  translatePaymentMethod(method) {
    const translations = {
      mercadopago: '💳 MercadoPago',
      transferencia_bbva: '🏦 BBVA',
      transferencia_galicia: '🏦 Galicia',
    };
    return translations[method] || method;
  }
}

let adminOrdersController;
export function getAdminOrdersController() {
  if (!adminOrdersController) {
    adminOrdersController = new AdminOrdersController();
  }
  return adminOrdersController;
}
