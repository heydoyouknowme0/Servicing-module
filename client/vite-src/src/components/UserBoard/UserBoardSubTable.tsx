import { useEffect, useState } from "react";
import userService from "../../services/user.service";
import { format } from "date-fns";
import { ItemExtDataWrapper } from "../../types/user.type";

const UserBoardSubTable: React.FC<{ id: number }> = ({ id }) => {
  const [itemExtData, setItemExtData] = useState<ItemExtDataWrapper>({
    data: [],
    ExtDataType: {
      phone: "",
      pickupDate: "",
      pickupLocation: "",
    },
  });

  useEffect(() => {
    const DatumId = id;
    userService
      .getItemsBoard(DatumId)
      .then((response) => {
        setItemExtData({
          data: response.data.userItems,
          ExtDataType: response.data.userDataExt,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  let index = 1;

  return (
    <div>
      <strong>Phone: </strong> {itemExtData.ExtDataType?.phoneCode ?? "+960"}
      &nbsp;{itemExtData.ExtDataType?.phone}
      <br />
      <strong>Pickup Date: </strong>
      {itemExtData.ExtDataType?.pickupDate &&
        format(new Date(itemExtData.ExtDataType?.pickupDate), "dd-MM-yyyy")}
      <br />
      <strong>Pickup Location: </strong>
      {itemExtData.ExtDataType?.pickupLocation}
      <h4 className="mt-3">Item Board</h4>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Quantity</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          {itemExtData.data.map((item) => (
            <tr key={item.itemName}>
              <th scope="row">{index++}</th>
              <td>{item.itemQuantity}</td>
              <td>{item.itemName}</td>
              <td>{item.itemType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserBoardSubTable;
