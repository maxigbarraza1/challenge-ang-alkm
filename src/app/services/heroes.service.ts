import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  //La API no me deja ingresar con mi cuenta de Facebook
  //El soporte me dio un token para poder utilizarla.
  tokenHeroApi:string='10227816847035198';
  
  constructor(private http:HttpClient,) 
  { 
  }

  searchHeroes(name:string):Observable<any>{
    return this.http.get<any>("api/"+this.tokenHeroApi+"/search/"+name);
  }

  getHeroById(id:string):Observable<any>{
    return this.http.get<any>("/api/"+this.tokenHeroApi+"/"+id)
  }

}
