import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class CommunicationService {
    private imageUrl$ = new BehaviorSubject<string>('assets/img/upload-avatar.png');
    hideCoverImage = new BehaviorSubject<boolean>(true);

    constructor() { }

    private emitChangeSource = new Subject<any>();
    currentProfilePic = this.imageUrl$.asObservable();

    changeEmitted$ = this.emitChangeSource.asObservable();

    emitChange(data) {
        this.emitChangeSource.next(data);
    }

    changeprofileImage(value: any): any {
        this.imageUrl$.next(value);
    }
}
