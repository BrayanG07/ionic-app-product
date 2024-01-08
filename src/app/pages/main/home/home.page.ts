import { Component, OnInit, inject } from '@angular/core';
import { orderBy, where } from 'firebase/firestore'
import { FirebaseService } from '../../../services/firebase.service';
import { UtilService } from '../../../services/util.service';
import { AddOrUpdateProductComponent } from '../../../shared/components';
import { LS_USER, collection } from '../../../constants';
import { Product, User } from '../../../interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private firebaseService = inject(FirebaseService)
  private utilService = inject(UtilService)
  public products: Product[] = []
  public loading: boolean = false;

  ngOnInit() { }

  // * Esta funcion es propia de Ionic y se ejecuta cada vez que el usuaio entra a la pantalla
  ionViewWillEnter() {
    this.getProducts();
  }

  get user(): User {
    return this.utilService.getFromLocalStorage(LS_USER) as User;
  }

  getProducts(): void {
    this.loading = true;
    const query = [
      orderBy('soldUnits', 'desc'),
      // where('soldUnits', '>', 0)
    ]

    let path: string = `${collection.users}/${this.user.uid}/${collection.products}`
    this.firebaseService.getCollectionData(path, query).subscribe({
      next: (products: any) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    })
  }

  addOrUpadteProduct(product?: Product): void {
    this.utilService.presentModal({
      component: AddOrUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })
  }

  earnings(price: number, soldUnits: number): number {
    return price * soldUnits;
  }

  async deleteProduct({ id, image }: Product) {
    const loading = await this.utilService.loading();
    let path: string = `${collection.users}/${this.user.uid}/${collection.products}/${id}`

    try {
      const imagePath = this.firebaseService.getFilePath(image);
      await this.firebaseService.deleteFileFromStorage(imagePath); // * Eliminando imagen del storage
      await this.firebaseService.deleteDocument(path); // * Eliminando producto

      this.utilService.presentToast({
        message: 'Producto eliminado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'top',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      this.utilService.presentToast({
        message: error.message,
        duration: 2500,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    } finally {
      loading.dismiss();
    }
  }

  async onConfirmDeleteProduct(product: Product) {
    await this.utilService.presentAlert({
      header: 'Eliminar Producto',
      message: `¿Desea eliminar el producto ${product.name}?`,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, Eliminar',
          handler: async () => {
            await this.deleteProduct(product);
          }
        }
      ]
    })
  }

  doRefresh(event?: any) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  get totalEarnings(): number {
    return this.products.reduce((acumulator: number, { price, soldUnits }) => acumulator + (price * soldUnits), 0);
  }
}
