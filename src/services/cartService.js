class CartService {
  constructor() {
    this.storageKey = 'cart_items';
    this.maxQuantityPerProduct = 999; // límite realista
  }

  // Obtener carrito
  getCart() {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Guardar carrito
  saveCart(cart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.notifyChange();
  }

  // Agregar al carrito
  addToCart(product, quantity = 1, selectedColor = null, selectedSize = null) {
    if (quantity < 1 || quantity > this.maxQuantityPerProduct) {
      throw new Error(`Cantidad inválida`);
    }

    const cart = this.getCart();
    const itemKey = this.generateItemKey(product.id, selectedColor, selectedSize);

    const existingIndex = cart.findIndex(item => item.itemKey === itemKey);

    if (existingIndex >= 0) {
      // Aumentar cantidad
      cart[existingIndex].quantity += quantity;
    } else {
      // Nuevo item
      cart.push({
        itemKey,
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        imagen_url: product.imagen_url,
        quantity,
        selectedColor,
        selectedSize,
      });
    }

    this.saveCart(cart);
    return cart;
  }

  // Actualizar cantidad
  updateQuantity(itemKey, quantity) {
    if (quantity < 0) {
      return this.removeFromCart(itemKey);
    }

    const cart = this.getCart();
    const item = cart.find(i => i.itemKey === itemKey);

    if (item) {
      item.quantity = Math.min(quantity, this.maxQuantityPerProduct);
      this.saveCart(cart);
    }

    return cart;
  }

  // Eliminar del carrito
  removeFromCart(itemKey) {
    const cart = this.getCart();
    const filtered = cart.filter(item => item.itemKey !== itemKey);
    this.saveCart(filtered);
    return filtered;
  }

  // Vaciar carrito
  clearCart() {
    localStorage.removeItem(this.storageKey);
    this.notifyChange();
    return [];
  }

  // Calcular total
  getTotal() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  }

  // Obtener cantidad de items
  getItemCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Generar key única por item (con color/talla si aplican)
  generateItemKey(productId, color, size) {
    return `${productId}_${color || 'default'}_${size || 'default'}`;
  }

  // Notificar cambios (para listeners)
  notifyChange() {
    const event = new CustomEvent('cartChanged', {
      detail: { cart: this.getCart(), total: this.getTotal() },
    });
    window.dispatchEvent(event);
  }

  // Obtener carrito para checkout
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
