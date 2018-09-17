export class UserData {
  UserId: number;
  FirstName: string;
  LastName: string;
  SecondLastName: string;
  Gender: string;
  BornDate: string;
  GuestKey: string;
  HostKey: string;
  Email: string;
  Address: Address = new Address();
  FiscalData: FiscalData = new FiscalData();
}

export class Address {
  Street: string;
  OutdoorNumber: string;
  InteriorNumber: string;
  PostalCode: string;
  Settlement: string;
  Township: string;
  FederalEntity: FederalEntity = new FederalEntity();
}

export class FederalEntity {
  Id: number;
}

export class FiscalData {
  Card: Card = new Card();
  FirstName: string;
  LastName: string;
  SecondLastName: string;
  Rfc: string;
  Curp: string;
  Email: string;
  PhoneNumber: string;
  Address: Address = new Address();
}

export class Card {
  Bank: Bank = new Bank();
  Clabe: string;
}

export class Bank {
  Id: number;
}
