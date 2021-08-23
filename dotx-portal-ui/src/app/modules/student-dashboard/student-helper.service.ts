import {DOCUMENT} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentHelperService {

  handleUserPersonalInfo = new BehaviorSubject<any>(null);
  handleUserAvatar = new Subject<any>();
  handlePersonalQuiz = new Subject<any>();
  handleUserSkills = new Subject<any>();
  handleResetPassword = new Subject<any>();
  handleDailyDot = new Subject<any>();
  _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  userId: any;

  userUrl = `${environment.baseURL}/dot-user-details`;
  userSkillUrl = `${environment.baseURL}/dot-user-skills`;
  searchBy = `${environment.baseURL}/dot-user-details`;
  dailyQuoteUrl = `${environment.baseURL}/dot-daily-dot-records`;
  totalRecordsUrl = `${environment.baseURL}/dot-daily-dot-records/dashboard`;
  spotlightChallenges = `${environment.baseURL}/dot-topic-details`;
  loginHistory = `${environment.baseURL}/dot-login-history`;
  actionsChallenge = `${environment.baseURL}/dot-topic-assignments`;
  commentsUrl = `${environment.baseURL}/dot-topic-response`;
  questDetailUrl = `${environment.baseURL}/dot-topic-details/filter`;
  skillResourceUrl = `${environment.baseURL}/dot-skill-details`;
  studentSkillsUpdateUrl = `${environment.baseURL}/dot-user-skills/update`;
  personalizeQuizUrl = `${environment.baseURL}/dot-std-per-quiz-details/student_quiz_details`;
  studentQuizDetailsUrl = `${environment.baseURL}/dot-std-per-quiz-details`;
  streaksUrl = `${environment.baseURL}/dot-daily-dot-records/streak`;
  badgesUrl = `${environment.baseURL}/dot-reward-allocation/badges`;
  achievementsUrl = `${environment.baseURL}/dot-reward-allocation/achievements`;
  rolesUrl = `${environment.baseURL}/dot-topic-group-roles`;
  auto_assignURL = `${environment.baseURL}/dot-topic-group/auto_assign`;
  checkGroupURL = `${environment.baseURL}/dot-topic-group/check_groupname`;
  groupMembersURL = `${environment.baseURL}/dot-topic-group-roles/group_members`;
  submittedCommentsURl = `${environment.baseURL}/dot-topic-response/submitted_comments`;

  constructor(public http: HttpClient, @Inject(DOCUMENT) private readonly document: Document) {
  }

  /* Student Dashboard  */
  getSkillsList(page?: string): Observable<any> {
    const url = page ? this.skillResourceUrl + '/' + page : this.skillResourceUrl;
    return this.http.get(url);
  }

  getUserSkills(page?: string): Observable<any> {
    const url = page ? this.userSkillUrl + '/' + page : this.userSkillUrl;
    return this.http.get(url);
  }

  getAchievements(userId): Observable<any> {
    const data = {user_id: userId};
    return this.http.post(this.achievementsUrl, data);
  }

  getBadges(userId): Observable<any> {
    const data = {user_id: userId};
    return this.http.post(this.badgesUrl, data);
  }

  getStudentPersonalityQuiz(): Observable<any> {
    return this.http.get(`${this.personalizeQuizUrl}`);
  }

  savePersonalizeQuizDetails(payload): Observable<any> {
    return this.http.post(`${this.studentQuizDetailsUrl}`, payload);
  }

  getStudentSkillSet(payload): Observable<any> {
    return this.http.post(`${this.userSkillUrl}/filter`, payload);
  }

  updateSkills(payload): Observable<any> {
    return this.http.post(this.studentSkillsUpdateUrl, payload);
  }

  updateUserProfile(payload): Observable<any> {
    return this.http.put(this.userUrl, payload);
  }

  getAllUsers(userId): Observable<any> {
    const url = `${this.userUrl}/filter`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, { user_type: 'student' });
  }

  getMyBuddies(): Observable<any> {
    const url = `${this.userUrl}/my_buddies`;
    return this.http.get(url);
  }

  buddyByGroup(userId): Observable<any> {
    const url = `${this.userUrl}/buddy_search_by_group`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, { user_id: userId });
  }

  getUserInfo(userId): Observable<any> {
    const url = `${this.userUrl}/${userId}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  dot_activities(): Observable<any> {
    const url = `${this.spotlightChallenges}/dot_activities`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  UserSkillsInfo(userId): Observable<any> {
    const url = `${this.userSkillUrl}/filter`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, { user_id: userId });
  }

  searchByValue(payload): Observable<any> {
    const url = `${this.searchBy}/buddy_search`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }


  // -------------------------------------------------------------
  //  Daily quote services


  getDailyQuotes(payload): Observable<any> {
    const url = `${this.dailyQuoteUrl}/filter`;
    console.log('url', url)
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  postDailyQuote(payload): Observable<any> {
    const url = `${this.dailyQuoteUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.put(url, payload);
  }

  postDailyQuestion(payload): Observable<any> {
    const url = `${this.dailyQuoteUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.put(url, payload);
  }

  postDailyJournal(payload): Observable<any> {
    const url = `${this.dailyQuoteUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.put(url, payload);
  }

  retrievePolls(payload): Observable<any> {
    const url = `${this.totalRecordsUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  retrieveQuestions(payload): Observable<any> {
    const url = `${this.totalRecordsUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  retrieveJournals(payload): Observable<any> {
    const url = `${this.totalRecordsUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  submitWorkLocation(payload): Observable<any> {
    return this.http.post(this.loginHistory, payload);
  }


  // ------------------------- SpotlightChallenges----------------

  spotLightChallenges(): Observable<any> {
    const url = `${this.spotlightChallenges}/spotlight_challenges`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  getTop10Challenges(): Observable<any> {
    const url = `${this.spotlightChallenges}/challenge_top10`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  getChallengeTrend(payload): Observable<any> {
    const url = `${this.spotlightChallenges}/challenge_trend`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  getChallengeMine(payload): Observable<any> {
    const url = `${this.spotlightChallenges}/my_challenges`;
    return this.http.post(url, payload);
  }

  getUpcomingChallenges(payload): Observable<any> {
    const url = `${this.spotlightChallenges}/upcoming_challenges`;
    return this.http.post(url, payload);
  }

  getInfluencerChallenges(): Observable<any> {
    const url = `${this.spotlightChallenges}/influencer_challenges`;
    return this.http.get(url);
  }

  getChallengesContinue(payload): Observable<any> {
    const url = `${this.spotlightChallenges}/continue_challenges`;
    return this.http.post(url, payload);
  }

  getChallengesRecent(payload): Observable<any> {
    const url = `${this.spotlightChallenges}/recent_challenges`;
    return this.http.post(url, payload);
  }

  getTop10ResponsesChallenges(): Observable<any> {
    const url = `${this.spotlightChallenges}/top10_responses`;
    return this.http.get(url);
  }

  getChallengesTop10(payload): Observable<any> {
    const url = `${this.spotlightChallenges}/challenge_top10`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  getWatch_again(): Observable<any> {
    const url = `${this.spotlightChallenges}/watch_again`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  actionChallenge(payload): Observable<any> {
    const url = `${this.actionsChallenge}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.put(url, payload);
  }

  feedbackGet(topic_assign_id): Observable<any> {
    const url = `${this.actionsChallenge}/${topic_assign_id}`;
    return this.http.get(url);
  }

  rejectChallenge(topic_assign_id): Observable<any> {
    const url = `${this.actionsChallenge}/${topic_assign_id}`;
    return this.http.delete(url);
  }

  topicDetailsById(topic_id): Observable<any> {
    const url = `${this.spotlightChallenges}/${topic_id}`;
    return this.http.get(url);
  }

  groupMemById(topic_id): Observable<any> {
    const url = `${this.submittedCommentsURl}/${topic_id}`;
    return this.http.get(url);
  }

  getSoloChallengeResponses(topicId: number): Observable<any> {
    const url = `${this.commentsUrl}/solo_responses/${topicId}`;
    return this.http.get(url);
  }

  addComments(payload): Observable<any> {
    const url = `${this.commentsUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  getCommentRetrieve(topic_id): Observable<any> {
    const url = `${this.commentsUrl}/challenge_comments/${topic_id}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  getCommentRetrieveGroup(topic_id): Observable<any> {
    const url = `${this.commentsUrl}/group_comments/${topic_id}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  getSoloChallengeNotes(topicAssignId: number): Observable<any> {
    const url = `${this.commentsUrl}/solo_challenge_notes/${topicAssignId}`;
    return this.http.get(url);
  }

  autoAssignChallenge(payload): Observable<any> {
    const url = `${this.auto_assignURL}`;
    return this.http.post(url, payload);
  }

  questDetails(questId): Observable<any> {
    return this.http.post(this.questDetailUrl, { parent_topic_id: questId });
  }

  shareInvites(payload): Observable<any> {
    const url = `${this.spotlightChallenges}/update_challenge `;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.put(url, payload);
  }

  viewAssignees(topicId): Observable<any> {
    const url = `${this.spotlightChallenges}/topic_assignments/${topicId}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  loadScript(url: string): Observable<any> {
    if (this._loadedLibraries[url]) {
      return this._loadedLibraries[url].asObservable();
    }

    this._loadedLibraries[url] = new ReplaySubject();

    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = () => {
      this._loadedLibraries[url].next();
      this._loadedLibraries[url].complete();
    };

    this.document.body.appendChild(script);

    return this._loadedLibraries[url].asObservable();
  }

  roles(payload): Observable<any> {
    const url = `${this.rolesUrl}/topic_roles`;
    return this.http.post(url, payload);
  }

  postSelectedRole(payload): Observable<any> {
    const url = `${this.rolesUrl}`;
    return this.http.post(url, payload);
  }

  checkGroup(payload): Observable<any> {
    const url = `${this.checkGroupURL}`;
    return this.http.post(url, payload);
  }

  groupMembers(payload): Observable<any> {
    const url = `${this.groupMembersURL}`;
    return this.http.post(url, payload);
  }

  reactAndRate(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-ratings`;
    return this.http.post(url, payload);
  }

  rateSubmission(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-ratings/rate_response`;
    return this.http.post(url, payload);
  }

  reactOnSubmission(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-ratings/react_response`;
    return this.http.post(url, payload);
  }

  JoinSoloChallenge(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-details/join_solo_challenge`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  postResponse(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-comments`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  updateResponse(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-comments`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.put(url, payload);
  }

  getResponses(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-comments/filter`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }


  // ----------- Streaks ---------------------------

  getStreaks(): Observable<any> {
    const url = `${this.streaksUrl}`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.get(url);
  }

  dotRatings(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-ratings`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post(url, payload);
  }

  dotRatingsUpdate(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-resp-ratings`;
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.put(url, payload);
  }

  searchChallenges(payload): Observable<any> {
    const url = `${environment.baseURL}/dot-topic-details/search`;
    return this.http.post(url, payload);
  }

  getLeaderboardDetails(): Observable<any> {
    const url = `${environment.baseURL}/dot-reward-allocation/leader_board`;
    return this.http.get(url);
  }

}
