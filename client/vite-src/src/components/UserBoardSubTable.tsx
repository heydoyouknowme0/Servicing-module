import { useEffect, useState } from "react";
import userService from "../services/user.service";
import { ItemType } from "../types/user.type";

const UserBoardSubTable: React.FC<{ id: number }> = ({ id }) => {
  const [items, setItems] = useState<ItemType[]>([]);

  useEffect(() => {
    const userDatumId = id;
    userService
      .getItemsBoard(userDatumId)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  let index = 1;

  return (
    <div>
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
          {items.map((item) => (
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
