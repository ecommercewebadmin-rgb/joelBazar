import { airtableService } from './airtableService.js';

class CartService {
  constructor() {
    this.storageKey = 'cart_items';
    this.maxQuantityPerProduct = 999;
  }

  getCart() {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.notifyChange();
  }

  addToCart(product, quantity = 1, selectedColor = null, selectedSize = null) {
    if (quantity < 1 || quantity > this.maxQuantityPerProduct) {
      throw new Error(`Cantidad inválida`);
    }

    const cart = this.getCart();
    const itemKey = this.generateItemKey(product.id, selectedColor, selectedSize);

    const existingItem = cart.find(item => item.itemKey === itemKey);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity + quantity > product.stock) {
      throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
    }

    const existingIndex = cart.findIndex(item => item.itemKey === itemKey);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        itemKey,
        id: product.id,
        nombre: product.nombre,
        precio: Number(product.precio) || 0,
        imagen_url: product.imagen_url,
        quantity,
        selectedColor,
        selectedSize,
      });
    }

    this.saveCart(cart);
    return cart;
  }

  async updateQuantity(itemKey, quantity) {
    if (quantity < 0) {
      return this.removeFromCart(itemKey);
    }

    const cart = this.getCart();
    const item = cart.find(i => i.itemKey === itemKey);

    if (item) {
      const product = await airtableService.getRecord('Productos', item.id);
      if (quantity > product.stock) {
        throw new Error(`Stock insuficiente. Solo quedan ${product.stock} unidades.`);
      }
      item.quantity = Math.min(quantity, this.maxQuantityPerProduct);
      this.saveCart(cart);
    }

    return cart;
  }

  removeFromCart(itemKey) {
    const cart = this.getCart();
    const filtered = cart.filter(item => item.itemKey !== itemKey);
    this.saveCart(filtered);
    return filtered;
  }

  clearCart() {
    localStorage.removeItem(this.storageKey);
    this.notifyChange();
    return [];
  }

  getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  }

  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  generateItemKey(productId, color, size) {
    return `${productId}_${color || 'default'}_${size || 'default'}`;
  }

  notifyChange() {
    const event = new CustomEvent('cartChanged', {
      detail: { cart: this.getCart(), total: this.getTotal() },
    });
    window.dispatchEvent(event);
  }

  getCheckoutData() {
    const cart = this.getCart();
    return cart.map(item => ({
      product_id: item.id,
      nombre: item.nombre,
      cantidad: item.quantity,
      precio_unitario: item.precio,
      color: item.selectedColor,
      talla: item.selectedSize,
    }));
  }
}

export const cartService = new CartService();
