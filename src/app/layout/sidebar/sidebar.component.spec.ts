import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  @Input() sidebarOpen: boolean;
  isLogoSm = !this.sidebarOpen;

  ngOnInit(): void {}

  getLogo(): string {
    if (this.sidebarOpen === true) {
      this.isLogoSm = false;
      return './assets/images/teha_logo.png';
    } else {
      this.isLogoSm = true;
      return './assets/images/teha-symbol.png';
    }
  }
}
