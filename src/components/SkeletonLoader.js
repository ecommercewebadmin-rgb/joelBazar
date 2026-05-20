export class Skeleton {
  static renderProductCards(container, count = 8) {
    if (!container) return;

    const html = Array(count)
      .fill(0)
      .map(
        () => `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <div class="skeleton" style="height: 220px; margin-bottom: 1rem;"></div>
            <div class="card-body">
              <div class="skeleton skeleton-title mb-2"></div>
              <div class="skeleton skeleton-text mb-2"></div>
              <div class="skeleton skeleton-text" style="width: 60%;"></div>
              <div class="skeleton skeleton-button mt-3"></div>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    container.innerHTML = html;
  }

  static renderProductDetail(container) {
    const html = `
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <div class="skeleton" style="height: 400px;"></div>
        </div>
        <div class="col-12 col-md-6">
          <div class="skeleton skeleton-title mb-3"></div>
          <div class="skeleton skeleton-text mb-3"></div>
          <div class="skeleton skeleton-button mb-3"></div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
}
