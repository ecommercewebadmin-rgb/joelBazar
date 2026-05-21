export class Toast {
  static show(message, type = 'success', duration = 3000) {
    // Crear contenedor de toasts si no existe
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container position-fixed top-0 start-50 translate-middle-x p-3';
      container.style.zIndex = '1060';
      container.style.textAlign = 'center';
      document.body.appendChild(container);
    }

    // Crear el elemento Toast
    const toastId = `toast-${Date.now()}`;
    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = toastHtml;
    const toastElement = wrapper.firstElementChild;
    
    container.appendChild(toastElement);

    // Inicializar y mostrar el toast de Bootstrap
    const bsToast = new bootstrap.Toast(toastElement, {
      delay: duration
    });
    
    bsToast.show();

    // Eliminar el elemento del DOM después de que se oculte
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }
}
