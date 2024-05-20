// src/app/services/user-profile.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private profileSource = new BehaviorSubject<string | null>(
    this.getInitialProfile()
  );
  currentProfile = this.profileSource.asObservable();

  constructor() {}

  public getInitialProfile(): string | null {
    let profile = localStorage.getItem('profile');
    if (profile && typeof profile === 'string') {
      if (profile.startsWith('"') && profile.endsWith('"')) {
        profile = profile.substring(1, profile.length - 1);
      }
      return profile;
    }
    return null;
  }

  setProfile(profile: string) {
    localStorage.setItem('profile', JSON.stringify(profile));
    this.profileSource.next(profile);
  }

  clearProfile() {
    localStorage.removeItem('profile');
    this.profileSource.next(null);
  }
}
