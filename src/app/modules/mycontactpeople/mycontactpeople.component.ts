import { Component, OnInit } from '@angular/core';
import { ResponseStatus } from 'src/app/shared/models/Response';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { ContactPersonsService } from './services/contact-persons.service';
import { ServiceContacts } from './models/ServiceContacts';
@Component({
  selector: 'app-mycontactpeople',
  templateUrl: './mycontactpeople.component.html',
  styleUrls: ['./mycontactpeople.component.scss'],
})
export class MycontactpeopleComponent implements OnInit {
  serviceContacts: ServiceContacts;
  constructor(
    private contactPersonService: ContactPersonsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.serviceContacts = new ServiceContacts();
    this.GetContactPersons();
  }
  GetContactPersons(): void {
    this.contactPersonService.GetContactPersons().subscribe((res) => {
      if (res.status == ResponseStatus.OK) {
        this.serviceContacts = res.data;
      } else {
        this.toastService.openSnackSuccessfully(res.message);
      }
    });
  }
}
