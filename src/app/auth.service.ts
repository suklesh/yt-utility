import { Injectable } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject, TimeoutError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private token: string;
  private authStatusList = new Subject<boolean>();
  private isAuthent = false;

  getToken() {
    return this.token;
  }

  getAuthStatusList() {
    return this.authStatusList.asObservable();
  }

  getIsAuth() {
    return this.isAuthent;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post("http://localhost:3000/api/auth/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{token: string}>("http://localhost:3000/api/auth/login", authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token) {
          this.isAuthent = true;
          this.authStatusList.next(true);
          this.saveAuthSession(token);
        this.router.navigate(['/']);
        }

      });
  }

  logout() {
    this.token = null;
    this.isAuthent = false;
    this.authStatusList.next(false);
    this.clearAuthSession();
    this.router.navigate(['/']);
  }

  private saveAuthSession(token: string) {
    localStorage.setItem('token', token);
    //localStorage.setItem('exp', expDate.toISOString());
  }
  private clearAuthSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
  }

}
