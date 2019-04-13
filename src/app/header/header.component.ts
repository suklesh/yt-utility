import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { DataHandlerService } from "../data-handler.service";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private auth: AuthService,
    private router: Router,
    private service: DataHandlerService
  ) {}
  private authListSub: Subscription;
  userIsAuthen = false;
  resultPage: boolean;
  indicator = "";
  vidID = "";

  toggleLogoSearch() {
    this.resultPage = false;
  }

  onLogout() {
    console.log("Clicked logout");
    this.auth.logout();
  }

  ngOnInit() {
    this.resultPage = false;
    this.service.resultPageInd().subscribe(indicator => {
      console.log(indicator);
      if (indicator === "started") {
        this.resultPage = true;
        console.log(this.resultPage);
      }
    });

    this.service.getVidID().subscribe(vid => {
      this.vidID = vid;
    });

    this.authListSub = this.auth.getAuthStatusList().subscribe((isAuth) => {
      this.userIsAuthen = isAuth;
      console.log("Header listener");
    });
  }

  ngOnDestroy(): void {
    this.authListSub.unsubscribe();
  }
}
