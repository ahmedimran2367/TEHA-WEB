import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AccountService } from '../../account.service';
import { ContactInformation } from '../../models/contact-information.model';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
  @ViewChild('generalForm') generalForm: FormGroup;
  floatLabelControl = new FormControl('auto');
  @Input() contactInformationCurrent = new ContactInformation();
  @Input() contactInformationNew = new ContactInformation();

  salutations = [
    {
      code: 'Mr',
      value: 'Mr.'
    },
    {
      code: 'Mrs',
      value: 'Mrs.'
    }
  ];
  constructor(
    private accountService: AccountService,
    private toastService: ToastService,
    public defaultDataService: DefaultDataService,
    private translate: TranslateService,
    public utilityService: UtilityService
  ) { }

  private eventsSubscription: Subscription;

  @Input() buttonClickedEvent: Observable<void>;
  @Input() discardedEvent: Observable<void>;
  @Input() selectedTabId: number;

  @Output() stateChanged = new EventEmitter<any>();

  ngOnChanges(): void {
    if (
      JSON.stringify(this.contactInformationCurrent) !==
      JSON.stringify(this.contactInformationNew)
    ) {
      console.log('contact', true);
      this.stateChanged.emit({ contact: 'yes' });
    } else {
      console.log('contact', false);
      this.stateChanged.emit({ contact: 'no' });
    }
  }
  ngOnInit(): void {
    this.eventsSubscription = this.buttonClickedEvent.subscribe(() => {
      if (this.selectedTabId === 0) {
        console.log('general save');
        if (
          JSON.stringify(this.contactInformationCurrent) !==
          JSON.stringify(this.contactInformationNew)
        ) {
          this.accountService
            .updateContactInformation(this.contactInformationNew)
            .subscribe(
              (m) => {
                console.log('updated', m);
                this.contactInformationCurrent = JSON.parse(
                  JSON.stringify(this.contactInformationNew)
                );
                this.stateChanged.emit({ contact: 'no' });
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
                    this.toastService.openSnackInfo(value);
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
      }
    });
    this.eventsSubscription.add(
      this.discardedEvent.subscribe(() => {
        console.log('discarded from parent');

        this.contactInformationNew = JSON.parse(
          JSON.stringify(this.contactInformationCurrent)
        );
      })
    );
  }
  deleteEmail(index: number): void {
    this.contactInformationNew.additionalEmails.splice(index, 1);
  }
  trackByIdx(index: number, obj: any): any {
    return index;
  }
  onEmailCheckChange($event: MatCheckboxChange): void {
    if ($event.checked) {
      this.contactInformationNew.secondaryEmail = this.contactInformationNew.email;
    }
  }

  onAddressCheckChange($event: MatCheckboxChange): void {
    if ($event.checked) {
      this.contactInformationNew.secondaryStreet = this.contactInformationNew.street;
      this.contactInformationNew.secondaryPostcode = this.contactInformationNew.postcode;
      this.contactInformationNew.secondaryPlace = this.contactInformationNew.place;
      this.contactInformationNew.secondaryFirstName = this.contactInformationNew.firstName;
      this.contactInformationNew.secondaryLastName = this.contactInformationNew.lastName;
      this.contactInformationNew.secondarySalutationCode = this.contactInformationNew.salutationCode;
    }

  }

  ngOnDestroy(): void {
    this.eventsSubscription.unsubscribe();
  }
  ngAfterViewInit(): void { }
}
