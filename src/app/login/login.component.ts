import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
isLoading = false;
onLogin(form: NgForm) {
console.log(form.value);
if(form.invalid) {
  return;
}
this.auth.login(form.value.email, form.value.password);
//this.router.navigate(['/']);
}
  constructor(private auth: AuthService, private router: Router) { }
  ngOnInit() {
  }
}
