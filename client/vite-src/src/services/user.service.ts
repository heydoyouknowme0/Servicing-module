import axios from 'axios';
import authHeader from './auth-header';
interface ChangeStatus {
  id: number;
  status: number;
}


// const API_URL = 'https://servicing-module-production.up.railway.app/api/test/';
const API_URL = "http://localhost:8080/api/test/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard(val?:boolean) {
    if(val){
      return axios.get(API_URL + 'userAdmin', { headers: authHeader() });
    }
    else if(val===false){
      return axios.get(API_URL + 'userServicer', { headers: authHeader() });
    }
    else{
      return axios.get(API_URL + 'user', { headers: authHeader() });
    }
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
  getItemsBoard(DatumId: number) {
      return axios.get(API_URL + 'items', {
        params: { DatumId },
        headers: authHeader()
      });
  }
  insertFormData(formValues: { [key: string]: string }) {
    return axios.post(API_URL + 'insertFormData', formValues, { headers: authHeader() });
  }
  updateReceived(FormData:FormData){
    return axios.post(API_URL + 'updateReceived', FormData, { headers: authHeader() });
  }
  deleteData(id:number){
    return axios.get(API_URL + 'deleteData', { params: { id }, headers: authHeader() });
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
  getImage(name: string) {
      return axios.get(API_URL + 'getImage', {
        params: { name},
        headers: authHeader(),
        responseType: 'arraybuffer',
      });
  }
}

export default new UserService();
