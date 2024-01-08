import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilService } from '../../../services/util.service';
import { KR_AUTH, KR_MAIN, KR_MAIN_HOME, LS_USER, collection } from '../../../constants';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  private firebaseService = inject(FirebaseService)
  private utilService = inject(UtilService)
  private formBuild = inject(FormBuilder);
  private readonly nameMinLenght: number = 4;
  public readonly routeBackButton: string = KR_AUTH

  public form = this.formBuild.group({
    uid: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(this.nameMinLenght)]],
  });

  public validationMessages = {
    email: {
      required: 'Email is required.',
      email: 'Please provide a valid email.',
    },
    password: {
      required: 'La contraseña es requerida.',
    },
    name: {
      required: 'El nombre es requerido.',
      minlength: `La longitud minima es de ${this.nameMinLenght} caracteres`
    }
  };

  ngOnInit() {
  }

  async onSubmit() {
    if (this.form.invalid) return;
    const loading = await this.utilService.loading();

    try {
      await loading.present();

      let { email, password, name } = this.form.value;
      email = email.split(' ').join('').toLocaleLowerCase();

      const response = await this.firebaseService.signUp({ email, password });
      await this.firebaseService.updateUser(name);

      const uid: string = response.user.uid;
      this.form.controls.uid.setValue(uid);

      this.setUserInfo(uid);

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

  async setUserInfo(uid: string): Promise<void> {
    if (this.form.invalid) return;
    const loading = await this.utilService.loading();

    try {
      await loading.present();
      const path = `${collection.users}/${uid}`;
      delete this.form.value.password;

      const { email } = this.form.value;
      const cleanedEmail: string = email.split(' ').join('').toLowerCase();
      this.form.controls.email.setValue(cleanedEmail);

      await this.firebaseService.setDocument(path, this.form.value);
      this.utilService.saveInLocalStorage(LS_USER, this.form.value);
      this.utilService.routerLink(`${KR_MAIN}/${KR_MAIN_HOME}`);
      this.form.reset();

    } catch (error) {
      this.utilService.presentToast({
        message: error.message,
        duration: 2500,
        color: 'warning',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }
}
