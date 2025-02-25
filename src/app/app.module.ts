import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { TableCompComponent } from './composant/table-comp/table-comp.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Error404Component } from './error404/error404.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatListModule } from '@angular/material/list';
import { Sidenav2Component } from './sidenav2/sidenav2.component';
import { BodyComponent } from './body/body.component';
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectsComponent } from './projects/projects.component';
import { TemplatesComponent } from './templates/templates.component';
import { HowtouserComponent } from './howtouser/howtouser.component';
import { HeaderComponent } from './header/header.component';
import { PrototypeUiComponent } from './prototype-ui/prototype-ui.component';
import { WithSidenavLayoutComponent } from './with-sidenav-layout/with-sidenav-layout.component';
import { FullscreenLayoutComponent } from './fullscreen-layout/fullscreen-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { WorkspaceComponent } from './workspace/workspace.component'; 
import { MatTooltipModule } from "@angular/material/tooltip";






@NgModule({
  declarations: [
    AppComponent,
    TableCompComponent,
    HomeComponent,
    LoginComponent,
    Error404Component,
    Sidenav2Component,
    BodyComponent,
    UsersComponent,
    DashboardComponent,
    ProjectsComponent,
    TemplatesComponent,
    HowtouserComponent,
    HeaderComponent,
    PrototypeUiComponent,
    WithSidenavLayoutComponent,
    FullscreenLayoutComponent,
    NavbarComponent,
    WorkspaceComponent
   
   
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    AppRoutingModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
  
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports : [MatIconModule]
})
export class AppModule { }
