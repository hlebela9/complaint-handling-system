import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  currentUser : any ;


  constructor() { }

  get(key: string, sessionType: string): any {
    let data = sessionType === 'session' ? sessionStorage.getItem(key) : localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  store(value: any, key: string, sessionType: string): void {
    sessionType === 'session' ? sessionStorage.setItem(key, JSON.stringify(value)) : localStorage.setItem(key, JSON.stringify(value));
    console.log ('User stored')
  }
  
  generatePwd(): any {
    let chars = 'Z*a&9Sx^Dc%V6$fG#b@7N3h!Jm~4Kl`Op/Iu?Y.tR;e2Wq:zAx]Sx[Cd|F\vB-F0g5Hj8MnkL1+'
    let pwd = ''
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return pwd
  }
}