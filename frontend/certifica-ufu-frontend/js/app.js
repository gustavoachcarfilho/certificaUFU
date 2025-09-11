// Certifica UFU - Main Application JavaScript

$(document).ready(function() {
    // Initialize application
    initializeApp();
    initializeDarkMode();
});

// Application initialization
function initializeApp() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'login':
            initializeLogin();
            break;
        case 'student-dashboard':
            initializeStudentDashboard();
            break;
        case 'submit-document':
            initializeSubmitDocument();
            break;
        case 'my-documents':
            initializeMyDocuments();
            break;
        case 'opportunities':
            initializeOpportunities();
            break;
        case 'opportunities-student':
            initializeOpportunitiesStudent();
            break;
        case 'profile':
            initializeProfile();
            break;
        case 'profile-settings':
            initializeProfileSettings();
            break;
        case 'admin-dashboard':
            initializeAdminDashboard();
            break;
        case 'opportunity-editor':
            initializeOpportunityEditor();
            break;
        case 'notifications':
            initializeNotifications();
            break;
    }
}

// Dark Mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
    }
    
    // Toggle dark mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
        });
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'index';
}

// Show toast notification
function showToast(toastId, message, type = 'success') {
    const toast = document.getElementById(toastId);
    if (toast) {
        const toastBody = toast.querySelector('.toast-body');
        const toastIcon = toast.querySelector('.toast-header i');
        
        if (toastBody) toastBody.textContent = message;
        
        // Update icon based on type
        if (toastIcon) {
            toastIcon.className = `bi bi-${type === 'success' ? 'check-circle-fill text-success' : 'exclamation-triangle-fill text-warning'} me-2`;
        }
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

// Form validation helper
function validateForm(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    
    Object.keys(rules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const rule = rules[fieldName];
        
        if (field) {
            const value = field.value.trim();
            let fieldValid = true;
            let errorMessage = '';
            
            // Required validation
            if (rule.required && !value) {
                fieldValid = false;
                errorMessage = rule.requiredMessage || 'Este campo é obrigatório';
            }
            
            // Email validation
            if (fieldValid && rule.email && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    fieldValid = false;
                    errorMessage = 'Email inválido';
                }
            }
            
            // Min length validation
            if (fieldValid && rule.minLength && value.length < rule.minLength) {
                fieldValid = false;
                errorMessage = `Mínimo de ${rule.minLength} caracteres`;
            }
            
            // URL validation
            if (fieldValid && rule.url && value) {
                try {
                    new URL(value);
                } catch {
                    fieldValid = false;
                    errorMessage = 'URL inválida';
                }
            }
            
            // Update field state
            if (fieldValid) {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            } else {
                field.classList.remove('is-valid');
                field.classList.add('is-invalid');
                const feedback = field.parentNode.querySelector('.invalid-feedback');
                if (feedback) feedback.textContent = errorMessage;
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// LOGIN PAGE
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    
    // Toggle password visibility
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('bi-eye');
            icon.classList.toggle('bi-eye-slash');
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rules = {
                email: { required: true, email: true },
                password: { required: true, minLength: 6 },
                role: { required: true }
            };
            
            if (validateForm('loginForm', rules)) {
                const loginBtn = document.getElementById('loginBtn');
                const btnText = loginBtn.querySelector('.btn-text');
                const btnLoading = loginBtn.querySelector('.btn-loading');
                
                // Show loading state
                btnText.classList.add('d-none');
                btnLoading.classList.remove('d-none');
                loginBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    const role = document.getElementById('role').value;
                    const redirectUrl = role === 'student' ? 'student-dashboard.html' : 'admin-dashboard.html';
                    
                    showToast('loginToast', 'Login realizado com sucesso!');
                    
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1000);
                }, 1500);
            }
        });
    }
}

// STUDENT DASHBOARD
function initializeStudentDashboard() {
    // Smooth scroll for progress section link
    $('a[href="#progressSection"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $('.card:has(.progress)').offset().top - 100
        }, 500);
    });
}

// PROFILE SETTINGS PAGE
function initializeProfileSettings() {
    const saveAllBtn = document.getElementById('saveAllBtn');
    const profilePictureInput = document.getElementById('profilePictureInput');
    const profileImage = document.getElementById('profileImage');
    const removePhotoBtn = document.getElementById('removePhotoBtn');
    
    // Handle profile picture upload
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle remove photo
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', function() {
            profileImage.src = '/placeholder.svg?height=120&width=120&text=MS';
            profilePictureInput.value = '';
        });
    }
    
    // Handle save all
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', function() {
            const rules = {
                fullName: { required: true },
                email: { required: true, email: true },
                course: { required: true }
            };
            
            if (validateForm('personalInfoForm', rules) && validateForm('academicInfoForm', { course: { required: true } })) {
                const btnText = saveAllBtn.querySelector('.btn-text');
                const btnLoading = saveAllBtn.querySelector('.btn-loading');
                
                // Show loading state
                btnText.classList.add('d-none');
                btnLoading.classList.remove('d-none');
                saveAllBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    showToast('settingsToast', 'Configurações salvas com sucesso!');
                    
                    // Reset button state
                    btnText.classList.remove('d-none');
                    btnLoading.classList.add('d-none');
                    saveAllBtn.disabled = false;
                }, 1500);
            }
        });
    }
}

// OPPORTUNITIES STUDENT PAGE
function initializeOpportunitiesStudent() {
    loadStudentOpportunities();
    
    // Filter functionality
    $('#categoryFilter, #searchInput').on('input', filterStudentOpportunities);
    $('#clearFilters').on('click', clearStudentFilters);
    
    // Handle application modal
    const submitApplicationBtn = document.getElementById('submitApplicationBtn');
    if (submitApplicationBtn) {
        submitApplicationBtn.addEventListener('click', submitApplication);
    }
}

function loadStudentOpportunities() {
    const mockOpportunities = [
        {
            id: 1,
            title: 'Workshop de Inteligência Artificial',
            category: 'ensino',
            description: 'Workshop prático sobre IA e Machine Learning com certificação.',
            hours: 20,
            deadline: '2024-02-15',
            externalLink: 'https://exemplo.com/workshop-ia',
            status: 'active',
            requirements: 'Conhecimento básico em programação'
        },
        {
            id: 2,
            title: 'Projeto de Pesquisa em IoT',
            category: 'pesquisa',
            description: 'Oportunidade de participar de projeto de pesquisa em Internet das Coisas.',
            hours: 40,
            deadline: '2024-02-20',
            externalLink: 'https://exemplo.com/pesquisa-iot',
            status: 'active',
            requirements: 'Estudante de engenharia ou computação'
        },
        {
            id: 3,
            title: 'Extensão - Programação para Crianças',
            category: 'extensao',
            description: 'Ensine programação básica para crianças da comunidade.',
            hours: 30,
            deadline: '2024-02-10',
            externalLink: 'https://exemplo.com/prog-criancas',
            status: 'active',
            requirements: 'Disponibilidade aos sábados'
        },
        {
            id: 4,
            title: 'Hackathon Universitário 2024',
            category: 'pesquisa',
            description: 'Competição de desenvolvimento de soluções inovadoras.',
            hours: 48,
            deadline: '2024-03-01',
            externalLink: 'https://exemplo.com/hackathon',
            status: 'active',
            requirements: 'Formar equipe de 3-5 pessoas'
        },
        {
            id: 5,
            title: 'Monitoria de Cálculo I',
            category: 'monitoria',
            description: 'Oportunidade de monitoria na disciplina de Cálculo I.',
            hours: 60,
            deadline: '2024-02-25',
            externalLink: 'https://exemplo.com/monitoria-calculo',
            status: 'active',
            requirements: 'Ter sido aprovado em Cálculo I com nota ≥ 8.0'
        },
        {
            id: 6,
            title: 'Festival de Música Universitária',
            category: 'cultural',
            description: 'Participe da organização do festival de música da universidade.',
            hours: 25,
            deadline: '2024-02-18',
            externalLink: 'https://exemplo.com/festival-musica',
            status: 'active',
            requirements: 'Interesse em atividades culturais'
        }
    ];
    
    window.allStudentOpportunities = mockOpportunities;
    renderStudentOpportunities(mockOpportunities);
}

function renderStudentOpportunities(opportunities) {
    const grid = document.getElementById('opportunitiesGrid');
    const noResults = document.getElementById('noResults');
    
    if (opportunities.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('d-none');
        return;
    }
    
    noResults.classList.add('d-none');
    grid.innerHTML = '';
    
    opportunities.forEach(opp => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${opp.title}</h5>
                        <span class="badge bg-primary">${getCategoryName(opp.category)}</span>
                    </div>
                    <p class="card-text text-muted text-truncate-2">${opp.description}</p>
                    <div class="row text-center mb-3">
                        <div class="col-6">
                            <small class="text-muted">Carga Horária</small>
                            <div class="fw-bold">${opp.hours}h</div>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Prazo</small>
                            <div class="fw-bold">${formatDate(opp.deadline)}</div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted">Requisitos:</small>
                        <div class="small">${opp.requirements}</div>
                    </div>
                </div>
                <div class="card-footer bg-white">
                    <button type="button" class="btn btn-primary w-100" onclick="openApplicationModal(${opp.id})">
                        <i class="bi bi-send me-2"></i>Candidatar-se
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(col);
    });
}

function openApplicationModal(opportunityId) {
    const opportunity = window.allStudentOpportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;
    
    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    const detailsDiv = document.getElementById('opportunityDetails');
    
    detailsDiv.innerHTML = `
        <div class="alert alert-info">
            <h6 class="fw-bold">${opportunity.title}</h6>
            <p class="mb-1">${opportunity.description}</p>
            <small><strong>Carga Horária:</strong> ${opportunity.hours}h | <strong>Prazo:</strong> ${formatDate(opportunity.deadline)}</small>
        </div>
    `;
    
    // Store opportunity ID for submission
    document.getElementById('applicationModal').dataset.opportunityId = opportunityId;
    
    modal.show();
}

function submitApplication() {
    const form = document.getElementById('applicationForm');
    const agreeTerms = document.getElementById('agreeTerms');
    
    // Validate terms agreement
    if (!agreeTerms.checked) {
        agreeTerms.classList.add('is-invalid');
        return;
    } else {
        agreeTerms.classList.remove('is-invalid');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
    modal.hide();
    
    showToast('applicationToast', 'Candidatura enviada com sucesso!');
    
    // Reset form
    form.reset();
}

function filterStudentOpportunities() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = window.allStudentOpportunities;
    
    if (category) {
        filtered = filtered.filter(opp => opp.category === category);
    }
    
    if (search) {
        filtered = filtered.filter(opp => 
            opp.title.toLowerCase().includes(search) ||
            opp.description.toLowerCase().includes(search)
        );
    }
    
    renderStudentOpportunities(filtered);
}

function clearStudentFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('searchInput').value = '';
    renderStudentOpportunities(window.allStudentOpportunities);
}

// SUBMIT DOCUMENT PAGE
function initializeSubmitDocument() {
    const submitForm = document.getElementById('submitDocumentForm');
    
    if (submitForm) {
        submitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rules = {
                title: { required: true },
                category: { required: true },
                workloadHours: { required: true },
                documentFile: { required: true }
            };
            
            if (validateForm('submitDocumentForm', rules)) {
                const submitBtn = document.getElementById('submitBtn');
                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoading = submitBtn.querySelector('.btn-loading');
                
                // Show loading state
                btnText.classList.add('d-none');
                btnLoading.classList.remove('d-none');
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    showToast('submitToast', 'Documento enviado com sucesso!');
                    
                    setTimeout(() => {
                        window.location.href = 'my-documents.html';
                    }, 2000);
                }, 2000);
            }
        });
    }
}

// MY DOCUMENTS PAGE
function initializeMyDocuments() {
    loadMyDocuments();
}

function loadMyDocuments() {
    const mockDocuments = [
        {
            id: 1,
            title: 'Certificado de Curso de Python',
            category: 'Ensino',
            status: 'approved',
            hours: 40,
            submissionDate: '2024-01-15',
            reviewDate: '2024-01-18',
            description: 'Curso completo de Python com certificação.'
        },
        {
            id: 2,
            title: 'Participação em Congresso',
            category: 'Pesquisa',
            status: 'pending',
            hours: 20,
            submissionDate: '2024-01-20',
            description: 'Participação no Congresso de Tecnologia 2024.'
        },
        {
            id: 3,
            title: 'Projeto de Extensão',
            category: 'Extensão',
            status: 'rejected',
            hours: 60,
            submissionDate: '2024-01-10',
            reviewDate: '2024-01-12',
            rejectionReason: 'Documento não apresenta carga horária válida.',
            description: 'Projeto de extensão comunitária.'
        },
        {
            id: 4,
            title: 'Monitoria de Algoritmos',
            category: 'Monitoria',
            status: 'approved',
            hours: 80,
            submissionDate: '2024-01-05',
            reviewDate: '2024-01-08',
            description: 'Atividade de monitoria na disciplina de Algoritmos.'
        },
        {
            id: 5,
            title: 'Curso de Design UX/UI',
            category: 'Ensino',
            status: 'pending',
            hours: 30,
            submissionDate: '2024-01-22',
            description: 'Curso de Design de Interfaces.'
        }
    ];
    
    // Load desktop table
    const tableBody = document.getElementById('documentsTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
        
        mockDocuments.forEach(doc => {
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.onclick = () => showDocumentDetails(doc);
            
            row.innerHTML = `
                <td>${doc.title}</td>
                <td>${doc.category}</td>
                <td>${getStatusBadge(doc.status)}</td>
                <td>${doc.hours}h</td>
                <td>${formatDate(doc.submissionDate)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); showDocumentDetails(${JSON.stringify(doc).replace(/"/g, '&quot;')})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Load mobile list
    const mobileList = document.getElementById('documentsListMobile');
    if (mobileList) {
        mobileList.innerHTML = '';
        
        mockDocuments.forEach(doc => {
            const item = document.createElement('div');
            item.className = 'list-group-item list-group-item-action';
            item.onclick = () => showDocumentDetails(doc);
            
            item.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${doc.title}</h6>
                    ${getStatusBadge(doc.status)}
                </div>
                <p class="mb-1 text-muted">${doc.category} • ${doc.hours}h</p>
                <small class="text-muted">${formatDate(doc.submissionDate)}</small>
            `;
            
            mobileList.appendChild(item);
        });
    }
}

function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge bg-warning">Em análise</span>',
        approved: '<span class="badge bg-success">Aprovado</span>',
        rejected: '<span class="badge bg-danger">Rejeitado</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Desconhecido</span>';
}

function showDocumentDetails(doc) {
    const modal = new bootstrap.Modal(document.getElementById('documentModal'));
    const modalBody = document.getElementById('documentModalBody');
    
    let rejectionSection = '';
    if (doc.status === 'rejected' && doc.rejectionReason) {
        rejectionSection = `
            <div class="alert alert-danger">
                <h6><i class="bi bi-exclamation-triangle me-2"></i>Motivo da Rejeição</h6>
                <p class="mb-0">${doc.rejectionReason}</p>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Título:</strong><br>
                ${doc.title}
            </div>
            <div class="col-md-6 mb-3">
                <strong>Status:</strong><br>
                ${getStatusBadge(doc.status)}
            </div>
            <div class="col-md-6 mb-3">
                <strong>Categoria:</strong><br>
                ${doc.category}
            </div>
            <div class="col-md-6 mb-3">
                <strong>Carga Horária:</strong><br>
                ${doc.hours} horas
            </div>
            <div class="col-md-6 mb-3">
                <strong>Data de Envio:</strong><br>
                ${formatDate(doc.submissionDate)}
            </div>
            ${doc.reviewDate ? `
            <div class="col-md-6 mb-3">
                <strong>Data de Avaliação:</strong><br>
                ${formatDate(doc.reviewDate)}
            </div>
            ` : ''}
            <div class="col-12 mb-3">
                <strong>Descrição:</strong><br>
                ${doc.description}
            </div>
        </div>
        ${rejectionSection}
    `;
    
    modal.show();
}

// OPPORTUNITIES PAGE
function initializeOpportunities() {
    loadOpportunities();
    
    // Filter functionality
    $('#categoryFilter, #searchInput').on('input', filterOpportunities);
    $('#clearFilters').on('click', clearFilters);
}

function loadOpportunities() {
    const mockOpportunities = [
        {
            id: 1,
            title: 'Workshop de Inteligência Artificial',
            category: 'ensino',
            description: 'Workshop prático sobre IA e Machine Learning com certificação.',
            hours: 20,
            deadline: '2024-02-15',
            externalLink: 'https://exemplo.com/workshop-ia',
            status: 'active'
        },
        {
            id: 2,
            title: 'Projeto de Pesquisa em IoT',
            category: 'pesquisa',
            description: 'Oportunidade de participar de projeto de pesquisa em Internet das Coisas.',
            hours: 40,
            deadline: '2024-02-20',
            externalLink: 'https://exemplo.com/pesquisa-iot',
            status: 'active'
        },
        {
            id: 3,
            title: 'Extensão - Programação para Crianças',
            category: 'extensao',
            description: 'Ensine programação básica para crianças da comunidade.',
            hours: 30,
            deadline: '2024-02-10',
            externalLink: 'https://exemplo.com/prog-criancas',
            status: 'active'
        },
        {
            id: 4,
            title: 'Hackathon Universitário 2024',
            category: 'pesquisa',
            description: 'Competição de desenvolvimento de soluções inovadoras.',
            hours: 48,
            deadline: '2024-03-01',
            externalLink: 'https://exemplo.com/hackathon',
            status: 'active'
        },
        {
            id: 5,
            title: 'Monitoria de Cálculo I',
            category: 'monitoria',
            description: 'Oportunidade de monitoria na disciplina de Cálculo I.',
            hours: 60,
            deadline: '2024-02-25',
            externalLink: 'https://exemplo.com/monitoria-calculo',
            status: 'active'
        },
        {
            id: 6,
            title: 'Festival de Música Universitária',
            category: 'cultural',
            description: 'Participe da organização do festival de música da universidade.',
            hours: 25,
            deadline: '2024-02-18',
            externalLink: 'https://exemplo.com/festival-musica',
            status: 'active'
        }
    ];
    
    window.allOpportunities = mockOpportunities;
    renderOpportunities(mockOpportunities);
}

function renderOpportunities(opportunities) {
    const grid = document.getElementById('opportunitiesGrid');
    const noResults = document.getElementById('noResults');
    
    if (opportunities.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('d-none');
        return;
    }
    
    noResults.classList.add('d-none');
    grid.innerHTML = '';
    
    opportunities.forEach(opp => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${opp.title}</h5>
                        <span class="badge bg-primary">${getCategoryName(opp.category)}</span>
                    </div>
                    <p class="card-text text-muted">${opp.description}</p>
                    <div class="row text-center mb-3">
                        <div class="col-6">
                            <small class="text-muted">Carga Horária</small>
                            <div class="fw-bold">${opp.hours}h</div>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">Prazo</small>
                            <div class="fw-bold">${formatDate(opp.deadline)}</div>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-white">
                    <a href="${opp.externalLink}" target="_blank" class="btn btn-primary w-100">
                        <i class="bi bi-box-arrow-up-right me-2"></i>Inscrever-se
                    </a>
                </div>
            </div>
        `;
        
        grid.appendChild(col);
    });
}

function filterOpportunities() {
    const category = document.getElementById('categoryFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = window.allOpportunities;
    
    if (category) {
        filtered = filtered.filter(opp => opp.category === category);
    }
    
    if (search) {
        filtered = filtered.filter(opp => 
            opp.title.toLowerCase().includes(search) ||
            opp.description.toLowerCase().includes(search)
        );
    }
    
    renderOpportunities(filtered);
}

function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('searchInput').value = '';
    renderOpportunities(window.allOpportunities);
}

function getCategoryName(category) {
    const names = {
        ensino: 'Ensino',
        pesquisa: 'Pesquisa',
        extensao: 'Extensão',
        monitoria: 'Monitoria',
        cultural: 'Cultural',
        esportiva: 'Esportiva'
    };
    return names[category] || category;
}

// PROFILE PAGE
function initializeProfile() {
    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const form = document.getElementById('profileForm');
    
    if (editBtn) {
        editBtn.addEventListener('click', enableProfileEdit);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelProfileEdit);
    }
    
    if (form) {
        form.addEventListener('submit', saveProfile);
    }
}

function enableProfileEdit() {
    const fields = ['fullName', 'email', 'phone', 'course', 'period', 'address'];
    
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.removeAttribute('readonly');
            field.removeAttribute('disabled');
        }
    });
    
    document.getElementById('editProfileBtn').classList.add('d-none');
    document.getElementById('cancelEditBtn').classList.remove('d-none');
    document.getElementById('saveProfileBtn').classList.remove('d-none');
}

function cancelProfileEdit() {
    const fields = ['fullName', 'email', 'phone', 'course', 'period', 'address'];
    
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.setAttribute('readonly', 'readonly');
            if (field.tagName === 'SELECT') {
                field.setAttribute('disabled', 'disabled');
            }
            field.classList.remove('is-valid', 'is-invalid');
        }
    });
    
    document.getElementById('editProfileBtn').classList.remove('d-none');
    document.getElementById('cancelEditBtn').classList.add('d-none');
    document.getElementById('saveProfileBtn').classList.add('d-none');
}

function saveProfile(e) {
    e.preventDefault();
    
    const rules = {
        fullName: { required: true },
        email: { required: true, email: true },
        course: { required: true }
    };
    
    if (validateForm('profileForm', rules)) {
        const saveBtn = document.getElementById('saveProfileBtn');
        const btnText = saveBtn.querySelector('.btn-text');
        const btnLoading = saveBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        saveBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showToast('profileToast', 'Perfil atualizado com sucesso!');
            cancelProfileEdit();
            
            // Reset button state
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
            saveBtn.disabled = false;
        }, 1500);
    }
}

// ADMIN DASHBOARD
function initializeAdminDashboard() {
    loadPendingDocumentsCards();
    loadOpportunitiesList();
    
    // Initialize new opportunity modal
    const saveOpportunityBtn = document.getElementById('saveOpportunityBtn');
    if (saveOpportunityBtn) {
        saveOpportunityBtn.addEventListener('click', saveNewOpportunity);
    }
}

function loadPendingDocumentsCards() {
    const mockPendingDocs = [
        {
            id: 1,
            studentName: 'João Santos',
            title: 'Certificado de Curso de React',
            category: 'Ensino',
            hours: 40,
            submissionDate: '2024-01-20',
            description: 'Curso completo de React com certificação.',
            studentNotes: 'Curso realizado na plataforma Udemy com certificado válido.',
            fileLink: '#'
        },
        {
            id: 2,
            studentName: 'Ana Costa',
            title: 'Participação em Hackathon',
            category: 'Pesquisa',
            hours: 48,
            submissionDate: '2024-01-19',
            description: 'Participação no Hackathon UFU 2024.',
            studentNotes: 'Equipe ficou em 3º lugar na competição.',
            fileLink: '#'
        },
        {
            id: 3,
            studentName: 'Carlos Lima',
            title: 'Projeto de Extensão - Inclusão Digital',
            category: 'Extensão',
            hours: 60,
            submissionDate: '2024-01-18',
            description: 'Projeto de inclusão digital para idosos.',
            studentNotes: 'Projeto desenvolvido em parceria com a prefeitura.',
            fileLink: '#'
        },
        {
            id: 4,
            studentName: 'Maria Oliveira',
            title: 'Monitoria de Algoritmos',
            category: 'Monitoria',
            hours: 80,
            submissionDate: '2024-01-17',
            description: 'Atividade de monitoria na disciplina de Algoritmos.',
            studentNotes: 'Monitoria realizada durante todo o semestre 2023.2.',
            fileLink: '#'
        },
        {
            id: 5,
            studentName: 'Pedro Silva',
            title: 'Workshop de UX Design',
            category: 'Ensino',
            hours: 24,
            submissionDate: '2024-01-16',
            description: 'Workshop sobre design de experiência do usuário.',
            studentNotes: 'Workshop ministrado por profissionais da área.',
            fileLink: '#'
        },
        {
            id: 4,
            studentName: 'Maria Oliveira',
            title: 'Monitoria de Algoritmos',
            category: 'Monitoria',
            hours: 80,
            submissionDate: '2024-01-17',
            description: 'Atividade de monitoria na disciplina de Algoritmos.',
            studentNotes: 'Monitoria realizada durante todo o semestre 2023.2.',
            fileLink: '#'
        },
        ,
        {
            id: 4,
            studentName: 'Maria Oliveira',
            title: 'Monitoria de Algoritmos',
            category: 'Monitoria',
            hours: 80,
            submissionDate: '2024-01-17',
            description: 'Atividade de monitoria na disciplina de Algoritmos.',
            studentNotes: 'Monitoria realizada durante todo o semestre 2023.2.',
            fileLink: '#'
        },
        ,
        {
            id: 4,
            studentName: 'Maria Oliveira',
            title: 'Monitoria de Algoritmos',
            category: 'Monitoria',
            hours: 80,
            submissionDate: '2024-01-17',
            description: 'Atividade de monitoria na disciplina de Algoritmos.',
            studentNotes: 'Monitoria realizada durante todo o semestre 2023.2.',
            fileLink: '#'
        }
    ];
    
    const container = document.getElementById('pendingDocumentsContainer');
    if (container) {
        container.innerHTML = '';
        
        mockPendingDocs.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'card document-card shadow-sm';
            card.onclick = () => showDocumentDetailsModal(doc);
            
            card.innerHTML = `
                <div class="card-body">
                    <h6 class="card-title fw-bold">${doc.title}</h6>
                    <p class="card-text text-muted small mb-2">${doc.studentName}</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${doc.category}</span>
                        <span class="fw-bold">${doc.hours}h</span>
                    </div>
                    <p class="card-text small text-truncate-2">${doc.description}</p>
                    <small class="text-muted">${formatDate(doc.submissionDate)}</small>
                </div>
                <div class="card-footer bg-white p-2">
                    <div class="btn-group w-100" role="group">
                        <button class="btn btn-sm btn-outline-success" onclick="event.stopPropagation(); approveDocument(${doc.id})" title="Aprovar">
                            <i class="bi bi-check"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); rejectDocument(${doc.id}, '${doc.studentName}')" title="Rejeitar">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });
    }
}

function showDocumentDetailsModal(doc) {
    const modal = new bootstrap.Modal(document.getElementById('documentDetailsModal'));
    const modalBody = document.getElementById('documentDetailsBody');
    const modalFooter = document.getElementById('documentDetailsFooter');
    
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-3">
                <strong>Estudante:</strong><br>${doc.studentName}
            </div>
            <div class="col-md-6 mb-3">
                <strong>Data de Envio:</strong><br>${formatDate(doc.submissionDate)}
            </div>
            <div class="col-12 mb-3">
                <strong>Título:</strong><br>${doc.title}
            </div>
            <div class="col-md-6 mb-3">
                <strong>Categoria:</strong><br>${doc.category}
            </div>
            <div class="col-md-6 mb-3">
                <strong>Carga Horária:</strong><br>${doc.hours} horas
            </div>
            <div class="col-12 mb-3">
                <strong>Descrição:</strong><br>${doc.description}
            </div>
            <div class="col-12 mb-3">
                <strong>Observações do Estudante:</strong><br>${doc.studentNotes}
            </div>
            <div class="col-12 mb-3">
                <strong>Arquivo:</strong><br>
                <a href="${doc.fileLink}" target="_blank" class="btn btn-outline-primary btn-sm">
                    <i class="bi bi-download me-2"></i>Baixar Documento
                </a>
            </div>
        </div>
    `;
    
    modalFooter.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
        <button type="button" class="btn btn-danger" onclick="rejectDocument(${doc.id}, '${doc.studentName}')">
            <i class="bi bi-x-circle me-2"></i>Rejeitar
        </button>
        <button type="button" class="btn btn-success" onclick="approveDocument(${doc.id})">
            <i class="bi bi-check-circle me-2"></i>Aprovar
        </button>
    `;
    
    modal.show();
}

function saveNewOpportunity() {
    const rules = {
        title: { required: true },
        category: { required: true },
        description: { required: true },
        externalLink: { url: true }
    };
    
    if (validateForm('newOpportunityForm', rules)) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('newOpportunityModal'));
        modal.hide();
        
        showToast('adminToast', 'Nova oportunidade criada com sucesso!');
        
        // Reset form
        document.getElementById('newOpportunityForm').reset();
        
        // Reload opportunities list
        setTimeout(loadOpportunitiesList, 1000);
    }
}

function loadOpportunitiesList() {
    const mockOpportunities = [
        { id: 1, title: 'Workshop de IA', status: 'active' },
        { id: 2, title: 'Projeto IoT', status: 'active' },
        { id: 3, title: 'Extensão Comunitária', status: 'inactive' },
        { id: 4, title: 'Hackathon 2024', status: 'active' }
    ];
    
    const list = document.getElementById('opportunitiesList');
    if (list) {
        list.innerHTML = '';
        
        mockOpportunities.forEach(opp => {
            const item = document.createElement('div');
            item.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            item.innerHTML = `
                <div>
                    <div class="fw-bold">${opp.title}</div>
                    <span class="badge ${opp.status === 'active' ? 'bg-success' : 'bg-secondary'}">${opp.status === 'active' ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editOpportunity(${opp.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteOpportunity(${opp.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            list.appendChild(item);
        });
    }
}

function approveDocument(docId) {
    if (confirm('Tem certeza que deseja aprovar este documento?')) {
        showToast('adminToast', 'Documento aprovado com sucesso!');
        // Reload pending documents
        setTimeout(loadPendingDocumentsCards, 1000);
    }
}

function rejectDocument(docId, studentName) {
    document.getElementById('rejectionDocumentId').value = docId;
    const modal = new bootstrap.Modal(document.getElementById('rejectionModal'));
    modal.show();
    
    // Handle rejection confirmation
    document.getElementById('confirmRejectionBtn').onclick = function() {
        const reason = document.getElementById('rejectionReason').value.trim();
        if (!reason) {
            document.getElementById('rejectionReason').classList.add('is-invalid');
            return;
        }
        
        modal.hide();
        showToast('adminToast', `Documento de ${studentName} rejeitado.`);
        setTimeout(loadPendingDocumentsCards, 1000);
    };
}

function editOpportunity(oppId) {
    window.location.href = `opportunity-editor.html?id=${oppId}`;
}

function deleteOpportunity(oppId) {
    if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
        showToast('adminToast', 'Oportunidade excluída com sucesso!');
        setTimeout(loadOpportunitiesList, 1000);
    }
}

function generateReport() {
    showToast('adminToast', 'Relatório sendo gerado...');
}

function exportData() {
    showToast('adminToast', 'Dados sendo exportados...');
}

// OPPORTUNITY EDITOR
function initializeOpportunityEditor() {
    const form = document.getElementById('opportunityForm');
    
    // Check if editing existing opportunity
    const urlParams = new URLSearchParams(window.location.search);
    const oppId = urlParams.get('id');
    
    if (oppId) {
        loadOpportunityForEdit(oppId);
    }
    
    if (form) {
        form.addEventListener('submit', saveOpportunity);
    }
}

function loadOpportunityForEdit(oppId) {
    // Mock data for editing
    const mockOpportunity = {
        id: oppId,
        title: 'Workshop de Inteligência Artificial',
        category: 'ensino',
        workloadHours: 20,
        description: 'Workshop prático sobre IA e Machine Learning com certificação.',
        externalLink: 'https://exemplo.com/workshop-ia',
        deadline: '2024-02-15',
        maxParticipants: 50,
        status: 'active'
    };
    
    // Update page title
    document.getElementById('pageTitle').textContent = 'Editar Oportunidade';
    document.getElementById('breadcrumbTitle').textContent = 'Editar Oportunidade';
    
    // Fill form fields
    Object.keys(mockOpportunity).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            field.value = mockOpportunity[key];
        }
    });
}

function saveOpportunity(e) {
    e.preventDefault();
    
    const rules = {
        title: { required: true },
        category: { required: true },
        description: { required: true },
        externalLink: { url: true },
        status: { required: true }
    };
    
    if (validateForm('opportunityForm', rules)) {
        const saveBtn = document.getElementById('saveBtn');
        const btnText = saveBtn.querySelector('.btn-text');
        const btnLoading = saveBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        saveBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showToast('opportunityToast', 'Oportunidade salva com sucesso!');
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 2000);
        }, 1500);
    }
}

// NOTIFICATIONS PAGE
function initializeNotifications() {
    loadNotifications();
    
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsRead);
    }
}

function loadNotifications() {
    const mockNotifications = [
        {
            id: 1,
            title: 'Documento Aprovado',
            message: 'Seu certificado "Curso de Python" foi aprovado!',
            type: 'success',
            date: '2024-01-20T10:30:00',
            read: false
        },
        {
            id: 2,
            title: 'Nova Oportunidade',
            message: 'Workshop de IA disponível para inscrições.',
            type: 'info',
            date: '2024-01-19T14:15:00',
            read: false
        },
        {
            id: 3,
            title: 'Documento Rejeitado',
            message: 'Seu certificado "Projeto de Extensão" foi rejeitado. Verifique os detalhes.',
            type: 'warning',
            date: '2024-01-18T09:45:00',
            read: true
        },
        {
            id: 4,
            title: 'Lembrete de Prazo',
            message: 'Prazo para inscrição no Hackathon termina em 3 dias.',
            type: 'warning',
            date: '2024-01-17T16:20:00',
            read: false
        },
        {
            id: 5,
            title: 'Sistema Atualizado',
            message: 'O sistema foi atualizado com novas funcionalidades.',
            type: 'info',
            date: '2024-01-15T08:00:00',
            read: true
        }
    ];
    
    const notificationsList = document.getElementById('notificationsList');
    const emptyState = document.getElementById('emptyNotifications');
    
    if (mockNotifications.length === 0) {
        notificationsList.style.display = 'none';
        emptyState.classList.remove('d-none');
        return;
    }
    
    notificationsList.innerHTML = '';
    
    mockNotifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = `list-group-item list-group-item-action ${!notification.read ? 'unread' : ''}`;
        item.onclick = () => markNotificationRead(notification.id);
        
        const iconClass = getNotificationIcon(notification.type);
        const timeAgo = getTimeAgo(notification.date);
        
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-start">
                <div class="d-flex align-items-start">
                    <i class="bi ${iconClass} me-3 mt-1"></i>
                    <div class="flex-grow-1">
                        <h6 class="mb-1 ${!notification.read ? 'fw-bold' : ''}">${notification.title}</h6>
                        <p class="mb-1 text-muted">${notification.message}</p>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                </div>
                ${!notification.read ? '<div class="bg-primary rounded-circle" style="width: 8px; height: 8px;"></div>' : ''}
            </div>
        `;
        
        notificationsList.appendChild(item);
    });
    
    window.notifications = mockNotifications;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'bi-check-circle-fill text-success',
        info: 'bi-info-circle-fill text-info',
        warning: 'bi-exclamation-triangle-fill text-warning',
        error: 'bi-x-circle-fill text-danger'
    };
    return icons[type] || 'bi-bell-fill text-primary';
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Agora mesmo';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
}

function markNotificationRead(notificationId) {
    if (window.notifications) {
        const notification = window.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
            notification.read = true;
            loadNotifications(); // Reload to update UI
        }
    }
}

function markAllNotificationsRead() {
    if (window.notifications) {
        window.notifications.forEach(n => n.read = true);
        loadNotifications(); // Reload to update UI
        showToast('adminToast', 'Todas as notificações foram marcadas como lidas.');
    }
}

// UTILITY FUNCTIONS
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Mock API functions
function mockApiCall(endpoint, data = null, delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: data,
                message: 'Operação realizada com sucesso'
            });
        }, delay);
    });
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Erro na aplicação:', e.error);
    showToast('adminToast', 'Ocorreu um erro inesperado. Tente novamente.', 'error');
});

// Service Worker registration (for offline support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}
