import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Meter } from 'src/app/modules/stock-overview/models/meter.model';
import { StockOverviewService } from 'src/app/modules/stock-overview/stock-overview.service';
import { FileName, FilePath, MeterType } from 'src/app/shared/Constant/PDF';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
import { DefaultDataService } from 'src/app/shared/services/defaultData.service';
import { OrderPlumbingRequest } from '../../models/order-plumbing-request.model';

@Component({
  selector: 'app-order-plumbing-table-two',
  templateUrl: './order-plumbing-table-two.component.html',
  styleUrls: ['./order-plumbing-table-two.component.scss']
})
export class OrderPlumbingTableTwoComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<Meter>;
  dataSource: MatTableDataSource<Meter>;
  @Input() orderPlumbingRequestNew = new OrderPlumbingRequest();
  @Input() orderPlumbingRequestCurrent = new OrderPlumbingRequest();
  @ViewChild('summaryForm') summaryForm;
  currentMeter: Meter[] = [];
  meterType: string;
  building: any;
  currentDate = new Date();
  @Input() meter = new Meter();
  plumbingLevel = '';
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [];

  /**
   *
   */
  constructor(
    private browserService: BrowserStorageService,
    private stockOverviewService: StockOverviewService,
    private defaultData: DefaultDataService) {
  }
  ngOnInit(): void {
    this.plumbingLevel = this.browserService.getlocalStorage('plumbingLevel');
    if (this.plumbingLevel == 'MyOrderFloatFlat' || this.plumbingLevel == 'Flat') {
      this.displayedColumns = ['tehalgno', 'adminlgno', 'tehauserno', 'adminuserno', 'reason', 'address', 'date'];
    }
    else {
      this.displayedColumns = ['tehalgno', 'adminlgno', 'meterserial', 'meterty', 'reason', 'location', 'address', 'date'];
    }
    this.currentMeter.push(this.stockOverviewService.meterData?.find(m => m.id === this.orderPlumbingRequestNew.meterIds[0]));
    this.dataSource = new MatTableDataSource(this.currentMeter);
    this.meterType = this.defaultData.DefaultData.lookUps.measuringInstrumentType.find(
      (mt) => mt.value === this.currentMeter[0]?.meterTypeDesc
    )?.code;
    const properties = this.browserService.getSessionStorage('userProperties');
    this.building = properties?.find(
      (p) => p.id === this.browserService.getlocalStorage('currentPropertyId')
    );

  }
  showFullMeter(meterType: string): string {
    return this.defaultData.DefaultData.lookUps.measuringInstrumentType.find(
      (mt) => mt.value === meterType
    )?.code;
  }
  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
  }
  downloadPDF(): void {
    this.downloadFile(FileName.commonPDF, FilePath.commonPDF);

    const selectedMeter = this.stockOverviewService.meterData?.find(x => x.id == this.orderPlumbingRequestNew.meterIds[0]);
    if (selectedMeter?.meterTypeDesc == MeterType.WMZ) {
      this.downloadFile(FileName.WMZPDF, FilePath.WMZPDF);
    }
    else if (selectedMeter?.meterTypeDesc == MeterType.HKV) {
      this.downloadFile(FileName.HKVPDF, FilePath.HKVPDF);
    }
    else if (selectedMeter?.meterTypeDesc == MeterType.WWZ || selectedMeter?.meterTypeDesc == MeterType.KWZ) {
      this.downloadFile(FileName.WWZORKWZ, FilePath.WWZORKWZ);
    }

  }
  downloadFile(name, path): void {
    const link = document.createElement('a');
    link.download = name;
    link.href = path;
    link.click();
  }
}
