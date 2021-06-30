import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements AfterViewInit, OnInit {
  floatLabelControl = new FormControl('auto');

  newPassword = '';
  currentPassword = '';
  confirmPassword = '';

  constructor(
    private toastService: ToastService,
    private accountService: AccountService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  moveOnMax(field: any, nextFieldID: any): void {
    if (field.value.length >= 1) {
      document.getElementById(nextFieldID).focus();
    }
  }
  onCancelPressed(): void {
    this.newPassword = this.currentPassword = this.confirmPassword = '';
  }
  changePassword(): void {
    if (
      this.newPassword === '' ||
      this.confirmPassword === '' ||
      this.currentPassword === ''
    ) {

      this.translate.get('miscellaneous.fillAllFields').subscribe(value => { this.toastService.openSnackInfo(value); });

    } else {
      if (this.newPassword !== this.confirmPassword) {
        this.translate.get('miscellaneous.passwordsNotMatch').subscribe(value => { this.toastService.openSnackInfo(value); });
      } else {
        if (this.currentPassword !== this.newPassword) {
          this.accountService
            .changePassword(this.newPassword, this.currentPassword)
            .subscribe((m) => {
              this.showSnackbar();
              this.confirmPassword = this.newPassword = this.currentPassword =
                '';
            },
              (err) => {
                if (err.error.status === 409) {
                  this.translate.get('miscellaneous.currentPasswordWrong').subscribe(value => { this.toastService.openSnackError(value); });
                }
                else {
                  this.translate.get('miscellaneous.couldNotUpdate').subscribe(value => { this.toastService.openSnackError(value); });
                }
              });
        } else {
          this.translate.get('miscellaneous.currentPasswordMatch').subscribe(value => { this.toastService.openSnackInfo(value); });
        }
      }
    }
  }
  showSnackbar(): void {
    this.translate.get('miscellaneous.changedSuccessfully').subscribe(value => { this.toastService.openSnackSuccessfully(value); });
  }
}
