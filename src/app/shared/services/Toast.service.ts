import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AssignedSuccessfullySnackComponent } from '../components/assigned-successfully-snack/assigned-successfully-snack.component';
import { ErrorSnackComponent } from '../components/error-snack/error.component';
import { InfoSnackComponent } from '../components/info-snack/info-snack.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackSuccessfully(
    message: string,
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    horizontalPosition: MatSnackBarHorizontalPosition = 'end',
    duration: any = 6000
  ): any {
    return this.snackBar.openFromComponent(AssignedSuccessfullySnackComponent, {
      duration,
      verticalPosition,
      horizontalPosition,
      panelClass: 'transparent-snackbar',
      data: { message },
    });
  }

  openSnackError(
    message: string,
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    horizontalPosition: MatSnackBarHorizontalPosition = 'end',
    duration: any = 6000
  ): any {
    return this.snackBar.openFromComponent(ErrorSnackComponent, {
      duration,
      verticalPosition,
      horizontalPosition,
      panelClass: 'transparent-snackbar',
      data: { message },
    });
  }

  openSnackInfo(
    message: string,
    verticalPosition: MatSnackBarVerticalPosition = 'bottom',
    horizontalPosition: MatSnackBarHorizontalPosition = 'end',
    duration: any = 6000
  ): any {
    return this.snackBar.openFromComponent(InfoSnackComponent, {
      duration,
      verticalPosition,
      horizontalPosition,
      panelClass: 'transparent-snackbar',
      data: { message },
    });
  }
}
