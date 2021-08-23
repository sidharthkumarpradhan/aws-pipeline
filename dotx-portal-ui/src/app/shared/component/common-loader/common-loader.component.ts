import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: '<div class="loader">Loading...</div>'
})
export class CommonLoaderComponent implements OnInit {
  @Input() isTableLoader: boolean;
  isTableLoaderSelected: boolean;
  
  constructor() { }

  ngOnInit() {
    this.isTableLoaderSelected = !!this.isTableLoader;
  }

}
