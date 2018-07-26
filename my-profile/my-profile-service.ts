import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppGlobalService} from '../../app-global';
import {HttpClient} from '@angular/common/http';
import {UserData} from './my-profile-classes/user-data';
import {FederalEntity} from './my-profile-classes/federal-entity';
import {Bank} from './my-profile-classes/bank';
import {ChangePassword} from './my-profile-classes/change-password';
import {AppTokenStorage, UserSession} from '../../app-token-storage';

@Injectable()
export class MyProfileService {

  // Urls
  private urlApiMemberShip = this._appGlobalService.urlIssApiMovil + 'membership/';
  private urlApiCatalogs = this._appGlobalService.urlIssApiMovilCatalogs;

  // helpers
  private USER_ID: number;

  constructor(private _http: HttpClient,
              private _appGlobalService: AppGlobalService,
              private tokenStorage: AppTokenStorage) {
    if (!this.USER_ID) {
      this.getUserIdFromSession();
    }
  }

  public getUserById(): Observable<any> {
    return this._http.get<UserData>(this.urlApiMemberShip + 'find/' + this.getUserIdFromSession());
  }

  public editUserPersonalData(_userDataUpdate: UserData): Observable<any> {
    return this._http.post<any>
    (
      this.urlApiMemberShip + 'updateuserpersonaldata',
      _userDataUpdate,
      this._appGlobalService.httpOptionsJson
    );
  }

  public editUserAddress(_userDataUpdate: UserData): Observable<any> {
    return this._http.post<any>
    (
      this.urlApiMemberShip + 'updateuseraddressdata',
      _userDataUpdate,
      this._appGlobalService.httpOptionsJson
    );
  }

  public editUserFiscalData(_userDataUpdate: UserData): Observable<any> {
    return this._http.post<any>
    (
      this.urlApiMemberShip + 'updateuserfiscaldata',
      _userDataUpdate,
      this._appGlobalService.httpOptionsJson
    );
  }

  // Cambiar Contrasena
  public changePassword(changePasswordRequest: ChangePassword): Observable<any> {
    return this._http.post<any>(this.urlApiMemberShip + 'changepassword', changePasswordRequest, {});
  }

  // Obtener las Entidades Federativas
  public getFederalEntities(): Observable<FederalEntity[]> {
    return this._http.get <FederalEntity[]>(this.urlApiCatalogs + 'federalentities');
  }

  // Obtener los Bancos
  public getBanks(): Observable<Bank[]> {
    return this._http.get <Bank[]>(this.urlApiCatalogs + 'banks');
  }


  private getUserIdFromSession(): number {
    const DEFAULT_USER_ID = 30060;
    if (!this.USER_ID) {
      if (this.tokenStorage.isLoggedIn()) {
        const USER_SESSION: UserSession = this.tokenStorage.getUserSessionObject();
        if (USER_SESSION != null && USER_SESSION.sessionData.sub.IdUser) {
          this.USER_ID = USER_SESSION.sessionData.sub.IdUser;
        }
      } else {
        this.USER_ID = DEFAULT_USER_ID;
      }
    }
    console.log('USER ID', this.USER_ID);
    return this.USER_ID;
  }


}
