import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path:'user', loadChildren:() => import('./components/user/user.module').then(m=>m.UserModule)},
  {path:'dashboard', component: DashboardComponent ,loadChildren:() => import('./components/dashboard/dashboard.module').then(m=>m.DashboardModule), canActivate:[AuthGuard]},
  {path:'**', redirectTo: 'user', pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
