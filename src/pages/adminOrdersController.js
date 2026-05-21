import { airtableService } from '../services/airtableService.js';
import { toggleLoading } from '../utils/helpers.js';
import { Skeleton } from '../components/SkeletonLoader.js';

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
    const tbody = document.getElementById('orders-tbody');
    Skeleton.renderTbodySkeleton(tbody, 6);

    try {
      this.orders = await airtableService.getOrders();
      this.renderTable();
    } catch (error) {
      if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error cargando órdenes</td></tr>';
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
        <td class="text-end">
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-info btn-view-order" data-order-id="${o.id}">Ver</button>
          </div>
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
    
    // Renderizar productos de la orden
    const productsContainer = document.getElementById('order-products');
    if (productsContainer && order.productos) {
      try {
        const products = typeof order.productos === 'string' 
          ? JSON.parse(order.productos) 
          : order.productos;
          
        productsContainer.innerHTML = products.map(p => `
          <div class="border-bottom pb-2 mb-2">
            <div class="d-flex justify-content-between">
              <strong>${p.nombre}</strong>
              <span>$${(p.cantidad * p.precio_unitario).toLocaleString('es-AR')}</span>
            </div>
            <div class="text-muted small">
              ${p.cantidad} x $${p.precio_unitario.toLocaleString('es-AR')}
              ${p.color ? ` | Color: ${p.color}` : ''}
              ${p.talla ? ` | Talla: ${p.talla}` : ''}
            </div>
          </div>
        `).join('');
      } catch (e) {
        productsContainer.innerHTML = '<p class="text-danger small">Error al cargar productos</p>';
      }
    }

    modal.show();
  }

  async updateOrderStatus() {
    const updateBtn = document.getElementById('update-order-btn');
    if (!updateBtn) return;

    const orderId = updateBtn.dataset.orderId;
    const newStatus = document.getElementById('order-status').value;

    try {
      toggleLoading(updateBtn, true);
      
      // 1. Actualizar el estado de la orden
      await airtableService.updateRecord('Ordenes', orderId, {
        estado: newStatus,
      });

      // 2. Si la orden se cancela, devolver el stock a los productos en PARALELO
      if (newStatus === 'cancelado') {
        const order = await airtableService.getRecord('Ordenes', orderId);
        
        if (order && order.productos) {
          const products = typeof order.productos === 'string' 
            ? JSON.parse(order.productos) 
            : order.productos;
            
          // Usamos Promise.all para actualizar todos los stocks simultáneamente
          // Esto evita que la pantalla se "congele" esperando cada petición secuencial
          await Promise.all(products.map(async (product) => {
            const productId = product.product_id || product.id;
            if (productId) {
              const currentProduct = await airtableService.getRecord('Productos', productId);
              const currentStock = Number(currentProduct.stock || 0);
              const quantityToReturn = Number(product.cantidad || 0);
              await airtableService.updateRecord('Productos', productId, { 
                stock: currentStock + quantityToReturn 
              });
            }
          }));
        }
      }

      // Cerrar modal inmediatamente después de las operaciones críticas
      const modalElement = document.getElementById('orderModal');
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      // Refrescar la tabla en segundo plano
      this.loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error actualizando orden');
    } finally {
      toggleLoading(updateBtn, false);
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
