import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminHelperService } from './admin-helper.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscriptions: Subscription[] = [];
  constructor(private adminService: AdminHelperService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.adminService.getLoading().subscribe(res => this.isLoading = res)
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }
}
