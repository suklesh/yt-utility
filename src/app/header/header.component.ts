import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from '../data-handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private service: DataHandlerService) { }

  resultPage: boolean;
  indicator = '';

  toggleLogoSearch() {
    this.resultPage = false;
  }

  ngOnInit() {
    this.resultPage = false;
    this.service.resultPageInd()
    .subscribe((indicator) => {
      if (indicator === 'started') {
        this.resultPage = true;
        console.log(this.resultPage);
      }
    });
  }

}
