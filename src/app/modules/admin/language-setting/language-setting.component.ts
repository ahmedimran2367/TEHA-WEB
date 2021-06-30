import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { LanguageSetting } from '../models/language-setting-model';
import { LanguageSettingService } from '../services/language-setting.service';

@Component({
  selector: 'app-language-setting',
  templateUrl: './language-setting.component.html',
  styleUrls: ['./language-setting.component.scss'],
})
export class LanguageSettingComponent implements OnInit {
  languageSetting: LanguageSetting;
  viewGrid = true;
  category = 'all';
  freeSearch = '';
  isEdited = false;
  @ViewChild('languagetableComponent') languageTable;
  @Output() categoryChangeEvent = new EventEmitter<string>();
  constructor(
    private languageSettingService: LanguageSettingService,
    private translateService: TranslateService,
    private toast: ToastService
  ) {}
  ngOnInit(): void {
    if (this.languageSetting) {
      this.viewGrid = false;
    }
  }

  reciveItem($event): void {
    this.languageSetting = $event;
    this.viewGrid = false;
  }
  Update(): void {
    this.isEdited = true;
    this.languageSettingService.Update(this.languageSetting).subscribe(x => {
      this.viewGrid = true;
      // this.languageTable.getAll(this.category);
      // this.translateService.reloadLang('de')
      // this.translateService.use('en')
      // this.translateService.use('de')
      this.translateService.get('miscellaneous.updatedSuccessfully').subscribe((value) => {
        this.toast.openSnackSuccessfully(value);
      });

    }, () => {
      console.log('some error');
    });
  }

  onChange($event): void {
    this.category = $event.value;
    this.languageTable.pageIndex = 0;
    this.languageTable.getAll($event.value, this.freeSearch);
  }
  goBack(): void {
    this.viewGrid = true;
  }
}
