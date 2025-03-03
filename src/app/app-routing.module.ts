

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { TemplatesComponent } from './templates/templates.component';
import { HowtouserComponent } from './howtouser/howtouser.component';
import { LoginComponent } from './login/login.component';
import { Error404Component } from './error404/error404.component';
import { WithSidenavLayoutComponent } from './with-sidenav-layout/with-sidenav-layout.component';
import { ProjectLayoutComponent } from './project-layout/project-layout.component';
import { DragdropComponent } from './dragdrop/dragdrop.component';
import { TableCompComponent } from './composant/table-comp/table-comp.component';
import { Test00Component } from './test00/test00.component';


const routes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },

  // Routes avec side nav
  {
    path: '',
    component: WithSidenavLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'dashbord', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'templates', component: TemplatesComponent },
      { path: 'how-to-use', component: HowtouserComponent },
      { path: 'login', component: LoginComponent },
    ]
  },

  // Route sans side nav (pour prototype-ui)
  // {
  //   path: '/projet/id',
  //   /* component: ProjectLayoutComponent, */
  //   children: [
  //     { path: '', component: ProjectLayoutComponent }
  //   ]
  // },

  
  { path: 'projet', component: ProjectLayoutComponent },
  { path: 'comp', component: DragdropComponent },
  { path: 't', component: TableCompComponent },
  { path: 'test', component: Test00Component },


  // Route générique pour les erreurs 404
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}