import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'shared-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {
  @Input()
  public control!: FormControl;

  @Input()
  public type!: string;

  @Input()
  public label?: string;

  @Input()
  public autocomplete!: string;

  @Input()
  public icon?: string;

  @Input()
  public placeHolder?: string;

  public isPassword?: boolean;
  private hide: boolean = true

  constructor() { }

  ngOnInit() {
    if (this.type === 'password') {
      this.isPassword = true;
    }
  }

  showOrHidePassword(): void {
    this.hide = !this.hide

    if (this.hide) {
      this.type = 'password'
      return;
    }

    this.type = 'text'
  }

  get iconShowOrHidePassword(): string {
    return this.hide ? 'eye-outline' : 'eye-off-outline'
  }

}
