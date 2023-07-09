import "./AdminBoard.css";
import { useEffect, useState } from "react";
import userService from "../services/user.service";

interface Userd {
  users: User[];
  items: Item[];
  subItems: SubItem[];
}

interface User {
  id: number;
  username: string;
}

interface Item {
  itemId: number;
  itemName: string;
}

interface SubItem {
  typeId: number;
  itemType: string;
  itemItemId: number;
}

interface InputElement {
  id: number;
  nameToType: number;
}

const AdminBoard = () => {
  const [customEnable, setCustomEnable] = useState(false);
  const [UserD, setUserD] = useState<Userd>({
    users: [],
    items: [],
    subItems: [],
  });

  useEffect(() => {
    userService
      .getAdminBoard()
      .then((response) => {
        setUserD(response.data);
        console.log(UserD);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [inputs, setInputs] = useState<InputElement[]>([
    { id: 1, nameToType: 0 },
  ]);

  const handleAddElement = () => {
    const newId = inputs.length + 1;
    setInputs([...inputs, { id: newId, nameToType: 0 }]);
  };

  const handleRemoveLastElement = () => {
    if (inputs.length === 1) {
      return;
    }
    const updatedInputs = [...inputs];
    updatedInputs.pop();
    setInputs(updatedInputs);
  };
  const handleChangeItem = (
    inputId: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    const intValue = parseInt(value);
    const updatedInputs = [...inputs];
    updatedInputs[inputId - 1] = {
      ...updatedInputs[inputId - 1],
      nameToType: intValue || 0,
    };

    setInputs(updatedInputs);
    console.log(inputs[inputId - 1].nameToType);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValues: { [key: string]: string } = {};

    for (const [key, value] of formData.entries()) {
      formValues[key] = value.toString();
    }

    formValues["quantity"] = inputs.length.toString();

    console.log(formValues);

    userService
      .insertFormData(formValues)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error inserting form data:", error);
      });

    setInputs([{ id: 1, nameToType: 0 }]);
    e.currentTarget.reset();
    setCustomEnable(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container flex-fill d-flex flex-column overflow-auto"
    >
      <div className="row justify-content-between mt-3 pe-0 ">
        <div className="col-md-4 form-floating">
          <input
            type="text"
            className="form-control form-control-lg"
            id="company-name"
            name="companyName"
            placeholder="Company name"
            required
          />
          <label htmlFor="company-name" className="ms-2">
            Company name
          </label>
        </div>

        <div className="form-floating col-md-4">
          <input
            type="date"
            className="form-control form-control-lg"
            id="date"
            name="date"
            required
          />
          <label className="ms-2" htmlFor="date">
            Date
          </label>
        </div>
      </div>

      <div className="row justify-content-between  pe-0">
        <div className="col-md-4 form-floating">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            aria-label="Email"
            id="email"
            name="email"
            required
          />
          <label className="ms-2" htmlFor="email">
            Email
          </label>
        </div>

        <div className="form-check col-auto">
          <input
            className="form-check-input"
            type="checkbox"
            name="customInput"
            onClick={() => {
              setCustomEnable(!customEnable);
            }}
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Custom user
          </label>
        </div>
        {customEnable ? (
          <div className="form-floating  col-md-4">
            <input
              type="text"
              className="form-control"
              id="nameUser"
              placeholder="name"
              name="userName"
            />
            <label htmlFor="nameUser" className="ms-2">
              Name
            </label>
          </div>
        ) : (
          <div className="form-floating col-md-4">
            <select
              className="form-select"
              aria-label="Floating label select example"
              id="nameId"
              name="nameId"
              required
            >
              <option value="">Open this select menu</option>
              {UserD.users.map((user) => (
                <option value={user.id} key={user.id}>
                  {user.username}
                </option>
              ))}
              <option value="">Other</option>
            </select>
            <label htmlFor="nameId" className="ms-2">
              select User
            </label>
          </div>
        )}
      </div>
      <div className="col-md-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control  form-control-lg ps-1 pe-1 pb-0"
            placeholder="+960"
            id="phoneCode"
            name="phoneCode"
            maxLength={4}
            pattern="\+[\d]{1,3}"
            style={{ maxWidth: "56px" }}
            title="Start with a plus, then only numbers"
          />

          <div className=" form-floating ">
            <input
              type="tel"
              className="form-control form-control-lg "
              name="phone"
              placeholder="phone"
              pattern="[0-9]{7,}"
              title="Must be atleast 7 Characters"
              required
            />
            <label htmlFor="phone">
              {/* className="ms-2"*/}
              Phone
            </label>
          </div>
        </div>
      </div>
      <div className="row justify-content-between mb-3 pe-0 ">
        <div className="form-floating col-md-4">
          <input
            type="date"
            className="form-control form-control-lg"
            id="pickupDate"
            name="pickupDate"
            required
          />
          <label className="ms-2" htmlFor="date">
            Pickup Date
          </label>
        </div>

        <div className=" col-md-4 form-floating">
          <label htmlFor="pickupLocation" className="form-label"></label>
          <textarea
            className="form-control"
            id="pickupLocation"
            name="pickupLocation"
            placeholder="Location"
          />
          <label htmlFor="pickupLocation" className="ms-2">
            Pickup Location
          </label>
        </div>
      </div>
      <div className="flex-grow-1 overflow-auto" style={{ minHeight: "108px" }}>
        <div className="input-group  mb-1 " style={{ height: "50px" }}>
          <div className="input-group-text col-1 col-lg-1">#</div>
          <div className="input-group-text col">Item Name</div>
          <div className="input-group-text col">Item Type</div>
          <div className="input-group-text ps-2 pe-0 col-2 col-lg-1">Total</div>
        </div>
        {inputs.map((input) => (
          <div className="input-group mb-1 grouph" key={input.id}>
            <div className="input-group-text index col-1 col-lg-1">
              {input.id}
            </div>

            <select
              className="form-select col"
              aria-label="select example"
              name={`itemName${input.id}`}
              onChange={(e) => handleChangeItem(input.id, e)}
              required
            >
              <option value="">Select Item Name</option>
              {UserD.items.map((item) => (
                <option
                  value={item.itemId + "." + item.itemName}
                  key={item.itemId}
                >
                  {item.itemName}
                </option>
              ))}
            </select>

            <select
              className="form-select col"
              aria-label="select example"
              name={`itemType${input.id}`}
              required
            >
              <option value="">Select Item Type</option>
              {UserD.subItems.map(
                (subItem) =>
                  subItem.itemItemId === input.nameToType && (
                    <option value={subItem.itemType} key={subItem.typeId}>
                      {subItem.itemType}
                    </option>
                  )
              )}
            </select>
            <div className="col-2 col-lg-1 grouph">
              <input
                type="number"
                name={`itemQuantity${input.id}`}
                aria-label="quantity"
                className="form-control "
                min={1}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <div className="container my-2 d-sm-flex justify-content-sm-around w-100">
        <button
          className="btn btn-success col-12 col-sm-4 col-xl-3"
          type="button"
          onClick={handleAddElement}
        >
          Add Element
        </button>
        <button
          className="btn btn-danger col-12 col-sm-4 col-xl-3"
          type="button"
          onClick={handleRemoveLastElement}
        >
          Remove
        </button>
        <button
          className="btn btn-primary col-12 col-sm-4 col-xl-3"
          type="submit"
        >
          Submit form
        </button>
      </div>
    </form>
  );
};

export default AdminBoard;
