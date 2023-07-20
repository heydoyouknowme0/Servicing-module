import { useEffect, useState, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import userService from "../../services/user.service";
import { format } from "date-fns";
import { ItemExtDataWrapper, DataType } from "../../types/user.type";
import "./UserPrint.css";
import ImageUploader from "./ImageUploader";
import { Button, Modal, Dropdown, Alert } from "react-bootstrap";

interface UserBoardSubTableProps {
  selectedRow: DataType | null;
  handleStatusChange: (newStatus: number, row: DataType) => void;
  showAdminBoard?: boolean;
  getStatusString: (status: number | string) => string;
}

const UserBoardSubTable: React.FC<UserBoardSubTableProps> = ({
  selectedRow,
  handleStatusChange,
  showAdminBoard,
  getStatusString,
}) => {
  const [itemExtData, setItemExtData] = useState<ItemExtDataWrapper>({
    data: [],
    ExtDataType: {
      phone: "",
      pickupDate: "",
      pickupLocation: "",
    },
  });

  const [localStatus, setLocalStatus] = useState<string | number | undefined>();
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle"); // Track submission status

  const onStatusChange = useCallback(
    (newStatus: number) => {
      if (selectedRow) {
        const updatedRow = {
          ...selectedRow,
          status: newStatus,
        };
        handleStatusChange(newStatus, updatedRow);
        setLocalStatus(getStatusString(newStatus));
      }
    },
    [selectedRow, handleStatusChange]
  );

  useEffect(() => {
    setLocalStatus(selectedRow?.status);
  }, []);

  useEffect(() => {
    const loadItemExtData = async () => {
      try {
        if (selectedRow) {
          const response = await userService.getItemsBoard(selectedRow.id);
          setItemExtData({
            data: response.data.userItems,
            ExtDataType: response.data.userData,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadItemExtData();
  }, [selectedRow, showAdminBoard]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    setSubmissionStatus("pending"); // Set submission status to pending

    userService
      .updateReceived(formData)
      .then((response) => {
        setSubmissionStatus("success"); // Set submission status to success
        setTimeout(() => {
          setSubmissionStatus("idle"); // Reset submission status after a delay
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setSubmissionStatus("error"); // Set submission status to error
        setTimeout(() => {
          setSubmissionStatus("idle"); // Reset submission status after a delay
        }, 3000);
      });
  };

  return (
    <>
      <Modal.Body className="overflow-auto">
        <div className="row">
          <div className="col-sm-6">
            <p>
              <strong>Name:</strong> {selectedRow?.userName}
              <br />
              <strong>Company Name:</strong> {selectedRow?.companyName}
              <br />
              <strong>Email:</strong> {selectedRow?.email}
              <br />
              <strong>Status:</strong> {localStatus}
              <br />
              <strong>Date:</strong> {selectedRow?.createdAt}
              <br />
              <strong>Phone:</strong>{" "}
              {itemExtData.ExtDataType?.phoneCode || "+960"}
              &nbsp;
              {itemExtData.ExtDataType?.phone}
            </p>
            <strong>Pickup Date:</strong>{" "}
            {itemExtData.ExtDataType?.pickupDate &&
              format(
                new Date(itemExtData.ExtDataType?.pickupDate),
                "dd-MM-yyyy"
              )}
            <br />
            <strong>Pickup Location:</strong>{" "}
            {itemExtData.ExtDataType?.pickupLocation}
            <br />
            <br />
          </div>
          <div className="col-sm-6">
            <p className={`${showAdminBoard ? "d-none d-print-block" : ""}`}>
              <strong className="fs-5">Requester</strong>
              <br />
              <strong> Name:</strong> {itemExtData.ExtDataType?.user?.username}
              <br />
              <strong>Email:</strong> {itemExtData.ExtDataType?.user?.email}
              <br />
              <strong>Phone:</strong>{" "}
              {itemExtData.ExtDataType?.user?.phoneCode || "+960"}
              &nbsp;{itemExtData.ExtDataType?.user?.phone}
            </p>
            <p
              className={`${
                showAdminBoard === false ? "d-none d-print-block" : ""
              }`}
            >
              <strong className="fs-5">Servicer</strong>
              <br />
              <strong> Name:</strong>{" "}
              {itemExtData.ExtDataType?.nameUser?.username}
              <br />
              <strong>Email:</strong> {itemExtData.ExtDataType?.nameUser?.email}
              <br />
              <strong>Phone:</strong>{" "}
              {itemExtData.ExtDataType?.nameUser?.phoneCode || "+960"}
              &nbsp;{itemExtData.ExtDataType?.nameUser?.phone}
            </p>
            <p
              className={`${
                showAdminBoard === undefined ? "d-none d-print-block" : ""
              }`}
            >
              <strong className="fs-5">Driver</strong>
              <br />
              <strong>Name:</strong>{" "}
              {itemExtData.ExtDataType?.driverUser?.username}
              <br />
              <strong>Email:</strong>{" "}
              {itemExtData.ExtDataType?.driverUser?.email}
              <br />
              <strong>Phone:</strong>{" "}
              {itemExtData.ExtDataType?.driverUser?.phoneCode || "+960"}
              &nbsp;{itemExtData.ExtDataType?.driverUser?.phone}
            </p>
          </div>
        </div>
        <h3 className="mt-3">Item Board</h3>
        <form onSubmit={handleSubmit} className="overflow-auto" id="myform">
          <table className="table t1 mb-4">
            <thead>
              <tr>
                <th scope="col" className="d-none d-sm-table-cell">
                  #
                </th>
                <th scope="col">Quantity</th>
                <th scope="col">Received</th>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {itemExtData.data.map((item, i) => (
                <tr key={item.id}>
                  <th scope="row " className="col-auto d-none d-sm-table-cell">
                    {i + 1}
                  </th>
                  <td className="col-auto">{item.itemQuantity}</td>
                  <td className="col-auto">
                    {showAdminBoard === false ? (
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={item.receivedQuantity}
                        name={`${item.id}`}
                        required
                      />
                    ) : (
                      item.receivedQuantity
                    )}
                  </td>
                  <td className="col-3">{item.itemName}</td>
                  <td className="col-3">{item.itemType}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="d-none" id="submit-form" type="submit" />
        </form>
        {itemExtData.ExtDataType?.user && selectedRow?.id ? (
          <ImageUploader
            id={selectedRow.id}
            image={itemExtData.ExtDataType?.image}
          />
        ) : null}
      </Modal.Body>
      <Modal.Footer className="d-print-none">
        {showAdminBoard ? (
          <Button variant="danger" onClick={() => onStatusChange(-2)}>
            Cancel
          </Button>
        ) : showAdminBoard === false ? (
          <label className="btn btn-success" htmlFor="submit-form">
            Update Received
          </label>
        ) : null}

        <div className="btn-group">
          <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic">
              Change Status
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onStatusChange(0)}>
                Mark Done
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onStatusChange(2)}>
                Accept
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onStatusChange(-1)}>
                Reject
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Button variant="warning" onClick={window.print}>
          Print
        </Button>
      </Modal.Footer>
      <CSSTransition
        in={submissionStatus !== "idle"}
        timeout={300}
        classNames="fade-message-fade"
        unmountOnExit
      >
        <Alert
          variant={submissionStatus === "success" ? "success" : "danger"}
          className="position-fixed bottom-0 end-0 mb-3 me-3"
        >
          {submissionStatus === "success"
            ? "Submitted successfully!"
            : "Submission error. Please try again."}
        </Alert>
      </CSSTransition>
    </>
  );
};

export default UserBoardSubTable;
