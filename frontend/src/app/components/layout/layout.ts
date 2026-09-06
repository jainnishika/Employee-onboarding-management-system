import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet,MatIconModule,RouterModule,MatButtonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  username = localStorage.getItem("username") || "";
  role = localStorage.getItem("role") || "";
  showProfile = false;
  isSidebarOpen = window.innerWidth > 768;
  isMobile = window.innerWidth <= 768;

  constructor(private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    this.isSidebarOpen = false;
  }
}

  toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  myProfile() {
    this.showProfile = false;

    if (this.role === "Admin") {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/employee-profile']);
    }
    this.cdr.detectChanges();
  }

  changePassword() {
    this.showProfile = false;

    this.router.navigate(
      ['/update-password'],
      {
        queryParams: { from: 'dashboard' }
      }
    );
  }
  @HostListener('window:resize')
onResize() {
  this.isMobile = window.innerWidth <= 768;
  if (!this.isMobile) {
      this.isSidebarOpen = true;
    }
}

 logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    this.router.navigate(['/']);
  } 

}