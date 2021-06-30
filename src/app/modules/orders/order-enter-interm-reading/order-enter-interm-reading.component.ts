import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileContentResponse, InterimReadingSelf } from '../models/interimReadingSelf';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StockOverviewService } from '../../stock-overview/stock-overview.service';
import { UserMovingDetail } from '../models/userMovingDetail';
import { OrdersService } from '../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { ToastService } from 'src/app/shared/services/Toast.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { isNullOrUndefined } from 'util';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FileName, FilePath } from 'src/app/shared/Constant/PDF';
import { AccountingService } from '../../accounting/accounting.service';
import { AccountingInterimReadingSelf } from '../models/AccountingInterimReadingSelf'
@Component({
  selector: 'app-order-enter-interm-reading',
  templateUrl: './order-enter-interm-reading.component.html',
  styleUrls: ['./order-enter-interm-reading.component.scss']
})

export class OrderEnterIntermReadingComponent implements OnInit, OnDestroy {

  currentStep = 1;
  isVacant = true;
  @ViewChild('firstForm') firstForm;

  dataSource: any;
  summaryDataSource: any;
  enterInterimTableDataSource: any;

  interimReadingSelf: any;
  oldInterimReadingSelf: string;
  propertyID: any = null;
  property: any;
  showFlatCard = false;
  showMeterCard = false;
  showPropertyCard = false;
  showHelloCard = false;
  showUserMap = false;
  showPropertySearch = true;
  orderId: number = null;
  routeId: any;
  allMoveOutReadingsInd = false;
  indicatorToAccounting = null;  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['tehaUserNo', 'adminUserNo', 'userName', 'location', 'actions'];
  displayedSummaryColumns = ['meterTypeDesc', 'serialNumber', 'location', 'value',
    'lastReading',
    'image',
    'warning'
  ];
  enterInterimTableDisplayedColumns = ['warning', 'meterTypeDesc', 'serialNumber', 'location', 'value', 'lastReading', 'image', 'imageView'];
  attachmenttooltipText = '';
  allMoveOutReadingsTooltip = '';
  constructor(
    private browserService: BrowserStorageService,
    public route: ActivatedRoute,
    private stockOverService: StockOverviewService,
    private orderService: OrdersService,
    private router: Router,
    private dialog: MatDialog,
    public defaultDataService: DefaultDataService,
    private toasService: ToastService,
    private utility: UtilityService,
    private location: Location,
    private translate: TranslateService,
    private accountingService: AccountingService) {

  }
  ngOnDestroy(): void {
    this.browserService.removeSessionStorage('userDataurlInd');
    this.browserService.removeSessionStorage('allMoveOutReadingsInd');
    this.accountingService.userDataSelectedMoveOutDate = null;
  }

  ngOnInit(): void {

    this.indicatorToAccounting = this.browserService.getSessionStorage('userDataurlInd');
    this.allMoveOutReadingsInd = this.browserService.getSessionStorage('allMoveOutReadingsInd');
    // get property ID and flat ID
    this.propertyID = this.browserService.getlocalStorage('currentPropertyId');
    this.property = this.browserService.getSessionStorage('userProperties')?.find(
      (p) => p.id === this.propertyID
    );
    let flatID = this.route.snapshot.paramMap.get('id');
    this.routeId = this.route.snapshot.paramMap.get('id');
    if (flatID == null) {
      this.currentStep = 0;
      this.displayCard('user');
      // this.getFlats(null, false);
    }
    else {
      this.currentStep = 2;
      this.getFlats(flatID, true);
      this.stockOverService.flatId = parseInt(flatID);
      this.displayCard('flat');
    }

    if(this.indicatorToAccounting){
      this.interimReadingSelf=new AccountingInterimReadingSelf();
    }
    else{
      this.interimReadingSelf=new InterimReadingSelf();
    }

    this.translate
      .get([
        'accounting.attachmentTooltip',
        'order.allMoveOutReadingsTooltip'
      ])
      .subscribe((values) => {
        this.attachmenttooltipText = values['accounting.attachmentTooltip'];
        this.allMoveOutReadingsTooltip = values['order.allMoveOutReadingsTooltip']
      });
  }

  getFlats(flatID, includeChildInd): void {
    this.stockOverService.flatRequest.flatIds = [];
    this.stockOverService.getFlats(this.browserService.getlocalStorage('currentPropertyId'), Number(flatID), includeChildInd).subscribe(res => {
      if (this.currentStep == 1) {
        this.stockOverService.flatData = res.data.items;
        this.dataSource = new MatTableDataSource(res.data.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      // if step 2
      if (this.currentStep == 2) {
        this.orderService.getLastReading(Number(this.propertyID), Number(flatID), null, this.accountingService.userDataSelectedMoveOutDate).subscribe(response => {
          this.enterInterimTableDataSource = null;
          this.interimReadingSelf=this.indicatorToAccounting!=null?new AccountingInterimReadingSelf():new InterimReadingSelf();
          this.interimReadingSelf.propertyId = this.propertyID;
          this.interimReadingSelf.flatId = Number(flatID);

          res.data.items[0].meters.forEach(element => {
            let counterReading = response.data.find(x => x.meterId == element.id)?.moveOutReadingValue;
            if (element.meterTypeDesc != 'RWM') {
              this.interimReadingSelf.meterReadings.push({
                meterId: element.id,
                value: counterReading != null ? String(counterReading) : null,
                lastReading: response.data.find(x => x.meterId == element.id)?.value,
                image: response.data.find(x => x.meterId == element.id)?.image,
                adminUserNo: element.adminUserNo,
                location: element.location,
                meterTypeDesc: element.meterTypeDesc,
                serialNumber: element.serialNumber,
                tehaUserNo: element.tehaUserNo,
                address: this.property.street + ', ' + this.property.postcode + ', ' + this.property.place,
                movingOutDate: null,
                userMovingOut: null,
                warning: false,
                meterWithResetInd: response.data.find(x => x.meterId == element.id)?.meterWithResetInd,
                error: false
              });
            }
          });
          this.enterInterimTableDataSource = res.data.items[0].meters.filter(x => x.meterTypeDesc != 'RWM');
          this.orderService.GetInterimReadingUserMovingOut(this.browserService.getlocalStorage('currentPropertyId'), Number(flatID))
            .subscribe(
              (m) => {
                if(this.indicatorToAccounting==null){
                this.interimReadingSelf.userMovingOut.salutationCode = m.data.salutationCode;
                this.interimReadingSelf.userMovingOut.firstName = m.data.firstName;
                this.interimReadingSelf.userMovingOut.lastName = m.data.lastName;
                this.interimReadingSelf.userMovingOut.date = m.data.date;
                }
                else{
                  this.interimReadingSelf.date = m.data.date;
                }
                this.oldInterimReadingSelf = JSON.stringify(this.interimReadingSelf);
              },
              () => {
                this.translate.get('order.prefillDataError').subscribe((value) => {
                  this.toasService.openSnackInfo(value);
                });
              }
            );
        });
      }
    });
  }
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  stepper(): void {
    // view summary
    this.displayCard('flat');
    if (this.currentStep == 2) {
      if (this.indicatorToAccounting == null) {
      this.interimReadingSelf.userMovingOut.date = this.utility.setDateFormat(this.interimReadingSelf.userMovingOut.date);
      this.interimReadingSelf.userMovingIn.date = this.utility.setDateFormat(this.interimReadingSelf.userMovingIn.date);
      this.interimReadingSelf.meterReadings.forEach(element => {
        element.userMovingOut = this.interimReadingSelf.userMovingOut.firstName + ' ' + this.interimReadingSelf.userMovingOut.lastName;
        element.movingOutDate = this.interimReadingSelf.userMovingOut.date;
      });
      this.summaryDataSource = this.interimReadingSelf.meterReadings;
    }
    }
    if (this.indicatorToAccounting != null) {
      this.submitOrder();
      return;
    }
    if (this.currentStep == 3) {
      this.submitOrder();
    }
    else {
      this.currentStep++;
    }
  }

  stepperBack(): void {
    if (this.currentStep == 2) {
      if (this.oldInterimReadingSelf != JSON.stringify(this.interimReadingSelf)) {
        const dialogRef = this.dialog.open(DialogComponent, {
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
          if (result == 'confirm') {
            this.enterInterimTableDataSource = null;
            this.interimReadingSelf=this.indicatorToAccounting!=null?new AccountingInterimReadingSelf():new InterimReadingSelf();
            this.currentStep--;
            if (this.currentStep == 1 && this.indicatorToAccounting != null) {
              this.cancelOrder();
            }
            else if (this.currentStep == 1 && this.routeId != null) {
              this.router.navigate(['/stockoverview/flat', this.propertyID]);
            }
          }
        });
      }
      else { this.currentStep--; this.interimReadingSelf=this.indicatorToAccounting!=null?new AccountingInterimReadingSelf():new InterimReadingSelf(); this.enterInterimTableDataSource = null; }
    }
    else { this.currentStep--; }
    if (this.currentStep == 1 && this.indicatorToAccounting != null) {
      this.cancelOrder();
    }
    else if (this.currentStep == 1 && this.routeId != null) {
      this.router.navigate(['/stockoverview/flat', this.propertyID]);
    }
    else if (this.currentStep == 0) {
      this.displayCard('user');
    }
    else if (this.currentStep == 1) {
      this.displayCard('property');
    }
  }

  valueChange(value, id): void {
    this.interimReadingSelf.meterReadings.find(x => x.meterId == id).value = value?.replace(',', '.');
  }
  vacantChange(): void {
    if (this.isVacant == true) {
      this.interimReadingSelf.userMovingIn = new UserMovingDetail();
    }
  }
  getReading(id): any {
    const val = this.interimReadingSelf.meterReadings.find(x => x.meterId == id).lastReading;
    return val == null ? '-' : val;
  }
  getValue(id): any {
    return this.interimReadingSelf.meterReadings.find(x => x.meterId == id).value?.replace('.', ',');
  }

  showFullLocation(location: string): string {
    return this.defaultDataService.DefaultData.lookUps.location.find(
      (loc) => loc.code === location
    )?.value;

  }

  attachImage(e, id): void {

    
    let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      if (parseFloat(sizeInMB) > 5) {
        alert('File size must under 5MB!');
        return;
      }
      let pattern = /image|pdf|spreadsheetml|wordprocessingml-*/;
      if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
      }
    }
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      let reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(
        this,
        id,
        file.name
      );
      reader.readAsDataURL(file);
    }
  
  }
  _handleReaderLoaded(id,name, e): void {
    let reader = e.target;
    let fileContentResponse: FileContentResponse = new FileContentResponse();
    fileContentResponse.content=reader.result.split('base64,')[1];
    fileContentResponse.filename=name;
    var obj=this.interimReadingSelf.meterReadings.find(x => x.meterId == id);
    if (obj.image == null) {
      obj.image = []
    }
    this.interimReadingSelf.meterReadings.find(x => x.meterId == id).image.push(fileContentResponse);
  }

  removeUpload(id): void {
    this.interimReadingSelf.meterReadings.find(x => x.meterId == id).image = [];
  }

  getImage(id): any {
    return this.interimReadingSelf.meterReadings.find(x => x.meterId == id).image?.length>0?true:false;
  }
  getImageLength(id): any {
    return this.interimReadingSelf.meterReadings.find(x => x.meterId == id).image?.length;
  }

  submitOrder(): void {
    if (this.indicatorToAccounting != null) {
      this.interimReadingSelf.date = this.accountingService.userDataSelectedMoveOutDate;
    }


    if(this.indicatorToAccounting){
      this.orderService.AccountingPostInterimReading(this.interimReadingSelf, this.isVacant).subscribe(res => {
        this.handleSubmiteResponse(res);
      },
        (err) => {
          this.toasService.openSnackError(err.error.data?.length > 0 ? err.error.data[0].description : err.error.message);
        }
      );
    }
    else{
      this.orderService.postInterimReading(this.interimReadingSelf, this.isVacant).subscribe(res => {
        this.handleSubmiteResponse(res);
      },
        (err) => {
          this.toasService.openSnackError(err.error.data?.length > 0 ? err.error.data[0].description : err.error.message);
        }
      );
    }
    


    
  }
  handleSubmiteResponse(res){
    if (this.indicatorToAccounting != null) {
      this.translate.get('miscellaneous.addedSuccessfully').subscribe((value) => {
        this.toasService.openSnackSuccessfully(value);
      });
      this.accountingService.savedEnterInterimInd = true;
      this.oldInterimReadingSelf = JSON.stringify(this.interimReadingSelf);
      this.cancelOrder();
    }
    else {
      this.currentStep++;
    }
  }

  updateFlats($event): void {
    this.browserService.setlocalStorage('currentPropertyId', $event);
    this.getFlats(null, false);
    this.currentStep = 1;
    this.displayCard('property');
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //  this.router.navigate(['/orders/enterintermreading']);
    // });
  }
  canDeactivate(): boolean {
    if (this.currentStep == 2 && this.oldInterimReadingSelf != JSON.stringify(this.interimReadingSelf)) {
      return true;
    }
    else { return false; }

  }

  calculateWarningCriteria(id): void {
    let value = this.interimReadingSelf.meterReadings.find(x => x.meterId == id)?.value;
    if (isNullOrUndefined(value) || value == '') {
      return;
    }
    const lastReading = this.interimReadingSelf.meterReadings.find(x => x.meterId == id)?.lastReading;
    if (!isNullOrUndefined(lastReading)) {
      const counterReading = Number(value);
      const twenty = (20 / 100) * Number(lastReading);

      if (this.interimReadingSelf.meterReadings.find(x => x.meterId == id).meterTypeDesc == 'WMZ' ||
        this.interimReadingSelf.meterReadings.find(x => x.meterId == id).meterTypeDesc == 'WWZ' ||
        this.interimReadingSelf.meterReadings.find(x => x.meterId == id).meterTypeDesc == 'KWZ') {
        if (counterReading < Number(lastReading) && this.interimReadingSelf.meterReadings.find(x => x.meterId == id).meterWithResetInd == false) {
          this.interimReadingSelf.meterReadings.find(x => x.meterId == id).error = true;
        }
        else {
          this.interimReadingSelf.meterReadings.find(x => x.meterId == id).error = false;
        }
      }
      else if (counterReading < Number(lastReading) + twenty && counterReading > Number(lastReading) - twenty) {
        this.interimReadingSelf.meterReadings.find(x => x.meterId == id).warning = false;
      }
      else {
        this.interimReadingSelf.meterReadings.find(x => x.meterId == id).warning = true;
      }
    }
  }
  getWarningCriteria(id): any {
    if (this.interimReadingSelf.meterReadings.find(x => x.meterId == id).meterTypeDesc == 'WMZ' ||
      this.interimReadingSelf.meterReadings.find(x => x.meterId == id).meterTypeDesc == 'WWZ' ||
      this.interimReadingSelf.meterReadings.find(x => x.meterId == id).meterTypeDesc == 'KWZ') {
      return false;
    }
    return this.interimReadingSelf.meterReadings.find(x => x.meterId == id).warning;
  }
  getErrorClassCriteria(id): any {
    if (this.firstForm) {
      if (this.firstForm.form.controls['Value' + id] == undefined) {
        return false;
      }
      if (this.firstForm.form.controls['Value' + id].status == 'DISABLED') {
        return false;
      }
      return !this.firstForm.form.controls['Value' + id]?.valid;
    }
    else {
      return false;
    }
  }
  cancelOrder(): void {
    if (this.indicatorToAccounting != null) {
      this.router.navigate(['/accounting/overview/enter/1'], { skipLocationChange: true });
    }
    else {
      this.location.back();
    }
  }
  gotoFlats(event): void {
    this.currentStep = 1;
    this.displayCard('property');
    this.propertyID = this.browserService.getlocalStorage('currentPropertyId');
    this.property = this.browserService.getSessionStorage('userProperties')?.find(
      (p) => p.id === this.propertyID
    );
    this.getFlats(null, false);
  }
  displayCard(type: string): void {
    if (type === 'user') {
      this.showHelloCard = true;
      this.showUserMap = true;
      this.showPropertyCard = false;
      this.showFlatCard = false;
      this.showPropertySearch = false;
    }
    else if (type === 'property') {
      this.showPropertyCard = true;
      this.showFlatCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
    else if (type === 'flat') {
      this.showFlatCard = true;
      this.showPropertyCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
    else {
      this.showPropertyCard = false;
      this.showFlatCard = false;
      this.showUserMap = false;
      this.showHelloCard = false;
      this.showPropertySearch = true;
    }
  }
  getErrorofWater(id): any {
    return this.interimReadingSelf.meterReadings.find(x => x.meterId == id)?.error;
  }
  downloadPDF(): void {
    this.downloadFile(FileName.commonPDF, FilePath.commonPDF);
    this.downloadFile(FileName.WMZPDF, FilePath.WMZPDF);
    this.downloadFile(FileName.WWZORKWZ, FilePath.WWZORKWZ);
    this.downloadFile(FileName.HKVPDF, FilePath.HKVPDF);

  }
  downloadFile(name, path): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = path;
    link.click();
  }
  propertyChange(id): void {
    this.browserService.setlocalStorage('currentPropertyId', id);
    this.gotoFlats(true);
  }
}
