# Next Steps and Improvement Prompts

This document outlines potential areas for improvement, new features, and general enhancements for the Assaatah Donation Site. Each section provides detailed prompts that can be used to guide future development.

## 1. Code Quality and Maintainability

### Prompt 1: Refactor Authentication Logic
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Review and refactor the authentication logic in `src/contexts/AuthContext.js` and related components (`src/components/auth/LoginForm.js`, `src/components/auth/RegisterForm.js`).
- **Objective:** Improve readability, reduce complexity, and enhance error handling.
- **Specific Tasks:**
    - **Extract Firebase authentication calls into a dedicated service:** Create `src/services/authService.js` to encapsulate all Firebase Auth API calls (e.g., `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signOut`, `sendPasswordResetEmail`). The `AuthContext` should then consume this service.
    - **Implement more granular error messages:** Instead of generic "Authentication failed," provide specific messages like "Invalid email or password," "User not found," "Email already in use," etc., by parsing Firebase error codes.
    - **Ensure consistent state management:** Implement a unified approach for `loading` and `error` states within `AuthContext` that propagates clearly to `LoginForm` and `RegisterForm`. Use `useState` and `useEffect` hooks effectively.
    - **Improve form validation:** If `react-hook-form` is not fully utilized, integrate it for all authentication forms to handle validation rules (e.g., email format, password strength, required fields) and display validation errors efficiently.

### Prompt 2: Standardize Component Structure and Styling
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Review existing components in `src/components/` and `src/pages/` to ensure consistent structure, prop passing, and styling practices.
- **Objective:** Improve code consistency, reusability, and maintainability.
- **Specific Tasks:**
    - **Consistent functional component structure:** Ensure all new and refactored components use React Hooks (e.g., `useState`, `useEffect`, `useContext`) appropriately. Avoid class components.
    - **Prop Types/TypeScript for prop validation:** Implement `PropTypes` (or migrate to TypeScript for full type safety) for all component props to clearly define expected data types and enforce consistency.
    - **Consistent Tailwind CSS and Material-UI usage:** Verify that styling is primarily done via Tailwind CSS utility classes. For UI components, ensure Material-UI components are used consistently with their theming and customization options. Avoid inline styles where Tailwind classes suffice.
    - **JSDoc comments for complex components:** Add JSDoc blocks for components, functions, and complex props to explain their purpose, parameters, and return values.
    - **Refactor duplicated UI patterns:** Identify common UI elements (e.g., form inputs, buttons, cards, modals) that are repeated across multiple components and extract them into smaller, reusable presentational components.

### Prompt 3: Optimize Image Handling
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Review image imports and usage across the application, especially in components that display dynamic images (e.g., campaign images, user avatars).
- **Objective:** Improve performance by optimizing image loading and display.
- **Specific Tasks:**
    - **Implement lazy loading:** For images below the fold or in carousels, use `loading="lazy"` attribute on `<img>` tags or integrate a library like `react-lazyload` to defer image loading until they are near the viewport.
    - **Consider responsive image techniques:** Use `srcset` and `<picture>` elements to serve different image resolutions based on device screen size and pixel density, reducing unnecessary bandwidth usage.
    - **Evaluate Firebase Storage for image hosting:** Ensure images uploaded to Firebase Storage are served efficiently. Consider using Firebase Extensions for image resizing and optimization (e.g., converting to WebP format).
    - **Placeholder/loading states for images:** Display a low-resolution placeholder or a loading spinner while high-resolution images are being fetched.

## 2. Performance Optimizations

### Prompt 1: Bundle Size Reduction
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Analyze the application's JavaScript bundle size and identify opportunities for reduction.
- **Objective:** Improve initial load times and overall application performance.
- **Specific Tasks:**
    - **Use Webpack Bundle Analyzer:** Integrate `webpack-bundle-analyzer` into the build process to visualize the contents of your bundles and identify large dependencies or duplicated modules.
    - **Implement route-based code splitting:** Use `React.lazy` and `Suspense` to dynamically import page components (e.g., `CampaignsPage`, `DonationsPage`) only when they are navigated to, reducing the initial bundle size.
    - **Component-level code splitting:** For very large components or libraries used only in specific parts of the application, consider lazy loading them.
    - **Review and remove unused libraries/dead code:** Use tools like `purgecss` (for Tailwind) or `tree-shaking` (built into Webpack) to eliminate unused CSS and JavaScript. Manually review `package.json` for unnecessary dependencies.

### Prompt 2: Data Fetching and Caching
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Review data fetching mechanisms, particularly for frequently accessed data (e.g., campaigns, donations).
- **Objective:** Reduce redundant API calls and improve data responsiveness.
- **Specific Tasks:**
    - **Implement client-side caching with `react-query` (TanStack Query):** Integrate `react-query` to manage server state, handle caching, revalidation, and background data fetching for data like campaigns, donations, and user profiles. This will eliminate manual `useState` and `useEffect` for data fetching.
    - **Optimize Firestore queries:**
        - Use `limit()` and `startAfter()` for efficient pagination instead of fetching all documents.
        - Implement `where()` clauses to filter data on the server-side, reducing the amount of data transferred.
        - Use `select()` to retrieve only specific fields from documents if not all fields are needed.
    - **Implement infinite scrolling:** For lists like donations and campaigns, replace traditional pagination with infinite scrolling to improve UX and progressively load data.

## 3. Security Enhancements

### Prompt 1: Firebase Security Rules Audit
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Conduct a thorough audit of `firestore.rules` and `storage.rules`.
- **Objective:** Ensure data is secure and accessible only to authorized users.
- **Specific Tasks:**
    - **Verify read/write permissions:** For each collection (`users`, `campaigns`, `donations`, `receipts`), ensure that `read` and `write` permissions are strictly defined based on user roles (admin, donor, anonymous) and data ownership.
    - **Test rules thoroughly:** Use the Firebase Emulator Suite and Firebase Security Rules Playground to simulate different user scenarios (logged in, logged out, different roles) and verify that rules behave as expected.
    - **Implement granular field-level rules:** For sensitive fields within documents (e.g., `isAdmin` in `users` collection), ensure that only authorized users can modify them.
    - **Prevent unauthorized data deletion:** Ensure that only administrators or data owners can delete documents.

### Prompt 2: Input Validation and Sanitization
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Review all user input fields and ensure proper validation and sanitization on both the frontend and backend.
- **Objective:** Prevent common web vulnerabilities like XSS and injection attacks.
- **Specific Tasks:**
    - **Robust frontend validation:** Implement comprehensive validation rules for all form inputs using `react-hook-form` (e.g., minimum/maximum length, regex patterns for phone numbers/emails, number ranges for amounts). Provide immediate feedback to the user.
    - **Backend validation and sanitization (Firebase Cloud Functions):** For all data written to Firestore via Cloud Functions, implement server-side validation to ensure data integrity and security. Sanitize user-provided text inputs to prevent XSS attacks (e.g., using a library like `dompurify` if rendering user-generated HTML, or simply stripping HTML tags).
    - **Special attention to free-form text fields:** For fields like `notes` or `description`, ensure they are properly sanitized before storage and display to prevent malicious script injection.

## 4. New Features and Enhancements

### Prompt 1: Implement AI-Powered Receipt Verification (as per `GEMINI.md`)
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Proceed with the detailed plan outlined in `GEMINI.md` for the AI-powered receipt verification system.
- **Objective:** Automate and enhance the process of verifying donation receipts.
- **Specific Tasks:**
    - **Complete Genkit setup and configuration:** Ensure `genkit init` is done, and `genkit.config.js` is correctly configured with Google AI and Firebase.
    - **Develop the Genkit flow (`verifyReceiptFlow`):** Implement the flow to receive image URLs, call the Gemini Vision model with the specified prompt, parse the JSON output, and handle potential errors or malformed responses.
    - **Create React frontend components:** Develop `src/pages/VerifyReceiptPage.js` and `src/components/dashboard/ReceiptVerification.js` for image upload, progress display, and showing verification results.
    - **Define and implement Firestore data model:** Ensure the `receipts` collection in Firestore accurately stores all extracted data, status, reason, and image references as per the `GEMINI.md` specification.

### Prompt 2: User Profile Management
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Add functionality for users to view and update their own profile information.
- **Objective:** Provide users with more control over their data.
- **Specific Tasks:**
    - **Create a "My Profile" page/section:** Develop `src/pages/ProfilePage.js` (or similar) accessible from the user dashboard.
    - **Allow updating core details:** Enable users to update their `name`, `phone number`, and potentially `email` (with re-authentication for email changes).
    - **Implement password change functionality:** Provide a secure way for users to change their password.
    - **Display donation summary:** Show a quick overview of their total donations or recent activity on their profile page.

### Prompt 3: Donation Tracking and History for Donors
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Allow logged-in donors to view their past donation history.
- **Objective:** Increase transparency and engagement for donors.
- **Specific Tasks:**
    - **Create a "My Donations" section:** Develop a dedicated component or page (e.g., `src/components/dashboard/MyDonations.js`) that lists donations made by the currently logged-in user.
    - **Display comprehensive details:** For each donation, show `amount`, `campaign name`, `date`, `status`, and `notes`.
    - **Implement filtering and sorting:** Allow donors to filter their donations by `campaign`, `date range`, or `status`, and sort by `date` or `amount`.

### Prompt 4: Admin Dashboard Enhancements
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Add more comprehensive analytics and reporting features to the admin dashboard.
- **Objective:** Provide administrators with better insights into donation activities and campaign performance.
- **Specific Tasks:**
    - **Integrate charting libraries:** Use `Recharts` or `Chart.js` to create visual representations of:
        - Donation trends over time (e.g., monthly, quarterly).
        - Top campaigns by amount raised.
        - Distribution of donations by status.
    - **Add detailed reports:** Generate downloadable reports (CSV/PDF) for:
        - All donations within a specified period.
        - Campaign performance summaries.
        - Donor lists with contact information (for authorized admins).
    - **Implement customizable date ranges:** Allow admins to select custom date ranges for all reports and charts.

## 5. User Experience (UX) Improvements

### Prompt 1: Enhance Form User Experience
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Improve the overall user experience for forms across the application.
- **Objective:** Make forms more intuitive, user-friendly, and error-resistant.
- **Specific Tasks:**
    - **Real-time validation feedback:** Provide immediate visual feedback (e.g., red borders, error messages) as users type, rather than only on submission.
    - **Clear and helpful error messages:** Ensure error messages are concise, actionable, and user-friendly (e.g., "Please enter a valid email address" instead of "Invalid input").
    - **Appropriate input types and auto-completion:** Use `type="email"`, `type="tel"`, `type="number"`, `autocomplete` attributes, and `inputmode` for mobile keyboards.
    - **Consider multi-step forms:** For complex forms (e.g., detailed campaign creation), break them into logical, manageable steps with clear progress indicators.
    - **Loading indicators for form submissions:** Display a loading spinner or disable the submit button during form submission to prevent multiple submissions and inform the user.

### Prompt 2: Accessibility (A11y) Audit
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Conduct an accessibility audit of the application.
- **Objective:** Ensure the application is usable by individuals with disabilities.
- **Specific Tasks:**
    - **Automated testing with Lighthouse/axe-core:** Regularly run accessibility audits using browser developer tools (Lighthouse) or a library like `axe-core` during development.
    - **Semantic HTML:** Ensure correct use of HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<button>`, `<form>`, `<input>`, etc.) for better screen reader interpretation.
    - **Keyboard navigation and focus management:** Verify that all interactive elements are reachable and operable via keyboard. Ensure clear focus indicators are visible.
    - **ARIA attributes:** Use `aria-label`, `aria-describedby`, `aria-live` regions, and other ARIA attributes where standard HTML semantics are insufficient (e.g., for custom components, dynamic content updates).
    - **Color contrast:** Check that text and interactive elements have sufficient color contrast against their backgrounds to meet WCAG guidelines.

## 6. Deployment and Infrastructure

**Important Note for all tasks in this section:** When implementing these improvements, exercise extreme caution to avoid disrupting existing functionality or introducing database schema mismatches. Always back up relevant data and test thoroughly in a development environment before deploying to production.

### Prompt 1: Implement CI/CD Pipeline
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Set up a Continuous Integration/Continuous Deployment (CI/CD) pipeline for the project.
- **Objective:** Automate testing and deployment processes, ensuring faster and more reliable releases.
- **Specific Tasks:**
    - **Choose a CI/CD platform:** Select a platform like GitHub Actions, GitLab CI/CD, or Firebase Hosting's built-in CI.
    - **Configure automated tests:** Set up the pipeline to automatically run `npm test` and `npm run lint` on every push to the `main` or `develop` branch.
    - **Automated deployment:** Configure the pipeline to automatically build (`npm run build`) and deploy the application to Firebase Hosting upon successful completion of tests on the `main` branch.
    - **Staging environment deployment:** Consider setting up a separate staging environment for pre-production testing.

### Prompt 2: Environment Management
**Caution:** When implementing this, be careful not to mess up existing code and avoid database mismatches. Always back up relevant data and test thoroughly in a development environment.
Refine environment variable management for different deployment stages (development, staging, production).
- **Objective:** Ensure proper configuration and security across environments.
- **Specific Tasks:**
    - **Document all required environment variables:** Create a clear `.env.example` file listing all necessary environment variables (e.g., Firebase config, API keys) with descriptions.
    - **Secure handling of sensitive variables:** Ensure sensitive API keys and credentials are not committed to version control. Use environment-specific configuration files or CI/CD secrets management.
    - **Easy switching between environments:** Implement a mechanism (e.g., `cross-env` or specific `npm` scripts) to easily switch between development, staging, and production configurations during local development and CI/CD.
    - **Firebase project aliases:** Use Firebase project aliases (`firebase use --add`) to manage multiple Firebase projects (dev, staging, prod) from the CLI.