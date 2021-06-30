import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CanComponentDeactivate } from 'src/app/core/guard/unsaved-data-guard.guard';
import { AccountService } from '../account.service';
import { ContactInformation } from '../models/contact-information.model';
import { GeneralSettings, Member } from '../models/contact-detail.model';
import { ToastService } from '../../../shared/services/Toast.service';
import { TranslateService } from '@ngx-translate/core';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-document-archives',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, CanComponentDeactivate {
  floatLabelControl = new FormControl('always');

  hiddenPropertySelectComponent = true;
  hiddenPropertySelectStatement = true;
  hiddenSearchbar = true;
  addTeamMemberShown = false;
  childStateChanged = { contact: false, notification: false, myTeam: false };
  searchText = '';
  contactInformationNew = new ContactInformation();
  generalSettingsNew = new GeneralSettings();
  generalSettingsCurrent = new GeneralSettings();
  contactInformationCurrent = new ContactInformation();
  myTeamNew: Member[] = [];
 public helloCardTabWiseText = 'Weisen Sie Ihre Verwalter bestehendenLiegenschaften zu oder erweitern Sie hier Ihr Team.';
  constructor(
    private dialog: MatDialog,
    public accountService: AccountService,
    private toastService: ToastService,
    private translate: TranslateService,
    private browserService: BrowserStorageService
  ) { }
  selectedProperty: any;
  settingsSuffixMessage = '';

  hiddenBackButton = true;
  hiddenButtons = false;
  defaultSelected = '';
  selectedTabId = 0;
  prevTabId = 0;
  saveEventsSubject: Subject<number> = new Subject<number>();
  discardChangesEventSubject = new Subject<void>();
  backEventSubject = new Subject<void>();

  onChildStateChanged($event): void {
    if ($event.contact) {
      $event.contact === 'yes'
        ? (this.childStateChanged.contact = true)
        : (this.childStateChanged.contact = false);
    }
    if ($event.myTeam) {
      $event.myTeam === 'yes'
        ? (this.childStateChanged.myTeam = true)
        : (this.childStateChanged.myTeam = false);
    }
    if ($event.notification) {
      $event.notification === 'yes'
        ? (this.childStateChanged.notification = true)
        : (this.childStateChanged.notification = false);
    }


    // $event.contact
    //   ? (this.childStateChanged.contact = $event.contact)
    //   : $event.notification
    //   ? (this.childStateChanged.notification = $event.notification)
    //   : (this.childStateChanged.myTeam = $event.myTeam);

    // this.childStateChanged = $event;
    // console.log(this.childStateChanged);
  }

  deselectProperty(): void {
    this.hiddenPropertySelectStatement = true;
  }

  onPropertySelected($event): void {
    this.hiddenPropertySelectStatement = false;
    this.selectedProperty = this.browserService
      .getSessionStorage('userProperties')
      .find((p) => p.id === $event);
  }
  emitSaveClickEventToChild(flag: number): void {
    this.childStateChanged.contact = false;
    this.childStateChanged.notification = false;
    this.childStateChanged.myTeam = false;
    console.log(this.childStateChanged);
    this.saveEventsSubject.next(flag);
  }
  emitCancelClickEventToChild(): void {
    if (this.childStateChanged.notification || this.childStateChanged.contact) {
      this.childStateChanged.contact = false;
      this.childStateChanged.notification = false;

      this.discardChangesEventSubject.next();
    }
  }
  ngOnInit(): void {

    this.accountService.getDetail().subscribe((m) => {

      this.accountService.profileDetail = m.data;
      this.contactInformationNew = m.data.contactInformation;
      this.contactInformationCurrent = JSON.parse(
        JSON.stringify(this.contactInformationNew)
      );
      this.generalSettingsNew = m.data.generalSettings;
      if (this.generalSettingsNew.invoice.communicationMedium.includes('Email')) {
        if (!this.generalSettingsNew.newInvoice.communicationMedium.includes('Email')){
          this.generalSettingsNew.newInvoice.communicationMedium.push('Email');
        }
      }
      this.generalSettingsCurrent = JSON.parse(
        JSON.stringify(this.generalSettingsNew)
      );
      this.myTeamNew = m.data.members;
    });
    if(history.state.selectedTabId)
    {
      this.selectedTabId = history.state.selectedTabId;
      this.prevTabId = history.state.selectedTabId;
      this.hiddenSearchbar = false;
    }
    this.changeHelloCardMessage();
  }

  canDeactivate(): boolean {
    if (
      this.childStateChanged.contact ||
      this.childStateChanged.notification ||
      this.childStateChanged.myTeam
    ) { return true; }
    else { return false; }
  }
  tabChanged($event: MatTabChangeEvent): void {
    if (
      !this.childStateChanged.contact &&
      !this.childStateChanged.notification &&
      !this.childStateChanged.myTeam
    ) {
      this.selectedTabId = $event.index;
      this.prevTabId = $event.index;
      if ($event.index === 0 || $event.index === 1) {
        this.hiddenButtons = false;
      } else {
        this.hiddenButtons = true;
      }
      if ($event.index !== 4) {
        this.backEventSubject.next();
      }
      if ($event.index === 3 || $event.index === 4) {
        this.hiddenSearchbar = false;
        this.searchText = '';
      } else {
        this.hiddenSearchbar = true;
      }
      if ($event.index === 1) {
        this.hiddenPropertySelectComponent = false;
      } else {
        this.hiddenPropertySelectComponent = true;
        this.hiddenPropertySelectStatement = true;
      }
    } else {
      if (this.selectedTabId !== this.prevTabId) {
        this.selectedTabId = this.prevTabId;
        let dialogRef = this.dialog.open(DialogComponent, {
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog

          if (result == 'confirm') {
            this.discardChangesEventSubject.next();
            this.selectedTabId = $event.index;
            this.childStateChanged.contact = this.childStateChanged.notification = this.childStateChanged.myTeam = false;

          }
        });
      }
    }
    this.changeHelloCardMessage();
  }

  backPressed(): void {
    if (this.childStateChanged.myTeam) {
      let dialogRef = this.dialog.open(DialogComponent, {
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog

        if (result == 'confirm') {
          this.discardChangesEventSubject.next();
          this.childStateChanged.contact = this.childStateChanged.notification = this.childStateChanged.myTeam = false;

        }
      });
    } else {
      this.backEventSubject.next();
    }
  }
  onUpdateFormAppeared($event): void {
    this.hiddenBackButton = $event.hideBackButton;
    if ($event.message !== '') {

      this.translate.get($event.message).subscribe((value) => {
        this.settingsSuffixMessage = ' -- ' + value;
      });
    } else {
      this.settingsSuffixMessage = $event.message;
    }
  }

  onChange(text): void {

    this.searchText = text;
  }

  addTeamMemberClicked(): void {
    this.addTeamMemberShown = true;
  }
  addMemberCanceled(): void {
    this.addTeamMemberShown = false;
  }

  assignBuildingClicked(): void {
    this.translate
      .get('miscellaneous.assignedSuccessfully')
      .subscribe((value) => {
        this.toastService.openSnackSuccessfully(value);
      });
  }

  confirmTeamMemberClicked(): void {
    this.addTeamMemberShown = false;
    this.translate.get('miscellaneous.addedSuccessfully').subscribe((value) => {
      this.toastService.openSnackSuccessfully(value);
    });
  }
  changeHelloCardMessage():void{
    let personalDataTabMsg: string;
    let notificationsTabMsg: string;
    let passwordTabMsg: string;
    let contractsTabMsg: string;
    let teamsTabMsg: string;
    let myOffersTabMsg: string;
    let myPreferencesTabMsg: string;
    this.translate
      .get([
        'account.personalDataTabMsg',
        'account.notificationsTabMsg',
        'account.passwordTabMsg',
        'account.contractsTabMsg',
        'account.teamsTabMsg',
        'account.myOffersTabMsg',
        'account.myPreferencesTabMsg',
      ])
      .subscribe((values) => {
        personalDataTabMsg = values['account.personalDataTabMsg'];
        notificationsTabMsg = values['account.notificationsTabMsg'];
        passwordTabMsg = values['account.passwordTabMsg'];
        contractsTabMsg = values['account.contractsTabMsg'];
        teamsTabMsg = values['account.teamsTabMsg'];
        myOffersTabMsg = values['account.myOffersTabMsg'];
        myPreferencesTabMsg = values['account.myPreferencesTabMsg'];
      });
      debugger;
     if(this.selectedTabId == 0)
     {
       this.helloCardTabWiseText = personalDataTabMsg;
     }
     else if(this.selectedTabId == 1)
     {
      this.helloCardTabWiseText = notificationsTabMsg;
     }
     else if(this.selectedTabId == 2)
     {
      this.helloCardTabWiseText = passwordTabMsg;
     }
     else if(this.selectedTabId == 3)
     {
      this.helloCardTabWiseText = contractsTabMsg;
     }
     else if(this.selectedTabId == 4)
     {
      this.helloCardTabWiseText = myOffersTabMsg;
     }
     else if(this.selectedTabId == 5)
     {
      this.helloCardTabWiseText = teamsTabMsg;
     }
     else if(this.selectedTabId == 6)
     {
      this.helloCardTabWiseText = myPreferencesTabMsg;
     }
     else{
      this.helloCardTabWiseText;
     }
  }
  languageChange(): void{
    this.translate
    .get('account.myPreferencesTabMsg')
    .subscribe((value) => {
     this.helloCardTabWiseText = value;
    });
  }
}
