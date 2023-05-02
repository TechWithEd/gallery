import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/firestore";
import { collection, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import config from "./config.json";

const app = initializeApp(config);

export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const database = {};
export const auth = getAuth(app);
export default app;
