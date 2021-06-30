import { HttpClient, HttpParams } from '@angular/common/http';
import { GeneralSettings, Profile } from './models/contact-detail.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Url } from 'src/app/shared/Constant/URL';
import { User } from 'src/app/shared/models/user.model';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { ContactInformation } from './models/contact-information.model';
import { AddMemberRequest } from './models/add-team-member-request.model';
import { UpdatePropertyRequest } from './models/update-property-request.model';
import { EditTeamMemberRequest } from './models/edit-team-member-request.model';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  user: User;
  public profileDetail: Profile;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    private browserService: BrowserStorageService
  ) {
    this.authenticationService.currentUser.subscribe((u) => {
      if (u != null) {
        this.user = u;
      }
    });
  }

  updateContactInformation(
    contactInformation: ContactInformation
  ): Observable<any> {
    let updateContactInformationRequest = {
      id: this.user.id,
      contactInfo: contactInformation,
    };

    return this.httpClient.put<any>(
      Url.constUpdateContactInformation,
      updateContactInformationRequest
    );
  }

  updateGeneralSettings(
    generalSettings: GeneralSettings,
    propertyId: number = null,
    overwriteInd?: boolean
  ): Observable<any> {
    for (const key in generalSettings) {
      if (Object.prototype.hasOwnProperty.call(generalSettings, key)) {
        if (generalSettings[key]?.communicationMedium?.length > 0) {
          generalSettings[key].notificationInd = true;
        }else if (key !== 'userNotAvailable' && key !== 'defectSmokeDetectors') {
          generalSettings[key].notificationInd = false;
        }
      }
    }

    let generalSettingsUpdateRequest = {
      userId: this.user.id,
      propertyId,
      overwriteInd,
      generalSetting: generalSettings,
    };

    return this.httpClient.put<any>(
      Url.constUpdateGeneralSetting,
      generalSettingsUpdateRequest
    );
  }

  getContractDocument(id: number, propertyId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', this.user.id.toString())
      .set('propertyId', propertyId.toString())
      .set('id', id.toString());
    return this.httpClient.get<any>(Url.constContractGetDocument, {
      params,
    });
  }
  getContracts(): Observable<any> {
    const params = new HttpParams().set('userId', this.user.id.toString());
    return this.httpClient.get<any>(Url.constContractGet, {
      params,
    });
  }
  changePassword(newPassword: string, oldPassword: string): Observable<any> {
    const updatePasswordRequest = {
      userId: this.user.id,
      oldPassword,
      newPassword,
    };
    return this.httpClient.put<any>(
      Url.constChangePassword,
      updatePasswordRequest
    );
  }
  getUserContactInformation(): Observable<any> {
    const params = new HttpParams().set('userId', this.user.id.toString());
    return this.httpClient.get<any>(Url.constUserContactInformation, {
      params,
    });
  }

  getGeneralSetting(propertyId: number): Observable<any> {
    let params = new HttpParams().set('id', this.user.id.toString());
    if (propertyId) {
      params = params.append('propertyId', propertyId.toString());
    }
    return this.httpClient.get<any>(Url.constGetGeneralSetting, {
      params,
    });
  }
  getDetail(): Observable<any> {
    const params = new HttpParams().set('id', this.user.id.toString());
    return this.httpClient.get<any>(Url.constDetail, {
      params,
    });
  }

  updateMemberProperties(
    propertyIds: number[],
    memberId: number
  ): Observable<any> {
    let updatePropertyRequest = new UpdatePropertyRequest();
    updatePropertyRequest.userId = this.user.id;
    updatePropertyRequest.memberUserId = memberId;
    updatePropertyRequest.properties = propertyIds;

    return this.httpClient.put<any>(
      Url.constUpdateMemberProperties,
      updatePropertyRequest
    );
  }
  addTeamMember(addMemberRequest: AddMemberRequest): Observable<any> {
    addMemberRequest.userId = this.user.id;
    return this.httpClient.post<any>(Url.constAddTeamMember, addMemberRequest);
  }
  editTeamMember(editMemberRequest: EditTeamMemberRequest): Observable<any> {
    editMemberRequest.userId = this.user.id;
    return this.httpClient.put<any>(Url.constEditTeamMember, editMemberRequest);
  }
}
