import {Component, OnInit, ViewChild} from '@angular/core';
import {MyProfileService} from '../my-profile-service';
import {AppGlobalService} from '../../../app-global';
import {UserData} from '../my-profile-classes/user-data';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalWindowsSuccessComponent} from '../../modal-windows/modal-windows-success.component';
import {ModalWindowsErrorComponent} from '../../modal-windows/modal-windows-error.component';

@Component({
  selector: 'app-my-profile-personal',
  templateUrl: './my-profile-personal.component.html',
  styleUrls: ['./my-profile-personal.component.css']
})

export class MyProfilePersonalComponent implements OnInit {

  // Ventanas modales error y ok
  @ViewChild(ModalWindowsErrorComponent) modalError;
  @ViewChild(ModalWindowsSuccessComponent) modalSuccess;

  public parentErrorMessage: string;
  public parentSuccessMessage: string;

  public userData: UserData = new UserData();
  public TemporalBornDate: Date;

  public myProfilePersonalForm: FormGroup;

  constructor(private _myProfileService: MyProfileService,
              private _appGlobalService: AppGlobalService) {
  }

  ngOnInit() {
    this.getUserDataPersonal();
    this.createMyProfilePersonalForm();
  }

  public setBornDate($event: any): void {
    console.log('Ajustando fecha', $event.target.value);
    this.userData.BornDate = $event.target.value;
  }

  private getUserDataPersonal(): void {
    this._myProfileService
      .getUserById()
      .subscribe(
        userFound => {
          console.log('MyProfilePersonalComponent Usuario Encontrado...', userFound);
          this.userData = userFound;
          if (this.userData.BornDate.length >= 10) {
            this.userData.BornDate = this.userData.BornDate.substring(0, 10);
          }
        },
        errorFindUser => {
          console.error('Ocurrio un error al encontrar un usuario en el modulo personal', errorFindUser);
          this._appGlobalService.catchError(errorFindUser);
        }
      );
  }

  public submitMyProfilePersonalForm(): void {
    console.log('USER PERSONAL DATA SUBMITING...', this.userData);
    if (this.userData.BornDate.length >= 10) {
      this.userData.BornDate = this.userData.BornDate.substring(0, 10);
    }

    this._myProfileService.editUserPersonalData(this.userData)
      .subscribe(
        data => {
          this.parentSuccessMessage = 'se han actualizado los datos del usuario.';
          this.modalSuccess.showModalSuccess();
          this.resetFormUserPersonalData();
        },
        error => {
          console.error('Ocurrio un error al actualizar los datos PERSONALES del usuario...', error);
          if (error.error && error.error.Message) {
            this.parentErrorMessage = `${error.error.Message}`;
          } else {
            this.parentErrorMessage = `Intente más tarde.`;
          }
          this.modalError.showModalError();
          this._appGlobalService.catchError(error);
        }
      );

  }

  private resetFormUserPersonalData(): void {
    console.log('Reseteando formulario de datos personales del usuario');
    this.myProfilePersonalForm.reset();
    this.getUserDataPersonal();
  }

  private createMyProfilePersonalForm(): void {
    this.myProfilePersonalForm = new FormGroup({
      'FirstName': new FormControl(this.userData.FirstName, [
        Validators.required
      ]),
      'LastName': new FormControl(this.userData.LastName, [
        Validators.required
      ]),
      'SecondLastName': new FormControl(this.userData.SecondLastName, [
        Validators.required
      ])
    });
  }

  // Metodos GET que permiten la obtencion de cada validacion
  get FirstName() {
    return this.myProfilePersonalForm.get('FirstName');
  }

  get LastName() {
    return this.myProfilePersonalForm.get('LastName');
  }

  get SecondLastName() {
    return this.myProfilePersonalForm.get('SecondLastName');
  }

}

