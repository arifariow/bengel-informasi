document.addEventListener('DOMContentLoaded', function () {
    // Inisialisasi AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true
    });

    // Ambil semua elemen yang dibutuhkan
    const tipsContainer = document.getElementById('tipsContainer');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const noResultsState = document.getElementById('noResultsState');
    const resultsCount = document.getElementById('resultsCount');
    const totalCount = document.getElementById('totalCount');
    const filterInfoText = document.getElementById('filterInfoText');
    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const heroSearchInput = document.getElementById('heroSearchInput');
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    const searchTags = document.querySelectorAll('.search-tag');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const resetSearchBtn = document.getElementById('resetSearchBtn'); // 1. Ambil tombol reset baru
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const tipModal = new bootstrap.Modal(document.getElementById('tipModal'));
    const backToTopBtn = document.getElementById('backToTop');
    const footerLinks = document.querySelectorAll('.footer-link');
    const footerSearchLinks = document.querySelectorAll('.footer-search-link');

    // Tambahkan tombol dark mode toggle ke navbar
    const nav = document.getElementById('mainNav').querySelector('.container');
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'btn btn-outline-secondary ms-2';
    darkModeBtn.id = 'darkModeToggle';
    darkModeBtn.title = 'Toggle Dark Mode';
    darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    nav.appendChild(darkModeBtn);

    // Dark mode logic
    function setDarkMode(on) {
        document.body.classList.toggle('dark-mode', on);
        localStorage.setItem('darkMode', on ? '1' : '0');
        darkModeBtn.innerHTML = on ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    darkModeBtn.addEventListener('click', () => setDarkMode(!document.body.classList.contains('dark-mode')));
    if (localStorage.getItem('darkMode') === '1') setDarkMode(true);

    // State aplikasi
    let currentCategory = 'all';
    let currentSearchTerm = '';
    let currentView = 'grid'; // 'grid' atau 'list'
    let currentPage = 1;
    const itemsPerPage = 9; // Menampilkan 9 item per halaman (3x3 grid)

    // Set total tips di UI
    const allTips = tipsData.tips;
    document.getElementById('totalTips').textContent = `${allTips.length}+`;
    document.getElementById('footerTotalTips').textContent = `${allTips.length}+`;
    totalCount.textContent = allTips.length;

    // --- FUNGSI-FUNGSI UTAMA ---

    /**
     * Menampilkan tips berdasarkan filter, pencarian, dan halaman saat ini
     * @param {boolean} isSearchAction - Bernilai true jika fungsi dipanggil oleh aksi pencarian
     */
    function displayTips(isSearchAction = false) {
        loadingState.style.display = 'block';
        tipsContainer.style.display = 'none';
        noResultsState.style.display = 'none';
        emptyState.style.display = 'none';
        document.getElementById('paginationNav').style.display = 'none';

        setTimeout(() => { // Simulasi loading
            let filteredTips = allTips;

            // 1. Filter berdasarkan kategori
            if (currentCategory !== 'all') {
                filteredTips = filteredTips.filter(tip => tip.category === currentCategory);
            }

            // 2. Filter berdasarkan pencarian
            if (currentSearchTerm) {
                filteredTips = filteredTips.filter(tip => 
                    tip.title.toLowerCase().includes(currentSearchTerm) ||
                    tip.description.toLowerCase().includes(currentSearchTerm)
                );
            }

            // --- LOGIKA PAGINASI ---
            const totalFilteredItems = filteredTips.length;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedTips = filteredTips.slice(startIndex, endIndex);
            
            loadingState.style.display = 'none';
            tipsContainer.innerHTML = '';

            if (allTips.length === 0) {
                emptyState.style.display = 'block';
            } else if (totalFilteredItems === 0) {
                noResultsState.style.display = 'block';
            } else {
                tipsContainer.style.display = (currentView === 'grid') ? 'flex' : 'block';
                paginatedTips.forEach(tip => {
                    const tipElement = (currentView === 'grid') ? createTipCard(tip) : createTipListItem(tip);
                    tipsContainer.innerHTML += tipElement;
                });
            }
            
            renderPagination(totalFilteredItems);
            updateUI(paginatedTips.length, totalFilteredItems);

            // --- LOGIKA AUTO-SCROLL ---
            if (isSearchAction) {
                // Gulir ke bagian tips setelah hasil ditampilkan
                document.getElementById('tips-section').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                });
            }

            // Aktifkan tombol favorit
            document.querySelectorAll('.btn-fav').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.classList.toggle('active');
                });
            });
        }, 500);
    }

    /**
     * Membuat HTML untuk tampilan kartu (Grid View)
     * @param {object} tip - Objek data tip
     */
    function createTipCard(tip) {
        const difficultyBadge = getDifficultyBadge(tip.difficulty);
        // Badge baru untuk tips dengan id terbesar (anggap 3 tips terbaru)
        const isNew = tip.id >= Math.max(...allTips.map(t=>t.id)) - 2;
        return `
            <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
                <div class="card h-100 tip-card">
                    ${isNew ? '<span class="badge-new">Baru</span>' : ''}
                    <button class="btn-fav" title="Favorit"><i class="fas fa-heart"></i></button>
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <span class="badge bg-primary-subtle text-primary-emphasis rounded-pill me-2 card-category">${tip.category}</span>
                            <span class="badge ${difficultyBadge} rounded-pill">${tip.difficulty}</span>
                        </div>
                        <h5 class="card-title">${tip.title}</h5>
                        <p class="card-text small text-muted flex-grow-1">${tip.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <small class="text-muted"><i class="fas fa-clock me-1"></i> ${tip.readTime}</small>
                            <button class="btn btn-sm btn-outline-primary" onclick="showTipDetails(${tip.id})">
                                Baca Selengkapnya <i class="fas fa-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Membuat HTML untuk tampilan daftar (List View)
     * @param {object} tip - Objek data tip
     */
    function createTipListItem(tip) {
        const difficultyBadge = getDifficultyBadge(tip.difficulty);
        return `
            <div class="col-12 mb-3" data-aos="fade-up">
                <div class="p-3 tip-list-item d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                    <div class="mb-3 mb-md-0">
                        <span class="badge bg-primary-subtle text-primary-emphasis rounded-pill me-2">${tip.category}</span>
                        <span class="badge ${difficultyBadge} rounded-pill">${tip.difficulty}</span>
                        <h6 class="mt-2 mb-1">${tip.title}</h6>
                        <p class="small text-muted mb-0">${tip.description}</p>
                    </div>
                    <div class="d-flex align-items-center flex-shrink-0">
                        <small class="text-muted me-3"><i class="fas fa-clock me-1"></i> ${tip.readTime}</small>
                        <button class="btn btn-sm btn-outline-primary" onclick="showTipDetails(${tip.id})">
                           Baca Selengkapnya <i class="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Menentukan kelas badge Bootstrap berdasarkan tingkat kesulitan
     * @param {string} difficulty - Tingkat kesulitan ('Mudah', 'Sedang', 'Sulit')
     */
    function getDifficultyBadge(difficulty) {
        switch(difficulty.toLowerCase()) {
            case 'mudah': return 'bg-success-subtle text-success-emphasis';
            case 'sedang': return 'bg-warning-subtle text-warning-emphasis';
            case 'sulit': return 'bg-danger-subtle text-danger-emphasis';
            default: return 'bg-secondary-subtle text-secondary-emphasis';
        }
    }

    /**
     * Memperbarui informasi UI seperti jumlah hasil dan status filter
     * @param {number} displayedCount - Jumlah tips di halaman saat ini
     * @param {number} totalFilteredCount - Jumlah total tips setelah filter
     */
    function updateUI(displayedCount, totalFilteredCount) {
        resultsCount.textContent = displayedCount;
        totalCount.textContent = totalFilteredCount;
        let info = '';
        if (currentCategory !== 'all') {
            info += `dalam kategori <span class="badge bg-secondary">${currentCategory}</span>`;
        }
        if (currentSearchTerm) {
            info += `${info ? ' ' : ''}dengan kata kunci <span class="badge bg-secondary">"${currentSearchTerm}"</span>`;
        }
        filterInfoText.innerHTML = info;

        // 2. Logika untuk menampilkan atau menyembunyikan tombol reset
        if (currentCategory !== 'all' || currentSearchTerm) {
            resetSearchBtn.style.display = 'inline-block';
        } else {
            resetSearchBtn.style.display = 'none';
        }
    }

    /**
     * Membuat dan menampilkan kontrol paginasi
     * @param {number} totalItems - Jumlah total item setelah difilter
     */
    function renderPagination(totalItems) {
        const paginationNav = document.getElementById('paginationNav');
        const paginationUl = document.getElementById('pagination');
        paginationUl.innerHTML = '';

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            paginationNav.style.display = 'none';
            return;
        }
        paginationNav.style.display = 'flex';

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

        // Tombol "Previous"
        paginationUl.appendChild(createPageItem(currentPage - 1, '&laquo;', currentPage === 1));

        // Tombol halaman
        for (let i = 1; i <= totalPages; i++) {
            paginationUl.appendChild(createPageItem(i, i, false, currentPage === i));
        }

        // Tombol "Next"
        paginationUl.appendChild(createPageItem(currentPage + 1, '&raquo;', currentPage === totalPages));

        paginationUl.querySelectorAll('a.page-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const page = parseInt(link.dataset.page, 10);
                currentPage = page;
                displayTips();
            });
        });
    }

    // --- MODAL SHARE BUTTONS ---
    // Tambahkan tombol share di modal saat showTipDetails
    window.showTipDetails = function(tipId) {
        const tip = allTips.find(t => t.id === tipId);
        if (!tip) return;

        const iconMap = { 'Mobil': 'fa-car', 'Motor': 'fa-motorcycle', 'Truk': 'fa-truck', 'Perawatan': 'fa-tools' };
        const difficultyColorMap = { 'Mudah': 'bg-success', 'Sedang': 'bg-warning', 'Sulit': 'bg-danger' };

        document.getElementById('modalTitle').textContent = tip.title;
        document.querySelector('#tipModalLabel .modal-icon').className = `modal-icon me-2 fas ${iconMap[tip.category] || 'fa-info-circle'}`;
        
        let modalBodyHtml = `<p class="lead">${tip.description}</p>`;
        if (tip.steps && tip.steps.length > 0) {
            modalBodyHtml += `<h6><i class="fas fa-shoe-prints me-2"></i>Langkah-langkah:</h6>
            <ol class="step-list">
                ${tip.steps.map((step, index) => `<li class="step-item"><span class="step-number">${index + 1}</span> <span>${step}</span></li>`).join('')}
            </ol>`;
        }
        if (tip.tips && tip.tips.length > 0) {
            modalBodyHtml += `<h6 class="mt-4"><i class="fas fa-lightbulb me-2"></i>Tips Tambahan:</h6>
            <ul class="list-group list-group-flush">
                ${tip.tips.map(t => `<li class="list-group-item"><i class="fas fa-check-circle text-success me-2"></i>${t}</li>`).join('')}
            </ul>`;
        }

        document.getElementById('modalBody').innerHTML = modalBodyHtml;
        document.getElementById('modalCategory').textContent = tip.category;
        document.getElementById('modalDifficulty').textContent = tip.difficulty;
        document.getElementById('modalDifficulty').className = `badge modal-difficulty-badge ms-2 ${difficultyColorMap[tip.difficulty] || 'bg-secondary'}`;
        document.getElementById('modalReadTime').innerHTML = `<i class="fas fa-clock me-1"></i> ${tip.readTime}`;

        // Share buttons
        const shareHtml = `
            <button class="share-btn" title="Bagikan ke WhatsApp" onclick="window.open('https://wa.me/?text='+encodeURIComponent('${tip.title} - ${tip.description}'),'_blank')"><i class="fab fa-whatsapp"></i></button>
            <button class="share-btn" title="Bagikan ke Facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href),'_blank')"><i class="fab fa-facebook-f"></i></button>
            <button class="share-btn" title="Bagikan ke Twitter" onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent('${tip.title} - ${tip.description}'),'_blank')"><i class="fab fa-twitter"></i></button>
        `;
        document.querySelector('#tipModal .modal-footer > .d-flex').insertAdjacentHTML('beforeend', shareHtml);

        tipModal.show();
    }

    // --- EVENT LISTENERS ---

    // Filter Kategori di Navbar
    navbarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            navbarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentPage = 1; // Reset ke halaman 1 saat ganti kategori
            currentCategory = this.dataset.category;
            displayTips();
        });
    });
    
    // Filter Kategori di Footer
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            currentPage = 1; // Reset ke halaman 1
            document.querySelector(`.navbar-nav .nav-link[data-category="${category}"]`).click();
            document.getElementById('tips-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Pencarian di Hero Section
    heroSearchBtn.addEventListener('click', () => {
        currentSearchTerm = heroSearchInput.value.toLowerCase().trim();
        currentPage = 1; // Reset ke halaman 1 saat mencari
        displayTips(true); // Kirim 'true' untuk menandakan aksi pencarian
    });
    heroSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentSearchTerm = heroSearchInput.value.toLowerCase().trim();
            currentPage = 1; // Reset ke halaman 1 saat mencari
            displayTips(true); // Kirim 'true' untuk menandakan aksi pencarian
        }
    });
    
    // Tag Pencarian Populer
    [...searchTags, ...footerSearchLinks].forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = this.dataset.search;
            heroSearchInput.value = searchTerm;
            currentSearchTerm = searchTerm.toLowerCase().trim();
            currentPage = 1; // Reset ke halaman 1
            displayTips(true); // Kirim 'true' untuk menandakan aksi pencarian
            if (e.target.closest('.footer-section')) {
                document.getElementById('tips-section').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Tombol Hapus Pencarian
    clearSearchBtn.addEventListener('click', () => {
        heroSearchInput.value = '';
        currentSearchTerm = '';
        currentPage = 1; // Reset ke halaman 1
        document.querySelector('.navbar-nav .nav-link[data-category="all"]').click();
        // .click() akan memicu displayTips() secara otomatis
    });

    // 3. Fungsionalitas untuk tombol reset di baris filter
    resetSearchBtn.addEventListener('click', () => {
        clearSearchBtn.click(); // Memicu fungsi reset yang sudah ada
    });

    // Toggle Tampilan Grid/List
    function setView(view) {
        currentView = view;
        if (view === 'grid') {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            tipsContainer.classList.remove('list-view');
        } else {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            tipsContainer.classList.add('list-view');
        }
        currentPage = 1; // Reset ke halaman 1 saat ganti tampilan
        displayTips();
    }
    gridViewBtn.addEventListener('click', () => setView('grid'));
    listViewBtn.addEventListener('click', () => setView('list'));

    // Tombol Kembali ke Atas
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Tampilkan semua tips saat halaman pertama kali dimuat
    setView('grid'); // Ini sudah otomatis panggil displayTips()
    document.querySelector('.navbar-nav .nav-link[data-category="all"]').classList.add('active');
});