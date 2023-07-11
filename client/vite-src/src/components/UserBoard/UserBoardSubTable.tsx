import { useEffect, useState } from "react";
import userService from "../../services/user.service";
import { format } from "date-fns";
import { ItemExtDataWrapper } from "../../types/user.type";
import "./UserPrint.css";
import ImageUploader from "./ImageUploader";

const UserBoardSubTable: React.FC<{ id: number; val: boolean }> = ({
  id,
  val,
}) => {
  const [itemExtData, setItemExtData] = useState<ItemExtDataWrapper>({
    data: [],
    ExtDataType: {
      phone: "",
      pickupDate: "",
      pickupLocation: "",
    },
  });

  useEffect(() => {
    const loadItemExtData = async () => {
      try {
        const response = await userService.getItemsBoard(id, val);
        setItemExtData({
          data: response.data.userItems,
          ExtDataType: response.data.userData,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadItemExtData();
  }, [id]);

  return (
    <div>
      <strong>Phone: </strong> {itemExtData.ExtDataType?.phoneCode || "+960"}
      &nbsp;
      {itemExtData.ExtDataType?.phone}
      <br />
      <strong>Pickup Date: </strong>
      {itemExtData.ExtDataType?.pickupDate &&
        format(new Date(itemExtData.ExtDataType?.pickupDate), "dd-MM-yyyy")}
      <br />
      <strong>Pickup Location: </strong>
      {itemExtData.ExtDataType?.pickupLocation}
      <h3 className="mt-3">Item Board</h3>
      <table className="table t1">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Quantity</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          {itemExtData.data.map((item, i) => (
            <tr key={item.itemName}>
              <th scope="row">{i + 1}</th>
              <td>{item.itemQuantity}</td>
              <td>{item.itemName}</td>
              <td>{item.itemType}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ImageUploader id={id} />
    </div>
  );
};

export default UserBoardSubTable;
