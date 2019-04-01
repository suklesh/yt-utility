import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataHandlerService {
  constructor(private http: HttpClient) {}
  private resultPageLoaded = new Subject<string>();
  private displayInputValue = new Subject<string>();
  private resultData = {};
  private resultsReceived = new Subject<{}>();

  searchInput(inputValue: string) {
    this.getData(inputValue);
    this.displayInputValue.next(inputValue);
  }

  getData(searchData: string) {
    this.http
      .get<{ message: string; results: {} }>(
        'http://localhost:3000/api/getCaptionInfo?v=' + searchData
      ) // search data passed to express as query param
      .subscribe(resultsData => {
        this.resultData = resultsData.results;
        console.log(this.resultData);
        // this.resultsReceived.next([...this.resultData]); // for observable
      });
  }

  resultsUpdate() {
    return this.resultsReceived.asObservable();
  }
  resultPageStarted(resPageInd: string) {
    this.resultPageLoaded.next(resPageInd);
  }
  resultPageInd() {
    return this.resultPageLoaded.asObservable();
  }

  inputValue() {
    return this.displayInputValue.asObservable();
  }
}
