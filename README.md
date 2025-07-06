# صدقة السعاتة الدومة - Assaatah Al-Doma Charity

A modern React-based charity website dedicated to helping the people of Assaatah Al-Doma area in Khartoum, Sudan.

## 🌟 Features

- **Bilingual Support**: Full Arabic and English language support with RTL layout
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Donation System**: Multi-step donation form with multiple payment methods
- **Real-time Updates**: Live statistics and donation tracking
- **Campaign Management**: Multiple charity campaigns with progress tracking
- **Story Sharing**: Impact stories and beneficiary testimonials
- **Interactive Map**: Project locations and impact visualization
- **User Dashboard**: Personal donation history and impact tracking
- **Mobile Responsive**: Optimized for all device sizes
- **Dark Mode**: Toggle between light and dark themes
- **Accessibility**: WCAG compliant with screen reader support

## 🚀 Tech Stack

- **Frontend**: React 18, JavaScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Payments**: Stripe, PayPal
- **Backend**: Firebase (Auth, Firestore, Functions, Storage)
- **Maps**: Leaflet/React-Leaflet
- **Notifications**: React Hot Toast
- **Internationalization**: Custom i18n solution

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation/     # Main navigation
│   ├── HeroSection/    # Hero section component
│   ├── DonationForm/   # Multi-step donation form
│   ├── Layout/         # Layout components
│   └── Footer/         # Footer component
├── contexts/           # React contexts
│   ├── AuthContext.js  # Authentication state
│   ├── ThemeContext.js # Theme and language
│   ├── LanguageContext.js # Internationalization
│   └── NotificationContext.js # Notifications
├── pages/              # Page components
│   ├── HomePage.js     # Homepage
│   ├── DonationPage.js # Donation page
│   ├── AboutPage.js    # About page
│   └── ...            # Other pages
├── config/             # Configuration files
│   └── firebase.js     # Firebase configuration
├── constants/          # App constants
│   └── index.js        # All constants
└── utils/              # Utility functions
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd assaatahdonationsite
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌍 Localization

The app supports both Arabic and English languages:

- **Arabic (RTL)**: Primary language with full RTL support
- **English (LTR)**: Secondary language
- **Language Switching**: Toggle between languages via navigation
- **Persistent Language**: Language preference saved in localStorage

## 🎨 Theming

- **Light Mode**: Default theme with clean, modern design
- **Dark Mode**: Dark theme for better accessibility
- **Custom Colors**: Sudan flag colors and charity-specific palette
- **Responsive Design**: Mobile-first approach with breakpoints

## 💳 Payment Integration

- **Stripe**: Credit card payments with secure processing
- **PayPal**: Express checkout for international donors
- **Bank Transfer**: Direct bank transfer options
- **Security**: PCI compliant with encryption

## 🔐 Authentication

- **Email/Password**: Traditional authentication
- **Google Sign-in**: OAuth with Google
- **Anonymous**: Guest donations without registration
- **User Profiles**: Personalized dashboards and preferences

## 📊 Features by Page

### Homepage

- Hero section with animated statistics
- Impact stories showcase
- Campaign highlights
- Emergency alerts
- Newsletter signup

### Donation Page

- Multi-step donation process
- Campaign selection
- Payment method options
- Real-time impact calculator
- Recent donations feed

### Campaigns

- Active campaign listings
- Progress tracking
- Category filtering
- Emergency campaign highlighting

### Stories

- Beneficiary testimonials
- Impact stories
- Photo galleries
- Social sharing

### Impact Dashboard

- Real-time statistics
- Geographic impact map
- Project timelines
- Success metrics

## 🚀 Deployment

### Firebase Hosting

```bash
npm run build
firebase deploy
```

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel

```bash
npm run build
# Deploy to Vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- The people of Assaatah Al-Doma for their resilience
- All volunteers and donors who make this work possible
- The open-source community for amazing tools and libraries

## 📞 Contact

For questions or support, please contact:

- Email: info@assaatahdonationsite.com
- Phone: +249 XXX XXX XXX
- Address: Assaatah Al-Doma, Khartoum, Sudan

---

**Made with ❤️ for the people of Assaatah Al-Doma**
