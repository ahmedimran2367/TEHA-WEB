import { Component, OnInit, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-info-snack',
  templateUrl: './info-snack.component.html',
  styleUrls: ['./info-snack.component.scss']
})
export class InfoSnackComponent implements OnInit {
  constructor(
    public snackBarRef: MatSnackBarRef<InfoSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}
  ngOnInit(): void {}
}
