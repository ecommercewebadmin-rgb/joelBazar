# 🐛 BUGS A CORREGIR - joelBazar

## BUG #1: Producto no se agrega desde botón "Agregar" en Home
**Ubicación:** Página Home, grid de productos  
**Síntoma:** Click en botón "Agregar" no agrega producto al carrito  
**Comportamiento esperado:** Al clickear "Agregar", el producto debe agregarse al carrito, mostrar notificación y actualizar el badge contador  
**Causa probable:** El event listener del botón "btn-add-to-cart" en homeController.js no está funcionando o no llama a cartService.addToCart()  
**Archivos a revisar:** 
- src/pages/homeController.js (método handleAddToCart)
- src/services/cartService.js (método addToCart)
**Solución:** Verificar que el evento click funcione, que se valide el stock > 0, y que se llame correctamente a cartService.addToCart()

---

## BUG #2: No se puede seguir comprando desde pantalla de confirmación de compra
**Ubicación:** Página de confirmación post-pago  
**Síntoma:** El botón "Volver a comprar" no redirige al home o no funciona  
**Comportamiento esperado:** Al clickear "Volver a comprar", debe ir a home (#/) y permitir agregar más productos  
**Causa probable:** El botón #return-home-btn no tiene evento click, o la redirección window.location.hash no funciona  
**Archivos a revisar:**
- src/pages/PaymentConfirmationController.js (método setupEventListeners)
**Solución:** Agregar event listener al botón que redirija a window.location.hash = '#/'

---

## BUG #3: Se puede agregar más productos que el stock disponible
**Ubicación:** Carrito y checkout  
**Síntoma:** El usuario puede agregar 50 productos de un artículo que solo tiene 10 en stock, y completa la compra  
**Comportamiento esperado:** No permitir agregar más que el stock disponible, mostrar mensaje "Stock insuficiente"  
**Causa probable:** Falta validación de stock en cartService.addToCart() y en el selector de cantidad  
**Archivos a revisar:**
- src/services/cartService.js (método addToCart y updateQuantity)
- src/pages/detailController.js (método handleAddToCart)
**Solución:** 
1. En cartService.addToCart(): validar que quantity <= product.stock
2. En detailController: al aumentar cantidad, no permitir mayor que stock
3. En checkoutController: validar stock total antes de crear orden

---

## BUG #4: Total muestra $0 en pantalla de confirmación de compra
**Ubicación:** Página de confirmación post-pago  
**Síntoma:** El campo "Total" muestra $0 en lugar del monto real  
**Comportamiento esperado:** Debe mostrar el total de la orden (ej: $1500)  
**Causa probable:** El total no se está pasando a la vista, o element #confirmation-total está vacío  
**Archivos a revisar:**
- src/pages/PaymentConfirmationController.js (método renderConfirmation)
**Solución:** En renderConfirmation(), asegurar que document.getElementById('confirmation-total').textContent = `$${order.total}`

---

## BUG #5: Los datos seleccionados (color, talla) persisten al navegar
**Ubicación:** Detalle de producto  
**Síntoma:** Si entro a un producto, selecciono color "azul" y talla "M", luego vuelvo al home y re-entro al mismo producto, los datos están aún seleccionados  
**Comportamiento esperado:** Al entrar de nuevo al producto, debe estar limpio (sin color ni talla seleccionados)  
**Causa probable:** Los datos guardados en this.selectedColor y this.selectedSize no se resetean al cargar la vista  
**Archivos a revisar:**
- src/pages/detailController.js (método loadProduct o init)
**Solución:** Al final de loadProduct(), resetear:
```javascript
this.selectedColor = null;
this.selectedSize = null;
document.querySelectorAll('.btn-color, .btn-size').forEach(btn => btn.classList.remove('active'));
```

---

## BUG #6: Menú del carrito no se cierra al ir a checkout
**Ubicación:** Offcanvas carrito → Checkout  
**Síntoma:** Al clickear "Ir al pago" (checkout-btn), el carrito offcanvas queda abierto  
**Comportamiento esperado:** El offcanvas debe cerrarse automáticamente y mostrar la página de checkout  
**Causa probable:** No se llama a bootstrap.Offcanvas.getInstance().hide()  
**Archivos a revisar:**
- src/components/CartUIController.js (evento checkoutBtn click)
**Solución:** Antes de redirigir a checkout, agregar:
```javascript
const cartOffcanvas = document.getElementById('cartOffcanvas');
const offcanvasInstance = bootstrap.Offcanvas.getInstance(cartOffcanvas);
if (offcanvasInstance) offcanvasInstance.hide();
```

---

## BUG #7: Categoría muestra caracteres random al editar
**Ubicación:** Panel Admin, editar producto  
**Síntoma:** El campo "Categoría" en el modal muestra valores como "rec12345xyz" o caracteres aleatorios en lugar del nombre  
**Comportamiento esperado:** Debe mostrar el nombre de la categoría (ej: "Ropa", "Accesorios")  
**Causa probable:** Se está guardando/mostrando el ID de Airtable (record ID) en lugar del nombre de la categoría  
**Archivos a revisar:**
- src/pages/adminProductsController.js (método showProductForm, línea donde se llena category)
**Solución:** En lugar de guardar categoria_id (record ID), guardar el nombre de la categoría, o hacer un JOIN/lookup en Airtable

---

## BUG #8: Campo de fecha muestra "obligatorio" pero sin marcarlo dice "undefined"
**Ubicación:** Panel Admin, crear/editar producto  
**Síntoma:** El campo "creado_en" o "actualizado_en" aparece como obligatorio (required), pero si no lo marco, el sistema guarda "undefined" en lugar de la fecha actual  
**Comportamiento esperado:** Las fechas deben ser automáticas (se generan en el servidor), no obligatorias para el usuario  
**Causa probable:** Los campos creado_en y actualizado_en se muestran en el formulario pero no deberían (son auto-generated)  
**Archivos a revisar:**
- src/pages/adminProductsController.js (formulario #product-form)
- HTML del modal productModal
**Solución:** 
1. Eliminar estos campos del formulario HTML (no deberían aparecer)
2. En saveProduct(), agregar automáticamente antes de guardar:
```javascript
data.creado_en = new Date().toISOString();
data.actualizado_en = new Date().toISOString();
```

---

## BUG #9: Error 403 al eliminar producto, pero igual se elimina
**Ubicación:** Panel Admin, tabla de productos  
**Síntoma:** Al clickear "Eliminar" producto, aparece error 403 en consola, pero el producto se elimina de Airtable igualmente  
**Comportamiento esperado:** Debe eliminar sin error, o si hay error, NO debe eliminar  
**Causa probable:** El token de API no tiene permiso de escritura (write), pero Airtable está permitiendo igual (bug de Airtable) O la llamada a DELETE funciona pero hay otro error 403 posterior  
**Archivos a revisar:**
- src/services/airtableService.js (método deleteRecord)
- Permisos del token en Airtable (verificar que tenga data.records:write)
**Solución:**
1. Verificar que el token tenga permiso: data.records:write ✅
2. En deleteRecord(), agregar mejor error handling:
```javascript
if (!response.ok) {
  console.error(`Error ${response.status}: ${response.statusText}`);
  throw new Error(`No se puede eliminar: ${response.statusText}`);
}
```

---

## 📋 RESUMEN RÁPIDO

| # | Bug | Prioridad | Complejidad |
|---|-----|-----------|------------|
| 1 | Agregar producto no funciona | CRÍTICA | Baja |
| 2 | No se puede seguir comprando | CRÍTICA | Baja |
| 3 | Stock no se valida | CRÍTICA | Media |
| 4 | Total muestra $0 | ALTA | Baja |
| 5 | Datos persisten al navegar | MEDIA | Baja |
| 6 | Carrito no se cierra | MEDIA | Baja |
| 7 | Categoría con caracteres random | MEDIA | Media |
| 8 | Fecha muestra "undefined" | MEDIA | Baja |
| 9 | Error 403 pero elimina igual | BAJA | Baja |

