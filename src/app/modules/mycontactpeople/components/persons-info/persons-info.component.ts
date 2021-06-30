import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-persons-info',
  templateUrl: './persons-info.component.html',
  styleUrls: ['./persons-info.component.scss']
})
export class PersonsInfoComponent implements OnInit {
  constructor() {}
  @Input() ContactPersonDetail = null;
  ngOnInit(): void {
  }
}
