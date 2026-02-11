const CONFIG = {
  firebase: {
    apiKey: window.__ENV__?.FIREBASE_API_KEY || "",
    authDomain: window.__ENV__?.FIREBASE_AUTH_DOMAIN || "",
    projectId: window.__ENV__?.FIREBASE_PROJECT_ID || "",
    storageBucket: window.__ENV__?.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: window.__ENV__?.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: window.__ENV__?.FIREBASE_APP_ID || "",
    measurementId: window.__ENV__?.FIREBASE_MEASUREMENT_ID || ""
  },
  backendApi: window.__ENV__?.BACKEND_API || "",
  geminiKey: ""
};

export default CONFIG;
