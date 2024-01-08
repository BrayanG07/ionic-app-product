import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'shared-error-field',
  templateUrl: './error-field.component.html',
  styleUrls: ['./error-field.component.scss'],
})
export class ErrorFieldComponent  implements OnInit {
  @Input() control!: FormControl | AbstractControl;
  @Input() errorMessages!: Object;

  constructor(public formDirective: FormGroupDirective) { }

  ngOnInit() {}

}
