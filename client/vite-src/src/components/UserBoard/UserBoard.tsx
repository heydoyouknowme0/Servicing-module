import { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, useSortBy, CellProps } from "react-table";
import { format } from "date-fns";
import { DataType } from "../../types/user.type";
import UserBoardSubTable from "./UserBoardSubTable";
import "./UserPrint.css";
interface UserBoardProps {
  data: DataType[];
  showAdminBoard: boolean;
  onStatusChange: (newStatus: number, row: DataType) => void;
}

const UserBoard: React.FC<UserBoardProps> = ({
  data,
  showAdminBoard,
  onStatusChange,
}) => {
  const [selectedRow, setSelectedRow] = useState<DataType | null>(null);

  const handleStatus = (newStatus: number, selRow: DataType) => {
    onStatusChange(newStatus, selRow);
    setSelectedRow({ ...selRow, status: newStatus });
  };
  const handleRowClick = (rowData: DataType) => {
    setSelectedRow(() => rowData);
  };

  const getStatusString = useCallback((status: number) => {
    switch (status) {
      case 0:
        return "Complete";
      case 1:
        return "Requested";
      case -2:
        return "Cancelled";
      case 2:
        return "Approved";
      case -1:
        return "Rejected";
      default:
        return "Unknown";
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (_: any, rowIndex: number) => rowIndex + 1,
      },
      {
        Header: "Name",
        accessor: "userName" as const,
      },
      {
        Header: "Company Name",
        accessor: "companyName" as const,
      },
      {
        Header: "Email",
        accessor: "email" as const,
      },
      {
        Header: "Status",
        accessor: "status" as const,
        Cell: ({ value }: CellProps<DataType>) => getStatusString(value),
      },
      {
        Header: "Date",
        accessor: "date" as const,
        Cell: ({ value }: { value: string }) =>
          format(new Date(value), "dd-MM-yyyy"),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          hiddenColumns: !showAdminBoard ? ["companyName"] : [],
        },
      },
      useSortBy
    );

  return (
    <div className=" container table-responsive ">
      <table className="table table-hover d-print-none" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className="col"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header") as React.ReactNode}
                  <span className="ms-1">
                    {column.isSorted ? (column.isSortedDesc ? "⇓" : "⇑") : ""}
                  </span>
                </th>
              ))}
              <th style={{ textAlign: "center" }}>#</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => {
                  handleRowClick(row.original);
                }}
                key={row.original.id}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>
                    {cell.render("Cell") as React.ReactNode}
                  </td>
                ))}
                <td style={{ textAlign: "center" }} key={row.original.id}>
                  <button className="btn btn-outline-danger py-0 px-1">
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedRow && (
        <div
          className="modal model-backdrop show fade "
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-3">Request Details</h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRow(null)}
                ></button>
              </div>
              <div className="modal-body mb-3">
                <strong>Name:</strong> {selectedRow?.userName}
                <br />
                {showAdminBoard ? (
                  <>
                    <strong>Company Name:</strong> {selectedRow?.companyName}
                    <br />
                  </>
                ) : null}
                <strong>Email:</strong>
                {selectedRow?.email}
                <br />
                <strong>Status:</strong> {getStatusString(selectedRow?.status)}
                <br />
                <strong>Date:</strong>{" "}
                {format(new Date(selectedRow?.date), "dd-MM-yyyy")}
                <UserBoardSubTable id={selectedRow?.id} val={showAdminBoard} />
              </div>
              <div className="modal-footer d-print-none">
                {showAdminBoard ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      handleStatus(-2, selectedRow);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-info dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="true"
                  >
                    Change Status
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          handleStatus(0, selectedRow);
                        }}
                      >
                        Mark Done
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          handleStatus(2, selectedRow);
                        }}
                      >
                        Accept
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          handleStatus(-1, selectedRow);
                        }}
                      >
                        Reject
                      </a>
                    </li>
                  </ul>
                </div>
                <button className="btn btn-warning" onClick={window.print}>
                  Print
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRow(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBoard;
