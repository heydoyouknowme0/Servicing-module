import "./Mainpage.css";
import { useState, ChangeEvent } from "react";
interface InputElement {
  id: number;
  name: string;
  type: string;
  quantity: number;
}

const Mainpage = () => {
  (() => {
    "use strict";
    const forms = document.querySelectorAll(".needs-validation");

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  })();
  // window.onbeforeunload = function(){
  //   // Check the state of the form
  //    if(form_changed){
  //      return false;
  //    }else{
  //      return true;
  //    }
  // };
  const [inputs, setInputs] = useState<InputElement[]>([
    { id: 1, name: "", type: "", quantity: 0 },
  ]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [name]: value };
    setInputs(newInputs);
  };

  const handleAddElement = () => {
    const newId = inputs.length + 1;
    setInputs([...inputs, { id: newId, name: "", type: "", quantity: 0 }]);
  };

  return (
    <div className="container cont-main">
      <form className="row needs-validation" noValidate>
        <div className="row justify-content-end mb-3">
          <div className="col-sm-auto">
            <div className="input-group has-validation">
              <div className="input-group-text">
                <label htmlFor="date" className="me-1">
                  <strong>Date</strong>
                </label>
              </div>
              <input
                type="date"
                className="form-control form-control-lg is-invalid"
                id="date"
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
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-between mb-3 ">
          <div className="col-sm-4 form-floating  gx-1 ms-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="First name"
              aria-label="First name"
            />
            <label htmlFor="First name">First name</label>
          </div>
          <div className="col-sm-4 ">
            <select
              className="form-select form-select-lg h-100"
              aria-label=".form-select-lg example"
            >
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>
        {/* <div className="input-group" id="group-grid">
          <span className="input-group-text index">1</span>
          <span>
            <input
              type="text"
              aria-label="Item Name"
              className="form-control"
            />
          </span>
          <span>
            <input
              type="text"
              aria-label="Item type"
              className="form-control"
            />
          </span>
          <span>
            <input
              type="number"
              aria-label="quantity"
              className="form-control"
              min={1}
            />
          </span>
        </div> */}
        <div className="row" id="con1">
          {inputs.map((input, index) => (
            <div className="input-group group-grid" key={input.id}>
              <span className="input-group-text index">{input.id}</span>
              <span>
                <input
                  type="text"
                  name="name"
                  aria-label="Item Name"
                  className="form-control"
                  value={input.name}
                  onChange={(e) => handleChange(index, e)}
                />
              </span>
              <span>
                <input
                  type="text"
                  name="type"
                  aria-label="Item type"
                  className="form-control"
                  value={input.type}
                  onChange={(e) => handleChange(index, e)}
                />
              </span>
              <span>
                <input
                  type="number"
                  name="quantity"
                  aria-label="quantity"
                  className="form-control"
                  min={1}
                  value={input.quantity}
                  onChange={(e) => handleChange(index, e)}
                />
              </span>
            </div>
          ))}
        </div>
        <div className="row mt-3 justify-content-around">
          <button
            className="btn btn-secondary col-2"
            onClick={handleAddElement}
          >
            Add Element
          </button>
          <button className="btn btn-primary col-2" type="submit">
            Submit form
          </button>
        </div>
      </form>
    </div>
  );
};

<>
  //{" "}
  {/*
// export default Mainpage;
// import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";

// const Mainpage = () => {
//   const handleSubmit = (event) => {
//     const form = event.currentTarget;
//     if (!form.checkValidity()) {
//       event.preventDefault();
//       event.stopPropagation();
//     }
//     form.classList.add("was-validated");
//   };

//   return (
//     <div className="container">
//       <Form className="row needs-validation" noValidate onSubmit={handleSubmit}>
//         <Row className="justify-content-end mb-3">
//           <Col sm="auto">
//             <InputGroup hasValidation>
//               <InputGroup.Text>
//                 <Form.Label htmlFor="date">
//                   <strong>Date</strong>
//                 </Form.Label>
//               </InputGroup.Text>
//               <Form.Control
//                 type="date"
//                 className="form-control-lg is-invalid"
//                 id="date"
//                 required
//               />
//               <Form.Control.Feedback type="invalid">
//                 Please choose a date.
//               </Form.Control.Feedback>
//             </InputGroup>
//           </Col>
//         </Row>

//         <Row className="mb-3">
//           <Col sm="auto">
//             <InputGroup>
//               <InputGroup.Text>
//                 <Form.Label htmlFor="company-name">
//                   <strong>Company name</strong>
//                 </Form.Label>
//               </InputGroup.Text>
//               <Form.Control
//                 type="text"
//                 className="form-control-lg"
//                 id="company-name"
//                 required
//               />
//             </InputGroup>
//           </Col>
//         </Row>

//         <Row className="justify-content-between">
//           <Col sm="4">
//             <Form.Control
//               type="text"
//               className="form-control-lg"
//               placeholder="First name"
//               aria-label="First name"
//               required
//             />
//           </Col>
//           <Col sm="4">
//             <Form.Select
//               className="form-select-lg mb-3"
//               aria-label=".form-select-lg example"
//             >
//               <option selected>Open this select menu</option>
//               <option value="1">One</option>
//               <option value="2">Two</option>
//               <option value="3">Three</option>
//             </Form.Select>
//           </Col>
//         </Row>
//         <Col>
//           <Button variant="primary" type="submit">
//             Submit form
//           </Button>
//         </Col>
//       </Form>
//     </div>
//   );
// };
// */}
</>;

export default Mainpage;
