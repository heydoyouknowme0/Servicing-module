import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
  getItemsBoard(userDatumId: number) {
    return axios.get(API_URL + 'items', {
      params: { userDatumId },
      headers: authHeader()
    });
  }
}

export default new UserService();
