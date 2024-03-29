import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  isLoading = false;

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.createUser(form.value.email, form.value.password);
    //this.authService.createUser("test@gmail.com", "testPassword");
  }

  constructor(public authService: AuthService) {}

  ngOnInit() {}
}
