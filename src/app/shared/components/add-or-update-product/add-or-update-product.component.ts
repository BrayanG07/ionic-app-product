import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilService } from '../../../services/util.service';
import { KR_AUTH, LS_USER, collection } from '../../../constants';
import { User, Product } from '../../../interfaces';

@Component({
  selector: 'shared-add-or-update-product',
  templateUrl: './add-or-update-product.component.html',
  styleUrls: ['./add-or-update-product.component.scss'],
})
export class AddOrUpdateProductComponent implements OnInit {

  private firebaseService = inject(FirebaseService)
  private utilService = inject(UtilService)
  private formBuild = inject(FormBuilder);
  private readonly nameMinLenght: number = 3;
  private readonly priceMinValue: number = 0;
  private readonly soldUnitsMinValue: number = 0;
  public readonly routeBackButton: string = KR_AUTH
  public user?: User;

  @Input()
  public product?: Product;

  public form = this.formBuild.group({
    id: [''],
    image: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(this.nameMinLenght)]],
    price: [0, [Validators.required, Validators.min(0)]],
    soldUnits: [0, [Validators.required, Validators.min(0)]],
  });

  public validationMessages = {
    image: {
      required: 'La imagen es requerida.',
    },
    name: {
      required: 'El nombre es requerido.',
      minlength: `La longitud minima es de ${this.nameMinLenght} caracteres`,
    },
    price: {
      required: 'El precio es requerido.',
      min: `El valor minimo permitido es ${this.priceMinValue}`
    },
    soldUnits: {
      required: 'Las cantidad de unidades vendidas es requerido.',
      min: `El valor minimo permitido es ${this.soldUnitsMinValue}`
    },
  };

  ngOnInit() {
    this.user = this.utilService.getFromLocalStorage(LS_USER) as User

    if (this.product) {
      this.form.setValue(this.product)
    }
  }

  async onTakePicture() {
    const { dataUrl } = await this.utilService.takePicture('Imagen del producto')
    this.form.controls.image.setValue(dataUrl);
  }

  async onSubmit() {
    if (this.form.invalid) return;

    if (this.product) {
      this.updateProduct();
      return;
    }

    await this.createProduct();
  }

  async createProduct() {
    const loading = await this.utilService.loading();
    let path: string = `${collection.users}/${this.user.uid}/${collection.products}`

    try {
      await loading.present();

      // * Subir la imagen y obtener la urk
      const dataUrl = this.form.value.image;
      const imagePath = `${this.user.uid}/${Date.now()}`;
      const imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl)
      this.form.controls.image.setValue(imageUrl);

      let { id, ...restData } = this.form.value
      restData.price = +restData.price;
      restData.soldUnits = +restData.soldUnits;

      await this.firebaseService.addDocument(path, restData);
      this.utilService.presentToast({
        message: 'Producto creado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'top',
        icon: 'checkmark-circle-outline'
      })
      this.utilService.dismissModal({ success: true });


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

  async updateProduct() {
    const loading = await this.utilService.loading();
    let path: string = `${collection.users}/${this.user.uid}/${collection.products}/${this.product.id}`

    try {
      await loading.present();

      // * Si cambio la imagen, subimos la nueva (Reemplazandola por la antigua)
      if (this.form.value.image !== this.product.image) {
        const dataUrl = this.form.value.image;

        // * Obtenemos el path de la URL para sobrescribir la imagen y no crear otro registro.
        const imagePath = this.firebaseService.getFilePath(this.product.image);
        const imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl)
        this.form.controls.image.setValue(imageUrl);
      }

      const { id, ...restData } = this.form.value
      restData.price = +restData.price;
      restData.soldUnits = +restData.soldUnits;

      await this.firebaseService.updateDocument(path, restData);
      this.utilService.presentToast({
        message: 'Producto actualizado exitosamente.',
        duration: 1500,
        color: 'success',
        position: 'top',
        icon: 'checkmark-circle-outline'
      })
      this.utilService.dismissModal({ success: true });


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

  get textAction(): string {
    return this.product ? 'Actualizar Producto' : 'Agregar Producto';
  }

  setNumberInputs() {
    let { soldUnits, price } = this.form.controls
  }
 }
