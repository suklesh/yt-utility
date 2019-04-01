import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from '../data-handler.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(public searchInfo: DataHandlerService, private router: Router) {}

  searchData = '';

  triggerSearch(searchData: string) {
    // Add code to check for null value
    // call service to send searchData to express app
    this.searchInfo.searchInput(searchData);
    this.router.navigate(['/results']);
  }
  ngOnInit() {
  }

}
