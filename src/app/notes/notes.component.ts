import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.css"]
})
export class NotesComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService) {}

  userIsAuthen = false;
  private authListSub: Subscription;

  ngOnInit() {
    this.userIsAuthen = this.auth.getIsAuth();
    this.authListSub = this.auth.getAuthStatusList().subscribe((isAuth) => {
      if (isAuth) {
        this.userIsAuthen = true;
      } else {
        this.userIsAuthen = false;
      }
      console.log('Notes listener ' + this.userIsAuthen);
    });
  }
  ngOnDestroy(): void {
    this.authListSub.unsubscribe();
  }
}
