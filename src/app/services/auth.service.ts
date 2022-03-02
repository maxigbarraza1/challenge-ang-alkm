import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }



  login(user:string,password:string):Observable<any>{
    let httpHeaders = new HttpHeaders().set('Accept','application/json');
    let httpParams = new HttpParams().set('email',user).set('password',password);
    console.log(httpParams.toString());
    console.log(httpHeaders.keys());
    return this.http.get<any>('http://challenge-react.alkemy.org/')
  }
}
