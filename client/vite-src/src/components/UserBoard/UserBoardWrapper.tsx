import { useEffect, useState } from "react";
import UserService from "../../services/user.service";
import UserBoard from "./UserBoard";
import { DataType } from "../../types/user.type";
import userService from "../../services/user.service";
interface UserBoardWrapperProps {
  showAdminBoard: boolean;
}
const UserBoardWrapper: React.FC<UserBoardWrapperProps> = ({
  showAdminBoard,
}) => {
  const [userData, setUserData] = useState<DataType[]>([]);
  const handleStatusChange = (newStatus: number, row: DataType) => {
    userService.changeStatus(newStatus, row.id).then(() => {
      const updatedData = userData.map((dataRow) => {
        if (dataRow.id === row.id) {
          return { ...dataRow, status: newStatus };
        }
        return dataRow;
      });

      setUserData(updatedData);
    });
  };

  useEffect(() => {
    UserService.getUserBoard(showAdminBoard)
      .then((response) => {
        console.log(response.data);
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  return (
    <UserBoard
      data={userData}
      showAdminBoard={showAdminBoard}
      onStatusChange={handleStatusChange}
    />
  );
};

export default UserBoardWrapper;
