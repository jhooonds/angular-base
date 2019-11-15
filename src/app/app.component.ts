import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "PDCase/TCE-SC";
  public customLayout: boolean;


  constructor() { }

  ngOnInit() {    
    
    document.body.className = 'hold-transition skin-blue sidebar-mini';

  }
}
