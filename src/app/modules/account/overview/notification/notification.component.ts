import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { AccountService } from '../../account.service';
import { GeneralSettings } from '../../models/contact-detail.model';
import { UtilityService } from '../../../../shared/services/utility.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogConfig } from 'src/app/shared/models/dialog-config.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('notificationForm') notificationForm: FormGroup;
  @Input() generalSettingsNew = new GeneralSettings();
  @Input() generalSettingsCurrent = new GeneralSettings();

  informReadingAttemptList: any[] = [
    { code: 'F', value: 'After first reading attempt' },
    { code: 'S', value: 'After second reading attempt' },
  ];

  private eventsSubscription: Subscription;

  @Input() buttonClickedEvent: Observable<number>;
  @Input() discardedEvent: Observable<void>;
  @Input() selectedTabId: number;
  @Output() stateChanged = new EventEmitter<any>();
  selectedProperty: number = null;

  constructor(
    private accountService: AccountService,
    public defaultDataService: DefaultDataService,
    public utility: UtilityService,
    private toastService: ToastService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) { }

  ngOnChanges(): void {
    if (
      JSON.stringify(this.generalSettingsCurrent) !==
      JSON.stringify(this.generalSettingsNew)
    ) {
      this.stateChanged.emit({ notification: 'yes' });
    } else {
      this.stateChanged.emit({ notification: 'no' });
    }
  }
  ngOnInit(): void {
    // this.generalSettings = this.accountService.profileDetail?.generalSettings;
    console.log('first', this.generalSettingsNew);

    this.eventsSubscription = this.buttonClickedEvent.subscribe(
      (flag: number) => {
        if (this.selectedTabId === 1) {
          console.log('notification save');
          if (flag === 1) {
            if (
              JSON.stringify(this.generalSettingsCurrent) !==
              JSON.stringify(this.generalSettingsNew)
            ) {
              this.accountService
                .updateGeneralSettings(
                  this.generalSettingsNew,
                  this.selectedProperty,
                  false
                )
                .subscribe(
                  (m) => {
                    console.log('updated', m);
                    this.generalSettingsCurrent = JSON.parse(
                      JSON.stringify(this.generalSettingsNew)
                    );
                    this.stateChanged.emit({ notification: 'no' });
                    this.translate
                      .get('miscellaneous.updatedSuccessfully')
                      .subscribe((value) => {
                        this.toastService.openSnackSuccessfully(value);
                      });
                  },
                  (err) => {
                    this.translate
                      .get('miscellaneous.couldNotUpdate')
                      .subscribe((value) => {
                        this.toastService.openSnackError(value);
                      });
                  }
                );
            } else {
              this.translate
                .get('miscellaneous.changeDataBeforeSaving')
                .subscribe((value) => {
                  this.toastService.openSnackInfo(value);
                });
            }
          } else {
            let title: string;
            let message: string;
            let cancelBtn: string;
            let confirmBtn: string;
            this.translate
              .get([
                'account.saveNewConfigurations',
                'account.configurationsOverwriteMessage',
                'order.no',
                'order.yes',
              ])
              .subscribe((values) => {
                title = values['account.saveNewConfigurations'];
                message = values['account.configurationsOverwriteMessage'];
                cancelBtn = values['order.no'];
                confirmBtn = values['order.yes'];
              });
            const config: DialogConfig = {
              title,
              message,
              cancelButtonLabel: cancelBtn,
              confirmButtonLabel: confirmBtn,
            };

            let dialogRef = this.dialog.open(DialogComponent, {
              disableClose: true,
            });
            dialogRef.componentInstance.config = config;

            dialogRef.afterClosed().subscribe((result) => {
              let overwriteInd = false;
              if (result === 'confirm') {
                overwriteInd = true;
              }
              this.accountService
                .updateGeneralSettings(
                  this.generalSettingsNew,
                  null,
                  overwriteInd
                )
                .subscribe(
                  (m) => {
                    console.log('updated', m);
                    this.generalSettingsCurrent = JSON.parse(
                      JSON.stringify(this.generalSettingsNew)
                    );
                    this.stateChanged.emit({ notification: 'no' });
                    this.translate
                      .get('miscellaneous.updatedSuccessfully')
                      .subscribe((value) => {
                        this.toastService.openSnackSuccessfully(value);
                      });
                  },
                  (err) => {
                    this.translate
                      .get('miscellaneous.couldNotUpdate')
                      .subscribe((value) => {
                        this.toastService.openSnackError(value);
                      });
                  }
                );
            });
          }
        }
      }
    );
    this.eventsSubscription.add(
      this.discardedEvent.subscribe(() => {
        console.log('discarded from parent');
        this.generalSettingsNew = JSON.parse(
          JSON.stringify(this.generalSettingsCurrent)
        );
        this.translate
          .get('miscellaneous.changesDiscarded')
          .subscribe((value) => {
            this.toastService.openSnackInfo(value);
          });
      })
    );
  }

  addEmailSecondQuestion(): void {
    if (this.generalSettingsNew.invoice.communicationMedium.includes('Email')) {
      if (!this.generalSettingsNew.newInvoice.communicationMedium.includes('Email')){
        this.generalSettingsNew.newInvoice.communicationMedium = this.generalSettingsNew.newInvoice.communicationMedium.concat('Email');
      }
    }
  }
  checkIfEmail(): boolean {
    if (this.generalSettingsNew.invoice.communicationMedium.includes('Email')) {
      return true;
    }
    return false;
  }
  getGeneralSettings(propertyId: number): void {
    this.selectedProperty = propertyId;
    this.accountService.getGeneralSetting(propertyId).subscribe((m) => {
      this.generalSettingsNew = m.data;
      this.generalSettingsCurrent = JSON.parse(
        JSON.stringify(this.generalSettingsNew)
      );
    });
  }
  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
}
