import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfoService } from '../shared/user-info.service';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrl: './change-pwd.component.css'
})
export class ChangePwdComponent {

    changePwdForm: FormGroup
    user: any
    users: any
  
    constructor(private userInfor: UserInfoService, private snackBar: MatSnackBar, private matDialogRef: MatDialogRef<ChangePwdComponent>) {
  
      this.user = this.userInfor.get('currentUser', 'session')
      this.users = this.userInfor.get('users', 'local')
  
      this.changePwdForm = new FormGroup({
        currentPwd: new FormControl('', [Validators.required]),
        newPwd: new FormControl('', [Validators.required]),
        confirmPwd: new FormControl('', [Validators.required])
      })
    }
  
    save() {
      let currentPassword = this.user.password
      console.log(currentPassword)
      console.log(this.changePwdForm['controls']['currentPwd'].value)
  
      if(currentPassword !== this.changePwdForm['controls']['currentPwd'].value) {
        this.snackBar.open('Your current password is incorrect', 'OK', {duration: 3000})
      }else {
        if(this.changePwdForm['controls']['confirmPwd'].value === this.changePwdForm['controls']['newPwd'].value) {
          this.users.forEach((user: any, indx: number) => {
            if(user.email === this.user.email) {
              user['password'] = this.changePwdForm['controls']['newPwd'].value
              console.log(user)
            }
          })
          this.userInfor.store(this.users, 'users', 'local')
          this.close()
          this.snackBar.open('Your password, hass been changed successfully', 'OK', {duration: 3000})
  
        }else {
          this.snackBar.open('New password and confirm password doesn\'t match', 'OK', {duration: 3000})
        }
      }
  
    }
  
    
    close() {
      this.matDialogRef.close()
    }
  }
  

