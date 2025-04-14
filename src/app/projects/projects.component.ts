import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  activeBar : boolean = false;

  constructor(private router: Router) {}

  navigateToNewProject(): void {
    this.router.navigate(['/projet']); 
  }

  navigateToNewTemplates(): void {
    this.router.navigate(['/templates']); 
  }


  
  ngOnInit(): void {
  }

  settingsBar() {
    this.activeBar = !this.activeBar;
  }
}
