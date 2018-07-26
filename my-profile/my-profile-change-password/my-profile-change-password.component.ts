import {Component, OnInit, ViewChild} from '@angular/core';
import {MyProfileService} from '../my-profile-service';
import {AppGlobalService} from '../../../app-global';
import {UserData} from '../my-profile-classes/user-data';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ChangePassword} from '../my-profile-classes/change-password';
import {ModalWindowsSuccessComponent} from '../../modal-windows/modal-windows-success.component';
import {ModalWindowsErrorComponent} from '../../modal-windows/modal-windows-error.component';


@Component({
  selector: 'app-my-profile-change-password',
  templateUrl: './my-profile-change-password.component.html',
  styleUrls: ['./my-profile-change-password.component.css']
})

export class MyProfileChangePasswordComponent implements OnInit {

  // Ventanas modales para manejra errores
  @ViewChild(ModalWindowsErrorComponent) modalError;
  @ViewChild(ModalWindowsSuccessComponent) modalSuccess;

  public parentErrorMessage: string;
  public parentSuccessMessage: string;

  // datos de usuario actual
  public userData: UserData = new UserData();

  // cambiar contrasena
  public changePasswordRequest: ChangePassword;
  public changePasswordForm: FormGroup;

  constructor(private _myProfileService: MyProfileService,
              private _appGlobalService: AppGlobalService) {
    this.changePasswordRequest = new ChangePassword();
  }

  ngOnInit() {
    this.getUserDataChangePassword();
    this.createChangePasswordForm();
  }

  getUserDataChangePassword(): void {
    this._myProfileService
      .getUserById()
      .subscribe(
        userFound => {
          console.log('MyProfileChangePasswordComponent Usuario Encontrado...', userFound);
          this.userData = userFound;
        },
        errorFindUser => {
          console.error('Ocurrio un error al encontrar un usuario en el modulo MyProfileChangePasswordComponent', errorFindUser);
          this._appGlobalService.catchError(errorFindUser);
        }
      );
  }

  // Actualizar la contrasena SUBMIT
  public submitChangePasswordForm(): void {
    const encryptedObject = this.encryptChangePasswordRequestToBase64();
    console.log('changePasswordRequest:', this.changePasswordRequest);
    console.log('changePasswordRequest Base64:', encryptedObject);

    this._myProfileService.changePassword(encryptedObject)
      .subscribe((data) => {
        this.parentSuccessMessage = 'Se ha modificado tu contraseña correctamente...';
        this.modalSuccess.showModalSuccess();
        this.changePasswordForm.reset();
        this.changePasswordRequest = new ChangePassword();
      }, (error) => {
        if (error.error && error.error.Message) {
          this.parentErrorMessage = `${error.error.Message}`;
        } else {
          this.parentErrorMessage = `Intente más tarde.`;
        }
        console.log('OCURRIO UN error al actualizar la contrasena', error);
        this.modalError.showModalError();
        this._appGlobalService.catchError(error);
      });

  }

  private encryptChangePasswordRequestToBase64(): ChangePassword {
    const encryptedObject: ChangePassword = new ChangePassword();
    encryptedObject.IdUser = 33456;
    encryptedObject.OldPassword = btoa(this.changePasswordRequest.OldPassword);
    encryptedObject.Password = btoa(this.changePasswordRequest.Password);
    encryptedObject.PasswordVerification = btoa(this.changePasswordRequest.PasswordVerification);
    encryptedObject.Password = btoa(this.changePasswordRequest.Password);
    return encryptedObject;
  }


  // Crear Formulario del Cambio de Contraseña
  private createChangePasswordForm(): void {
    this.changePasswordForm = new FormGroup({
      'Password': new FormControl(this.changePasswordRequest.Password, [
        Validators.required,
        Validators.minLength(6)
      ]),
      'PasswordVerification': new FormControl(this.changePasswordRequest.PasswordVerification, [
        Validators.required,
        Validators.minLength(6),
        this.confirmPassword
      ]),
      'OldPassword': new FormControl(this.changePasswordRequest.OldPassword, [
        Validators.required
      ])
    });
  }

  get Password() {
    return this.changePasswordForm.get('Password');
  }

  get PasswordVerification() {
    return this.changePasswordForm.get('PasswordVerification');
  }

  get OldPassword() {
    return this.changePasswordForm.get('OldPassword');
  }


  private confirmPassword(c: AbstractControl): any {
    if (!c.parent || !c) return;
    const pwd = c.parent.get('Password');
    const cpwd = c.parent.get('PasswordVerification');

    if (!pwd || !cpwd) return;
    if (pwd.value !== cpwd.value) {
      return {invalid: true};

    }
  }

}
