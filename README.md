# ByCar - Used & New Cars Dealership Website

A modern, responsive car dealership website built with HTML, CSS, and JavaScript. ByCar provides a comprehensive platform for browsing vehicles, selling cars, and accessing automotive services.

## 🚗 Features

### Core Functionality
- **Vehicle Inventory**: Browse through a curated selection of new and used vehicles
- **Advanced Filtering**: Filter cars by condition (new/used) and search by make, model, or year
- **Detailed Car Modals**: Click any car card to view comprehensive details including specifications, features, and pricing
- **Sell Your Car**: Submit vehicle listings with detailed information forms
- **Contact System**: Multiple contact methods including forms, phone, and email
- **Responsive Design**: Fully responsive across all device sizes

### User Experience
- **Dark/Light Theme Toggle**: Switch between dark and light themes with persistent storage
- **Smooth Scrolling Navigation**: Seamless navigation between sections
- **Interactive Modals**: Modern modal system for car details and purchase flows
- **Form Validation**: Client-side validation for all forms
- **Back to Top Button**: Easy navigation for long pages
- **Loading Animations**: Smooth fade-in animations for enhanced user experience

### Services & Information
- **Comprehensive Services**: Maintenance, detailing, performance upgrades, and inspections
- **Financing Options**: Auto loans, refinancing, and lease information
- **Company Information**: About section with statistics and company story
- **FAQ Section**: Common questions and answers
- **Contact Information**: Multiple contact methods and business hours

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)**: Interactive functionality and DOM manipulation
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Typography (Arial fallback)

### Key Libraries & Features
- CSS Custom Properties (CSS Variables) for theming
- CSS Grid and Flexbox for responsive layouts
- Intersection Observer API for scroll animations
- Local Storage API for theme persistence
- FormData API for form handling
- Modern modal system with backdrop blur effects

## 📁 Project Structure

```
ByCar/
├── index.html          # Main HTML file
├── styles.css          # Complete stylesheet
├── app.js             # Main JavaScript functionality
├── data.js            # Car inventory data
└── README.md          # Project documentation
```

### File Descriptions

- **`index.html`**: Contains the complete website structure with all sections (hero, inventory, services, contact, etc.)
- **`styles.css`**: Comprehensive stylesheet with dark/light theme support, responsive design, and animations
- **`app.js`**: Handles all interactive functionality including:
  - Car filtering and display
  - Modal management
  - Form submission and validation
  - Theme switching
  - Smooth scrolling
  - Back-to-top functionality
- **`data.js`**: Contains the car inventory data with detailed specifications

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required - pure HTML/CSS/JS

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. The website will load with full functionality

### Local Development
Simply open `index.html` in any modern web browser. No server required for basic functionality.

## 📖 Usage

### Browsing Inventory
1. Navigate to the "Inventory" section
2. Use the condition filter (All/New/Used) to narrow results
3. Use the search bar to find specific makes, models, or years
4. Click on any car card to view detailed information in a modal

### Selling a Car
1. Go to the "Sell Your Car" section
2. Fill out the comprehensive form with vehicle details
3. Include optional features and image URL
4. Submit the form (currently logs to console for demo purposes)

### Contacting the Dealership
1. Use the contact form in the "Contact" section
2. Or call the provided phone numbers
3. Business hours and additional contact methods are listed

### Theme Switching
- Click the theme toggle button in the footer to switch between dark and light modes
- Your preference is automatically saved

## 🎨 Design Features

### Themes
- **Dark Theme (Default)**: Modern dark interface with glassmorphism effects
- **Light Theme**: Clean light interface with proper contrast
- Both themes use CSS custom properties for consistent theming

### Responsive Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: < 480px

### Animations & Effects
- Smooth hover transitions
- Modal slide-in animations
- Staggered content loading
- Backdrop blur effects
- Glassmorphism design elements

## 🔧 Functionality Overview

### JavaScript Features
- **Car Management**: Dynamic filtering, display, and modal generation
- **Form Handling**: Validation, submission, and success notifications
- **Theme System**: Persistent theme switching with localStorage
- **Navigation**: Smooth scrolling and active section highlighting
- **Modal System**: Reusable modal component with animations
- **Responsive Utilities**: Dynamic element management based on screen size

### Form Validation
- Required field validation
- Email format validation
- Year range validation (1900 - current year + 1)
- Real-time feedback and error messages

### Data Structure
Cars include comprehensive information:
- Basic info: make, model, year, price, mileage
- Technical specs: engine, transmission, fuel type, drivetrain
- Features: array of equipment and options
- Images: high-quality vehicle photos
- Condition: new or used status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Maintain responsive design principles
- Follow existing code style and naming conventions
- Test across multiple browsers and devices
- Ensure accessibility compliance
- Add comments for complex functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**ByCar Dealership**
- **Email**: info@bycar.com | sales@bycar.com
- **Phone**: (555) 123-4567 | Toll-Free: 1-800-BYCAR-01
- **Address**: 123 Auto Plaza Drive, Suite 100, Car City, CC 12345
- **Business Hours**:
  - Monday - Friday: 9:00 AM - 8:00 PM
  - Saturday: 9:00 AM - 6:00 PM
  - Sunday: 11:00 AM - 5:00 PM

## 🙏 Acknowledgments

- Vehicle images sourced from Unsplash
- Icons provided by Font Awesome
- Design inspiration from modern automotive websites
- Built with modern web standards and best practices

---

**ByCar** - Your trusted source for quality vehicles since 2010.