import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { Post } from "@/types/Post";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Firebase constants
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export default class Firebase {
  //GET: Sign in funciton.
  //Returns 200 if successful, 400 if email is not found, 401 if password is incorrect, and 500 if there is an error.
  async signIn(email: string, password: string) {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return { status: 400 };
      }
      for (const doc of querySnapshot.docs) {
        if (doc.data().password === password) {
          return { status: 200, data: doc.data() };
        }
      }
      return { status: 401 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  //GET: Get all posts
  //Returns an array of all posts.
  async getPosts() {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const posts: any[] = [];
      querySnapshot.forEach((doc) => {
        //Set id to the doc id
        const data = doc.data() as Post;
        data.post_id = doc.id;
        posts.push(data);
      });

      return posts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  //GET: Get single post
  //Returns a post object.
  async getPost(id: string) {
    try {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return {};
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  //UPDATE: Update post
  //Returns 200 if successful, 500 if there is an error.
  async updatePost(id: string, post: any) {
    try {
      const docRef = doc(db, "posts", id);
      await updateDoc(docRef, post);
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  //DELETE: Delete post
  //Returns 200 if successful, 500 if there is an error.
  async deletePost(id: string) {
    try {
      await deleteDoc(doc(db, "posts", id));
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
}
