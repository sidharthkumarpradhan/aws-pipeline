import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToDashboard(): void {
    this.router.navigate(['main-route/student/home']);
  }

}
