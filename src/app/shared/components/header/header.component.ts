import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'shared-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  @Input()
  public title?: string;

  @Input()
  public routeBackButton: string;

  @Input()
  public isModal?: boolean

  private utilService = inject(UtilService);

  ngOnInit() {}

  onDismissModal() {
    this.utilService.dismissModal();
  }

}
