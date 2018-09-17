import {Component, OnInit, ViewChild} from '@angular/core';
import {MyProfileService} from '../my-profile-service';
import {UserData} from '../my-profile-classes/user-data';
import {AppGlobalService} from '../../../app-global';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalWindowsSuccessComponent} from '../../modal-windows/modal-windows-success.component';
import {ModalWindowsErrorComponent} from '../../modal-windows/modal-windows-error.component';
import {FederalEntity} from '../my-profile-classes/federal-entity';

@Component({
  selector: 'app-my-profile-address',
  templateUrl: './my-profile-address.component.html',
  styleUrls: ['./my-profile-address.component.css']
})

export class MyProfileAddressComponent implements OnInit {

  // Ventanas modales error y ok
  @ViewChild(ModalWindowsErrorComponent) modalError;
  @ViewChild(ModalWindowsSuccessComponent) modalSuccess;

  public parentErrorMessage: string;
  public parentSuccessMessage: string;

  public userData: UserData = new UserData();

  public myProfileAddressForm: FormGroup;

  public listFederalEntities: FederalEntity[] = [];

  constructor(private _myProfileService: MyProfileService,
              private _appGlobalService: AppGlobalService) {
  }

  ngOnInit() {
    this.getListCatalogs();
    this.getUserDataAddress();
    this.createMyProfileAddressForm();
  }

  public submitMyProfileAddressForm(): void {
    console.log('USER ADDRES DATA SUBMITING...', this.userData);
    this._myProfileService.editUserAddress(this.userData)
      .subscribe(
        data => {
          this.parentSuccessMessage = 'se han actualizado los datos del usuario.';
          this.modalSuccess.showModalSuccess();
          this.resetFormUserAddress();
        },
        error => {
          console.error('Ocurrio un error al actualizar los datos de domicilio del usuario...', error);
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

  public resetFormUserAddress(): void {
    console.log('Reseteando formulario del domicilio del usuario');
    this.myProfileAddressForm.reset();
    this.getUserDataAddress();
  }

  // Obtener la informacion del usurio
  private getUserDataAddress(): void {
    this._myProfileService
      .getUserById()
      .subscribe(
        userFound => {
          console.log('MyProfileAddressComponent Usuario Encontrado...', userFound);
          this.userData = userFound;
        },
        errorFindUser => {
          console.error('Ocurrio un error al encontrar un usuario en el modulo MyProfileAddressComponent', errorFindUser);
          this._appGlobalService.catchError(errorFindUser);
        }
      );
  }

  private getListCatalogs(): void {

    this._myProfileService.getFederalEntities()
      .subscribe(
        dataFederalEntities => {
          this.listFederalEntities = dataFederalEntities;
        },
        errorFederalEntities => {
          console.error('Ocurrio un error al Obtener las Entidades Federativas...', errorFederalEntities);
          this._appGlobalService.catchError(errorFederalEntities);
        }
      );

  }

  private createMyProfileAddressForm(): void {
    this.myProfileAddressForm = new FormGroup({
      'Street': new FormControl(this.userData.Address.Street, [
        Validators.required
      ]),
      'OutdoorNumber': new FormControl(this.userData.Address.OutdoorNumber, [
        Validators.required
      ]),
      'PostalCode': new FormControl(this.userData.Address.PostalCode, [
        Validators.required
      ]),
      'Settlement': new FormControl(this.userData.Address.Settlement, [
        Validators.required
      ]),
      'Township': new FormControl(this.userData.Address.Township, [
        Validators.required
      ]),
      'FederalEntityId': new FormControl(this.userData.Address.FederalEntity.Id, [
        Validators.required
      ]),
    });
  }

  // Metodos GET que permiten la obtencion de cada validacion
  get Street() {
    return this.myProfileAddressForm.get('Street');
  }

  get OutdoorNumber() {
    return this.myProfileAddressForm.get('OutdoorNumber');
  }

  get PostalCode() {
    return this.myProfileAddressForm.get('PostalCode');
  }

  get Settlement() {
    return this.myProfileAddressForm.get('Settlement');
  }

  get Township() {
    return this.myProfileAddressForm.get('Township');
  }

  get FederalEntityId() {
    return this.myProfileAddressForm.get('FederalEntityId');
  }



}
