// AI Tools Hub - Main Frontend Application Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // API Configuration
    const API_BASE = '/api/tools';

    // Application State
    let allTools = [];
    let currentCategory = 'All';
    let currentPricing = 'All';
    let currentSearchTerm = '';
    let adminSearchTerm = '';
    let toolDetailsModal = null;
    let toolFormModal = null;
    let deleteConfirmModal = null;

    // DOM Elements
    const toolsGrid = document.getElementById('toolsGrid');
    const toolsLoadingSpinner = document.getElementById('toolsLoadingSpinner');
    const noToolsFound = document.getElementById('noToolsFound');
    const emptyStateMessage = document.getElementById('emptyStateMessage');
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const categoryPills = document.querySelectorAll('.category-pill');
    const pricingBtns = document.querySelectorAll('.pricing-filter-btn');
    const activeFilterLabel = document.getElementById('activeFilterLabel');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    // Navigation & Views
    const userViewSection = document.getElementById('userViewSection');
    const adminViewSection = document.getElementById('adminViewSection');
    const viewUserModeBtn = document.getElementById('viewUserModeBtn');
    const viewAdminModeBtn = document.getElementById('viewAdminModeBtn');

    // Hero Stats Elements
    const statTotalTools = document.getElementById('statTotalTools');
    const statFreeTools = document.getElementById('statFreeTools');

    // Admin Elements
    const adminTotalCount = document.getElementById('adminTotalCount');
    const adminFreeCount = document.getElementById('adminFreeCount');
    const adminPaidCount = document.getElementById('adminPaidCount');
    const adminCategoryCount = document.getElementById('adminCategoryCount');
    const adminToolsTableBody = document.getElementById('adminToolsTableBody');
    const adminTableSearch = document.getElementById('adminTableSearch');
    const addNewToolModalBtn = document.getElementById('addNewToolModalBtn');

    // Form & Modal Elements
    const toolForm = document.getElementById('toolForm');
    const formToolId = document.getElementById('formToolId');
    const toolFormModalTitle = document.getElementById('toolFormModalTitle');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteToolId = document.getElementById('deleteToolId');
    const deleteToolNameText = document.getElementById('deleteToolNameText');

    // Initialize Bootstrap Modals
    if (document.getElementById('toolDetailsModal')) {
        toolDetailsModal = new bootstrap.Modal(document.getElementById('toolDetailsModal'));
    }
    if (document.getElementById('toolFormModal')) {
        toolFormModal = new bootstrap.Modal(document.getElementById('toolFormModal'));
    }
    if (document.getElementById('deleteConfirmModal')) {
        deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    }

    // Default Fallback Image
    const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

    // -------------------------------------------------------------
    // INITIALIZATION & FETCH DATA
    // -------------------------------------------------------------
    init();

    async function init() {
        setupEventListeners();
        await fetchAllData();
    }

    async function fetchAllData() {
        showSpinner(true);
        try {
            await Promise.all([loadTools(), loadStatistics()]);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Failed to connect to backend server. Make sure Spring Boot application is running.', 'error');
        } finally {
            showSpinner(false);
        }
    }

    async function loadTools() {
        try {
            let url = API_BASE;
            if (currentSearchTerm) {
                url = `${API_BASE}/search?keyword=${encodeURIComponent(currentSearchTerm)}`;
            } else if (currentCategory !== 'All') {
                url = `${API_BASE}/category/${encodeURIComponent(currentCategory)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            allTools = await response.json();
            
            renderFilteredTools();
            renderAdminTable();
        } catch (error) {
            console.error('Failed to load tools:', error);
            toolsGrid.innerHTML = '';
            noToolsFound.classList.remove('d-none');
            emptyStateMessage.textContent = 'Could not load tools from server.';
        }
    }

    async function loadStatistics() {
        try {
            const response = await fetch(`${API_BASE}/stats`);
            if (!response.ok) return;
            const stats = await response.json();

            // Update User Stats
            if (statTotalTools) statTotalTools.textContent = stats.totalTools || 0;
            if (statFreeTools && stats.pricingCounts) {
                const freeOrFreemium = (stats.pricingCounts.Free || 0) + (stats.pricingCounts.Freemium || 0);
                statFreeTools.textContent = freeOrFreemium;
            }

            // Update Admin Stats
            if (adminTotalCount) adminTotalCount.textContent = stats.totalTools || 0;
            if (adminFreeCount && stats.pricingCounts) {
                adminFreeCount.textContent = (stats.pricingCounts.Free || 0) + (stats.pricingCounts.Freemium || 0);
            }
            if (adminPaidCount && stats.pricingCounts) {
                adminPaidCount.textContent = stats.pricingCounts.Paid || 0;
            }
            if (adminCategoryCount && stats.categoryCounts) {
                adminCategoryCount.textContent = Object.keys(stats.categoryCounts).length;
            }
        } catch (err) {
            console.warn('Could not fetch stats:', err);
        }
    }

    // -------------------------------------------------------------
    // RENDERING LOGIC
    // -------------------------------------------------------------
    function renderFilteredTools() {
        let filtered = [...allTools];

        // Apply secondary pricing filter if set
        if (currentPricing !== 'All') {
            filtered = filtered.filter(t => t.pricing && t.pricing.toLowerCase() === currentPricing.toLowerCase());
        }

        // Search term client filter fallback / refinement
        if (currentSearchTerm) {
            const term = currentSearchTerm.toLowerCase();
            filtered = filtered.filter(t => 
                (t.name && t.name.toLowerCase().includes(term)) ||
                (t.description && t.description.toLowerCase().includes(term)) ||
                (t.category && t.category.toLowerCase().includes(term)) ||
                (t.features && t.features.toLowerCase().includes(term))
            );
        }

        toolsGrid.innerHTML = '';

        if (filtered.length === 0) {
            noToolsFound.classList.remove('d-none');
            emptyStateMessage.textContent = `No tools match "${currentSearchTerm || currentCategory}" with pricing "${currentPricing}".`;
            return;
        }

        noToolsFound.classList.add('d-none');

        filtered.forEach(tool => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4';
            
            const imageUrl = tool.imageUrl && tool.imageUrl.trim() !== '' ? tool.imageUrl : DEFAULT_IMAGE;
            const pricingClass = getPricingBadgeClass(tool.pricing);
            const features = tool.features ? tool.features.split(',').map(f => f.trim()).slice(0, 3) : [];

            col.innerHTML = `
                <div class="glass-card tool-card h-100">
                    <div class="card-img-wrap">
                        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(tool.name)}" onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';">
                        <div class="pricing-badge-overlay">
                            <span class="badge badge-pricing ${pricingClass}">${escapeHtml(tool.pricing || 'Free')}</span>
                        </div>
                        <div class="category-badge-overlay">
                            <span class="badge badge-category">
                                <i class="fa-solid fa-tag me-1 text-accent"></i>${escapeHtml(tool.category)}
                            </span>
                        </div>
                    </div>
                    <div class="p-4 d-flex flex-column flex-grow-1">
                        <h4 class="fw-bold text-light mb-2">${escapeHtml(tool.name)}</h4>
                        <p class="tool-description-clamp mb-3">${escapeHtml(tool.description)}</p>

                        ${features.length > 0 ? `
                            <div class="d-flex flex-wrap gap-1 mb-3 mt-auto">
                                ${features.map(f => `<span class="feature-pill"><i class="fa-solid fa-check text-success me-1"></i>${escapeHtml(f)}</span>`).join('')}
                            </div>
                        ` : ''}

                        <div class="d-flex align-items-center justify-content-between pt-3 border-top border-secondary mt-auto">
                            <button class="btn btn-sm btn-outline-light view-details-btn" data-id="${tool.id}">
                                <i class="fa-solid fa-circle-info me-1"></i> Details
                            </button>
                            <a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-gradient">
                                Visit Site <i class="fa-solid fa-arrow-up-right-from-square ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            toolsGrid.appendChild(col);
        });

        // Add event listeners to view-details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                openDetailsModal(id);
            });
        });
    }

    function renderAdminTable() {
        if (!adminToolsTableBody) return;

        let filtered = [...allTools];
        if (adminSearchTerm) {
            const term = adminSearchTerm.toLowerCase();
            filtered = filtered.filter(t => 
                t.name.toLowerCase().includes(term) || 
                t.category.toLowerCase().includes(term) ||
                t.pricing.toLowerCase().includes(term)
            );
        }

        adminToolsTableBody.innerHTML = '';

        if (filtered.length === 0) {
            adminToolsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-muted">
                        No AI tools match admin filter criteria.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(tool => {
            const tr = document.createElement('tr');
            const imageUrl = tool.imageUrl && tool.imageUrl.trim() !== '' ? tool.imageUrl : DEFAULT_IMAGE;
            const pricingClass = getPricingBadgeClass(tool.pricing);
            const formattedDate = tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'N/A';

            tr.innerHTML = `
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${escapeHtml(imageUrl)}" alt="" class="table-thumb" onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';">
                        <div>
                            <div class="fw-bold text-light">${escapeHtml(tool.name)}</div>
                            <div class="small text-muted text-truncate" style="max-width: 200px;">${escapeHtml(tool.description)}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-category">${escapeHtml(tool.category)}</span></td>
                <td><span class="badge badge-pricing ${pricingClass}">${escapeHtml(tool.pricing)}</span></td>
                <td>
                    <a href="${escapeHtml(tool.url)}" target="_blank" class="text-accent text-decoration-none small">
                        <i class="fa-solid fa-link me-1"></i>${escapeHtml(tool.url)}
                    </a>
                </td>
                <td class="small text-muted">${formattedDate}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info me-1 edit-tool-btn" data-id="${tool.id}" title="Edit Tool">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-tool-btn" data-id="${tool.id}" data-name="${escapeHtml(tool.name)}" title="Delete Tool">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            adminToolsTableBody.appendChild(tr);
        });

        // Event listeners for admin edit & delete
        document.querySelectorAll('.edit-tool-btn').forEach(btn => {
            btn.addEventListener('click', () => openFormModal(btn.getAttribute('data-id')));
        });

        document.querySelectorAll('.delete-tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                openDeleteConfirmModal(id, name);
            });
        });
    }

    // -------------------------------------------------------------
    // MODALS & EVENT HANDLERS
    // -------------------------------------------------------------
    function openDetailsModal(toolId) {
        const tool = allTools.find(t => t.id == toolId);
        if (!tool) return;

        document.getElementById('detailToolName').textContent = tool.name;
        document.getElementById('detailCategory').textContent = tool.category;
        
        const detailPricing = document.getElementById('detailPricing');
        detailPricing.textContent = tool.pricing;
        detailPricing.className = `badge badge-pricing ${getPricingBadgeClass(tool.pricing)}`;

        document.getElementById('detailDescription').textContent = tool.description;
        document.getElementById('detailVisitBtn').href = tool.url;

        const imgEl = document.getElementById('detailToolImage');
        imgEl.src = tool.imageUrl && tool.imageUrl.trim() !== '' ? tool.imageUrl : DEFAULT_IMAGE;
        imgEl.onerror = () => { imgEl.src = DEFAULT_IMAGE; };

        document.getElementById('detailCreatedAt').innerHTML = `
            <i class="fa-regular fa-calendar me-1"></i> Listed: ${tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'Recently'}
        `;

        const featuresListEl = document.getElementById('detailFeaturesList');
        featuresListEl.innerHTML = '';
        if (tool.features && tool.features.trim() !== '') {
            const features = tool.features.split(',');
            features.forEach(f => {
                if (f.trim()) {
                    const pill = document.createElement('span');
                    pill.className = 'badge bg-secondary p-2';
                    pill.innerHTML = `<i class="fa-solid fa-check text-success me-1"></i> ${escapeHtml(f.trim())}`;
                    featuresListEl.appendChild(pill);
                }
            });
        } else {
            featuresListEl.innerHTML = '<span class="text-muted small">No specific features listed.</span>';
        }

        toolDetailsModal.show();
    }

    function openFormModal(toolId = null) {
        toolForm.reset();
        toolForm.classList.remove('was-validated');

        if (toolId) {
            const tool = allTools.find(t => t.id == toolId);
            if (!tool) return;

            toolFormModalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square me-2 text-accent"></i> Edit AI Tool: ${escapeHtml(tool.name)}`;
            formToolId.value = tool.id;
            document.getElementById('formName').value = tool.name;
            document.getElementById('formCategory').value = tool.category;
            document.getElementById('formPricing').value = tool.pricing;
            document.getElementById('formUrl').value = tool.url;
            document.getElementById('formImageUrl').value = tool.imageUrl || '';
            document.getElementById('formDescription').value = tool.description;
            document.getElementById('formFeatures').value = tool.features || '';
        } else {
            toolFormModalTitle.innerHTML = `<i class="fa-solid fa-plus-circle me-2 text-accent"></i> Add New AI Tool`;
            formToolId.value = '';
        }

        toolFormModal.show();
    }

    function openDeleteConfirmModal(id, name) {
        deleteToolId.value = id;
        deleteToolNameText.textContent = name;
        deleteConfirmModal.show();
    }

    // Submit Form (Add / Edit)
    toolForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!toolForm.checkValidity()) {
            e.stopPropagation();
            toolForm.classList.add('was-validated');
            return;
        }

        const id = formToolId.value;
        const toolPayload = {
            name: document.getElementById('formName').value.trim(),
            category: document.getElementById('formCategory').value,
            pricing: document.getElementById('formPricing').value,
            url: document.getElementById('formUrl').value.trim(),
            imageUrl: document.getElementById('formImageUrl').value.trim(),
            description: document.getElementById('formDescription').value.trim(),
            features: document.getElementById('formFeatures').value.trim()
        };

        const saveBtn = document.getElementById('saveToolBtn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Saving...`;

        try {
            let response;
            if (id) {
                response = await fetch(`${API_BASE}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(toolPayload)
                });
            } else {
                response = await fetch(API_BASE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(toolPayload)
                });
            }

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to save tool.');
            }

            toolFormModal.hide();
            showToast(id ? 'Tool updated successfully!' : 'New AI Tool created successfully!');
            await fetchAllData();
        } catch (error) {
            console.error('Save tool failed:', error);
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk me-1"></i> Save Tool`;
        }
    });

    // Delete Tool Confirmation
    confirmDeleteBtn.addEventListener('click', async () => {
        const id = deleteToolId.value;
        if (!id) return;

        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Deleting...';

        try {
            const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete tool.');

            deleteConfirmModal.hide();
            showToast('AI Tool deleted successfully.');
            await fetchAllData();
        } catch (err) {
            console.error('Delete error:', err);
            showToast('Failed to delete tool.', 'error');
        } finally {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = 'Delete';
        }
    });

    // -------------------------------------------------------------
    // EVENT LISTENERS SETUP
    // -------------------------------------------------------------
    function setupEventListeners() {
        // Search Input (Debounced)
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            if (currentSearchTerm) {
                clearSearchBtn.classList.remove('d-none');
            } else {
                clearSearchBtn.classList.add('d-none');
            }

            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadTools();
            }, 300);
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchTerm = '';
            clearSearchBtn.classList.add('d-none');
            loadTools();
        });

        // Admin Table Search Filter
        adminTableSearch.addEventListener('input', (e) => {
            adminSearchTerm = e.target.value.trim();
            renderAdminTable();
        });

        // Category Pills Click
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                currentCategory = pill.getAttribute('data-category');
                activeFilterLabel.textContent = currentCategory === 'All' 
                    ? 'Showing all tools' 
                    : `Category: ${currentCategory}`;
                
                loadTools();
            });
        });

        // Pricing Filters Click
        pricingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                pricingBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentPricing = btn.getAttribute('data-pricing');
                renderFilteredTools();
            });
        });

        // Reset Filters Button
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                currentSearchTerm = '';
                currentCategory = 'All';
                currentPricing = 'All';
                searchInput.value = '';
                clearSearchBtn.classList.add('d-none');

                categoryPills.forEach(p => p.classList.remove('active'));
                if (categoryPills[0]) categoryPills[0].classList.add('active');

                pricingBtns.forEach(b => b.classList.remove('active'));
                if (pricingBtns[0]) pricingBtns[0].classList.add('active');

                activeFilterLabel.textContent = 'Showing all tools';
                loadTools();
            });
        }

        // View Switchers (User Mode vs Admin Mode)
        viewUserModeBtn.addEventListener('click', () => {
            viewUserModeBtn.classList.add('active');
            viewAdminModeBtn.classList.remove('active');
            userViewSection.classList.remove('d-none');
            adminViewSection.classList.add('d-none');
        });

        viewAdminModeBtn.addEventListener('click', () => {
            viewAdminModeBtn.classList.add('active');
            viewUserModeBtn.classList.remove('active');
            adminViewSection.classList.remove('d-none');
            userViewSection.classList.add('d-none');
            renderAdminTable();
        });

        // Add New Tool Button
        if (addNewToolModalBtn) {
            addNewToolModalBtn.addEventListener('click', () => openFormModal());
        }
    }

    // -------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------
    function showSpinner(show) {
        if (toolsLoadingSpinner) {
            toolsLoadingSpinner.style.display = show ? 'block' : 'none';
        }
    }

    function getPricingBadgeClass(pricing) {
        if (!pricing) return 'badge-pricing-free';
        switch (pricing.toLowerCase()) {
            case 'free': return 'badge-pricing-free';
            case 'freemium': return 'badge-pricing-freemium';
            case 'paid': return 'badge-pricing-paid';
            default: return 'badge-pricing-free';
        }
    }

    function showToast(message, type = 'success') {
        const toastEl = document.getElementById('liveToast');
        const toastMessage = document.getElementById('toastMessage');
        if (!toastEl || !toastMessage) return;

        const iconClass = type === 'error' ? 'fa-circle-xmark text-danger' : 'fa-circle-check text-success';
        toastMessage.innerHTML = `<i class="fa-solid ${iconClass} fs-5"></i> <span>${escapeHtml(message)}</span>`;
        
        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
