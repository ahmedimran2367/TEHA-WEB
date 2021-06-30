
import { AfterViewInit, Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { LanguageSetting } from '../models/language-setting-model';
import { LanguageSettingService } from '../services/language-setting.service';
import { LanguageTableDataSource } from '../language-table/language-table-datasource';
import { BrowserStorageService } from 'src/app/shared/services/browser-storage/browser-storage.service';
@Component({
  selector: 'app-language-table',
  templateUrl: './language-table.component.html',
  styleUrls: ['./language-table.component.scss']
})
export class LanguageTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<LanguageSetting>;
  dataSource: LanguageTableDataSource;
  @Input() category = 'all';
  @Input() freeSearch = '';
  @Input() pageIndex = 0;
  @Input() pageSize = 10;
  sortBy = 'code';
  sortDirection = 'asc';
  list: LanguageSetting[];
  public categoryvalue: '';
  public editrow: any;
  @Output() editEvent = new EventEmitter<LanguageSetting>();
  @Input('category') public categoryObject;

  @Input() data;

  @Input() isEdited: any;
  @Input() isBacked: any;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'code',
    'category',
    'english',
    'german',
    'id'
  ];
  constructor(private languageService: LanguageSettingService, private browserService: BrowserStorageService) {
    if (this.browserService.getlocalStorage('pageIndex') == null && this.browserService.getlocalStorage('pageSize') == null) {
      this.browserService.setlocalStorage('pageIndex', this.pageIndex);
      this.browserService.setlocalStorage('pageSize', this.pageSize);
    }
  }
  ngOnInit(): void {
    if (this.categoryObject) {
      this.category = this.categoryObject;
    }
    this.getAll(this.category, this.freeSearch);

    if (this.browserService.getlocalStorage('pageIndex') != null && this.browserService.getlocalStorage('pageSize') != null) {
      this.pageIndex = this.browserService.getlocalStorage('pageIndex');
      this.pageSize = this.browserService.getlocalStorage('pageSize');
    }
    this.isBacked = false;
  }
  onPageChange($event): void {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.browserService.setlocalStorage('pageIndex', this.pageIndex);
    this.browserService.setlocalStorage('pageSize', this.pageSize);
    this.getAll(this.category, this.freeSearch);

  }
  getAll(category: string, freeSearch: string): void {
    // if (this.isEdited) {
    if (this.browserService.getlocalStorage('pageIndex') != null && this.browserService.getlocalStorage('pageSize') != null) {
      this.pageIndex = this.browserService.getlocalStorage('pageIndex');
      this.pageSize = this.browserService.getlocalStorage('pageSize');
    }
    // }
    this.category = category;
    this.freeSearch = freeSearch;
    this.languageService
      .Get(
        this.category,
        this.freeSearch,
        this.pageIndex,
        this.pageSize,
        this.sortBy,
        this.sortDirection
      )
      .subscribe((data) => {
        this.list = data.data.items;
        this.dataSource = new LanguageTableDataSource(data.data.items);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.length = data.data.totalRecords;
        this.table.dataSource = this.dataSource;
        this.isEdited = false;
      });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe((m) => {
      if (m.direction !== this.sort.start || m.direction !== 'asc') {
        this.sortBy = m.active;
        this.sortDirection = m.direction === '' ? 'asc' : m.direction;
        this.getAll(this.category, this.freeSearch);
      }
    });
  }
  Edit(id): void {
    this.editEvent.emit(this.list.filter(x => x.id == id)[0]);
  }
  applyFilter(filterValue: string): void {
    this.pageIndex = 0;
    this.browserService.setlocalStorage('pageIndex', 0);
    this.getAll(this.category, filterValue);
  }
}
