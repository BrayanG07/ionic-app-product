import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private loadingControler = inject(LoadingController);
  private toastController = inject(ToastController);
  private router = inject(Router);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController)

  loading(): Promise<HTMLIonLoadingElement> {
    return this.loadingControler.create({ spinner: 'crescent' });
  }

  async presentToast(opts?: ToastOptions): Promise<void> {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  routerLink(url: string) {
    return this.router.navigate([url]);
  }

  saveInLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    return data ? data : undefined;
  }

  dismissModal(data?: any) {
    this.modalController.dismiss(data);
  }

  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      // * Prompt = permite elegir al usuario si quiere la foto desde la camara o galeria
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccione una imagen',
      promptLabelPicture: 'Toma una fotografia'
    });
  };

  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }
}
