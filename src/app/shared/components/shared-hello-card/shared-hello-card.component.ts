import { Component, OnInit, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-shared-hello-card',
  templateUrl: './shared-hello-card.component.html',
  styleUrls: ['./shared-hello-card.component.scss'],
})
export class SharedHelloCardComponent implements OnInit {
  @Input() message: string;
  firstName: string;
  user: User;
  currentRout = '';
  constructor(public router: Router,private authenticationService: AuthenticationService) {
    this.currentRout = this.router.url;
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
      }
    });
  }
  ngOnInit(): void {
    this.firstName = this.user.name;
  }
}
