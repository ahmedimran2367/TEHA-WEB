import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { AccountService } from '../../account.service';
import { Member } from '../../models/contact-detail.model';
import { AddMemberRequest } from '../../models/add-team-member-request.model';

import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { Observable, Subscription } from 'rxjs';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { PropertyInfo } from 'src/app/shared/models/property-info.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogConfig } from 'src/app/shared/models/dialog-config.model';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-my-teams-table',
  templateUrl: './my-teams-table.component.html',
  styleUrls: ['./my-teams-table.component.scss'],
})
export class MyTeamsTableComponent implements OnChanges, OnInit {
  addTeamMemberInd = false;
  assignPropertyInd = false;

  @ViewChild('newMemberForm') newMemberForm: FormGroup;
  @Input() myTeamNew: Member[] = [];
  @Input() myTeamSearch: Member[] = [];

  @Input() discardedEvent: Observable<void>;
  @Input() backEvent: Observable<void>;
  @Output() stateChanged = new EventEmitter<any>();
  @Output() updateFormAppeard = new EventEmitter<any>();

  @Input() settingsSuffixMessage: string;
  @Input() hiddenBackButton = true;
  @Input() searchText: string;

  selectedMember = new Member();

  eventsSubscription: Subscription;

  addMemberRequestNew = new AddMemberRequest();
  addMemberRequestCurrent = new AddMemberRequest();
  assignPropertyDataNew = new PropertyInfo();
  assignPropertyDataCurrent = new PropertyInfo();

  tehaLgOptions: any[];
  adminLgOptions: any[];

  tehaLgControl = new FormControl();
  adminLgControl = new FormControl();

  buildingList = [];
  isValid = true;

  /**
   *
   */
  constructor(
    public defaultDataService: DefaultDataService,
    private accountService: AccountService,
    private browserService: BrowserStorageService,
    private toastService: ToastService,
    private dialog: MatDialog,
    private translate: TranslateService,
    public utilityService: UtilityService
  ) {
    this.buildingList = this.browserService.getSessionStorage('userProperties');
    this.tehaLgOptions = this.buildingList;
    this.adminLgOptions = this.buildingList;
  }
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'tehaLgNum',
    'adminLgNum',
    'street',
    'zipcode',
    'city',
    'download',
  ];

  ngOnChanges(): void {
    if (this.assignPropertyInd || this.addTeamMemberInd) {
      console.log('hiddenBack false');
      if (
        JSON.stringify(this.assignPropertyDataCurrent) !==
        JSON.stringify(this.assignPropertyDataNew) ||
        JSON.stringify(this.addMemberRequestCurrent.requestFor) !==
        JSON.stringify(this.addMemberRequestNew.requestFor)
      ) {
        this.stateChanged.emit({ myTeam: 'yes' });
      } else {
        this.stateChanged.emit({ myTeam: 'no' });
      }
    } else {
      console.log('hiddenBack true');
      this.updateFormAppeard.emit({ hideBackButton: true, message: '' });
      this.hiddenBackButton = true;
    }
  }

  ngOnInit(): void {
    this.eventsSubscription = this.discardedEvent.subscribe(() => {
      console.log('discarded from parent');
      this.addMemberRequestNew = new AddMemberRequest();
      this.assignPropertyDataNew = new PropertyInfo();
      this.addTeamMemberInd = false;
      this.assignPropertyInd = false;
      this.translate
        .get('miscellaneous.changesDiscarded')
        .subscribe((value) => {
          this.toastService.openSnackInfo(value);
        });
    });

    this.eventsSubscription.add(
      this.backEvent.subscribe(() => {
        this.addTeamMemberInd = false;
        this.assignPropertyInd = false;
        this.stateChanged.emit({ myTeam: 'no' });
      })
    );
  }

  onTextChange(typeInd: number): void {
    if (typeInd === 0) {
      this.tehaLgOptions = this.buildingList?.filter((o) =>
        o.tehaLgNo?.includes(this.tehaLgControl.value)
      );
    } else {
      this.adminLgOptions = this.buildingList?.filter((o) =>
        o.adminLgNo?.includes(this.adminLgControl.value)
      );
    }
  }

  searchChanged(filter: string): void {
    this.myTeamNew = this.myTeamSearch.filter(
      (m) =>
        m.name?.toLowerCase().includes(filter.toLowerCase()) ||
        m.properties?.some(
          (p) =>
            p.tehaLgNo?.includes(filter.toLowerCase()) ||
            p.adminLgNo?.includes(filter.toLowerCase())
        )
    );
  }

  checkValid(): void {
    this.isValid = this.newMemberForm.valid;
  }
  update(addTeamMemberInd: boolean): void {
    if (addTeamMemberInd) {
      this.accountService.addTeamMember(this.addMemberRequestNew).subscribe(
        (m) => {
          this.translate
            .get('miscellaneous.addedSuccessfully')
            .subscribe((value) => {
              this.toastService.openSnackSuccessfully(value);
            });
          m.data.properties = [];
          this.myTeamNew.push(m.data);
          this.addTeamMemberInd = false;
          this.addMemberRequestNew = new AddMemberRequest();
          this.stateChanged.emit({ myTeam: 'no' });
          console.log();
        },
        (err) => {
          this.toastService.openSnackError(err.error.data[0].description);
        }
      );

    } else {
      if (this.assignPropertyDataNew.id) {
        const hasDuplicateProperty = this.selectedMember.properties.findIndex(
          (p) => p.id === this.assignPropertyDataNew.id
        );

        if (hasDuplicateProperty === -1) {
          let propertiesToAssign = this.selectedMember.properties.map(
            (p) => p.id
          );
          propertiesToAssign.push(this.assignPropertyDataNew.id);

          this.accountService
            .updateMemberProperties(
              propertiesToAssign,
              this.selectedMember.userId
            )
            .subscribe((m) => {
              console.log('updated prper');
              this.assignPropertyInd = false;
              this.addTeamMemberInd = false;

              this.translate
                .get('miscellaneous.assignedSuccessfully')
                .subscribe((value) => {
                  this.toastService.openSnackSuccessfully(value);
                });

              this.myTeamNew[
                this.myTeamNew.findIndex(
                  (t) => t.userId === this.selectedMember.userId
                )
              ].properties.push(this.assignPropertyDataNew);
              this.assignPropertyDataNew = new PropertyInfo();
              this.stateChanged.emit({ myTeam: 'no' });
            });
        } else {
          this.translate
            .get('miscellaneous.propertyExists')
            .subscribe((value) => {
              this.toastService.openSnackError(value);
            });
        }
      } else {
        this.translate
          .get('miscellaneous.selectValidProperty')
          .subscribe((value) => {
            this.toastService.openSnackInfo(value);
          });
      }
    }
  }

  removePropertyFromMember(memberId: number, propertyId: number): void {
    let message: string;
    let title: string;
    let cancelButtonLabel: string;
    let confirmButtonLabel: string;
    this.translate
      .get([
        'miscellaneous.delete',
        'miscellaneous.deletePropertyQuestion',
        'account.cancel',
        'order.yes',
      ])
      .subscribe((values) => {
        title = values['miscellaneous.delete'];
        message = values['miscellaneous.deletePropertyQuestion'];
        cancelButtonLabel = values['account.cancel'];
        confirmButtonLabel = values['miscellaneous.delete'];
      });
    const config: DialogConfig = {
      title,
      message,
      cancelButtonLabel,
      confirmButtonLabel,
    };

    let dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
    });
    dialogRef.componentInstance.config = config;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        let propertiesToAssign = this.myTeamNew
          .find((m) => m.userId === memberId)
          .properties.map((p) => p.id);

        const indexToRemove = propertiesToAssign.findIndex(
          (p) => p === propertyId
        );
        propertiesToAssign.splice(indexToRemove, 1);

        this.accountService
          .updateMemberProperties(propertiesToAssign, memberId)
          .subscribe((m) => {
            console.log('deleted prper');
            this.assignPropertyInd = false;
            this.addTeamMemberInd = false;
            this.translate
              .get('miscellaneous.propertyDeletedSuccessfully')
              .subscribe((value) => {
                this.toastService.openSnackSuccessfully(value);
              });

            const memberIndex = this.myTeamNew.findIndex(
              (t) => t.userId === memberId
            );

            this.myTeamNew[memberIndex].properties = this.myTeamNew[
              memberIndex
            ].properties.filter((p) => p.id !== propertyId);
          });
      }
    });
  }
  optionSelected($event): void {
    const building = this.buildingList.find((a) => a.id === $event);

    this.assignPropertyDataNew.tehaLgNo = building.tehaLgNo;
    this.assignPropertyDataNew.adminLgNo = building.adminLgNo;
    this.assignPropertyDataNew.street = building.street;
    this.assignPropertyDataNew.place = building.place;
    this.assignPropertyDataNew.postcode = building.postcode;
    this.assignPropertyDataNew.id = $event;
  }

  cancel(): void {
    this.addTeamMemberInd = false;
    this.assignPropertyInd = false;
    this.assignPropertyDataNew = new PropertyInfo();
    this.addMemberRequestNew = new AddMemberRequest();
  }
}
