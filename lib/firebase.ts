import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { 
  getAuth, 
  sendPasswordResetEmail 
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  addDoc,
  query,
  where,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { Post } from "@/types/Post";
import { Event } from "@/types/Event";
import { signInWithEmailAndPassword } from "firebase/auth";

interface Registration {
  eventId: string;
  name: string;
  email: string;
}

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
export const db = getFirestore(app);
export const storage = getStorage(app);
const DATE_NOW = new Date().toLocaleString();

export default class Firebase {
  
  //GET: Sign in funciton.
  //Returns 200 if successful, 400 if email is not found, 401 if password is incorrect, and 500 if there is an error.
  async signIn(email: string, password: string) {
    try {
      const auth = getAuth();
      const res = await signInWithEmailAndPassword(auth, email, password);

      if (res.user) 
        return { status: 200, data: res.user.providerData }

      return { status: 401 };
    } catch (error) {
      return { status: 500 };
    }
  }

// POST: Send a reset password email
  // Returns 200 status code if 
  // successful, otherwise 404.
  async forgotPassword(email: string) {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      return { status: 200 };
    } catch (error) {
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

  async getEvents() {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const events: Event[] = [];
      querySnapshot.forEach((doc) => {
        // Set id to the doc id
        const data = doc.data() as Event;
        data.id = doc.id;
        events.push(data);
      });
      return events;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // POST: Create new event
  // Returns 200 if successful, 500 if there is an error.
  async createEvent(event: Event) {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...event,
      });
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 400 };
    }
  }

  //DELETE: Delete event
  //Returns 200 if successful, 500 if there is an error.
  async deleteEvent(id: string) {
    try {
      await deleteDoc(doc(db, "events", id));
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }
  
  //EDIT
  async updateEvent(eventId: string, eventData: Partial<Event>) {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, eventData);
      return { status: 200 };
    } catch (error) {
      console.log(error);
      return { status: 500 };
    }
  }

  async getRegistrations(eventId: string): Promise<Registration[]> {
    try {
      const registrationsRef = collection(db, "registrations");
      const q = query(registrationsRef, where("eventId", "==", eventId));
      const querySnapshot = await getDocs(q);
      const registrations: Registration[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        registrations.push({ eventId: data.eventId, name: data.name, email: data.email });
      });
      return registrations;
    } catch (error) {
      console.error("Error getting registrations:", error);
      throw error;
    }
  }

  async getRegisteredUsers(eventId: string): Promise<Registration[]> {
    try {
      const registrationsRef = collection(db, 'registration');
      const q = query(registrationsRef, where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);
      const registrations: Registration[] = [];
      querySnapshot.forEach((doc) => {
        registrations.push(doc.data() as Registration);
      });
      return registrations;
    } catch (error) {
      console.error('Error fetching registrations for event:', error);
      throw error;
    }
  }
}
