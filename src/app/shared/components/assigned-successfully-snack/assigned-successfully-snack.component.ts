import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-assigned-successfully-snack',
  templateUrl: './assigned-successfully-snack.component.html',
  styleUrls: ['./assigned-successfully-snack.component.scss']
})
export class AssignedSuccessfullySnackComponent implements OnInit {
  constructor(
    public snackBarRef: MatSnackBarRef<AssignedSuccessfullySnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
  ngOnInit(): void {}
}
