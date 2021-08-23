import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy  {
  title = 'dotx-portal-ui';
  subscription: Subscription[] = [];

  constructor(
    private elementRef: ElementRef,
  ) {

  }

  ngOnInit(): void {
    this.elementRef.nativeElement.removeAttribute('ng-version');
  }
  ngOnDestroy(): void {
    if (this.subscription && this.subscription.length > 0) {
      this.subscription.forEach(sub => sub.unsubscribe());
    }
  }
}
