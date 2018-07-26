import {Component, OnInit, ViewChild} from '@angular/core';
import {AppGlobalService} from '../../../app-global';
import {MyProfileService} from '../my-profile-service';
import {UserData} from '../my-profile-classes/user-data';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Bank} from '../my-profile-classes/bank';
import {FederalEntity} from '../my-profile-classes/federal-entity';
import {ModalWindowsSuccessComponent} from '../../modal-windows/modal-windows-success.component';
import {ModalWindowsErrorComponent} from '../../modal-windows/modal-windows-error.component';

@Component({
  selector: 'app-my-profile-fiscal-data',
  templateUrl: './my-profile-fiscal-data.component.html',
  styleUrls: ['./my-profile-fiscal-data.component.css']
})

export class MyProfileFiscalDataComponent implements OnInit {

  // Ventanas modales error y ok
  @ViewChild(ModalWindowsErrorComponent) modalError;
  @ViewChild(ModalWindowsSuccessComponent) modalSuccess;

  public parentErrorMessage: string;
  public parentSuccessMessage: string;

  public isUsedPersonalAddres = false;

  public listBanks: Bank[] = [];
  public listFederalEntities: FederalEntity[] = [];

  public userData: UserData = new UserData();

  public myProfileFiscalDataForm: FormGroup;

  constructor(private _myProfileService: MyProfileService,
              private _appGlobalService: AppGlobalService) {
  }

  ngOnInit() {
    this.getUserDataFiscal();
    this.getListCatalogs();
    this.createMyProfileFiscalDataForm();
  }

  private submitMyProfileFiscalDataForm(): void {
    console.log('USER FISCAL DATA SUBMITING...', this.userData);
    this._myProfileService.editUserFiscalData(this.userData)
      .subscribe(
        data => {
          this.parentSuccessMessage = 'se han actualizado los datos del usuario.';
          this.modalSuccess.showModalSuccess();
          this.resetFormUserFiscalData();
        },
        error => {
          console.error('Ocurrio un error al actualizar los datos FISCALES del usuario...', error);
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


  public usePersonalData(): void {
    this.isUsedPersonalAddres = !this.isUsedPersonalAddres;
    if (this.isUsedPersonalAddres) {
      console.log('copiando datos fiscales del usuario');
      this.userData.FiscalData.Address = this.userData.Address;
      this.userData.FiscalData.FirstName = this.userData.FirstName;
      this.userData.FiscalData.LastName = this.userData.LastName;
      this.userData.FiscalData.SecondLastName = this.userData.SecondLastName;
    } else {
      this.resetFormUserFiscalData();
    }
  }

  public resetFormUserFiscalData(): void {
    console.log('Reseteando formulario de datos fiscales');
    this.myProfileFiscalDataForm.reset();
    this.getUserDataFiscal();
  }

  private getUserDataFiscal(): void {
    this._myProfileService
      .getUserById()
      .subscribe(
        userFound => {
          console.log('MyProfileFiscalDataComponent Usuario Encontrado...', userFound);
          this.userData = userFound;
        },
        errorFindUser => {
          console.error('Ocurrio un error al encontrar un usuario en el modulo MyProfileFiscalDataComponent', errorFindUser);
          this._appGlobalService.catchError(errorFindUser);
        }
      );
  }

  private getListCatalogs(): void {
    this._myProfileService.getBanks()
      .subscribe(
        dataBanks => {
          this.listBanks = dataBanks;
        },
        errorBanks => {
          console.error('Ocurrio un error al Obtener los bancos...', errorBanks);
          this._appGlobalService.catchError(errorBanks);
        }
      );

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

  // FORMULARIO
  private createMyProfileFiscalDataForm(): void {
    this.myProfileFiscalDataForm = new FormGroup({
      'Rfc': new FormControl(this.userData.FiscalData.Rfc, [
        Validators.required
      ]),
      'Curp': new FormControl(this.userData.FiscalData.Curp, [
        Validators.required
      ]),
      'Email': new FormControl(this.userData.FiscalData.Email, [
        Validators.required,
        Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
      ]),
      'PhoneNumber': new FormControl(this.userData.FiscalData.PhoneNumber, [
        Validators.required
      ]),
      'FirstName': new FormControl(this.userData.FiscalData.FirstName, [
        Validators.required
      ]),
      'LastName': new FormControl(this.userData.FiscalData.LastName, [
        Validators.required
      ]),
      'SecondLastName': new FormControl(this.userData.FiscalData.SecondLastName, [
        Validators.required
      ]),
      'Street': new FormControl(this.userData.FiscalData.Address.Street, [
        Validators.required
      ]),
      'OutdoorNumber': new FormControl(this.userData.FiscalData.Address.OutdoorNumber, []),
      'InteriorNumber': new FormControl(this.userData.FiscalData.Address.InteriorNumber, []),
      'PostalCode': new FormControl(this.userData.FiscalData.Address.PostalCode, [
        Validators.required,
        Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')
      ]),
      'Settlement': new FormControl(this.userData.FiscalData.Address.Settlement, [
        Validators.required
      ]),
      'Township': new FormControl(this.userData.FiscalData.Address.Township, [
        Validators.required
      ]),
      'FederalEntityId': new FormControl(this.userData.FiscalData.Address.FederalEntity.Id, [
        Validators.required
      ]),
      'BankId': new FormControl(this.userData.FiscalData.Card.Bank.Id, [
        Validators.required
      ]),
      'Clabe': new FormControl(this.userData.FiscalData.Card.Clabe, [
        Validators.required
      ])
    });
  }

  get Rfc() {
    return this.myProfileFiscalDataForm.get('Rfc');
  }

  get Curp() {
    return this.myProfileFiscalDataForm.get('Curp');
  }

  get Email() {
    return this.myProfileFiscalDataForm.get('Email');
  }

  get PhoneNumber() {
    return this.myProfileFiscalDataForm.get('PhoneNumber');
  }

  get FirstName() {
    return this.myProfileFiscalDataForm.get('FirstName');
  }

  get LastName() {
    return this.myProfileFiscalDataForm.get('LastName');
  }

  get SecondLastName() {
    return this.myProfileFiscalDataForm.get('SecondLastName');
  }

  get Street() {
    return this.myProfileFiscalDataForm.get('Street');
  }

  get OutdoorNumber() {
    return this.myProfileFiscalDataForm.get('OutdoorNumber');
  }

  get InteriorNumber() {
    return this.myProfileFiscalDataForm.get('InteriorNumber');
  }

  get PostalCode() {
    return this.myProfileFiscalDataForm.get('PostalCode');
  }

  get Settlement() {
    return this.myProfileFiscalDataForm.get('Settlement');
  }

  get Township() {
    return this.myProfileFiscalDataForm.get('Township');
  }

  get FederalEntityId() {
    return this.myProfileFiscalDataForm.get('FederalEntityId');
  }

  get BankId() {
    return this.myProfileFiscalDataForm.get('BankId');
  }

  get Clabe() {
    return this.myProfileFiscalDataForm.get('Clabe');
  }


}
