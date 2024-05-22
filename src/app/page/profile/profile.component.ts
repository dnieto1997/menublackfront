import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private profileService: ProfileService // public storageService: StorageService, // public translationService: TranslationService
  ) {}
  ngOnInit(): void {
    this.start();
  }
  start() {
    this.profileService.getProfile({}).subscribe((res: any) => {});
  }
}
