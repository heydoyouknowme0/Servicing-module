import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Alert,
  Row,
  Col,
  InputGroup,
  FormControl,
  Container,
} from "react-bootstrap";
import userService from "../services/user.service";
import "./AdminBoard.css";

interface Userd {
  drivers: User[];
  servicers: User[];
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
  const [formSubmissionStatus, setFormSubmissionStatus] = useState("");
  const [UserD, setUserD] = useState<Userd>({
    drivers: [],
    servicers: [],
    items: [],
    subItems: [],
  });

  useEffect(() => {
    userService
      .getAdminBoard()
      .then((response) => {
        setUserD(response.data);
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
  };
  const minDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const formValues: { [key: string]: string } = {};

    for (const [key, value] of formData.entries()) {
      formValues[key] = value.toString();
    }

    formValues["quantity"] = inputs.length.toString();

    userService
      .insertFormData(formValues)
      .then((response) => {
        setFormSubmissionStatus("success");
      })
      .catch((error) => {
        setFormSubmissionStatus("error");
      });

    setInputs([{ id: 1, nameToType: 0 }]);
    e.currentTarget.reset();
  };

  return (
    <Container fluid className="flex-fill d-flex flex-column overflow-auto">
      <Form
        onSubmit={handleSubmit}
        className="container flex-fill d-flex flex-column overflow-auto"
      >
        <Row className="justify-content-between mt-3 mt-md-0 mb-md-2 pe-0">
          <Col md={5} lg={4}>
            <Form.Floating>
              <Form.Control
                type="text"
                id="company-name"
                name="companyName"
                placeholder="Company name"
                required
              />
              <label htmlFor="company-name">Company name</label>
            </Form.Floating>
          </Col>
          <Col md={5} lg={4}>
            <Form.Floating>
              <Form.Select id="driverId" name="driverId" required>
                <option value="">Select Driver</option>
                {UserD.drivers.map((driver) => (
                  <option value={driver.id} key={driver.id}>
                    {driver.username}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="driverId">Drivers</label>
            </Form.Floating>
          </Col>
        </Row>
        <Row className="justify-content-between  pe-0 mb-md-2">
          <Col md={5} lg={4}>
            <Form.Floating>
              <Form.Control
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                required
              />
              <label htmlFor="email">Email</label>
            </Form.Floating>
          </Col>
          <Col md={5} lg={4}>
            <Form.Floating>
              <Form.Select id="servicerId" name="servicerId" required>
                <option value="">Select Servicer</option>
                {UserD.servicers.map((servicer) => (
                  <option value={servicer.id} key={servicer.id}>
                    {servicer.username}
                  </option>
                ))}
              </Form.Select>
              <label htmlFor="servicerId">Servicers</label>
            </Form.Floating>
          </Col>
        </Row>
        <Row className="justify-content-between  pe-0 mb-md-2">
          <Col md={5} lg={4}>
            <Form.Floating>
              <Form.Control
                type="text"
                id="nameUser"
                placeholder="name"
                name="userName"
              />
              <label htmlFor="nameUser">Customer Name</label>
            </Form.Floating>
          </Col>

          <Col md={5} lg={4}>
            <Form.Floating>
              <Form.Control
                type="date"
                id="pickupDate"
                name="pickupDate"
                min={minDate()}
                required
              />
              <label htmlFor="pickupDate">Pickup Date</label>
            </Form.Floating>
          </Col>
        </Row>
        <Row className="justify-content-between  pe-0 mb-md-2">
          <Col md={5} lg={4}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="+960"
                id="phoneCode"
                name="phoneCode"
                autoComplete="phoneCode"
                maxLength={4}
                pattern="\+[\d]{1,3}"
                style={{ maxWidth: "56px" }}
                title="Start with a plus, then only numbers"
                className="px-1"
              />
              <Form.Floating>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="phone"
                  pattern="[0-9]{7,}"
                  title="Must be at least 7 characters"
                  required
                />
                <label htmlFor="phone">Phone</label>
              </Form.Floating>
            </InputGroup>{" "}
          </Col>
          <Col md={5} lg={4}>
            <Form.Floating className="mb-2">
              <label htmlFor="pickupLocation"></label>
              <Form.Control
                as="textarea"
                id="pickupLocation"
                name="pickupLocation"
                placeholder="Location"
              />
              <label htmlFor="pickupLocation">Pickup Location</label>
            </Form.Floating>
          </Col>
        </Row>
        {formSubmissionStatus === "success" && (
          <Alert variant="success" className="mt-3">
            Request submitted successfully!
          </Alert>
        )}
        {formSubmissionStatus === "error" && (
          <Alert variant="danger" className="mt-3">
            Error submitting request. Please try again.
          </Alert>
        )}
        <div
          className="flex-grow-1 overflow-auto"
          style={{ minHeight: "108px" }}
        >
          <div className="input-group mb-1" style={{ height: "50px" }}>
            <div className="input-group-text col-1 col-lg-1">#</div>
            <div className="input-group-text col">Item Name</div>
            <div className="input-group-text col">Item Type</div>
            <div className="input-group-text ps-2 pe-0 col-2 col-lg-1">
              Total
            </div>
          </div>
          {inputs.map((input) => (
            <div className="input-group mb-1 grouph" key={input.id}>
              <div className="input-group-text index col-1 col-lg-1">
                {input.id}
              </div>
              <Form.Select
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
              </Form.Select>
              <Form.Select
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
              </Form.Select>
              <div className="col-2 col-lg-1 grouph">
                <Form.Control
                  type="number"
                  name={`itemQuantity${input.id}`}
                  aria-label="quantity"
                  min={1}
                  required
                />
              </div>
            </div>
          ))}
        </div>
        <div className="container my-2 d-sm-flex justify-content-sm-around w-100">
          <Button
            variant="success"
            className="col-12 col-sm-4 col-xl-3"
            type="button"
            onClick={handleAddElement}
          >
            Add Element
          </Button>
          <Button
            variant="danger"
            className="col-12 col-sm-4 col-xl-3 mx-sm-2"
            type="button"
            onClick={handleRemoveLastElement}
          >
            Remove
          </Button>
          <Button
            variant="primary"
            className="col-12 col-sm-4 col-xl-3"
            type="submit"
          >
            Submit form
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminBoard;
