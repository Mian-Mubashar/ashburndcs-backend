import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDcA15hofK6qxp4zHH_kO8ehhUFG_Q-mEs",
//   authDomain: "ashburn-241b8.firebaseapp.com",
//   projectId: "ashburn-241b8",
//   storageBucket: "ashburn-241b8.appspot.com",
//   messagingSenderId: "423532133212",
//   appId: "1:423532133212:web:9cd8390a84791763325f99"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAnXzoJtlG_XF_3CfOclBtI4rvo6CXV5rA",
  authDomain: "adcs-7c87c.firebaseapp.com",
  databaseURL: "https://adcs-7c87c-default-rtdb.firebaseio.com",
  projectId: "adcs-7c87c",
  storageBucket: "adcs-7c87c.firebasestorage.app",
  messagingSenderId: "931480888715",
  appId: "1:931480888715:web:0ee91a1011441f1531bb8e"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const db = getFirestore(app);


