import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.scss'],
})
export class NewsCardComponent implements OnInit, OnChanges {
  @Input() news: any[];
  selected: any;
  constructor() { }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    // Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    // Add '${implements OnChanges}' to the class.
    
    if (!this.selected && this.news) {
      // this.news.push({
      //   date: '2021-05-23',
      //   description: 'LoremIpsum : doler sit emit lorem ipsem gmbh emit',
      //   referenceLink: 'http://google.com'
      // })
      this.selected = {
        news: this.news[0],
        index: 0,
      };
    }
    console.log('news', this.news);
    
  }

  getHeading(): string {
    if (this.selected?.news.description){
      return this.selected?.news.description.split(':')[0] + ' :';
    }
    return '';
  }
  
  getDescription(): string {
    if (this.selected?.news.description){
      return this.selected?.news.description.split(':')[1];
    }
    return '';
  }
  
  checkDisabled(direction: string): boolean {
    if (direction === 'n') {
      if (this.selected?.index === this.news?.length - 1) {
        return true;
      } 
    } else {
      if (this.selected?.index === 0) {
        return true;
      }
    }
    return false;
  }

  toggle(direction: string): void {
    if (direction === 'p') {
      if (this.selected.index === 0) {
        return;
        //this.selected.news = this.news[this.news.length - 1];
        //this.selected.index = this.news.length - 1;
      } else {
        this.selected.news = this.news[--this.selected.index];
      }
    } else {
      if (this.selected.index === this.news.length - 1) {
        return;
        //this.selected.news = this.news[0];
        //this.selected.index = 0;
      } else {
        this.selected.news = this.news[++this.selected.index];
      }
    }
  }
}
