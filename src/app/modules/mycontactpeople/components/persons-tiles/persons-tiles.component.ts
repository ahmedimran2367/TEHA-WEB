import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-persons-tiles',
  templateUrl: './persons-tiles.component.html',
  styleUrls: ['./persons-tiles.component.scss'],
})
export class PersonsTilesComponent implements OnInit {
  constructor() {}
  @Input() ContactPersonDetail = null;
  @Input() Title = 'Beta';
  ngOnInit(): void {}
}
