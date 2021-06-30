import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { User } from 'src/app/shared/models/user.model';
import { SystemSettings } from '../../models/system-settings-model';
import { SystemSettingsService } from '../../services/system-settings.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
})
export class SystemSettingsComponent implements OnInit {
  systemSetting: SystemSettings;
  viewGrid = true;
  user: User;
  isAdmin: boolean;
  public category: '';
  @ViewChild('settingstableComponent') settingsTable;
  constructor(private systemSettingsService: SystemSettingsService, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
        if(this.user.type === 'HA'){
          this.isAdmin = true;
        }
      }
    });
  }
  ngOnInit(): void {
    if (this.systemSetting) {
      this.viewGrid = false;
    }
  }

  reciveItem($event): void {
    this.systemSetting = $event;
    this.viewGrid = false;
  }
  getCategory($event): void {

  }
  Update(): void {
    this.viewGrid = true;
    this.systemSettingsService.Update(this.systemSetting).subscribe(x => {
      this.settingsTable.getAll();
    });
  }

  downloadDocument(): void {
    this.systemSettingsService.GetDocumentJson().subscribe(m => {
      const byteArray = new Uint8Array(
        atob(m.data.content)
          .split('')
          .map((char) => char.charCodeAt(0))
      );
      const extension = String(m.data.filename).substr(-4, 4);
      const blob = new Blob([byteArray], {
        type: 'application/' + extension,
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = m.data.filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
      link.remove();
    })
  }
  onChange(event): void {
    this.settingsTable.getAll();
  }
  goBack(): void {
    this.viewGrid = true;
  }
}
