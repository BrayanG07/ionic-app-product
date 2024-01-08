import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { UtilService } from '../../../services/util.service';
import { KR_AUTH } from '../../../constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  private firebaseService = inject(FirebaseService)
  private utilService = inject(UtilService)
  private formBuild = inject(FormBuilder);
  public readonly routeBackButton: string = KR_AUTH

  public form = this.formBuild.group({
    email: ['gonzalesbrayan0071@gmail.com', [Validators.required, Validators.email]],
  });

  public validationMessages = {
    email: {
      required: 'El email es requerido',
      email: 'El email no es valido.',
    },
  };

  ngOnInit() {
  }

  async onSubmit(): Promise<void> {
    const loading = await this.utilService.loading();

    try {
      if (this.form.invalid) return;
      await loading.present();

      const cleanedEmail = this.form.value.email.split(' ').join('').toLowerCase();
      await this.firebaseService.sendEmailForRecoveryPassword(cleanedEmail);
      this.utilService.presentToast({
        message: 'Correo electronico enviado con éxito.',
        color: 'success',
        position: 'top',
        icon: 'mail-outline',
        duration: 2000
      })
      this.utilService.routerLink(KR_AUTH);
      this.form.reset();

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

}
