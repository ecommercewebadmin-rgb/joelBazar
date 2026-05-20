import { airtableService } from './airtableService.js';

class OrderService {
  generateOrderNumber() {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `ORD-${dateStr}-${random}`;
  }

  async createOrder(customerData, cartItems, paymentMethod) {
    try {
      const orderData = {
        numero_orden: this.generateOrderNumber(),
        cliente_nombre: customerData.nombre,
        cliente_email: customerData.email,
        cliente_telefono: customerData.telefono,
        cliente_direccion: customerData.direccion,
        productos: JSON.stringify(cartItems),
        total: cartItems.reduce(
          (sum, item) => sum + item.precio_unitario * item.cantidad,
          0
        ),
        metodo_pago: paymentMethod,
        estado: 'pendiente',
        creado_en: new Date().toISOString(),
      };

      const order = await airtableService.createOrder(orderData);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async getOrders() {
    return airtableService.getOrders();
  }

  async updateOrderStatus(orderId, newStatus) {
    try {
      return await airtableService.updateOrder(orderId, {
        estado: newStatus,
        actualizado_en: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  }

  async markAsPaid(orderId, referenceId = null) {
    const updateData = {
      estado: 'pagado',
      actualizado_en: new Date().toISOString(),
    };

    if (referenceId) {
      updateData.referencia_mercadopago = referenceId;
    }

    return airtableService.updateOrder(orderId, updateData);
  }
}

export const orderService = new OrderService();
