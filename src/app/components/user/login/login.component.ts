import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  /*
  En este componente voy a simular un LOGIN ya que no puedo acceder al ENDPOINT
   dado porque mediante HTTP no se puede enviar un BODY dentro de la peticion GET.
  */

  loginForm:FormGroup;
  loading=false;

  tokenMomentaneo:string="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJjaGFsbGVuZ2VAYWxrZW15Lm9yZyIsImlhdCI6MTUxNjIzOTAyMn0.ilhFPrG0y7olRHifbjvcMOlH7q2YwlegT0f4aSbryBE"

  constructor(private fb:FormBuilder,
              private _authService:AuthService,
              private toastr:ToastrService,
              private router:Router
              ) 
  {
    this.loginForm = this.fb.group({
      usuario:['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(2)]]
    })
  }

  ngOnInit(): void {
  }

  almacenarToken(token:string){
    localStorage.setItem('token',token);
    setTimeout(() => {
      this.redireccionar()
    }, 2000);
  }

  redireccionar(){
    if(localStorage.getItem('token')!=''){
      this.router.navigate(['/dashboard']);
    }
  }

  simularLogin(user:string, password:string):void{
    setTimeout(() => {
      if(user==='challenge@alkemy.org' && password==='react'){
        this.almacenarToken(this.tokenMomentaneo);
        this.loading=false;
        this.toastr.success('Are you ready to assemble your dream team? ','WELCOME!')
        this.redireccionar()
      }else{
        this.toastr.error('Oops, an error occured', 'ERROR');
        this.loading=false;
      }
    }, 2000);
  }

  login(){
    const user=this.loginForm.get('usuario')?.value;
    const password=this.loginForm.get('password')?.value;
    this.loading=true;

    this.simularLogin(user,password);

    // this._authService.login(user,password).subscribe(data=>{
    //   this.almacenarToken(data);
    //   this.toastr.success('Are you ready to assemble your dream team? ','WELCOME!')
    //   this.loading=false;
    //   this.redireccionar()
    // },error =>{
    //   console.log(error)
    //   this.loading=false;
    //   this.toastr.error('Oops, an error occured', 'ERROR');
    // })

  }

}
