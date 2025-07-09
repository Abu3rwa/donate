<!-- # AI-Powered Receipt Verification Plan

This document outlines the plan to implement an AI-powered feature for verifying donation receipts using Firebase Genkit and the Gemini Vision model.

## 1. Objective

The goal is to create a system where an admin can upload an image of a bank transfer receipt, and an AI model will analyze it to:
1.  Extract key information (amount, date, transaction ID).
2.  Assess the authenticity of the receipt to detect potential forgery.
3.  Provide a structured output (`verified`, `suspicious`, `error`) with a clear reason.

## 2. Technology Stack

*   **Frontend:** React (using existing components and structure)
*   **Backend:** Firebase Cloud Functions with **Genkit**
*   **AI Model:** Google Gemini (specifically the Vision model)
*   **Database:** Firestore to store receipt data and verification results.
*   **Storage:** Firebase Storage to store the uploaded receipt images.

## 3. High-Level Workflow

1.  **Upload:** An admin navigates to a new "Verify Receipt" page in the dashboard. They use a file input to select and upload a receipt image.
2.  **Frontend to Backend:** The React frontend uploads the image to Firebase Storage and gets the download URL. It then calls a new Genkit flow (exposed as an HTTP endpoint) with this URL.
3.  **Genkit Flow Execution:**
    *   The Genkit flow receives the image URL.
    *   It uses the Gemini Vision model to analyze the image based on a specialized prompt.
    *   The flow processes the model's structured JSON output.
4.  **Data Storage:** The extracted data, the AI's verdict (`status` and `reason`), and a reference to the image in Storage are saved as a new document in a `receipts` collection in Firestore.
5.  **Display Results:** The frontend receives the result from the Genkit flow and displays the verification status and extracted details to the admin.

## 4. Detailed Implementation Steps

### Step 1: Firebase & Genkit Setup
- Initialize Genkit in the project: `genkit init`.
- Configure Genkit to use Google AI (`googleAI`) and Firebase (`firebase`).
- Update `genkit.config.js` to specify the Gemini Pro Vision model (`gemini-pro-vision`).

### Step 2: Backend - Genkit Flow
- Create a new file, e.g., `src/flows/verificationFlow.js`.
- Define a Genkit flow named `verifyReceiptFlow`.
- This flow will be configured with the `onFlow` handler to be invokable from the client.
- The flow will accept the image URL as input.
- It will call the Gemini model with the prompt defined in the section below.
- It will include logic to parse the model's response, handle potential errors, and save the final data to Firestore.

### Step 3: Frontend - React Component
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

### Step 4: Firestore Data Model
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

## 5. Core Gemini Prompt for Receipt Verification

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
--- -->
