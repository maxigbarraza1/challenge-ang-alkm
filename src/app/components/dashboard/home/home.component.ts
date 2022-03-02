import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeroesService } from 'src/app/services/heroes.service';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface stat {
  name:string,
  value:number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
  
})
export class HomeComponent implements OnInit,OnDestroy {

  searchResult:any[]=[];
  myTeam:any[]=[];

  closeResult='';
  loading=false
  
  globalStats:stat[]=[
    {name:"intelligence",value:0},
    {name:"strength",value:0},
    {name:"speed",value:0},
    {name:"durability",value:0},
    {name:"power",value:0},
    {name:"combat",value:0},
  ];

  hashMapStats = new Map([
    ["intelligence", 0],
    ["strength", 0],
    ["speed", 0],
    ["durability", 0],
    ["power", 0],
    ["combat", 0],
  ])

  count_evilHeros:number=0;
  count_goodHeros:number=0;
  count_neutralHeros:number=0;
  count_noneHeros:number=0;

  public AVGWeight:number=0;
  public AVGHeight:number=0;

  heroesSubscription:Subscription= new Subscription()

  searchForm: FormGroup;


  constructor(private _heroesService:HeroesService,
              private ngBStrapModalService:NgbModal,
              private fb:FormBuilder,
              private toastr:ToastrService){
    this.searchForm = this.fb.group({
      input:['',[Validators.required, Validators.minLength(1)]]
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.heroesSubscription.unsubscribe()
  }

  search():void{
    if(!this.searchForm.get('input')?.hasError('required')){
      const input=this.searchForm.get('input')?.value;
      this.loading=true;
      this.searchResult=[]
      this.heroesSubscription=this._heroesService.searchHeroes(input).subscribe(data=>{
        if(data.response === 'success'){
          this.searchResult=data.results;
          this.loading=false;
        }
      },error=>{
        console.log(error);
        this.loading=false;
      })
    }

  }

  guardarEstadisticasGlobales():void{
    let array:any=[];
    for(let [key,value] of this.hashMapStats){
      array.push({
        name:key,
        value:value,
      });
    }
    this.globalStats=array.sort(function(a:any,b:any){
      return (a.value! < b.value!) ? 1 : ((b.value! < a.value!) ? -1 : 0);
    })

  }

  openModal(content:any) {
    this.ngBStrapModalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getDenominador():number{
    if(this.myTeam.length===0){
      return 1;
    }else{
      return this.globalStats[0].value;
    }
  }

  getNumerador(index:number):number{
    if(this.globalStats[index].value>0){
      return this.globalStats[index].value
    }else{
      return 0;
    }
  }

  
  updateStatsHashValue(param:string, value:number, suma:boolean){
    let valorAnterior=this.hashMapStats.get(param) || 0;
    let valorNuevo:number=0;
    if(value>0){
      valorNuevo=Number(value);
    }
    if(suma){
      valorAnterior+=valorNuevo;
    }else{
      if((valorAnterior-Number(value))<0){
        valorAnterior=0;
      }else{
        valorAnterior-=valorNuevo;
      }
    }
    this.hashMapStats.set(param,valorAnterior);
  }

  updateStatsHash(hero:any, suma:boolean){
    this.updateStatsHashValue('intelligence', hero.powerstats.intelligence,suma);
    this.updateStatsHashValue('strength', hero.powerstats.strength,suma);
    this.updateStatsHashValue('speed', hero.powerstats.speed,suma);
    this.updateStatsHashValue('durability', hero.powerstats.durability,suma);
    this.updateStatsHashValue('power', hero.powerstats.power,suma);
    this.updateStatsHashValue('combat', hero.powerstats.combat,suma);

    this.guardarEstadisticasGlobales();
  }

  addToMyTeam(hero:any){
    if(this.myTeam.includes(hero)){
      this.toastr.error('You already have it in your team','ERROR')
      return
    }

    if(this.myTeam.length===6){
      this.toastr.warning('You already completed the team')
      return
    }
    
    switch (hero.biography.alignment) {
      case 'good':
        if(this.count_goodHeros<3){
          this.myTeam.push(hero);
          this.updateStatsHash(hero,true);
          this.count_goodHeros+=1;
          this.setPromedios();
        }else{
          this.toastr.warning('You can only have a maximum of 3 Good heroes in your team')
          return
        }
        break;

      case 'bad':
        if(this.count_evilHeros<3){
          this.myTeam.push(hero);
          this.count_evilHeros+=1;
          this.updateStatsHash(hero,true);
          this.setPromedios();
        }else{
          this.toastr.warning('You can only have a maximum of 3 Evil heroes in your team')
          return
        }
        break;
        
      default:
        this.toastr.warning('You cannot add heroes to your team that are not BAD/GOOD')
        break;
    }

  }

  deleteHero(hero:any){
    let nuevoArreglo=this.myTeam.filter((teamHero)=>teamHero.id != hero.id)
    this.myTeam=nuevoArreglo;
    this.updateStatsHash(hero,false);
    this.setPromedios();
    switch (hero.biography.alignment) {
      case 'good':
          this.count_goodHeros-=1;
        break;

      case 'bad':
          this.count_evilHeros-=1;
        break;
      default:
        break;
    }
  }

  setPromedios():void{
    let altura:number=0;
    let peso:number=0;
    if(this.myTeam.length>0){
      let pesoString:string='';
      let alturaString:string='';
      this.myTeam.forEach(element => {
        pesoString=element.appearance.weight[1].split(' ');
        peso+=parseInt(pesoString[0]);

        alturaString=element.appearance.height[1].split(' ');
        altura+=parseInt(alturaString[0]);
      });
      altura=(altura/this.myTeam.length)
      peso=(peso/this.myTeam.length)
    }
    this.AVGHeight=altura;
    this.AVGWeight=peso;
  }

}
