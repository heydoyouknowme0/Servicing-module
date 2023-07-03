export interface IUser {
  id?: any | null,
  username?: string | null,
  email?: string,
  password?: string,
  roles?: Array<string>
}
export interface DataType {
  id: number;
  name: string;
  email: string;
  status: string;
  date: string;
}
export interface ItemType {
  userDatumId:number;
  itemName:string;
  itemType:string;
  itemQuantity:number;
}