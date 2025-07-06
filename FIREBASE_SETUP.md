# Firebase Setup Guide

## Current Issue

The app is showing a Firebase authentication error because the Firebase configuration is missing. This guide will help you set up Firebase properly.

## Quick Fix for Development

### Option 1: Use Demo Mode (Recommended for now)

The app is already configured to work with demo values for development. The Firebase error should be resolved with the updated configuration.

### Option 2: Set up Firebase (For production)

1. **Create a Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Name it "Assaatah Al-Doma Charity" or similar
   - Follow the setup wizard

2. **Add a Web App**

   - In your Firebase project, click the web icon (</>)
   - Register your app with a nickname like "Assaatah Charity Web"
   - Copy the Firebase configuration

3. **Create Environment File**
   - Create a `.env` file in the project root (same level as package.json)
   - Add the following variables:

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

4. **Restart Development Server**
   ```bash
   npm start
   ```

## Firebase Services to Enable

1. **Authentication**

   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)

2. **Firestore Database**

   - Go to Firestore Database
   - Create database in test mode
   - Choose a location close to Sudan (Europe or Middle East)

3. **Storage**

   - Go to Storage
   - Start in test mode

4. **Hosting (Optional)**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init hosting`
   - Deploy: `firebase deploy`

## Security Rules

The project includes basic security rules for Firestore and Storage. You can customize them in:

- `firestore.rules`
- `storage.rules`

## Current Status

✅ **App works with demo values**  
✅ **Arabic-only interface**  
✅ **RTL layout**  
✅ **Responsive design**  
⚠️ **Firebase needs configuration for full functionality**

## Next Steps

1. The app should now work without Firebase errors
2. Set up Firebase when ready for production
3. Test authentication and database features
4. Deploy to Firebase Hosting

## Support

If you still see Firebase errors after following this guide, check:

1. The `.env` file is in the correct location
2. All environment variables are properly set
3. The development server has been restarted
4. Browser console for specific error messages
