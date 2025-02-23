import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
 @Input() collapsed = false;
 @Input() screenWidth = 0;

  constructor() { }

  // getBodyClass():string{
  //   let styleClass ='';
  //   if(this.collapsed && this.screenWidth > 768){
  //     styleClass = 'body-trimmed'
  //   }
  //   else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0 ){
        
  //     styleClass = 'body-md-screen'
  //   }
  //   return '';


  // }
  getBodyClass(): string {
    if (this.collapsed && this.screenWidth > 768) {
      return 'body-trimmed'; // Side nav étendu sur grands écrans
    } else if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      return 'body-md-screen'; // Side nav étendu sur petits écrans
    }
    return ''; // Par défaut (side nav réduit)
  }



  ngOnInit(): void {
  }


}
