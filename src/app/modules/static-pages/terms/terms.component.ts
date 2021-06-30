import { Component, OnInit } from '@angular/core';


export interface DocElement {
  doc_name: string;
  type: string;
  link: string;
}

const ELEMENT_DATA: DocElement[] = [
  {type: 'PDF', doc_name: 'TEHA Terms of Use & Service', link: '#'},
  {type: 'PDF', doc_name: 'TEHA Data & Privacy Policy', link: '#'},
];


@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})


export class TermsComponent implements OnInit {

  displayedColumns: string[] = ['doc_name', 'type', 'link'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
