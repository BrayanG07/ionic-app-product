import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserCredential, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage'
import { User } from '../interfaces/user.interface';
import { KR_AUTH, LS_USER } from '../constants';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private auth = inject(AngularFireAuth);
  private angularFirestore = inject(AngularFirestore);
  private storage = inject(AngularFireStorage);
  private utilService = inject(UtilService);

  constructor() { }

  // * ============== Autenticacion =================
  getAuthUser() {
    return getAuth();
  }

  signIn(user: User): Promise<UserCredential> {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  singOut(): void {
    getAuth().signOut();
    this.utilService.removeFromLocalStorage(LS_USER);
    this.utilService.routerLink(KR_AUTH);
  }

  updateUser(displayName: string, photoURL?: string) {
    return updateProfile(getAuth().currentUser, { displayName, photoURL });
  }

  async sendEmailForRecoveryPassword(email: string) {
    await sendPasswordResetEmail(getAuth(), email);
  }

  // * BASE DE DATOS FIRESTORE
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  async getDocument<T>(path: string) {
    const document = await getDoc(doc(getFirestore(), path))
    return document.data() as T;
  }

  /**
   * La diferencia entre el setDocument, es que el addDocument le agregara un id automaticamente.
   * En cambio en el setDocument nosotros especificamos el id de ese documento. Tambien aqui podremos
   * indicar o establecer los productos en una subcoleccion de la coleccion usuarios.
   * Ejemplo: users/id_user/products
   */
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data)
  }

  deleteDocument(path: string): Promise<void> {
    return deleteDoc(doc(getFirestore(), path));
  }

  // * ALMACENAMIENTO
  async uploadImage(path: string, dataUrl: string): Promise<string> {
    await uploadString(ref(getStorage(), path), dataUrl, 'data_url');
    return getDownloadURL(ref(getStorage(), path))
  }

  getCollectionData(path: string, colecctionQuery?: any) {
    const ref = collection(getFirestore(), path);
    // * { idField: 'id' } = lo establecemos para que devuelva el id de la collecion
    return collectionData(query(ref, ...colecctionQuery), { idField: 'id' })
  }

  /**
   * Obtener la ruta de la imagen con su url
   * @param url
   */
  getFilePath(url: string): string {
    return ref(getStorage(), url).fullPath;
  }

  deleteFileFromStorage(url: string) {
    return deleteObject(ref(getStorage(), url));
  }
}
