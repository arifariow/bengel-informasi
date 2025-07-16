// assets/js/main-fixed.js

class TipsManager {
    constructor() {
        this.allTips = [];
        this.filteredTips = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        this.itemsPerPage = 9;
        
        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadTips();
        this.setupEventListeners();
        this.applyFilters();
        AOS.init({ once: true, duration: 600, offset: 50 });
    }

    async loadTips() {
        try {
            const response = await fetch('data/data.json'); // Perhatikan path file
            if (!response.ok) throw new Error('Data tidak dapat dimuat');
            const data = await response.json();
            this.allTips = Array.isArray(data) ? data : []; // Asumsi data JSON adalah array
         } catch (error) {
            console.error('Error loading tips:', error);
            this.allTips = [];
        }
    }

    setupEventListeners() {
        document.querySelectorAll('[data-category]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                this.filterByCategory(e.target.closest('[data-category]').dataset.category);
            });
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.updateActiveNavLink(document.querySelector(`[data-category="${category}"]`));
        this.applyFilters();
    }

    applyFilters() {
        this.currentPage = 1;
        this.filteredTips = this.allTips.filter(tip => {
            const vehicleType = (tip.vehicle_type || tip.category || '').toLowerCase();
            const topic = (tip.topic || '').toLowerCase();
            const title = (tip.title || '').toLowerCase();
            const description = (tip.description || '').toLowerCase();
            
            let categoryFilter;
            switch(this.currentCategory) {
                case 'all':
                    categoryFilter = true;
                    break;
                case 'masalah mesin':
                case 'masalah rem':
                case 'masalah kelistrikan':
                    categoryFilter = topic.includes(this.currentCategory);
                    break;
                default:
                    categoryFilter = vehicleType.includes(this.currentCategory);
            }

            const matchesSearch = this.searchQuery === '' || 
                                  title.includes(this.searchQuery) ||
                                  description.includes(this.searchQuery) ||
                                  topic.includes(this.searchQuery);
                                  
            return categoryFilter && matchesSearch;
        });
        this.displayTips();
    }
    
    updateActiveNavLink(activeLink) {
        document.querySelectorAll('nav .nav-link').forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
    }

    displayTips() {
        const container = document.getElementById('tipsContainer');
        this.hideStates();

        if (this.allTips.length === 0) { this.showEmpty(); return; }
        if (this.filteredTips.length === 0) { this.showNoResults(); return; }

        container.style.display = 'flex';
        container.innerHTML = '';
        
        this.getPaginatedTips().forEach((tip, index) => {
            container.appendChild(this.createTipCard(tip, index));
        });
        
        this.renderPagination();
        setTimeout(() => AOS.refresh(), 50);
    }

    createTipCard(tip, index) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 d-flex';
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-delay', (index % 3) * 50);

        const defaultImage = 'https://images.unsplash.com/photo-1620656653362-3a182d33fb61?w=400&q=80';
        const vehicleType = tip.vehicle_type || tip.category; // Tetap sama
        const originalImageUrl = tip.image || defaultImage;
        const imageUrlWithProxy = `https://corsproxy.io/?${encodeURIComponent(originalImageUrl)}`;

        col.innerHTML = `
            <div class="tip-card d-flex flex-column w-100">
                <div class="card-img-container">
                    <img src="${imageUrlWithProxy}" class="card-img-top" alt="${tip.title}" loading="lazy">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${tip.title}</h5>
                    <p class="card-text flex-grow-1">${tip.description.substring(0, 80)}...</p>
                    <div class="card-info">
                        <div class="info-item text-capitalize">
                            <i class="fas fa-car fa-fw"></i> ${vehicleType}
                        </div>
                        <div class="info-item text-capitalize">
                            <i class="fas fa-tag fa-fw"></i> ${tip.topic}
                        </div>
                    </div>
                    <button class="btn btn-read-more" onclick="window.currentTipManager.showTipModal(${tip.id})">
                        Lihat Detail
                    </button>
                </div>
            </div>`;
        return col;
    }
    
    getPaginatedTips() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredTips.slice(startIndex, endIndex);
    }
    
    renderPagination() {
        const paginationNav = document.getElementById('paginationNav');
        const paginationUl = document.getElementById('pagination');
        if (!paginationNav || !paginationUl) return;

        const totalPages = Math.ceil(this.filteredTips.length / this.itemsPerPage);
        paginationUl.innerHTML = '';

        if (totalPages <= 1) {
            paginationNav.style.display = 'none';
            return;
        }
        paginationNav.style.display = 'block';

        const createPageItem = (page, text, isDisabled = false, isActive = false) => {
            const li = document.createElement('li');
            li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.innerHTML = text;
            a.dataset.page = page;
            li.appendChild(a);
            return li;
        };

        paginationUl.appendChild(createPageItem(this.currentPage - 1, '&laquo;', this.currentPage === 1));
        for (let i = 1; i <= totalPages; i++) {
            paginationUl.appendChild(createPageItem(i, i, false, this.currentPage === i));
        }
        paginationUl.appendChild(createPageItem(this.currentPage + 1, '&raquo;', this.currentPage === totalPages));

        paginationNav.querySelectorAll('a.page-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const page = parseInt(link.dataset.page, 10);
                if (page && page !== this.currentPage && page > 0 && page <= totalPages) {
                    this.currentPage = page;
                    this.displayTips();
                    document.getElementById('tips-section').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    showTipModal(tipId) {
        // ... (Fungsi ini tidak perlu diubah)
        const tip = this.allTips.find(t => t.id === tipId);
        if (!tip) return;
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalTags = document.getElementById('modalTags');
        const vehicleType = tip.vehicle_type || tip.category;
        const topic = tip.topic || 'Umum';
        modalTitle.textContent = tip.title;
        modalTags.innerHTML = `<span class="badge bg-warning text-dark me-2 text-capitalize">${vehicleType}</span><span class="badge bg-secondary text-capitalize">${topic}</span>`;
        let bodyHtml = `<p class="lead">${tip.description}</p>`;
        const renderList = (title, icon, items) => {
            if (!items || items.length === 0) return '';
            let listHtml = `<h6 class="mt-4"><i class="${icon} me-2"></i>${title}</h6><ul>`;
            items.forEach(item => listHtml += `<li>${item}</li>`);
            listHtml += '</ul>';
            return listHtml;
        };
        bodyHtml += renderList('Solusi', 'fas fa-wrench text-success', tip.solusi);
        if (tip.batas_aman) {
            bodyHtml += '<h6 class="mt-4"><i class="fas fa-shield-alt text-warning me-2"></i>Batas Aman</h6><ul>';
            Object.entries(tip.batas_aman).forEach(([key, value]) => {
                 bodyHtml += `<li><strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong> ${value}</li>`;
            });
            bodyHtml += '</ul>';
        }
        if (tip.penanggulangan) {
             bodyHtml += renderList('Pencegahan', 'fas fa-check-circle text-success', tip.penanggulangan.pencegahan);
             bodyHtml += renderList('Tindakan Darurat', 'fas fa-exclamation-triangle text-danger', tip.penanggulangan.darurat);
        }
        modalBody.innerHTML = bodyHtml;
        const bsModal = new bootstrap.Modal(document.getElementById('tipModal'));
        bsModal.show();
    }

    hideStates() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('noResultsState').style.display = 'none';
        document.getElementById('tipsContainer').style.display = 'none';
        document.getElementById('paginationNav').style.display = 'none';
    }
    showLoading() { this.hideStates(); document.getElementById('loadingState').style.display = 'block'; }
    showEmpty() { this.hideStates(); document.getElementById('emptyState').style.display = 'block'; }
    showNoResults() { this.hideStates(); document.getElementById('noResultsState').style.display = 'block'; }
}

window.currentTipManager = new TipsManager(); 