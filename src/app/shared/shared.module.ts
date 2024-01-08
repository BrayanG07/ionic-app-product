import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { ValidationPipe } from './pipes/validation.pipe';
import { ErrorFieldComponent } from './components/error-field/error-field.component';
import { AddOrUpdateProductComponent } from './components/add-or-update-product/add-or-update-product.component';
import { ListLoadingComponent } from './components/list-loading/list-loading.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    ValidationPipe,
    ErrorFieldComponent,
    AddOrUpdateProductComponent,
    ListLoadingComponent,
  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    CustomInputComponent,
    ErrorFieldComponent,
    ReactiveFormsModule,
    AddOrUpdateProductComponent,
    ListLoadingComponent,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule]
})
export class SharedModule { }
