import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
@Injectable({
  providedIn: 'root',
})
export class UnsavedDataGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private dialog: MatDialog) {}
  canDeactivate(
    component: CanComponentDeactivate
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (component.canDeactivate()) {
      let dialogRef = this.dialog.open(DialogComponent, {
        disableClose: true,
      });
      return dialogRef
        .afterClosed()
        .pipe(map((result) => result === 'confirm'));
      // return confirm(
      //   'You have some unsaved form data. Are you sure, you want to leave this page?'
      // );
    }

    return true;
  }
}
export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}
