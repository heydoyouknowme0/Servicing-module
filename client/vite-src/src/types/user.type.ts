export interface IUser {
  id?: any | null,
  username?: string | null,
  email?: string,
  password?: string,
  roles?: Array<string>
}
export interface DataType {
  id: number;
  userName: string;
  companyName: string;
  myEmail:string;
  email: string;
  status: number;
  date: string;
}
export interface ItemType {
  userDatumId:number;
  itemName:string;
  itemType:string;
  itemQuantity:number;
}
export interface ExtDataType {
  phoneCode?:string;
  phone:string;
  pickupDate:string;
  pickupLocation:string;
}
export interface ItemExtDataWrapper {
  data: ItemType[];
  ExtDataType?: ExtDataType;
}