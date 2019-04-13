import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { DataHandlerService } from "../data-handler.service";
import { Subscription } from "rxjs";
import { ResultsPageComponent } from "../results-page/results-page.component";

@Component({
  selector: "app-caption-search",
  templateUrl: "./caption-search.component.html",
  styleUrls: ["./caption-search.component.css"]
})
export class CaptionSearchComponent implements OnInit, OnDestroy {
  // Parent Child message implemented below. https://www.intersysconsulting.com/blog/angular-components/
  @Input() message: string;
  constructor(
    private service: DataHandlerService,
    private resultPage: ResultsPageComponent
  ) {}
  private serviceSub: Subscription;
  public captionResults: object;
  public captionsRec = true;
  public vidID: string;
  public numbBut: any;
  // @Output() captionMessage = new EventEmitter<string>();

  searchWord = "";
  buttonValue = "";
  captionsData = [];
  resultMessage: string;
  regularDistribution = 100 / 3;
  //vid = "9oWOsocN7qg";

  onSearchClick() {
    // this.service.getCaptionsData(this.vidID);
    console.log(this.message);
    this.captionResults = this.service.getCaptionsData(
      this.message,
      this.searchWord
    );

    this.serviceSub = this.service
      .captionDataRecieved()
      .subscribe((data: object) => {
        this.captionResults = data[0];
        const length = data[0].length;
        this.numbBut = Object.keys(this.captionResults);
        console.log(this.captionResults);
        if (length == 0) {
          this.captionsRec = false;
          this.resultMessage = "No Results";
          console.log(this.resultMessage);
        } else {
          this.resultMessage = "";
        }
      });
  }

  updateIframesPram(caption: any) {
    console.log(caption);
    this.resultPage.seekTo(caption);
    //return this.captionMessage.emit(caption);
  }

  millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + seconds;
  }

  ngOnInit() {
    this.service.getVidID().subscribe(vid => {
      this.vidID = vid;
      console.log("Got the Log ID" + this.vidID);
    });
  }

  ngOnDestroy() {
    //this.serviceSub.unsubscribe();
  }
}
