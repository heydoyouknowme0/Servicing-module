import axios from 'axios';
import authHeader from './auth-header';
interface ChangeStatus {
  id: number;
  status: number;
}


const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard(val:boolean) {
    if(val===true){
      return axios.get(API_URL + 'userAdmin', { headers: authHeader() });
    }
    else{
      return axios.get(API_URL + 'user', { headers: authHeader() });
    }
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
  getItemsBoard(DatumId: number,val:boolean) {
    if(val=== true){
      return axios.get(API_URL + 'itemsAdmin', {
        params: { DatumId },
        headers: authHeader()
      });
    }
    else{
      return axios.get(API_URL + 'items', {
        params: { DatumId },
        headers: authHeader()
      });
    }
  }
  insertFormData(formValues: { [key: string]: string }) {
    return axios.post(API_URL + 'insertFormData', formValues, { headers: authHeader() });
  }
  uploadImage(imageData: FormData){
    return axios.post(API_URL + 'uploadImage', imageData, { headers: authHeader() });
  }
  changeStatus(newStatus:number,id:number) {
    const data = {
      id: id,
      newStatus: newStatus
    };
    return axios.post(API_URL + 'changeStatus', data, { headers: authHeader() });
  }
  getImage(id: number) {
      return axios.get(API_URL + 'getImage', {
        params: { id},
        headers: authHeader(),
        responseType: 'arraybuffer',
      });
  }
}

export default new UserService();
