import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IDotRewards } from 'src/app/shared/model/dot-rewards.model';
import { environment } from 'src/environments/environment';
// import { Challenge } from './challenge/challenge-update/challenge-update.component';

@Injectable({
  providedIn: 'root'
})
export class AdminHelperService {
  isLoading$ = new BehaviorSubject<boolean>(false);
  constructor(public http: HttpClient) { }

  isAdminResetPassword = new Subject<boolean>();
  userUrl = `${environment.baseURL}/dot-user-details`;
  topicDetails = `${environment.baseURL}/dot-topic-details`;
  topicGroup = `${environment.baseURL}/dot-topic-group`;
  rolesGroup = `${environment.baseURL}/dot-topic-group-roles/filter`;
  assignmentsforGroup = `${environment.baseURL}/dot-topic-assignments`;
  assignmentsforChallenge = `${environment.baseURL}/dot-topic-details/topic_assignments`;
  challengeAttachmentsUrl = `${environment.baseURL}/dot-topic-attachments/filter`;
  rewardSetup = `${environment.baseURL}/dot-reward-setup`;
  leaderBoardsUrl = `${environment.baseURL}/dot-reward-setup/leader_board`;


  public isAuthenticated(): boolean {
    const userId = sessionStorage.getItem('userId');
    const userType = sessionStorage.getItem('userType');
    return (userId && userType === 'admin');
  }

  public setLoading(value: boolean): void {
    this.isLoading$.next(value);
  }

  public getLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /* User Tab services */

  getUsers(): Observable<any> {
    return this.http.get(this.userUrl);
  }

  getAdminUsers(): Observable<any> {
    const url = `${this.userUrl}/filter`;
    return this.http.post(url, { user_type: 'admin' });
  }

  updateUserRecords(data: any): Observable<any> {
    return this.http.put(this.userUrl, data).pipe(catchError(err => throwError(err)));
  }

  saveRecord(data: any): Observable<any> {
    return this.http.post(this.userUrl, data).pipe(catchError(err => throwError(err)));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.userUrl}/${id}`);
  }


  /* LeaderBoards Tab services */
  getLeaderBoardsList(): Observable<any> {
    return this.http.get(this.leaderBoardsUrl);
  }


  /* Dotcoin Tab services */

  getTopicsList(): Observable<any> {
    return this.http.get(this.topicDetails);
  }

  uploadDotCoinBadge(): Observable<any> {
    const url = `${this.userUrl}/filter`;
    return this.http.post(url, { user_type: 'admin' });
  }

  getRewardSetup(): Observable<any> {
    return this.http.get(this.rewardSetup);
  }

  rewardSetupById(id: number): Observable<any> {
    return this.http.get(`${this.rewardSetup}/${id}`);
  }

  saveRewardSetup(data: IDotRewards): Observable<any> {
    return this.http.post(this.rewardSetup, data).pipe(catchError(err => throwError(err)));
  }

  updateRewardSetup(data: IDotRewards): Observable<any> {
    return this.http.put(this.rewardSetup, data).pipe(catchError(err => throwError(err)));
  }

  deleteRewardSetup(id: number): Observable<any> {
    return this.http.delete(`${this.rewardSetup}/${id}`);
  }


  /* Challenge Tab services */

  getChallengesList(): Observable<any> {
    const url = `${this.topicDetails}/filter`;
    return this.http.post(url, { topic_type: 'Challenge' });
  }

  saveChallengeData(data: any): Observable<any> {
    const url = `${this.topicDetails}/create_challenge`;
    return this.http.post(url, data).pipe(catchError(err => throwError(err)));
  }

  updateChallenge(data: any): Observable<any> { // api needs to update from service side
    const url = `${this.topicDetails}/update_challenge`;
    return this.http.put(url, data).pipe(catchError(err => throwError(err)));
  }

  deleteChallenge(id: any): Observable<any> {
    return this.http.delete(`${this.topicDetails}/${id}`);
  }

  getBuddiesList(): Observable<any> {
    const url = `${this.userUrl}/filter`;
    return this.http.post(url, { user_type: 'student' });
  }

  assignmentsChallenge(id: any): Observable<any> {
    const url = `${this.assignmentsforChallenge}/` + id;
    return this.http.get(url);
  }

  getTopicDetailsById(id: number): Observable<any> {
    const url = `${this.topicDetails}/${id}`;
    return this.http.get(url);
  }

  TopicDetailsById(id: number): Observable<any> {
    const url = `${this.topicDetails}/edit/${id}`;
    return this.http.get(url);
  }

  getChallengeMediaFiles(data: any) { // {"topic_id":topicId}
    return this.http.post(this.challengeAttachmentsUrl, data).pipe(catchError(err => throwError(err)));
  }

  /* Group services */

  getGroupsList(): Observable<any> {
    return this.http.post(this.topicGroup + '/filter', {});
  }

  getGroupsListbyChallenge(id): Observable<any> {
    return this.http.post(this.topicGroup + '/filter', id);
  }

  saveGroup(data: any): Observable<any> {
    const url = `${this.topicGroup}/create_challenge_group`;
    return this.http.post(url, data).pipe(catchError(err => throwError(err)));
  }

  updateGroup(data: any): Observable<any> {
    const url = `${this.topicGroup}/update_challenge_group`;
    return this.http.put(url, data).pipe(catchError(err => throwError(err)));
  }

  deleteGroup(id: any): Observable<any> {
    return this.http.delete(`${this.topicGroup}/${id}`);
  }

  getRoles(data: any): Observable<any> {
    const url = `${this.rolesGroup}`;
    return this.http.post(url, data).pipe(catchError(err => throwError(err)));
  }

  assignmentsGroup(data: any): Observable<any> {
    const url = `${this.assignmentsforGroup}/filter`;
    return this.http.post(url, data).pipe(catchError(err => throwError(err)));
  }

  /* Create && update Group services */

  getGroupData(id: number) {
    const url = `${this.topicGroup}/${id}`;
    return this.http.get(url);
  }

  getChallengesForGroup(): Observable<any> {
    const url = `${this.topicDetails}`;
    return this.http.get(url);
  }

  generateJoinCodes(payload): Observable<any> {
    const url = `${this.userUrl}/generate_joincodes`;
    return this.http.post(url, payload);
  }
}
