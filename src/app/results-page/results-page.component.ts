import { Component, OnInit } from "@angular/core";
import { DataHandlerService } from "../data-handler.service";

@Component({
  selector: "app-results-page",
  templateUrl: "./results-page.component.html",
  styleUrls: ["./results-page.component.css"]
})
export class ResultsPageComponent implements OnInit {
  indicator = "started";
  public YT: any;
  public video: string;
  public videoID: string;
  public player: any;
  public reframed: Boolean = false;
  public resultData: object;
  public title: string;
  public desc: string;
  captionCheck = true;
  constructor(private service: DataHandlerService) {}
  init() {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = "iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  ngOnInit() {
    this.service.resultsUpdate().subscribe((data: object) => {
      this.resultData = data;
      this.video = this.resultData[0].contentInfo.id;
      this.title = this.resultData[0].contentInfo.snippet.title;
      this.desc = this.resultData[0].contentInfo.snippet.description;

      if (this.resultData[0].captionsAvailable === 'false') {
        this.captionCheck = false;
      }
      // Load iframe below
      if (document.getElementById("iframe_api") === null) {
        console.log("Window Not loaded");
        this.loadWindow();
      } else {
        console.log("Window loaded");
        this.reLoadWindow(this.video);
      }
    });
    this.service.resultPageStarted(this.indicator);
  }
  reLoadWindow(video: string) {
    this.service.inputValue().subscribe((data: string) => {
      this.video = data;
    });
    console.log("Right outside the window");
    console.log(" inside the window " + this.video);
    this.YT = window["YT"];
    this.player = new window["YT"].Player("player", {
      videoId: video,
      height: "100%",
      width: "100%",
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this),
        onReady: e => {
          e.target.a;
        }
      },
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showInfo: 1
      }
    });
  }
  loadWindow() {
    this.init();
    console.log("Iframe initiated");
    this.service.inputValue().subscribe((data: string) => {
      this.video = data;
    });
    console.log("Right outside the window");
    window["onYouTubeIframeAPIReady"] = e => {
      console.log(" inside the window " + this.video);
      this.YT = window["YT"];
      this.player = new window["YT"].Player("player", {
        videoId: this.video,
        height: "100%",
        width: "100%",
        events: {
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this),
          onReady: e => {
            e.target.a;
          }
        },
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showInfo: 1
        }
      });
    };
  }
  onPlayerStateChange(event) {
    console.log(event);
    switch (event.data) {
      case window["YT"].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log("started " + this.cleanTime());
        } else {
          console.log("playing " + this.cleanTime());
        }
        break;
      case window["YT"].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log("paused" + " @ " + this.cleanTime());
        }
        break;
      case window["YT"].PlayerState.ENDED:
        console.log("ended ");
        break;
    }
  }
  cleanTime() {
    return Math.round(this.player.getCurrentTime());
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

  /*   constructor() { }

  ngOnInit() {
  } */
}
