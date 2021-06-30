import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SystemSettingsService } from '../../services/system-settings.service';
import { SettingsTableDataSource } from '../../settings/system-settings-table/settings-table-datasource';
import { SystemSettings } from '../../models/system-settings-model';

@Component({
  selector: 'app-system-settings-table',
  templateUrl: './system-settings-table.component.html',
  styleUrls: ['./system-settings-table.component.scss'],
})
export class SystemSettingsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<SystemSettings>;
  dataSource: SettingsTableDataSource;
  @Input() category = 'all';
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  @Output() editEvent = new EventEmitter<SystemSettings>();
  sortBy = 'code';
  sortDirection = 'asc';
  list: SystemSettings[];
  public categoryvalue: '';
  public editrow: any;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  displayedColumns = [
    'code',
    'settingCategory',
    'displayName',
    'value',
    'description',
    'id',
  ];
  constructor(public systemSettingsService: SystemSettingsService) {}
  ngOnInit(): void {
    this.getAll();
  }

  onPageChange($event): void {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getAll();
  }
  getAll(): void {
    this.systemSettingsService
      .Get(this.pageIndex, this.pageSize, this.sortBy, this.sortDirection)
      .subscribe((data) => {
        this.list = data.data.items;
        this.dataSource = new SettingsTableDataSource(data.data.items);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.length = data.data.totalRecords;
        this.table.dataSource = this.dataSource;
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((m) => {
      console.log(m);
      if (m.direction !== this.sort.start || m.direction !== 'asc') {
        this.sortBy = m.active;
        this.sortDirection = m.direction === '' ? 'asc' : m.direction;
        this.getAll();
      }
    });
  }
  Edit(id): void {
    this.editEvent.emit(this.list.filter(x => x.id == id)[0]);
  }
}
