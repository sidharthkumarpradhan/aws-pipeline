import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AuthState } from 'src/app/store/auth.model';
import { userResponse } from 'src/app/store/auth.selector';
import { DotUserSkillsService } from '../../dot-user-skills/dot-user-skills.service';

@Component({
  selector: 'app-write-yourself',
  templateUrl: './write-yourself.component.html',
  styleUrls: ['./write-yourself.component.scss']
})
export class WriteYourselfComponent implements OnInit {
  aboutMe = '';
  userId: number;
  isLoading: boolean;
  constructor(private store: Store<AuthState>,
              private toastr: ToastrService,
              private dotUserSkillsService: DotUserSkillsService,
              private router: Router
              ) { }

  ngOnInit() {
    this.store.select(userResponse).subscribe(res => {
      this.userId = res.id;
    });
  }

  save(): void {
    if (!this.aboutMe) {
      this.toastr.warning('Please write something about yourself');
      return;
    }
    const payload = {
      user_id: this.userId,
      user_about_me: this.aboutMe
    };
    this.isLoading = true;
    this.dotUserSkillsService.updateAboutMe(payload).subscribe(() => {
      this.isLoading = false;
      this.router.navigateByUrl('main-route/student-onboard/completed');
    },
    () => this.isLoading = false);
  }

  backTo(): void {
    this.router.navigate(['main-route/student-onboard/skill/Favourites']);
  }

  skipTo(): void {
    this.router.navigateByUrl('main-route/student-onboard/completed');
  }

}
