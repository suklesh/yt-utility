import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { environment } from '../../src/environments/environment';

const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  constructor(private http: HttpClient) {}
  private resultPageLoaded = new Subject<string>();
  private displayInputValue = new Subject<string>();
  private vidID = new Subject<string>();
  private resultData = {};
  private resultsReceived = new Subject<object>();
  private captionData: object;
  private captionsReceived = new Subject<object>();

  searchInput(inputValue: string) {
    this.getData(this.getvID(inputValue));
    this.displayInputValue.next(this.getvID(inputValue));
  }
  getvID(str) {
    // return the videoID from the entered youtube Url
    return str.split("=").pop();
  }

  getData(v: string) {
    this.http
      .get<{ results: {} }>(BACKEND_URL + '/videoInfo?v=' + v) // search data passed to express as query param
      .subscribe(resultsData => {
        this.resultData = resultsData;
        console.log(this.resultData);
        this.resultsReceived.next([this.resultData]); // for observable
      });
  }
  // 'http://localhost:3000/api/getCaptionInfo?v=' + searchData NOTE THIS FOR USING IN the Word Search API

  getCaptionsData(vID: string, searchInput: string) {
    //var vID = "9oWOsocN7qg";
    //searchInput = "here";
    this.http
      .get<{ results: {} }>(
        BACKEND_URL + '/getCaptionInfo?v=' + vID + '&str=' + searchInput
      )
      .subscribe(data => {
        this.captionData = data;
        this.captionsReceived.next([this.captionData]);
      });
    return this.captionData;
  }

  captionDataRecieved() {
    return this.captionsReceived.asObservable();
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

  broadCastVidID(str: string) {
    //console.log("Got Vid ID " + str);
    this.vidID.next(str);
  }
  getVidID() {
    return this.vidID.asObservable();
  }
}
