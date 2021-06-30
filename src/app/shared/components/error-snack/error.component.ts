import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snack',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorSnackComponent implements OnInit {
  constructor(
    public snackBarRef: MatSnackBarRef<ErrorSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
  ngOnInit(): void {}
}
