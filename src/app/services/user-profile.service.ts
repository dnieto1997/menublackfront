// src/app/services/user-profile.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private profileSource = new BehaviorSubject<string | null>(null);
  currentProfile = this.profileSource.asObservable();

  constructor() {}

  setProfile(profile: string) {
    this.profileSource.next(profile);
  }

  clearProfile() {
    this.profileSource.next(null);
  }
}
