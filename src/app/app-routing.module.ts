import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './error404/error404.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { TemplatesComponent } from './templates/templates.component';
import { HowtouserComponent } from './howtouser/howtouser.component';

const routes: Routes = [
  { path: '', redirectTo: 'Projects', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'dashbord', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'how-to-use', component: HowtouserComponent },
  { path: 'login', component: LoginComponent },
  { path: '**' , component: Error404Component },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
