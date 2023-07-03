import "./AdminBoard.css";
import { useState } from "react";

interface InputElement {
  id: number;
  name: string;
  type: string;
  quantity: number;
}

const AdminBoard = () => {
  const [inputs, setInputs] = useState<InputElement[]>([
    { id: 1, name: "", type: "", quantity: 0 },
  ]);

  const handleAddElement = () => {
    const newId = inputs.length + 1;
    setInputs([...inputs, { id: newId, name: "", type: "", quantity: 0 }]);
  };

  const handleRemoveLastElement = () => {
    if (inputs.length === 1) {
      return;
    }
    const updatedInputs = [...inputs];
    updatedInputs.pop();
    setInputs(updatedInputs);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const formValues: { [key: string]: string } = {};

    // Iterate over form data and convert it to a plain object
    for (const [key, value] of formData.entries()) {
      formValues[key] = value.toString();
    }

    // Process the form values as needed
    console.log(formValues);
    // ... Perform further logic with the form data

    setInputs([{ id: 1, name: "", type: "", quantity: 0 }]);
    e.currentTarget.reset();
  };

  return (
    <div className="container cont-main">
      <form className="row needs-validation" onSubmit={handleSubmit}>
        <div className="row justify-content-end mb-3 mt-3">
          <div className="col-sm-auto">
            <div className="input-group">
              <div className="input-group-text">
                <label htmlFor="date" className="me-1">
                  <strong>Date</strong>
                </label>
              </div>
              <input
                type="date"
                className="form-control form-control-lg"
                id="date"
                name="date"
                required
              />
            </div>
            <div className="invalid-feedback">Please choose a username.</div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-auto">
            <div className="input-group">
              <div className="input-group-text">
                <label htmlFor="company-name" className="me-1">
                  <strong>Company name</strong>
                </label>
              </div>
              <input
                type="text"
                className="form-control form-control-lg"
                id="company-name"
                name="companyName"
                required
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-between mb-3 ">
          <div className="col-sm-4 form-floating">
            <input
              type="text"
              className="form-control form-control-lg "
              placeholder="First name"
              aria-label="First name"
              id="first-name"
              name="firstName"
              required
            />
            <label className="ms-2" htmlFor="first-name">
              First name
            </label>
          </div>
          <div className="col-sm-4 ">
            <select
              className="form-select form-select-lg h-100"
              aria-label=".form-select-lg example"
              id="select-option"
              name="selectedOption"
              required
            >
              <option defaultValue={0}>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>

        <div className="row mh-50" id="con1">
          {inputs.map((input) => (
            <div className="input-group group-grid" key={input.id}>
              <span className="input-group-text index">{input.id}</span>
              <span>
                <input
                  type="text"
                  name={`item_name_${input.id}`}
                  aria-label="Item Name"
                  className="form-control form-control-lg"
                  required
                />
              </span>
              <span>
                <input
                  type="text"
                  name={`item_type_${input.id}`}
                  aria-label="Item type"
                  className="form-control form-control-lg"
                />
              </span>
              <span>
                <input
                  type="number"
                  name={`item_quantity_${input.id}`}
                  aria-label="quantity"
                  className="form-control form-control-lg"
                  min={1}
                />
              </span>
            </div>
          ))}
        </div>
        <div className="row mt-3 justify-content-around fixed-bottom mb-3 ">
          <button className="btn btn-success col-2" onClick={handleAddElement}>
            Add Element
          </button>
          <button
            className="btn btn-danger col-2"
            type="button"
            onClick={() => handleRemoveLastElement()}
          >
            Remove
          </button>
          <button className="btn btn-primary col-2" type="submit">
            Submit form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBoard;
