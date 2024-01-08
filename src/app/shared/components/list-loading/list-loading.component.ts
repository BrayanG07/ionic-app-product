import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-list-loading',
  templateUrl: './list-loading.component.html',
  styles: ``,
})
export class ListLoadingComponent implements OnInit {
  @Input()
  public loading: boolean = false;
  public readonly registers = [1, 1, 1, 1, 1, 1, 1]

  constructor() { }

  ngOnInit() { }

}
