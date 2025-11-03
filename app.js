// DOM elements
const carListings = document.getElementById('car-listings');
const searchInput = document.getElementById('search-input');
const conditionFilter = document.getElementById('condition-filter');

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    displayCars(cars);
    setupEventListeners();
    initializeModal();
    initializeForms();
    initializeThemeToggle();
    initializeBackToTop();
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
        carListings.innerHTML = '<p style="text-align: center; color: #ccc; font-size: 1.2rem; grid-column: 1 / -1;">No cars found matching your criteria.</p>';
        return;
    }

    carsToDisplay.forEach(car => {
        const carCard = createCarCard(car);
        carListings.appendChild(carCard);
    });

    // Add visual enhancements after cars are displayed
    enhanceDisplayedCars();
}

// Create a car card element
function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';

    const conditionClass = car.condition === 'new' ? 'condition-new' : 'condition-used';
    const conditionText = car.condition === 'new' ? 'New' : 'Used';
    const formattedPrice = formatPrice(car.price);
    const formattedMileage = car.mileage.toLocaleString();

    card.innerHTML = `
        <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" class="car-image" loading="lazy">
        <div class="car-info">
            <h3 class="car-title">${car.year} ${car.make} ${car.model}</h3>
            <div class="car-details">
                <div class="car-detail">
                    <span>Mileage:</span>
                    <span>${car.mileage === 0 ? 'New' : formattedMileage + ' miles'}</span>
                </div>
                <div class="car-detail">
                    <span>Engine:</span>
                    <span>${car.engine}</span>
                </div>
                <div class="car-detail">
                    <span>Transmission:</span>
                    <span>${car.transmission}</span>
                </div>
                <div class="car-detail">
                    <span>Fuel:</span>
                    <span>${car.fuelType}</span>
                </div>
                <div class="car-detail">
                    <span>Color:</span>
                    <span>${car.color}</span>
                </div>
                <div class="car-detail">
                    <span>Drivetrain:</span>
                    <span>${car.drivetrain}</span>
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
    // Populate modal with car data
    document.getElementById('modal-car-image').src = car.image;
    document.getElementById('modal-car-image').alt = `${car.year} ${car.make} ${car.model}`;
    document.getElementById('modal-car-title').textContent = `${car.year} ${car.make} ${car.model}`;
    document.getElementById('modal-car-price').textContent = formatPrice(car.price);
    document.getElementById('modal-car-description').textContent = car.description;

    // Set condition badge
    const conditionBadge = document.getElementById('modal-condition-badge');
    conditionBadge.textContent = car.condition === 'new' ? 'New' : 'Used';
    conditionBadge.className = `condition-badge ${car.condition === 'new' ? 'condition-new' : 'condition-used'}`;

    // Populate specifications with staggered animation
    const specs = [
        { id: 'modal-year', value: car.year },
        { id: 'modal-make', value: car.make },
        { id: 'modal-model', value: car.model },
        { id: 'modal-mileage', value: car.mileage === 0 ? 'New' : car.mileage.toLocaleString() + ' miles' },
        { id: 'modal-engine', value: car.engine },
        { id: 'modal-transmission', value: car.transmission },
        { id: 'modal-fuel', value: car.fuelType },
        { id: 'modal-color', value: car.color },
        { id: 'modal-drivetrain', value: car.drivetrain }
    ];

    specs.forEach((spec, index) => {
        const element = document.getElementById(spec.id);
        element.textContent = spec.value;
        element.style.setProperty('--item-index', index);
    });

    // Populate features with staggered animation
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    car.features.forEach((feature, index) => {
        const li = document.createElement('li');
        li.textContent = feature;
        li.style.setProperty('--feature-index', index);
        featuresList.appendChild(li);
    });

    // Show modal with smooth entrance
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Add entrance sound effect (optional - requires audio file)
    // const audio = new Audio('modal-open.mp3');
    // audio.volume = 0.3;
    // audio.play().catch(() => {}); // Ignore if audio fails
}

// Close modal function
function closeModal() {
    // Add exit animation
    modal.style.animation = 'modalSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';

    // Hide modal after animation completes
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = ''; // Reset animation
        document.body.style.overflow = 'auto'; // Restore scrolling
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
        image: formData.get('carImage') || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };

    // Validate required fields
    if (!validateSellCarForm(carData)) {
        return;
    }

    // Show success message
    showSellCarSuccess(carData);

    // Reset form
    event.target.reset();

    // In a real application, you would send this data to a server
    console.log('Car listing submitted:', carData);
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
    // Create success modal/message
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h3>Message Sent!</h3>
            <p>Thank you for contacting us, <strong>${contactData.name}</strong>!</p>
            <p>We've received your message regarding <strong>${contactData.subject}</strong> and will get back to you at <strong>${contactData.email}</strong> within 24 hours.</p>
            <button class="success-close-btn">Continue</button>
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
    // Create success modal/message
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h3>Car Listing Submitted!</h3>
            <p>Thank you for listing your ${carData.year} ${carData.make} ${carData.model} with us.</p>
            <p>We'll review your submission and contact you at <strong>${carData.sellerEmail}</strong> within 24 hours.</p>
            <button class="success-close-btn">Continue</button>
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
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
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

// Initialize theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
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

// Add visual enhancements after cars are displayed
function enhanceDisplayedCars() {
    // Add visual enhancements after a short delay
    setTimeout(addVisualEnhancements, 100);
}