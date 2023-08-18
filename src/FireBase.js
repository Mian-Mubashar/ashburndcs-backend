import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcA15hofK6qxp4zHH_kO8ehhUFG_Q-mEs",
  authDomain: "ashburn-241b8.firebaseapp.com",
  projectId: "ashburn-241b8",
  storageBucket: "ashburn-241b8.appspot.com",
  messagingSenderId: "423532133212",
  appId: "1:423532133212:web:9cd8390a84791763325f99",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => signInWithPopup(auth, provider);
