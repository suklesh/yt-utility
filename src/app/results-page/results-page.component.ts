import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataHandlerService } from "../data-handler.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-results-page",
  templateUrl: "./results-page.component.html",
  styleUrls: ["./results-page.component.css"]
})
export class ResultsPageComponent implements OnInit, OnDestroy {
  private serviceSub: Subscription;
  indicator = "started";
  public YT: any;
  public video: string;
  public videoID: string;
  public player: any;
  public reframed: Boolean = false;
  public resultData: object;
  public title: string;
  public desc: string;

  captionCheck: boolean;

  constructor(private service: DataHandlerService) {}
  init() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = "iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  ngOnInit() {
    this.serviceSub = this.service.resultsUpdate().subscribe((data: object) => {
      this.resultData = data;
      this.video = this.resultData[0].contentInfo.id;
      this.videoID = this.video;
      this.service.broadCastVidID(this.video); // broadcast the VidID for elements within the results page
      this.title = this.resultData[0].contentInfo.snippet.title;
      this.desc = this.resultData[0].contentInfo.snippet.description;

      if (this.resultData[0].captionsAvailable == "false") {
        this.captionCheck = false;
      } else if (this.resultData[0].captionsAvailable == "true") {
        this.captionCheck = true;
      }
      // Load iframe below
      if (document.getElementById("iframe_api") === null) {
        this.loadWindow();
      } else {
        //this.reLoadWindow(this.video);
      }
    });
    this.service.resultPageStarted(this.indicator);
  }
  reLoadWindow(video: string) {
    this.service.inputValue().subscribe((data: string) => {
      this.video = data;
    });
    // this.YT = window["YT"];
    this.player = new window["YT"].Player("player", {
      videoId: this.video,
      height: "100%",
      width: "100%",
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this),
        onReady: this.onPlayerReady
      }
      /* playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showInfo: 1
      } */
    });
  }
  loadWindow() {
    this.init();
    this.service.inputValue().subscribe((data: string) => {
      this.video = data;
    });
    window["onYouTubeIframeAPIReady"] = e => {
      this.YT = window["YT"];
      this.player = new window["YT"].Player("player", {
        videoId: this.video,
        height: "100%",
        width: "100%",
        events: {
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this),
          onReady: this.onPlayerReady
        }
        /* playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showInfo: 1
        } */
      });
    };
  }
  onPlayerStateChange(event) {
    if (event.data == this.YT.PlayerState.PLAYING) {
    }
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  seekTo(sec) {
    const timer = sec/1000;
    console.log("Entered the player and setting to " + timer);
    this.player.seekTo(timer, true);
  }

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log("" + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }

  ngOnDestroy() {
    this.serviceSub.unsubscribe();
  }

  /*   constructor() { }

  ngOnInit() {
  } */
}
