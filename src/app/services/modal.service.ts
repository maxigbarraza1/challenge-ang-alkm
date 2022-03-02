import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  public open:boolean=false;

  public popup: Subject<any> = new Subject<any>();

  constructor() { }
}
