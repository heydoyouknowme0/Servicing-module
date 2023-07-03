import { useEffect, useState } from "react";
import UserService from "../services/user.service";
import UserBoard from "./UserBoard";
import { DataType } from "../types/user.type";

const UserBoardWrapper = () => {
  const [userData, setUserData] = useState<DataType[]>([]);

  useEffect(() => {
    UserService.getUserBoard()
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return <UserBoard data={userData} />;
};

export default UserBoardWrapper;
