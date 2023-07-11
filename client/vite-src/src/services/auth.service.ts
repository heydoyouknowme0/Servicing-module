import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string,companyName: string, email: string,phone: string, password: string,phoneCode?: string,roles?:boolean, ) {
    return axios.post(API_URL + "signup", {
      username,
      companyName,
      email,
      phone,
      password,
      phoneCode,
      roles
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
