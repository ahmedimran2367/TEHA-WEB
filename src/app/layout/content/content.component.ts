import { Component, OnInit } from '@angular/core';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
  constructor(private browserService: BrowserStorageService) {
    this.browserService.removeSessionStorage('userDataurlInd');
    this.browserService.removeSessionStorage('allMoveOutReadingsInd');
   }

  isSidebarOpen = true;
  ngOnInit(): void { }
  sidebarToggle(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
