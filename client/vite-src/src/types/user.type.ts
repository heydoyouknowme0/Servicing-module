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
  email: string;
  status: number|string;
  createdAt: string;
  driver?:string;
  servicer?:string;
  requester?:string;
}
export interface ItemType {
  userDatumId:number;
  itemName:string;
  itemType:string;
  itemQuantity:number;
  receivedQuantity:number;
  id:number;
}
export interface ExtDataType {
  pickupDate:string;
  pickupLocation:string;
  phone:string;
  phoneCode?:string;
  user?:User;
  nameUser?:User;
  driverUser?:User;
  image?:string,
}
export interface ItemExtDataWrapper {
  data: ItemType[];
  ExtDataType?: ExtDataType;
}
export interface User {
  username: string;
  email: string;
  phoneCode?: string;
  phone: string;
}
