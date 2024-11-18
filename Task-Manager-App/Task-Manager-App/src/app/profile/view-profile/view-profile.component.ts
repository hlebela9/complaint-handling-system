import { Component } from '@angular/core';
import { MaterialModule } from '../../modules/material/material.module'; 
import { MatDialog } from '@angular/material/dialog';
import { UserInfoService } from '../../shared/user-info.service';
import { ChangePwdComponent } from '../../change-pwd/change-pwd.component';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent {
  user:any
  constructor(private service:UserInfoService, private matDialog: MatDialog) {
    this.user = this.service.get('currentUser','session')
  }

  changePwd() {
    this.matDialog.open(ChangePwdComponent)
  }

  }
