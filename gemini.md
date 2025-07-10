# Project Overview and Gemini Integration Guide\
This document provides a comprehensive overview of the Assaatah Donation Site project, its key features, setup instructions, and how Google Gemini is integrated to enhance functionality.

## 1. Project Description

The Assaatah Donation Site is a web application designed to facilitate donations and manage related activities. It includes features for user authentication, campaign management, financial reporting, and an upcoming AI-powered receipt verification system.

## 2. AI-Powered Receipt Verification Plan

This section details the implementation of an AI-powered feature for verifying donation receipts using Firebase Genkit and the Gemini Vision model.

### 2.1. Objective

The goal is to create a system where an admin can upload an image of a bank transfer receipt, and an AI model will analyze it to:
1.  Extract key information (amount, date, transaction ID).
2.  Assess the authenticity of the receipt to detect potential forgery.
3.  Provide a structured output (`verified`, `suspicious`, `error`) with a clear reason.

### 2.2. Technology Stack

*   **Frontend:** React (using existing components and structure)
*   **Backend:** Firebase Cloud Functions with **Genkit**
*   **AI Model:** Google Gemini (specifically the Vision model)
*   **Database:** Firestore to store receipt data and verification results.
*   **Storage:** Firebase Storage to store the uploaded receipt images.

### 2.3. High-Level Workflow

1.  **Upload:** An admin navigates to a new "Verify Receipt" page in the dashboard. They use a file input to select and upload a receipt image.
2.  **Frontend to Backend:** The React frontend uploads the image to Firebase Storage and gets the download URL. It then calls a new Genkit flow (exposed as an HTTP endpoint) with this URL.
3.  **Genkit Flow Execution:**
    *   The Genkit flow receives the image URL.
    *   It uses the Gemini Vision model to analyze the image based on a specialized prompt.
    *   The flow processes the model's structured JSON output.
4.  **Data Storage:** The extracted data, the AI's verdict (`status` and `reason`), and a reference to the image in Storage are saved as a new document in a `receipts` collection in Firestore.
5.  **Display Results:** The frontend receives the result from the Genkit flow and displays the verification status and extracted details to the admin.

### 2.4. Detailed Implementation Steps for Receipt Verification

#### Step 1: Firebase & Genkit Setup
- Initialize Genkit in the project: `genkit init`.
- Configure Genkit to use Google AI (`googleAI`) and Firebase (`firebase`).
- Update `genkit.config.js` to specify the Gemini Pro Vision model (`gemini-pro-vision`).

#### Step 2: Backend - Genkit Flow
- Create a new file, e.g., `src/flows/verificationFlow.js`.
- Define a Genkit flow named `verifyReceiptFlow`.
- This flow will be configured with the `onFlow` handler to be invokable from the client.
- The flow will accept the image URL as input.
- It will call the Gemini model with the prompt defined in the section below.
- It will include logic to parse the model's response, handle potential errors, and save the final data to Firestore.

#### Step 3: Frontend - React Component
- Create a new page component: `src/pages/VerifyReceiptPage.js`.
- Create a new dashboard component: `src/components/dashboard/ReceiptVerification.js`.
- This component will contain:
    - A styled file input for image uploads (`<input type="file" accept="image/*" />`).
    - A state to manage the upload progress, the verification result, and any errors.
    - A function to handle the upload process:
        1. Upload the file to Firebase Storage.
        2. Get the public URL of the uploaded image.
        3. Call the `verifyReceiptFlow` Genkit flow using the Firebase Functions client SDK.
    - A section to clearly display the results returned from the flow (status, reason, and extracted data).

#### Step 4: Firestore Data Model
- A new top-level collection named `receipts`.
- Each document in this collection will represent a single verified receipt and have the following structure:
```json
{
  "uploadedAt": "timestamp",
  "imageUrl": "string",
  "status": "string (verified | suspicious | error)",
  "reason": "string",
  "extractedData": {
    "amount": "number",
    "currency": "string",
    "date": "string (ISO format)",
    "transactionId": "string",
    "senderName": "string",
    "bankName": "string"
  },
  "verifiedBy": "string (admin user ID)"
}
```

### 2.5. Core Gemini Prompt for Receipt Verification

This is the prompt that will be used in the Genkit flow to instruct the Gemini Vision model.

---

**Prompt:**

"You are an expert financial fraud analyst specializing in the verification of digital payment receipts. Your task is to analyze the provided image of a bank transfer receipt and determine its authenticity.

**Instructions:**

1.  **Extract Key Information:** Carefully extract the following fields from the receipt:
    *   `amount`: The total amount of the transaction.
    *   `currency`: The currency of the transaction (e.g., USD, EUR, JOD).
    *   `date`: The date of the transaction.
    *   `transactionId`: The unique reference or transaction ID number.
    *   `senderName`: The name of the person or entity sending the money.
    *   `bankName`: The name of the bank or financial institution.

2.  **Analyze for Forgery:** Scrutinize the image for any signs of digital manipulation or forgery. Pay close attention to:
    *   **Font Consistency:** Are all fonts uniform and consistent with typical bank receipts? Look for mismatched fonts, sizes, or styles, especially in the amount and date fields.
    *   **Alignment:** Are text fields and numbers properly aligned? Misalignment can be a key indicator of editing.
    *   **Pixelation:** Check for unusual pixelation or blurring around critical areas like numbers or names, which could suggest that the original text was erased and replaced.
    *   **Overall Layout:** Does the layout match the standard format for a receipt from the specified bank?

3.  **Provide a Verdict:** Based on your analysis, provide a `status` and a `reason`.
    *   `status`:
        *   `"verified"`: If the receipt appears completely legitimate with no signs of tampering.
        *   `"suspicious"`: If you find any indicators of potential forgery.
        *   `"error"`: If the image is unreadable, not a receipt, or if key information cannot be extracted.
    *   `reason`: A concise, one-sentence explanation for your verdict. For a 'suspicious' status, briefly state what raised a red flag (e.g., "The font used for the amount appears inconsistent with the rest of the document."). For 'verified', state "The receipt appears authentic."

**Output Format:**

Return your complete analysis in a single, clean JSON object. Do not include any explanatory text outside of the JSON structure.

**Example of Desired Output:**

```json
{
  "status": "verified",
  "reason": "The receipt appears authentic with consistent fonts and alignment.",
  "extractedData": {
    "amount": 150.00,
    "currency": "JOD",
    "date": "2025-07-05",
    "transactionId": "AQC100239Z9",
    "senderName": "John Doe",
    "bankName": "Arab Bank"
  }
}
```

---

## 3. Firebase Setup Guide

This guide helps you set up Firebase for the project.

### 3.1. Current Issue

The app is showing a Firebase authentication error because the Firebase configuration is missing.

### 3.2. Quick Fix for Development

#### Option 1: Use Demo Mode (Recommended for now)

The app is already configured to work with demo values for development. The Firebase error should be resolved with the updated configuration.

#### Option 2: Set up Firebase (For production)

1.  **Create a Firebase Project**
    *   Go to [Firebase Console](https://console.firebase.google.com/)
    *   Click "Create a project"
    *   Name it "Assaatah Al-Doma Charity" or similar
    *   Follow the setup wizard

2.  **Add a Web App**
    *   In your Firebase project, click the web icon (</>)
    *   Register your app with a nickname like "Assaatah Charity Web"
    *   Copy the Firebase configuration

3.  **Create Environment File**
    *   Create a `.env` file in the project root (same level as package.json)
    *   Add the following variables:

    ```env
    # Firebase Configuration
    REACT_APP_FIREBASE_API_KEY=your-api-key-here
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

    # Feature Flags
    REACT_APP_USE_FIREBASE_EMULATORS=false
    REACT_APP_ENABLE_ANALYTICS=false
    REACT_APP_ENABLE_PERFORMANCE=false

    # Payment Configuration (Optional for now)
    REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
    REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_here

    # Maps Configuration (Optional for now)
    REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

    # App Configuration
    REACT_APP_APP_URL=http://localhost:3000
    REACT_APP_API_URL=https://api.assaatah.org
    ```

4.  **Restart Development Server**
    ```bash
    npm start
    ```

### 3.3. Firebase Services to Enable

1.  **Authentication**
    *   Go to Authentication > Sign-in method
    *   Enable Email/Password
    *   Enable Google (optional)

2.  **Firestore Database**
    *   Go to Firestore Database
    *   Create database in test mode
    *   Choose a location close to Sudan (Europe or Middle East)

3.  **Storage**
    *   Go to Storage
    *   Start in test mode

4.  **Hosting (Optional)**
    *   Install Firebase CLI: `npm install -g firebase-tools`
    *   Login: `firebase login`
    *   Initialize: `firebase init hosting`
    *   Deploy: `firebase deploy`

### 3.4. Security Rules

The project includes basic security rules for Firestore and Storage. You can customize them in:
- `firestore.rules`
- `storage.rules`

### 3.5. Current Status

✅ **App works with demo values**
✅ **Arabic-only interface**
✅ **RTL layout**
✅ **Responsive design**
⚠️ **Firebase needs configuration for full functionality**

### 3.6. Next Steps

1.  The app should now work without Firebase errors
2.  Set up Firebase when ready for production
3.  Test authentication and database features
4.  Deploy to Firebase Hosting

### 3.7. Support

If you still see Firebase errors after following this guide, check:
1.  The `.env` file is in the correct location
2.  All environment variables are properly set
3.  The development server has been restarted
4.  Browser console for specific error messages

## 4. Project Development Guidelines

This section outlines general guidelines for developing within this project.

### 4.1. Available Scripts

In the project directory, you can run:

*   `npm start`: Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.
*   `npm run build`: Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!
*   `npm test`: Launches the test runner in the interactive watch mode.
*   `npm run eject`: **Note: this is a one-way operation. Once you `eject`, you can't go back!** If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project. Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them.
*   `npm run dev`: Alias for `npm start`.
*   `npm run lint`: Runs ESLint to check for code style and potential errors in `src` directory.
*   `npm run lint:fix`: Runs ESLint and attempts to fix automatically fixable issues in `src` directory.

### 4.2. Code Quality and Conventions

*   **Linting:** Always run `npm run lint` before committing to ensure code quality and adherence to project style. Use `npm run lint:fix` to automatically resolve most issues.
*   **Testing:** Write unit and integration tests for new features and bug fixes. Ensure all tests pass by running `npm test`.
*   **Component Structure:** Follow existing React component patterns and folder structures.
*   **Styling:** Utilize Tailwind CSS and Material-UI (`@mui/material`) for styling, adhering to the established design system.
*   **Internationalization:** Ensure all user-facing strings are properly internationalized using `i18next`. The project currently supports Arabic only.
*   **Firebase Integration:** When interacting with Firebase, use the provided services in `src/services` and ensure proper error handling.

## 5. Dependencies

Key dependencies include:
*   React
*   Firebase
*   Genkit (for AI features)
*   Tailwind CSS
*   Material-UI
*   React Router DOM
*   React Hook Form
*   Axios
*   i18next
*   Stripe & PayPal (for payments)
*   Leaflet (for maps)
*   Framer Motion (for animations)
*   Recharts (for charting)

For a complete list, refer to `package.json`.
