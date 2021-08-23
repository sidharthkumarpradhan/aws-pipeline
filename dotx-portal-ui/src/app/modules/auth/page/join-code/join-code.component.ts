import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { StudentHelperService } from 'src/app/modules/student-dashboard/student-helper.service';
import { AuthorizeService } from 'src/app/shared/services/auth.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AuthLoginSuccess, SetUser, SetUserDetail } from 'src/app/store/auth.action';
import { AuthState } from 'src/app/store/auth.model';

@Component({
  selector: 'app-join-code',
  templateUrl: './join-code.component.html'
})
export class JoinCodeComponent implements OnInit {
  isLoading: boolean;
  joinCodeForm: FormGroup;
  userId: string | number;

  constructor(
    private formBuilder: FormBuilder,
    private route: Router,
    private toastrService: ToastrService,
    private studentHelperService: StudentHelperService,
    public _uhs: HelperService,
    private authService: AuthorizeService,
    private store: Store<AuthState>) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.joinCodeForm = this.formBuilder.group({
      joincode: ['', [Validators.required]]
    });
  }

  formSubmit() {
    const joincode = this.joinCodeForm.get('joincode').value;
    if (!this.joinCodeForm.valid) {
      this.toastrService.warning('Please enter Join Code');
      return;
    }
    if (!joincode.trim()) {
      this.toastrService.warning('Please enter Join Code');
      return;
    }
    this.isLoading = true;
    this.authService.loginWithJoincode({joincode}).subscribe((resp) => {
      if (resp.body.hasOwnProperty('Error')) {
        this.toastrService.warning(resp.body.Error);
        this.isLoading = false;
        return;
      } else {
        const { username, password } = resp.body;
        const payload = {
          username,
          password
        };
        // this.toastrService.success('Login success');
        this.authService.loginOAuthToken(payload).subscribe((res) => {
          this.store.dispatch(new AuthLoginSuccess(res.body));
          this.isLoading = false;
          this.getUserID();
          this.toastrService.success('Code verified');
        }, () => {
          this.isLoading = false;
        });

      }
    }, (err) => {
      this.isLoading = false;
      this.toastrService.error('Invalid details');
    });
  }

  getUserID() {
    this.isLoading = true;
    this.authService.getUserIdData().subscribe((resp) => {
      this.userId = resp.id;
      this.store.dispatch(new SetUser(resp));
      this.studentHelperService.getUserInfo(this.userId).subscribe((res) => {
        this.store.dispatch(new SetUserDetail(res));
        this.redirectQuizDetails();
      }, () => {
        this.toastrService.error('Unable to get User info');
        this.isLoading = false;
      });
    }, () => {
      this.isLoading = false;
      this.toastrService.error('Unable to get User id');
    });
  }

  redirectQuizDetails() {
    this.isLoading = false;
    this.route.navigate(['auth/set-password']);
  }
}
