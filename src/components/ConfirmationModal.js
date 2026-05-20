export class ConfirmationModal {
  constructor() {
    this.modalId = 'custom-confirmation-modal';
    this.init();
  }

  init() {
    if (document.getElementById(this.modalId)) return;

    const modalHtml = `
      <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-bold" id="confirm-modal-title">Confirmación</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body py-3">
              <p class="mb-0" id="confirm-modal-message">¿Estás seguro de realizar esta acción?</p>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button type="button" class="btn btn-outline-secondary" id="confirm-modal-cancel">Cancelar</button>
              <button type="button" class="btn btn-primary" id="confirm-modal-ok">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);
    this.modalElement = document.getElementById(this.modalId);
    this.bootstrapModal = new bootstrap.Modal(this.modalElement);
  }

  async alert(title, message, options = {}) {
    return new Promise((resolve) => {
      this.setupModal(title, message, 'alert', options);
      this.bootstrapModal.show();

      const okBtn = document.getElementById('confirm-modal-ok');
      const cancelBtn = document.getElementById('confirm-modal-cancel');
      
      cancelBtn.style.display = 'none';

      okBtn.onclick = () => {
        this.bootstrapModal.hide();
        resolve(true);
      };
    });
  }

  async confirm(title, message, options = {}) {
    return new Promise((resolve) => {
      this.setupModal(title, message, 'confirm', options);
      this.bootstrapModal.show();

      const okBtn = document.getElementById('confirm-modal-ok');
      const cancelBtn = document.getElementById('confirm-modal-cancel');
      
      cancelBtn.style.display = 'block';

      okBtn.onclick = () => {
        this.bootstrapModal.hide();
        resolve(true);
      };

      cancelBtn.onclick = () => {
        this.bootstrapModal.hide();
        resolve(false);
      };
    });
  }

  setupModal(title, message, type, options) {
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    
    const okBtn = document.getElementById('confirm-modal-ok');
    
    // Custom styles based on options
    okBtn.className = 'btn ' + (options.btnClass || (type === 'confirm' && options.danger ? 'btn-danger' : 'btn-primary'));
    okBtn.textContent = options.okText || (type === 'confirm' ? 'Confirmar' : 'Aceptar');
    
    const cancelBtn = document.getElementById('confirm-modal-cancel');
    cancelBtn.textContent = options.cancelText || 'Cancelar';
  }
}

export const confirmationModal = new ConfirmationModal();
