// DOM elements
const carListings = document.getElementById('car-listings');
const searchInput = document.getElementById('search-input');
const conditionFilter = document.getElementById('condition-filter');

// Theme and Language management
const state = {
    lang: localStorage.getItem('language') || 'en',
    theme: localStorage.getItem('theme') || 'dark'
};

function initializeTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
}

function initializeLanguage() {
    updateContent();
}

function toggleLanguage() {
    console.log('Toggling language from:', state.lang);
    state.lang = state.lang === 'en' ? 'es' : 'en';
    localStorage.setItem('language', state.lang);
    updateContent();
    console.log('Language toggled to:', state.lang);
}

function updateContent() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');

        // Handle placeholders
        const t = window.translations;
        if (!t || !t[state.lang]) return;

        if (key.startsWith('[placeholder]')) {
            const cleanKey = key.replace('[placeholder]', '');
            if (t[state.lang][cleanKey]) {
                element.placeholder = t[state.lang][cleanKey];
            }
        } else {
            if (t[state.lang][key]) {
                element.textContent = t[state.lang][key];
            }
        }
    });

    // Update language toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle && window.translations && window.translations[state.lang]) {
        langToggle.querySelector('.lang-text').textContent = window.translations[state.lang]['lang.switch'];
    }

    // Re-render cars to update dynamic content
    try {
        filterCars();
    } catch (e) {
        console.error('Error updating car listings:', e);
    }
}

function toggleTheme() {
    console.log('Toggling theme from:', state.theme);
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    console.log('Theme toggled to:', state.theme);
}

// Initialize the application
// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    try {
        initializeTheme();
        initializeControls(); // Move controls initialization up
        initializeLanguage();

        try {
            displayCars(cars);
        } catch (e) {
            console.error('Error displaying cars:', e);
        }

        setupEventListeners();
        initializeModal();
        initializeForms();
        initializeBackToTop();
        initializeModalActions();
    } catch (e) {
        console.error('Error initializing app:', e);
    }
});

// Setup event listeners for search and filter
function setupEventListeners() {
    searchInput.addEventListener('input', filterCars);
    conditionFilter.addEventListener('change', filterCars);
}

// Filter cars based on search input and condition filter
function filterCars() {
    const searchTerm = searchInput.value.toLowerCase();
    const conditionValue = conditionFilter.value;

    const filteredCars = cars.filter(car => {
        const matchesSearch = car.make.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm) ||
            car.year.toString().includes(searchTerm);

        const matchesCondition = conditionValue === 'all' || car.condition === conditionValue;

        return matchesSearch && matchesCondition;
    });

    displayCars(filteredCars);
}

// Display cars in the listings
function displayCars(carsToDisplay) {
    carListings.innerHTML = '';

    if (carsToDisplay.length === 0) {
        const noCarsMsg = window.translations[state.lang]['inventory.no_cars'] || 'No cars found matching your criteria.';
        carListings.innerHTML = `<p style="text-align: center; color: #ccc; font-size: 1.2rem; grid-column: 1 / -1;">${noCarsMsg}</p>`;
        return;
    }

    carsToDisplay.forEach(car => {
        const carCard = createCarCard(car);
        carListings.appendChild(carCard);
    });

    // Add visual enhancements after cars are displayed
    enhanceDisplayedCars();
}

// Helper to translate car specs
function translateCarSpec(type, value) {
    if (!value) return value;
    const t = window.translations[state.lang];
    if (!t) return value;

    const val = value.toLowerCase();

    if (type === 'transmission') {
        if (val.includes('auto')) return t['car.trans.auto'];
        if (val.includes('manual')) return t['car.trans.manual'];
        if (val.includes('cvt')) return t['car.trans.cvt'];
        if (val.includes('single')) return t['car.trans.single'];
    }

    if (type === 'fuel') {
        if (val.includes('gas')) return t['car.fuel.gas'];
        if (val.includes('electric')) return t['car.fuel.electric'];
        if (val.includes('hybrid')) return t['car.fuel.hybrid'];
        if (val.includes('diesel')) return t['car.fuel.diesel'];
    }

    if (type === 'drive') {
        if (val.includes('fwd')) return t['car.drive.fwd'];
        if (val.includes('rwd')) return t['car.drive.rwd'];
        if (val.includes('awd')) return t['car.drive.awd'];
        if (val.includes('4wd')) return t['car.drive.4wd'];
    }

    if (type === 'color') {
        const colors = ['white', 'black', 'silver', 'red', 'blue', 'gray'];
        for (const color of colors) {
            if (val.includes(color)) {
                return value.replace(new RegExp(color, 'i'), t[`car.color.${color}`]);
            }
        }
    }

    return value;
}

// Create a car card element
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';

    const conditionClass = car.condition === 'new' ? 'condition-new' : 'condition-used';
    const conditionText = state.lang === 'es'
        ? (car.condition === 'new' ? 'Nuevo' : 'Usado')
        : (car.condition === 'new' ? 'New' : 'Used');
    const formattedPrice = formatPrice(car.price);
    const formattedMileage = car.mileage.toLocaleString();

    const t = window.translations[state.lang];
    if (!t) return card; // Safety check

    const getLabel = (key) => (t[key] ? t[key].replace(':', '') : key);

    const mileageLabel = getLabel('car.mileage');
    const engineLabel = getLabel('car.engine');
    const transmissionLabel = getLabel('car.transmission');
    const fuelLabel = getLabel('car.fuel');
    const colorLabel = getLabel('car.color');
    const drivetrainLabel = getLabel('car.drivetrain');
    const milesText = state.lang === 'es' ? 'millas' : 'miles';
    const newText = state.lang === 'es' ? 'Nuevo' : 'New';

    card.innerHTML = `
        <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" class="car-image" loading="lazy">
        <div class="car-info">
            <h3 class="car-title">${car.year} ${car.make} ${car.model}</h3>
            <div class="car-details">
                <div class="car-detail">
                    <span>${mileageLabel}:</span>
                    <span>${car.mileage === 0 ? newText : formattedMileage + ' ' + milesText}</span>
                </div>
                <div class="car-detail">
                    <span>${engineLabel}:</span>
                    <span>${car.engine}</span>
                </div>
                <div class="car-detail">
                    <span>${transmissionLabel}:</span>
                    <span>${translateCarSpec('transmission', car.transmission)}</span>
                </div>
                <div class="car-detail">
                    <span>${fuelLabel}:</span>
                    <span>${translateCarSpec('fuel', car.fuelType)}</span>
                </div>
                <div class="car-detail">
                    <span>${colorLabel}:</span>
                    <span>${translateCarSpec('color', car.color)}</span>
                </div>
                <div class="car-detail">
                    <span>${drivetrainLabel}:</span>
                    <span>${translateCarSpec('drive', car.drivetrain)}</span>
                </div>
            </div>
            <div class="car-price">${formattedPrice}</div>
            <span class="condition-badge ${conditionClass}">${conditionText}</span>
        </div>
    `;

    // Add click event to show more details (could be expanded later)
    card.addEventListener('click', () => {
        showCarDetails(car);
    });

    return card;
}

// Initialize modal action buttons
function initializeModalActions() {
    // Event delegation for modal action buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.modal-buy-btn') || e.target.closest('.modal-buy-btn')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                // Find the car data from the modal content
                const carPrice = modal.querySelector('#modal-car-price').textContent;

                // Parse car data (this is a simplified approach - in a real app you'd store car data)
                const carData = {
                    make: modal.querySelector('#modal-make').textContent,
                    model: modal.querySelector('#modal-model').textContent,
                    year: parseInt(modal.querySelector('#modal-year').textContent),
                    price: parseFloat(carPrice.replace(/[$,]/g, '')),
                    image: modal.querySelector('#modal-car-image').src,
                    condition: modal.querySelector('#modal-condition-badge').textContent.toLowerCase()
                };

                handleBuyNow(carData);
            }
        }

        if (e.target.matches('.modal-contact-btn') || e.target.closest('.modal-contact-btn')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                // Find the car data from the modal content
                const carData = {
                    make: modal.querySelector('#modal-make').textContent,
                    model: modal.querySelector('#modal-model').textContent,
                    year: parseInt(modal.querySelector('#modal-year').textContent),
                    price: parseFloat(modal.querySelector('#modal-car-price').textContent.replace(/[$,]/g, '')),
                    image: modal.querySelector('#modal-car-image').src,
                    condition: modal.querySelector('#modal-condition-badge').textContent.toLowerCase()
                };

                handleContactSeller(carData);
                closeModal();
            }
        }
    });
}

// Format price with currency
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Modal variables (will be initialized after DOM loads)
let modal, closeModalBtn;

// Show car details in modal
function showCarDetails(car) {
    const t = window.translations[state.lang];
    if (!t) return;

    // Populate modal with car data
    document.getElementById('modal-car-image').src = car.image;
    document.getElementById('modal-car-image').alt = `${car.year} ${car.make} ${car.model}`;
    document.getElementById('modal-car-title').textContent = `${car.year} ${car.make} ${car.model}`;
    document.getElementById('modal-car-price').textContent = formatPrice(car.price);

    // Use Spanish description if available
    document.getElementById('modal-car-description').textContent = state.lang === 'es' && car.description_es ? car.description_es : car.description;

    // Set condition badge
    const conditionBadge = document.getElementById('modal-condition-badge');
    conditionBadge.textContent = state.lang === 'es'
        ? (car.condition === 'new' ? 'Nuevo' : 'Usado')
        : (car.condition === 'new' ? 'New' : 'Used');
    conditionBadge.className = `condition-badge ${car.condition === 'new' ? 'condition-new' : 'condition-used'}`;

    const milesText = state.lang === 'es' ? 'millas' : 'miles';
    const newText = state.lang === 'es' ? 'Nuevo' : 'New';

    // Populate specifications with staggered animation
    const specs = [
        { id: 'modal-year', value: car.year },
        { id: 'modal-make', value: car.make },
        { id: 'modal-model', value: car.model },
        { id: 'modal-mileage', value: car.mileage === 0 ? newText : car.mileage.toLocaleString() + ' ' + milesText },
        { id: 'modal-engine', value: car.engine },
        { id: 'modal-transmission', value: translateCarSpec('transmission', car.transmission) },
        { id: 'modal-fuel', value: translateCarSpec('fuel', car.fuelType) },
        { id: 'modal-color', value: translateCarSpec('color', car.color) },
        { id: 'modal-drivetrain', value: translateCarSpec('drive', car.drivetrain) }
    ];

    specs.forEach((spec, index) => {
        const element = document.getElementById(spec.id);
        element.textContent = spec.value;
        element.style.setProperty('--item-index', index);
    });

    // Populate features with staggered animation
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    const carFeatures = state.lang === 'es' && car.features_es ? car.features_es : car.features;
    carFeatures.forEach((feature, index) => {
        const li = document.createElement('li');
        li.textContent = feature;
        li.style.setProperty('--feature-index', index);
        featuresList.appendChild(li);
    });

    // Show modal with smooth entrance
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal function
function closeModal() {
    document.body.style.overflow = 'auto'; // Restore scrolling immediately for mobile compatibility

    // Add exit animation
    modal.style.animation = 'modalSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';

    // Hide modal after animation completes
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = ''; // Reset animation
    }, 400);
}

// Add slide out animation
const style = document.createElement('style');
style.textContent = `
@keyframes modalSlideOut {
    from {
        opacity: 1;
        transform: scale(1) translateY(0) rotateX(0deg);
        filter: blur(0px);
    }
    to {
        opacity: 0;
        transform: scale(0.9) translateY(-20px) rotateX(-5deg);
        filter: blur(5px);
    }
}
`;
document.head.appendChild(style);

// Initialize modal after DOM loads
function initializeModal() {
    modal = document.getElementById('car-modal');
    closeModalBtn = document.querySelector('.close-modal');

    // Event listeners for modal
    closeModalBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}


// Form handling functions
function handleSellCarSubmit(event) {
    event.preventDefault();

    // Get preview image if exists
    const previewContainer = document.getElementById('image-preview');
    const previewImg = previewContainer.querySelector('img');
    const carImageBase64 = previewImg ? previewImg.src : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    // Get form data
    const formData = new FormData(event.target);
    const carData = {
        sellerName: formData.get('sellerName'),
        sellerEmail: formData.get('sellerEmail'),
        sellerPhone: formData.get('sellerPhone'),
        sellerLocation: formData.get('sellerLocation'),
        make: formData.get('carMake'),
        model: formData.get('carModel'),
        year: parseInt(formData.get('carYear')),
        mileage: parseInt(formData.get('carMileage')),
        price: parseInt(formData.get('carPrice')),
        condition: formData.get('carCondition'),
        color: formData.get('carColor'),
        transmission: formData.get('carTransmission'),
        description: formData.get('carDescription'),
        features: formData.get('carFeatures') ? formData.get('carFeatures').split(',').map(f => f.trim()) : [],
        image: carImageBase64
    };

    // Validate required fields
    if (!validateSellCarForm(carData)) {
        return;
    }

    // Show success message
    showSellCarSuccess(carData);

    // Reset form and preview
    event.target.reset();
    previewContainer.innerHTML = '';
    previewContainer.style.display = 'none';
    const fileNameSpan = document.getElementById('file-name');
    if (fileNameSpan) {
        fileNameSpan.textContent = state.lang === 'es' ? 'Sin foto seleccionada' : 'No photo selected';
        fileNameSpan.setAttribute('data-i18n', 'form.no_image');
    }

    // In a real application, you would send this data to a server
    console.log('Car listing submitted with image:', carData);
}

function handleContactSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const contactData = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        phone: formData.get('contactPhone'),
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage')
    };

    // Validate required fields
    if (!validateContactForm(contactData)) {
        return;
    }

    // Show success message
    showContactSuccess(contactData);

    // Reset form
    event.target.reset();

    // In a real application, you would send this data to a server
    console.log('Contact form submitted:', contactData);
}

function validateContactForm(data) {
    const requiredFields = ['name', 'email', 'subject', 'message'];

    for (const field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in the ${field === 'name' ? 'name' : field === 'email' ? 'email' : field === 'subject' ? 'subject' : 'message'} field.`);
            return false;
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    return true;
}

function showContactSuccess(contactData) {
    const t = window.translations[state.lang];
    // Create success modal/message
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h3>${t['success.message_sent']}</h3>
            <p>${t['success.thank_you']} <strong>${contactData.name}</strong>!</p>
            <p>${t['success.received']} <strong>${contactData.subject}</strong> ${t['success.contact_within']}</p>
            <button class="success-close-btn">${t['success.continue']}</button>
        </div>
    `;

    document.body.appendChild(successModal);

    // Add styles for success modal
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease-out;
        }

        .success-modal-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            max-width: 500px;
            margin: 1rem;
        }

        .success-icon {
            font-size: 3rem;
            color: #4CAF50;
            margin-bottom: 1rem;
        }

        .success-modal-content h3 {
            color: #fff;
            margin-bottom: 1rem;
        }

        .success-modal-content p {
            color: #ccc;
            margin-bottom: 1rem;
            line-height: 1.5;
        }

        .success-close-btn {
            background: linear-gradient(135deg, #666, #999);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .success-close-btn:hover {
            transform: translateY(-2px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Handle close button
    const closeBtn = successModal.querySelector('.success-close-btn');
    closeBtn.addEventListener('click', () => {
        successModal.remove();
        style.remove();
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (successModal.parentNode) {
            successModal.remove();
            style.remove();
        }
    }, 5000);
}

function validateSellCarForm(data) {
    const requiredFields = ['sellerName', 'sellerEmail', 'make', 'model', 'year', 'mileage', 'price', 'condition'];

    for (const field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
            return false;
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.sellerEmail)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (data.year < 1900 || data.year > currentYear + 1) {
        alert('Please enter a valid year.');
        return false;
    }

    return true;
}

function showSellCarSuccess(carData) {
    const t = window.translations[state.lang];
    // Create success modal/message
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h3>${t['success.car_listed']}</h3>
            <p>${t['success.car_listed_thanks']} ${carData.year} ${carData.make} ${carData.model}.</p>
            <p>${t['success.car_listed_review']}</p>
            <button class="success-close-btn">${t['success.continue']}</button>
        </div>
    `;

    document.body.appendChild(successModal);

    // Add styles for success modal
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease-out;
        }

        .success-modal-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 2rem;
            text-align: center;
            max-width: 500px;
            margin: 1rem;
        }

        .success-icon {
            font-size: 3rem;
            color: #4CAF50;
            margin-bottom: 1rem;
        }

        .success-modal-content h3 {
            color: #fff;
            margin-bottom: 1rem;
        }

        .success-modal-content p {
            color: #ccc;
            margin-bottom: 1rem;
            line-height: 1.5;
        }

        .success-close-btn {
            background: linear-gradient(135deg, #666, #999);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .success-close-btn:hover {
            transform: translateY(-2px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Handle close button
    const closeBtn = successModal.querySelector('.success-close-btn');
    closeBtn.addEventListener('click', () => {
        successModal.remove();
        style.remove();
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (successModal.parentNode) {
            successModal.remove();
            style.remove();
        }
    }, 5000);
}

// Initialize forms after DOM loads
function initializeForms() {
    // Sell Car Form Handling
    const sellForm = document.getElementById('sell-car-form');
    if (sellForm) {
        sellForm.addEventListener('submit', handleSellCarSubmit);
        initializeImageUpload();
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

// Initialize image upload and preview
function initializeImageUpload() {
    const fileInput = document.getElementById('car-photo-upload');
    const fileNameSpan = document.getElementById('file-name');
    const previewContainer = document.getElementById('image-preview');

    if (!fileInput || !fileNameSpan || !previewContainer) return;

    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            // Update file name display
            fileNameSpan.textContent = file.name;

            // Create preview
            const reader = new FileReader();
            reader.onload = function (e) {
                previewContainer.innerHTML = `<img src="${e.target.result}" alt="Vehicle Preview">`;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            fileNameSpan.textContent = state.lang === 'es' ? 'Sin foto seleccionada' : 'No photo selected';
            previewContainer.innerHTML = '';
            previewContainer.style.display = 'none';
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some visual enhancements
function addVisualEnhancements() {
    // Add fade-in animation for car cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initially hide cards and add animation
    document.querySelectorAll('.car-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize control buttons
function initializeControls() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            });
        });
    }
}

// Back to Top Button functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners
    window.addEventListener('scroll', toggleBackToTop);
    backToTopBtn.addEventListener('click', scrollToTop);

    // Initial check
    toggleBackToTop();
}

// Modal action button handlers
function handleBuyNow(car) {
    // Create a purchase confirmation modal
    const purchaseModal = document.createElement('div');
    purchaseModal.className = 'purchase-modal-overlay';
    purchaseModal.innerHTML = `
        <div class="purchase-modal">
            <div class="purchase-header">
                <h3>Confirm Purchase</h3>
                <button class="purchase-close">&times;</button>
            </div>
            <div class="purchase-body">
                <div class="purchase-car-info">
                    <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" class="purchase-car-image">
                    <div class="purchase-car-details">
                        <h4>${car.year} ${car.make} ${car.model}</h4>
                        <p class="purchase-price">${formatPrice(car.price)}</p>
                        <p class="purchase-condition">${car.condition === 'new' ? 'New' : 'Used'}</p>
                    </div>
                </div>
                <div class="purchase-form">
                    <h4>Enter Your Information</h4>
                    <form id="purchase-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="buyer-name">Full Name *</label>
                                <input type="text" id="buyer-name" name="buyerName" required>
                            </div>
                            <div class="form-group">
                                <label for="buyer-email">Email *</label>
                                <input type="email" id="buyer-email" name="buyerEmail" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="buyer-phone">Phone Number *</label>
                                <input type="tel" id="buyer-phone" name="buyerPhone" required>
                            </div>
                            <div class="form-group">
                                <label for="buyer-address">Address</label>
                                <input type="text" id="buyer-address" name="buyerAddress" placeholder="Street, City, State, ZIP">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="buyer-comments">Additional Comments</label>
                            <textarea id="buyer-comments" name="buyerComments" rows="3" placeholder="Any special requests or questions..."></textarea>
                        </div>
                        <div class="purchase-actions">
                            <button type="button" class="purchase-cancel">Cancel</button>
                            <button type="submit" class="purchase-confirm">Complete Purchase</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(purchaseModal);

    // Add event listeners
    const closeBtn = purchaseModal.querySelector('.purchase-close');
    const cancelBtn = purchaseModal.querySelector('.purchase-cancel');
    const form = purchaseModal.querySelector('#purchase-form');

    const closePurchaseModal = () => {
        purchaseModal.remove();
    };

    closeBtn.addEventListener('click', closePurchaseModal);
    cancelBtn.addEventListener('click', closePurchaseModal);

    purchaseModal.addEventListener('click', (e) => {
        if (e.target === purchaseModal) {
            closePurchaseModal();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handlePurchaseSubmit(car, new FormData(form));
        closePurchaseModal();
    });

    // Add styles for purchase modal
    const style = document.createElement('style');
    style.textContent = `
        .purchase-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: modalFadeIn 0.3s ease-out;
        }

        .purchase-modal {
            background: var(--modal-bg);
            backdrop-filter: blur(25px);
            border: 1px solid var(--modal-border);
            border-radius: 20px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .purchase-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--border-color);
        }

        .purchase-header h3 {
            color: var(--text-primary);
            margin: 0;
            font-size: 1.5rem;
        }

        .purchase-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 24px;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .purchase-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }

        .purchase-body {
            padding: 2rem;
        }

        .purchase-car-info {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--bg-secondary);
            border-radius: 12px;
            border: 1px solid var(--border-color);
        }

        .purchase-car-image {
            width: 120px;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;
        }

        .purchase-car-details h4 {
            color: var(--text-primary);
            margin: 0 0 0.5rem 0;
            font-size: 1.2rem;
        }

        .purchase-price {
            color: #4CAF50;
            font-size: 1.3rem;
            font-weight: bold;
            margin: 0.25rem 0;
        }

        .purchase-condition {
            color: var(--text-secondary);
            margin: 0.25rem 0;
            text-transform: capitalize;
        }

        .purchase-form h4 {
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            font-size: 1.3rem;
        }

        .purchase-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
        }

        .purchase-cancel {
            background: var(--bg-secondary);
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .purchase-cancel:hover {
            background: var(--bg-tertiary);
            border-color: var(--border-color-hover);
        }

        .purchase-confirm {
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .purchase-confirm:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        }

        @media (max-width: 768px) {
            .purchase-car-info {
                flex-direction: column;
                text-align: center;
            }

            .purchase-car-image {
                width: 100%;
                height: 150px;
            }

            .purchase-actions {
                flex-direction: column;
            }

            .purchase-cancel,
            .purchase-confirm {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

function handleContactSeller(car) {
    // Restore body overflow first so scrolling is possible
    document.body.style.overflow = 'auto';

    // Scroll to contact section and pre-fill some information
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        // Small delay to ensure modal start closing and body is scrollable
        setTimeout(() => {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }

    // Pre-fill subject with car information
    const subjectSelect = document.getElementById('contact-subject');
    const messageTextarea = document.getElementById('contact-message');

    if (subjectSelect) subjectSelect.value = 'sales';
    if (messageTextarea) {
        messageTextarea.value = `Hi, I'm interested in the ${car.year} ${car.make} ${car.model} listed for ${formatPrice(car.price)}. Please provide more information about this vehicle.`;

        // Add a small delay to ensure smooth scrolling completes
        setTimeout(() => {
            messageTextarea.focus();
            messageTextarea.setSelectionRange(messageTextarea.value.length, messageTextarea.value.length);
        }, 1200);
    }
}

function handlePurchaseSubmit(car, formData) {
    const purchaseData = {
        car: car,
        buyer: {
            name: formData.get('buyerName'),
            email: formData.get('buyerEmail'),
            phone: formData.get('buyerPhone'),
            address: formData.get('buyerAddress'),
            comments: formData.get('buyerComments')
        },
        timestamp: new Date().toISOString()
    };

    // Create success notification
    const successNotification = document.createElement('div');
    successNotification.className = 'purchase-success-notification';
    successNotification.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h3>Purchase Request Submitted!</h3>
            <p>Thank you for your interest in the ${car.year} ${car.make} ${car.model}!</p>
            <p>We'll contact you at <strong>${purchaseData.buyer.email}</strong> within 24 hours to complete the transaction.</p>
            <button class="success-close-btn">Continue</button>
        </div>
    `;

    document.body.appendChild(successNotification);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .purchase-success-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--modal-bg);
            backdrop-filter: blur(25px);
            border: 1px solid var(--modal-border);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            z-index: 10002;
            animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .success-content h3 {
            color: var(--text-primary);
            margin: 1rem 0;
            font-size: 1.5rem;
        }

        .success-content p {
            color: var(--text-secondary);
            margin: 0.5rem 0;
            line-height: 1.5;
        }

        .success-icon {
            font-size: 3rem;
            color: #4CAF50;
            margin-bottom: 1rem;
        }

        .success-close-btn {
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }

        .success-close-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        }
    `;
    document.head.appendChild(style);

    // Handle close
    const closeBtn = successNotification.querySelector('.success-close-btn');
    closeBtn.addEventListener('click', () => {
        successNotification.remove();
        style.remove();
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (successNotification.parentNode) {
            successNotification.remove();
            style.remove();
        }
    }, 5000);

    // In a real application, you would send this data to a server
    console.log('Purchase submitted:', purchaseData);
}

// Add visual enhancements after cars are displayed
function enhanceDisplayedCars() {
    // Add visual enhancements after a short delay
    setTimeout(addVisualEnhancements, 100);
}