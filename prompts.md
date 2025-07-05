Create a new React project with Firebase integration for a Sudan relief charity website. Set up the following:

1. Initialize React app with TypeScript and Tailwind CSS
2. Install and configure Firebase SDK with these services:

   - Authentication (Google, Email/Password, Anonymous)
   - Firestore Database
   - Cloud Functions
   - Cloud Storage
   - Analytics
   - Hosting

3. Create environment variables for:

   - Firebase configuration
   - Payment gateway keys (Stripe, PayPal)
   - Email service API keys
   - Analytics tracking IDs

4. Set up folder structure:
   /src
   ├── /components
   ├── /pages
   ├── /hooks
   ├── /services
   ├── /utils
   ├── /types
   ├── /contexts
   └── /assets

5. Configure Tailwind with custom theme colors:
   - Primary: Sudan flag colors (#CE1126, #FFFFFF, #000000)
   - Secondary: Hope colors (#FF6B35, #F7931E, #4A90E2)
   - Neutral: Warm grays (#2C3E50, #7F8C8D, #BDC3C7)
     Package Dependencies Installation Prompt
     Install the following npm packages for the Sudan relief charity website:

Core Dependencies:

- react-router-dom (navigation)
- @headlessui/react (accessible UI components)
- react-hook-form (form handling)
- yup (form validation)
- axios (API calls)
- react-query (data fetching)
- framer-motion (animations)
- react-intersection-observer (scroll animations)

Payment & Donations:

- @stripe/stripe-js
- @stripe/react-stripe-js
- @paypal/react-paypal-js

Firebase:

- firebase
- react-firebase-hooks

UI & Visualization:

- recharts (donation charts)
- react-countup (animated counters)
- react-image-gallery (photo galleries)
- react-player (video testimonials)
- leaflet + react-leaflet (interactive maps)

Internationalization:

- react-i18next (multi-language support)
- i18next-browser-languagedetector

Utilities:

- date-fns (date formatting)
- lodash (utility functions)
- react-hot-toast (notifications)
- react-helmet-async (SEO)

Create package.json with all dependencies and set up initial scripts for development, build, and deployment. 2. Database Schema & Firestore Setup
Firestore Database Structure Prompt
Create Firestore database collections and documents with the following structure:

Collection: donations

- id: string (auto-generated)
- amount: number
- currency: string
- donorEmail: string (encrypted)
- donorName: string
- isAnonymous: boolean
- paymentMethod: string
- transactionId: string
- campaign: string
- createdAt: timestamp
- status: string (pending, completed, failed)
- impactArea: string
- recurringDonation: boolean
- recurringInterval: string
- metadata: object

Collection: stories

- id: string
- title: string
- content: string
- author: string
- beneficiaryName: string
- location: string
- images: array of strings
- videoUrl: string
- category: string (emergency, education, healthcare, water)
- publishedAt: timestamp
- status: string (draft, published, archived)
- viewCount: number
- likes: number
- tags: array of strings
- impactMetrics: object

Collection: campaigns

- id: string
- name: string
- description: string
- targetAmount: number
- currentAmount: number
- startDate: timestamp
- endDate: timestamp
- status: string (active, completed, paused)
- category: string
- images: array
- isEmergency: boolean
- beneficiaryCount: number
- location: string
- updates: array of objects

Collection: beneficiaries

- id: string
- name: string (encrypted)
- age: number
- location: string
- family: object
- needs: array
- assistanceReceived: array
- consentGiven: boolean
- photos: array (with permissions)
- story: string
- updates: array
- privacyLevel: string

Collection: volunteers

- id: string
- name: string
- email: string
- skills: array
- location: string
- availability: object
- applications: array
- verificationStatus: string
- languages: array
- experience: string

Collection: partners

- id: string
- name: string
- type: string (ngo, government, business)
- website: string
- contact: object
- verificationStatus: string
- logo: string
- description: string
- activeProjects: array

Collection: impactMetrics

- id: string
- metric: string
- value: number
- unit: string
- category: string
- date: timestamp
- location: string
- campaign: string
- verified: boolean

Set up Firestore security rules for each collection with appropriate read/write permissions.
Firestore Security Rules Prompt
Create comprehensive Firestore security rules for the Sudan charity website:

1. Public read access for:

   - Published stories
   - Active campaigns
   - Impact metrics
   - Partner information (verified only)

2. Authenticated write access for:

   - Donations (users can create their own)
   - Volunteer applications
   - Comments and feedback

3. Admin-only access for:

   - Story publishing/editing
   - Campaign management
   - Beneficiary information
   - Impact metrics updates
   - User management

4. Privacy protection:

   - Encrypt sensitive donor information
   - Restrict access to beneficiary personal data
   - Implement data retention policies
   - Add audit logging for admin actions

5. Rate limiting:
   - Limit donation creation to prevent spam
   - Throttle story submissions
   - Prevent excessive API calls

Include custom functions for:

- Validating donation amounts
- Checking user authentication status
- Verifying admin permissions
- Data sanitization

3. Component Architecture Prompts
   Navigation Component Prompt
   Create a responsive navigation component for the Sudan relief charity website:

Features:

1. Logo with Sudan relief organization branding
2. Multi-language toggle (English/Arabic) with proper RTL support
3. Main navigation items:

   - Home
   - About Us
   - Our Work (dropdown: Emergency Relief, Education, Healthcare, Water)
   - Stories
   - Get Involved (dropdown: Donate, Volunteer, Partner)
   - Transparency
   - Contact

4. Mobile hamburger menu with smooth animations
5. Donate button prominently displayed (sticky on scroll)
6. Search functionality for stories and campaigns
7. Accessibility features (ARIA labels, keyboard navigation)
8. Dark mode toggle
9. Social media links
10. Emergency alert banner (conditional display)

Styling:

- Use Tailwind CSS classes
- Implement smooth hover effects
- Responsive design (mobile-first)
- High contrast mode support
- Loading states for all interactive elements

State Management:

- Track current language
- Handle mobile menu open/close
- Manage user authentication state
- Store navigation history for breadcrumbs

Export as default component with TypeScript interfaces for all props.
Hero Section Component Prompt
Create a compelling hero section component for the Sudan charity homepage:

Layout:

1. Full-screen height hero with background image/video
2. Overlay with gradient for text readability
3. Centered content with maximum width container
4. Responsive grid layout (text left, stats right on desktop)

Content Elements:

1. Main headline: "Bringing Hope to Sudan" (customizable)
2. Subheadline: Emotional, specific impact statement
3. Primary CTA: "Donate Now" button (prominent, animated)
4. Secondary CTA: "Learn Our Story" (ghost button)
5. Trust indicators: "Trusted by 10,000+ donors"

Live Statistics Section:

1. Animated counters showing:
   - Total funds raised
   - Families helped
   - Active projects
   - Countries reached
2. Real-time donation ticker
3. "People helped today" counter

Interactive Features:

1. Background image carousel (3-5 images)
2. Parallax scrolling effect
3. Typing animation for headlines
4. Hover effects on buttons
5. Loading states with skeleton screens

Accessibility:

1. Alt text for all images
2. Proper heading hierarchy
3. Keyboard navigation support
4. Screen reader optimizations
5. High contrast mode compatibility

Props Interface:

- headline: string
- subheadline: string
- backgroundImages: string[]
- statistics: object
- ctaButtons: array
- testimonialQuote: string

Use Framer Motion for animations and React Query for fetching live statistics.
Donation Form Component Prompt
Create a comprehensive donation form component with the following specifications:

Form Structure:

1. Multi-step donation process (3 steps):
   Step 1: Amount Selection
   Step 2: Personal Information
   Step 3: Payment Processing

Step 1 - Amount Selection:

- Preset amount buttons: $25, $50, $100, $250, $500
- Custom amount input field
- Donation frequency toggle (One-time / Monthly)
- Impact calculator showing "Your $50 provides..."
- Campaign/cause selection dropdown
- Progress indicator

Step 2 - Personal Information:

- Name (required)
- Email (required)
- Phone (optional)
- Country selection
- Anonymous donation checkbox
- Newsletter signup checkbox
- Dedication message field (optional)
- Tax receipt requirement checkbox

Step 3 - Payment Processing:

- Payment method selection (Credit Card, PayPal, Bank Transfer)
- Stripe Elements integration for card payments
- PayPal Express Checkout button
- Security badges display
- Processing loader with motivational messages
- Terms and conditions agreement

Form Validation:

- Real-time validation with error messages
- Email format validation
- Phone number validation by country
- Minimum/maximum amount limits
- Credit card validation
- Required field indicators

State Management:

- Form data persistence across steps
- Error state handling
- Loading states for API calls
- Success/failure feedback
- Form reset functionality

Security Features:

- Input sanitization
- XSS protection
- Rate limiting integration
- Secure token handling
- PCI compliance for card data

Accessibility:

- ARIA labels for screen readers
- Keyboard navigation support
- Focus management between steps
- Error announcement for screen readers
- High contrast mode support

Props Interface:

- initialAmount?: number
- preselectedCampaign?: string
- showRecurring?: boolean
- customAmounts?: number[]
- onSuccess: (donation: Donation) => void
- onError: (error: Error) => void

Use React Hook Form for form management and Yup for validation schema.
Impact Statistics Dashboard Component Prompt
Create an interactive impact statistics dashboard component:

Layout:

1. Grid layout with responsive columns (1-4 columns based on screen size)
2. Card-based design with hover effects
3. Progressive loading with skeleton screens
4. Smooth animations for number changes

Statistics Cards:

1. Total Donations Raised

   - Large animated counter
   - Percentage increase from last month
   - Small chart showing growth trend
   - Currency formatting

2. Families Helped

   - Animated counter with family icon
   - Breakdown by assistance type
   - Regional distribution mini-map
   - Success stories link

3. Active Projects

   - Current project count
   - Progress bars for each project
   - Completion percentages
   - "View Projects" CTA

4. Emergency Responses
   - Response time statistics
   - Current emergency alerts
   - Success rate metrics
   - Timeline of recent responses

Interactive Features:

1. Hover tooltips with additional details
2. Click-through to detailed reports
3. Time period selection (Last 30 days, 6 months, Year, All time)
4. Data export functionality
5. Real-time updates with WebSocket connection

Data Visualization:

1. Mini charts using Recharts
2. Progress bars and completion indicators
3. Trend arrows (up/down indicators)
4. Color-coded status indicators
5. Loading animations for data fetching

Props Interface:

- timeRange: string
- showExportButton: boolean
- refreshInterval: number
- onCardClick: (cardType: string) => void
- isLoading: boolean
- data: StatisticsData

Use React Query for data fetching and Framer Motion for animations.
Story Card Component Prompt
Create a story card component for displaying beneficiary stories:

Card Structure:

1. Featured image with overlay
2. Story category badge
3. Title and excerpt
4. Beneficiary information
5. Impact metrics
6. Action buttons

Visual Design:

1. Card dimensions: 400x500px (desktop), responsive scaling
2. Rounded corners with shadow
3. Hover effects: scale and shadow increase
4. Image aspect ratio: 16:9
5. Gradient overlay on image for text readability

Content Elements:

1. Featured Image:

   - Lazy loading implementation
   - Placeholder while loading
   - Alt text for accessibility
   - Hover zoom effect

2. Category Badge:

   - Color-coded by category (Emergency, Education, Healthcare, Water)
   - Positioned top-right corner
   - Small icon + text

3. Story Content:

   - Title (max 2 lines with ellipsis)
   - Excerpt (max 3 lines with "Read more...")
   - Publication date
   - Reading time estimate

4. Beneficiary Section:

   - Name and age (if permitted)
   - Location with country flag
   - Family size indicator

5. Impact Metrics:

   - Funds raised for this story
   - People helped
   - Project completion status

6. Action Buttons:
   - "Read Full Story" (primary)
   - "Share" with social media dropdown
   - "Donate to Help" (secondary)
   - Favorite/Save button (heart icon)

Interactive Features:

1. Smooth hover animations
2. Click-to-expand for quick preview
3. Social sharing functionality
4. Bookmark/save functionality
5. Loading states for all interactions

Accessibility:

1. Keyboard navigation support
2. Screen reader optimizations
3. High contrast mode
4. Focus indicators
5. Proper heading hierarchy

Props Interface:

- story: Story
- showDonateButton: boolean
- onRead: (storyId: string) => void
- onShare: (story: Story) => void
- onDonate: (story: Story) => void
- isLoading: boolean

Use Intersection Observer for lazy loading and analytics tracking.
Interactive Map Component Prompt
Create an interactive map component showing Sudan relief operations:

Map Features:

1. Base map using Leaflet/React-Leaflet
2. Custom markers for different operation types
3. Cluster markers for dense areas
4. Region highlighting for active operations
5. Zoom controls and full-screen mode

Marker Types:

1. Emergency Relief Centers (red markers)
2. Education Projects (blue markers)
3. Healthcare Facilities (green markers)
4. Water Projects (cyan markers)
5. Volunteer Locations (purple markers)

Interactive Elements:

1. Hover tooltips with basic information
2. Click popups with detailed information
3. Filter controls for marker types
4. Search functionality for locations
5. Legend/key for marker types

Popup Content:

1. Location name and type
2. Current status
3. People served
4. Funding received
5. Latest update timestamp
6. Photo gallery (if available)
7. "Learn More" and "Donate" buttons

Control Panel:

1. Layer toggles for different marker types
2. Time slider for historical data
3. Search bar for locations
4. Export/share map functionality
5. Zoom to user location

Data Integration:

1. Real-time data updates
2. Offline mode with cached data
3. Performance optimization for large datasets
4. Error handling for failed data loads
5. Loading states with progress indicators

Accessibility:

1. Keyboard navigation for markers
2. Screen reader support for map information
3. High contrast mode
4. Alternative text-based location list
5. Focus management for interactive elements

Props Interface:

- centers: OperationCenter[]
- defaultZoom: number
- defaultCenter: [number, number]
- showControls: boolean
- onMarkerClick: (center: OperationCenter) => void
- enableClustering: boolean
- filterOptions: FilterOptions

Use React-Leaflet for mapping and implement custom clustering algorithm. 4. Page-Level Components
Homepage Component Prompt
Create the main homepage component that combines all major sections:

Page Structure:

1. Hero Section (full viewport height)
2. Impact Statistics Section
3. Featured Stories Section (3-4 cards)
4. Emergency Alert Banner (conditional)
5. How We Help Section (4-column grid)
6. Testimonials Carousel
7. Partner Organizations Section
8. Newsletter Signup Section
9. Footer

Section Specifications:

Hero Section:

- Use HeroSection component
- Include donation quick-access
- Show live statistics
- Feature rotating background images

Impact Statistics:

- Display key metrics in cards
- Include trend indicators
- Link to detailed transparency page
- Auto-refresh every 30 seconds

Featured Stories:

- Show 4 most recent or featured stories
- Include mix of different categories
- "View All Stories" CTA
- Lazy loading for performance

Emergency Alerts:

- Conditional display based on active emergencies
- Dismissible with local storage
- High contrast design
- Multiple language support

How We Help:

- 4 main service areas with icons
- Brief descriptions and success metrics
- Links to detailed pages
- Hover animations

Testimonials:

- Carousel with 3-5 testimonials
- Mix of beneficiaries and donors
- Auto-play with pause on hover
- Responsive design

Partners:

- Logo grid of verified partners
- Hover effects showing partnership details
- Link to full partner directory
- Loading states

Newsletter:

- Email signup form
- Success/error messaging
- Privacy policy link
- Subscription preferences

Performance Optimizations:

- Lazy loading for below-fold content
- Image optimization
- Code splitting for heavy components
- Preloading critical resources
- SEO optimizations

Props Interface:

- emergencyAlert?: Alert
- featuredStories: Story[]
- statistics: Statistics
- testimonials: Testimonial[]
- partners: Partner[]
  Donation Page Component Prompt
  Create a dedicated donation page with enhanced features:

Page Layout:

1. Page header with breadcrumb navigation
2. Campaign selection section
3. Main donation form
4. Impact visualization sidebar
5. Recent donations feed
6. FAQ section
7. Trust indicators

Campaign Selection:

1. Active campaigns grid
2. Emergency campaigns highlighted
3. Campaign progress bars
4. "Most Urgent" and "Most Popular" filters
5. Campaign details modal

Enhanced Donation Form:

1. Multi-step process with progress indicator
2. Amount selection with smart defaults
3. Personal information collection
4. Payment processing with multiple options
5. Dedication/memorial options
6. Corporate donation fields

Impact Visualization:

1. Real-time impact calculator
2. "Your donation will provide..." statements
3. Beneficiary photo gallery
4. Success story previews
5. Geographic impact map

Recent Donations:

1. Live donation feed (anonymized)
2. Donor messages (with permission)
3. Donation amounts and causes
4. Country/region indicators
5. Celebration animations for large donations

Trust & Security:

1. Security badges and certifications
2. Financial transparency links
3. Charity registration information
4. Third-party verification badges
5. Privacy policy and terms

FAQ Section:

1. Donation process questions
2. Tax deductibility information
3. Recurring donation management
4. Refund and cancellation policies
5. Impact tracking and reporting

Features:

- URL parameter support for pre-filled campaigns
- Social sharing for donation drives
- Corporate/bulk donation options
- Matching donation capabilities
- Donor portal registration
- Mobile-optimized design

Props Interface:

- preselectedCampaign?: string
- referralSource?: string
- corporateMode?: boolean
- showRecentDonations?: boolean
