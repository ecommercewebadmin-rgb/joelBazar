export const templates = {
  header: `
    <header id="site-header">
      <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top shadow-sm">
        <div class="container-fluid px-3 px-md-4">
          <a class="navbar-brand fw-bold fs-5" href="#/" id="navbar-brand">joelBazar</a>
          <div class="d-flex gap-2 ms-auto">
            <button class="btn btn-outline-primary position-relative" id="cart-toggle-btn" data-bs-toggle="offcanvas" data-bs-target="#cartOffcanvas">
              🛒
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="cart-count">0</span>
            </button>
            <button class="btn btn-outline-secondary d-none" id="admin-toggle-btn" style="display: none;">⚙️ Admin</button>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
          <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="nav-link active" href="#/" id="nav-home">Home</a></li>
              <li class="nav-item"><button class="nav-link btn btn-link" id="nav-login">Iniciar sesión (Admin)</button></li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas">
      <div class="offcanvas-header border-bottom bg-light">
        <h5 class="offcanvas-title fw-bold">🛒 Mi Carrito</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body d-flex flex-column p-0">
        <div id="cart-items-container" class="flex-grow-1 p-3">
          <div class="text-center py-5">
            <div class="mb-3">
              <span style="font-size: 4rem; opacity: 0.5;">🛒</span>
            </div>
            <h5 class="fw-bold text-dark">Tu carrito está vacío</h5>
            <p class="text-muted">Parece que aún no has agregado productos.</p>
          </div>
        </div>
        <div class="p-3 border-top bg-light">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted">Total estimado:</span>
            <span class="fs-4 fw-bold text-success" id="cart-total">$0</span>
          </div>
          <div class="d-grid gap-2">
            <button class="btn btn-primary btn-lg fw-bold" id="checkout-btn" disabled>Finalizar Compra</button>
            <button class="btn btn-link btn-sm text-danger text-decoration-none" id="clear-cart-btn">Vaciar carrito</button>
          </div>
        </div>
      </div>
    </div>
  `,
  footer: `
    <footer id="site-footer" class="bg-light border-top mt-5 py-5">
      <div class="container text-center">
        <h6 class="fw-bold mb-4 text-uppercase" style="letter-spacing: 1px; color: #6c757d;">Conecta con nosotros</h6>
        <div class="d-flex flex-wrap justify-content-center gap-4 mb-4">
          <a href="https://instagram.com" target="_blank" class="text-decoration-none text-muted fs-6" id="social-instagram">📷 Instagram</a>
          <a href="mailto:contacto@example.com" class="text-decoration-none text-muted fs-6" id="social-email">✉️ Email</a>
          <a href="https://wa.me" target="_blank" class="text-decoration-none text-muted fs-6" id="social-whatsapp">💬 WhatsApp</a>
          <a href="tel:+5491112345678" class="text-decoration-none text-muted fs-6">📞 +54 9 11 1234-5678</a>
        </div>
        <div class="border-top pt-4 text-muted small">
          <p class="mb-0">&copy; 2025 joelBazar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  'home-view': `
    <main id="home-view" class="py-4">
      <div class="container">
        <section class="text-center mb-5">
          <h1 class="display-5 fw-bold mb-2">Bienvenido a joelBazar</h1>
          <p class="lead text-muted mb-4">Descubre nuestros productos de calidad. Todo lo que necesitas en un solo lugar.</p>
        </section>
        <section class="mb-4">
          <form class="search-form d-flex gap-2" id="search-form">
            <div class="input-group shadow-sm rounded-pill overflow-hidden" style="max-width: 600px; margin: 0 auto; width: 100%;">
              <span class="input-group-text bg-white border-end-0 px-3" style="border-radius: 50px 0 0 50px;">🔍</span>
              <input type="text" class="form-control border-start-0 ps-0" placeholder="Buscar productos..." id="search-input" autocomplete="off">
              <button class="btn btn-primary px-4 fw-semibold" type="submit">Buscar</button>
            </div>
          </form>
        </section>
        <section class="mb-5">
          <h5 class="mb-3 text-center">Categorías</h5>
          <div class="d-flex gap-2 flex-wrap justify-content-center" id="categories-container">
            <button class="btn btn-outline-primary active" data-category="all">Todas</button>
          </div>
        </section>
        <section>
          <div class="row g-4" id="products-container"></div>
          <div id="no-products-message" class="text-center text-muted py-5" style="display: none;">
            <p class="fs-5">No encontramos productos que coincidan con tu búsqueda.</p>
          </div>
        </section>
      </div>
    </main>
  `,
  'product-detail-view': `
    <main id="product-detail-view" class="py-4">
      <div class="container">
        <button class="btn btn-outline-secondary mb-4 d-inline-flex align-items-center gap-2" id="back-btn">
          ← <span class="d-none d-sm-inline">Volver al catálogo</span><span class="d-inline d-sm-none">Volver</span>
        </button>
        <div id="detail-content">
          <!-- El contenido se cargará dinámicamente aquí -->
        </div>
      </div>
    </main>
  `,
  'checkout-view': `
    <main id="checkout-view" class="py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="mb-4">
              <h4 class="mb-3">Tu Compra</h4>
              <div class="progress" style="height: 4px;"><div class="progress-bar" style="width: 33%"></div></div>
            </div>
            <form id="customer-form" class="mb-5">
              <h5 class="mb-3">Información de entrega</h5>
              <div class="mb-3"><label class="form-label">Nombre completo *</label><input type="text" class="form-control" id="customer-name" placeholder="Tu nombre" required></div>
              <div class="mb-3"><label class="form-label">Email *</label><input type="email" class="form-control" id="customer-email" placeholder="tu@email.com" required></div>
              <div class="mb-3"><label class="form-label">Teléfono *</label><input type="tel" class="form-control" id="customer-phone" placeholder="+54 9 1234 5678" required></div>
              <div class="mb-4"><label class="form-label">Dirección *</label><input type="text" class="form-control" id="customer-address" placeholder="Calle, número, piso, dpto." required></div>
              <div class="card mb-4 bg-light">
                <div class="card-body">
                  <h6 class="mb-3">Resumen de compra</h6>
                  <div id="checkout-summary"></div>
                  <hr class="my-3">
                  <div class="d-flex justify-content-between"><strong>Total:</strong><strong class="text-success" id="checkout-total">$0</strong></div>
                </div>
              </div>
              <h5 class="mb-3">Método de pago</h5>
              <div class="form-check mb-3">
                <input class="form-check-input" type="radio" name="payment-method" id="payment-mercadopago" value="mercadopago">
                <label class="form-check-label w-100 p-2 border rounded" for="payment-mercadopago"><strong>💳 MercadoPago</strong><p class="text-muted small mb-0">Tarjeta débito/crédito, dinero en cuenta, etc.</p></label>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="radio" name="payment-method" id="payment-bbva" value="transferencia_bbva">
                <label class="form-check-label w-100 p-2 border rounded" for="payment-bbva"><strong>🏦 Transferencia Bancaria BBVA</strong><p class="text-muted small mb-0">Recibe los datos después de confirmar</p></label>
              </div>
              <div class="form-check mb-4">
                <input class="form-check-input" type="radio" name="payment-method" id="payment-galicia" value="transferencia_galicia">
                <label class="form-check-label w-100 p-2 border rounded" for="payment-galicia"><strong>🏦 Transferencia Bancaria Galicia</strong><p class="text-muted small mb-0">Recibe los datos después de confirmar</p></label>
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg" id="confirm-payment-btn">Confirmar pago</button>
                <button type="button" class="btn btn-outline-secondary" id="back-to-cart-btn">Volver al carrito</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  `,
  'payment-confirmation-view': `
    <main id="payment-confirmation-view" class="py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 text-center">
            <div class="mb-4"><span style="font-size: 4rem;">✅</span></div>
            <h1 class="mb-3">¡Pedido Confirmado!</h1>
            <p class="lead text-muted mb-4">Número de orden: <strong id="order-number">ORD-20250520-001</strong></p>
            <div id="mp-confirmation" style="display: none;">
              <div class="card mb-4 bg-light">
                <div class="card-body"><h5>Pago con MercadoPago</h5><p class="text-muted mb-0">Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.</p></div>
              </div>
            </div>
            <div id="transfer-confirmation" style="display: none;">
              <div class="card mb-4 bg-warning bg-opacity-10 border-warning">
                <div class="card-body">
                  <h5 class="text-warning">Pendiente de pago</h5>
                  <p class="text-muted mb-3">Completa la transferencia con los datos a continuación. Tu orden quedará confirmada una vez que recibamos el pago.</p>
                  <div class="card bg-white mb-3">
                    <div class="card-body">
                      <div class="mb-2"><strong>Banco:</strong> <span id="bank-name">BBVA Argentina</span></div>
                      <div class="mb-2"><strong>CBU/CVU:</strong>
                        <div class="input-group mt-2"><input type="text" class="form-control" id="bank-account" readonly><button class="btn btn-outline-secondary" id="copy-account-btn">Copiar</button></div>
                      </div>
                      <div class="mb-2"><strong>Alias:</strong>
                        <div class="input-group mt-2"><input type="text" class="form-control" id="bank-alias" readonly><button class="btn btn-outline-secondary" id="copy-alias-btn">Copiar</button></div>
                      </div>
                      <div><strong>Concepto:</strong><input type="text" class="form-control mt-2" id="transfer-concept" readonly></div>
                    </div>
                  </div>
                  <p class="text-muted small mb-0">⚠️ Usa el número de orden como referencia en la transferencia</p>
                </div>
              </div>
            </div>
            <div class="card mb-4">
              <div class="card-body">
                <h5 class="mb-3">Resumen de tu compra</h5>
                <div id="confirmation-summary"></div>
                <hr class="my-3">
                <div class="d-flex justify-content-between"><strong>Total:</strong><strong class="text-success" id="confirmation-total">$0</strong></div>
              </div>
            </div>
            <div class="card mb-4 bg-light">
              <div class="card-body">
                <h5 class="mb-3">Información de envío</h5>
                <p class="mb-0" id="confirmation-address"></p>
              </div>
            </div>
            <button class="btn btn-primary btn-lg w-100" id="return-home-btn">Volver a comprar</button>
          </div>
        </div>
      </div>
    </main>
  `,
  'admin-login-view': `
    <main id="admin-login-view" class="py-5 bg-light" style="min-height: 90vh; display: flex; align-items: center;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-5">
            <div class="text-center mb-4">
              <div class="display-6 mb-2">⚙️</div>
              <h2 class="fw-bold">Panel Administrativo</h2>
              <p class="text-muted">Ingresa tus credenciales para gestionar la tienda</p>
            </div>
            <form id="admin-login-form" class="card shadow border-0">
              <div class="card-body p-4 p-md-5">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Usuario</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white text-muted">👤</span>
                    <input type="text" class="form-control form-control-lg" id="admin-username" placeholder="Tu usuario" required>
                  </div>
                </div>
                <div class="mb-4">
                  <label class="form-label fw-semibold">Contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text bg-white text-muted">🔒</span>
                    <input type="password" class="form-control form-control-lg" id="admin-password" placeholder="********" required>
                    <button class="btn btn-outline-secondary" type="button" id="toggle-password">👁️</button>
                  </div>
                </div>
                <div id="login-error" class="alert alert-danger d-none mb-3 py-2 small"></div>
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg fw-bold">Entrar al Panel</button>
                  <button type="button" class="btn btn-link text-muted" id="cancel-login-btn">Volver a la tienda</button>
                </div>
              </div>
            </form>
            <p class="text-center mt-4 text-muted small">&copy; 2025 joelBazar Admin</p>
          </div>
        </div>
      </div>
    </main>
  `,
  'admin-dashboard-view': `
    <main id="admin-dashboard-view" class="py-4">
      <div class="container-fluid px-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom gap-3">
          <div>
            <h2 class="fw-bold mb-0">📊 Dashboard Admin</h2>
            <p class="text-muted mb-0 small">Gestiona tu inventario y pedidos en tiempo real</p>
          </div>
          <button class="btn btn-outline-danger fw-semibold" id="logout-btn">🔴 Cerrar Sesión</button>
        </div>
        
        <ul class="nav nav-pills mb-4 gap-2" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active d-flex align-items-center gap-2" id="products-tab" data-bs-toggle="tab" data-bs-target="#products-panel" type="button">
              <span>📦</span> Productos
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link d-flex align-items-center gap-2" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders-panel" type="button">
              <span>📋</span> Órdenes
            </button>
          </li>
        </ul>

        <div class="tab-content">
          <div class="tab-pane fade show active" id="products-panel" role="tabpanel">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h4 class="fw-bold mb-0">Gestión de Productos</h4>
                  <button class="btn btn-success fw-bold" id="new-product-btn">➕ Nuevo Producto</button>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover align-middle" id="products-table">
                    <thead class="table-light">
                      <tr>
                        <th class="py-3">Nombre</th>
                        <th class="py-3">Categoría</th>
                        <th class="py-3">Precio</th>
                        <th class="py-3">Stock</th>
                        <th class="py-3 text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="products-tbody"></tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div class="modal fade" id="productModal" tabindex="-1">
              <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                  <div class="modal-header bg-light">
                    <h5 class="modal-title fw-bold" id="productModalTitle">Nuevo Producto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body p-4">
                    <form id="product-form">
                      <div class="row g-3">
                        <div class="col-12">
                          <label class="form-label fw-semibold">Nombre del producto *</label>
                          <input type="text" class="form-control form-control-lg" id="product-name" placeholder="Ej. Camiseta Algodón" required>
                        </div>
                        <div class="col-12">
                          <label class="form-label fw-semibold">Descripción *</label>
                          <textarea class="form-control" id="product-description" rows="3" placeholder="Describe las características del producto..." required></textarea>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold">Precio (ARS) *</label>
                          <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="product-price" step="0.01" placeholder="0.00" required>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold">Stock *</label>
                          <input type="number" class="form-control" id="product-stock" placeholder="0" required>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold">Categoría *</label>
                          <select class="form-select" id="product-category" required>
                            <option value="">Seleccionar categoría</option>
                          </select>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold">URL de imagen</label>
                          <input type="url" class="form-control" id="product-image" placeholder="https://...">
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold">Colores (JSON)</label>
                          <input type="text" class="form-control" id="product-colors" placeholder='["Rojo", "Azul"]'>
                        </div>
                        <div class="col-md-6">
                          <label class="form-label fw-semibold">Tallas (JSON)</label>
                          <input type="text" class="form-control" id="product-sizes" placeholder='["S", "M", "L"]'>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary fw-bold" id="save-product-btn">Guardar Producto</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-pane fade" id="orders-panel" role="tabpanel">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h4 class="fw-bold mb-4">Gestión de Órdenes</h4>
                <div class="table-responsive">
                  <table class="table table-hover align-middle" id="orders-table">
                    <thead class="table-light">
                      <tr>
                        <th class="py-3">Orden</th>
                        <th class="py-3">Cliente</th>
                        <th class="py-3">Total</th>
                        <th class="py-3">Método</th>
                        <th class="py-3">Estado</th>
                        <th class="py-3 text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="orders-tbody"></tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div class="modal fade" id="orderModal" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow">
                  <div class="modal-header bg-light">
                    <h5 class="modal-title fw-bold">Actualizar Orden</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body p-4">
                    <div class="bg-light p-3 rounded mb-4">
                      <div class="row g-2">
                        <div class="col-6 text-muted small">ID Orden:</div><div class="col-6 fw-bold" id="order-id"></div>
                        <div class="col-6 text-muted small">Cliente:</div><div class="col-6 fw-bold" id="order-client"></div>
                        <div class="col-6 text-muted small">Total:</div><div class="col-6 fw-bold text-success" id="order-total"></div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Cambiar Estado de la Orden *</label>
                      <select class="form-select form-select-lg" id="order-status">
                        <option value="pendiente">⏳ Pendiente</option>
                        <option value="pagado">✅ Pagado</option>
                        <option value="enviado">📦 Enviado</option>
                        <option value="entregado">🎁 Entregado</option>
                        <option value="cancelado">❌ Cancelado</option>
                      </select>
                    </div>
                  </div>
                  <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary fw-bold btn-update-order" id="update-order-btn">Actualizar Estado</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
}
