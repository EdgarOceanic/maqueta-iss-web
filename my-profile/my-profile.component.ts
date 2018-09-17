import {Component, OnInit} from '@angular/core';
import {MyProfileService} from './my-profile-service';
import {UserData} from './my-profile-classes/user-data';
import {Router} from '@angular/router';
import {AppGlobalService} from '../../app-global';
import {AppTokenStorage} from '../../app-token-storage';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  providers: [MyProfileService]
})

export class MyProfileComponent implements OnInit {

  public selectedMyProfileTabIndex: number;

  public userName: string;

  constructor(private router: Router,
              private _myProfileService: MyProfileService,
              private _appGlobalService: AppGlobalService,
              private _tokenStorage: AppTokenStorage) {
  }

  ngOnInit() {
    console.log('MyProfileComponent Up and Running...');
    this.verifyUrlRouter();
    this.userName = this._tokenStorage.getNameOfUser();
  }

  private verifyUrlRouter(): void {
    const URL = this.router.url;
    if (URL === '/mi-perfil/datos-personales') {
      this.setSelecteddMyProfileTabIndex(0);
    } else if (URL === '/mi-perfil/domicilio') {
      this.setSelecteddMyProfileTabIndex(1);
    } else if (URL === '/mi-perfil/datos-fiscales') {
      this.setSelecteddMyProfileTabIndex(2);
    } else if (URL === '/mi-perfil/cambiar-contrasena') {
      this.setSelecteddMyProfileTabIndex(3);
    }
  }

  public setSelecteddMyProfileTabIndex(_index: number): void {
    this.selectedMyProfileTabIndex = _index;
  }

}

