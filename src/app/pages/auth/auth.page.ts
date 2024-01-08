import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { UtilService } from '../../services/util.service';
import { KR_MAIN, KR_MAIN_HOME, LS_USER, collection } from '../../constants';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  private firebaseService = inject(FirebaseService)
  private utilService = inject(UtilService)
  private formBuild = inject(FormBuilder);

  public form = this.formBuild.group({
    email: ['gonzalesbrayan0071@gmail.com', [Validators.required, Validators.email]],
    password: ['password', [Validators.required]]
  });

  public validationMessages = {
    email: {
      required: 'Email is required',
      email: 'Please provide a valid email',
    },
    password: {
      required: 'La contraseña es requerida',
    },
  };

  ngOnInit() {
  }

  async onSubmit(): Promise<void> {
    const loading = await this.utilService.loading();

    try {
      if (this.form.invalid) return;
      await loading.present();

      let { email, password } = this.form.value;
      email = email.split(' ').join('').toLowerCase();

      const { user: { uid } } = await this.firebaseService.signIn({ email, password });
      await this.getUserInfo(uid);

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

  async getUserInfo(uid: string): Promise<void> {
    const loading = await this.utilService.loading();

    try {
      await loading.present();
      const path = `${collection.users}/${uid}`;

      const user = await this.firebaseService.getDocument<User>(path);
      this.utilService.saveInLocalStorage(LS_USER, user);
      this.utilService.routerLink(`${KR_MAIN}/${KR_MAIN_HOME}`);
      this.form.reset();

      this.utilService.presentToast({
        message: `Hola ${user.name}`,
        duration: 1500,
        color: 'success',
        position: 'top',
        icon: 'person-circle-outline'
      });

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
