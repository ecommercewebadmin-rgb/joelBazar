import { CONFIG } from '../utils/constants.js';

class AirtableService {
  constructor() {
    this.baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
    this.token = import.meta.env.VITE_AIRTABLE_TOKEN;
    this.baseUrl = 'https://api.airtable.com/v0';
  }

  // Hacer fetch a Airtable
  async request(method, tableName, data = null, recordId = null) {
    if (!this.baseId || !this.token) {
      throw new Error('Airtable credentials no configuradas');
    }

    const url = recordId
      ? `${this.baseUrl}/${this.baseId}/${tableName}/${recordId}`
      : `${this.baseUrl}/${this.baseId}/${tableName}`;

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify({ fields: data });
    }

    try {
      const response = await Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('API timeout')), CONFIG.API_TIMEOUT)
        ),
      ]);

      if (!response.ok) {
        throw new Error(`Airtable error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AirtableService error:', error);
      throw error;
    }
  }

  // GET - Obtener registros
  async getRecords(tableName) {
    const result = await this.request('GET', tableName);
    return result.records.map(record => ({ id: record.id, ...record.fields }));
  }

  // GET por ID
  async getRecord(tableName, recordId) {
    const result = await this.request('GET', tableName, null, recordId);
    return { id: result.id, ...result.fields };
  }

  // POST - Crear registro
  async createRecord(tableName, data) {
    const result = await this.request('POST', tableName, data);
    return { id: result.id, ...result.fields };
  }

  // PATCH - Actualizar registro
  async updateRecord(tableName, recordId, data) {
    const result = await this.request('PATCH', tableName, data, recordId);
    return { id: result.id, ...result.fields };
  }

  // DELETE - Eliminar registro
  async deleteRecord(tableName, recordId) {
    await this.request('DELETE', tableName, null, recordId);
    return true;
  }

  // Obtener productos
  async getProducts() {
    return this.getRecords('Productos');
  }

  // Obtener categorías
  async getCategories() {
    return this.getRecords('Categorias');
  }

  // Obtener órdenes
  async getOrders() {
    return this.getRecords('Ordenes');
  }

  // Crear orden
  async createOrder(orderData) {
    return this.createRecord('Ordenes', orderData);
  }

  // Actualizar orden
  async updateOrder(orderId, statusData) {
    return this.updateRecord('Ordenes', orderId, statusData);
  }

  // Crear/Actualizar producto
  async saveProduct(productData, productId = null) {
    if (productId) {
      return this.updateRecord('Productos', productId, productData);
    }
    return this.createRecord('Productos', productData);
  }

  // Eliminar producto
  async deleteProduct(productId) {
    return this.deleteRecord('Productos', productId);
  }
}

export const airtableService = new AirtableService();
