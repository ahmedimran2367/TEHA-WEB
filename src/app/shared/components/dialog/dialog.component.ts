import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfig } from '../../models/dialog-config.model';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() config: DialogConfig = {
    title : 'Discard Changes?',
    message : 'You have unsaved changes, do you want to Discard?',
    confirmButtonLabel : 'Discard',
    cancelButtonLabel : 'Cancel',
  };
  constructor( private translate: TranslateService) {
    this.translate
      .get([
        'miscellaneous.discardChanges',
        'miscellaneous.discardQuestion',
        'miscellaneous.discard',
        'account.cancel',
      ])
      .subscribe((values) => {
        this.config.title = values['miscellaneous.discardChanges'];
        this.config.message = values['miscellaneous.discardQuestion'];
        this.config.confirmButtonLabel = values['miscellaneous.discard'];
        this.config.cancelButtonLabel = values['account.cancel'];
      });
   }

  ngOnInit(): void {
  }

}
