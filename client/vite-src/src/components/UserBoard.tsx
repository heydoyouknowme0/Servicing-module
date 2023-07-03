import * as React from "react";
import { useTable, useSortBy } from "react-table";
import { format } from "date-fns";
import { DataType } from "../types/user.type";
import UserBoardSubTable from "./UserBoardSubTable";

function UserBoard({ data }: { data: DataType[] }) {
  const [selectedRow, setSelectedRow] = React.useState<DataType | null>(null);
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: (_: any, rowIndex: number) => rowIndex + 1,
      },
      {
        Header: "Name",
        accessor: "name" as const,
      },
      {
        Header: "Email",
        accessor: "email" as const,
      },
      {
        Header: "status",
        accessor: "status" as const,
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
    useTable({ columns, data }, useSortBy);

  return (
    <div
      className="container"
      style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}
    >
      <table className="table table-hover" {...getTableProps()}>
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
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => setSelectedRow(row.original)}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>
                    {cell.render("Cell") as React.ReactNode}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {selectedRow ? (
        <div
          className="modal model-backdrop show fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Request Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRow(null)}
                ></button>
              </div>
              <div className="modal-body">
                <strong>Name:</strong> {selectedRow.name}
                <br />
                <strong>Email:</strong> {selectedRow.email}
                <br />
                <strong>Status:</strong> {selectedRow.status}
                <br />
                <strong>Date:</strong>{" "}
                {format(new Date(selectedRow.date), "dd-MM-yyyy")}
                <UserBoardSubTable id={selectedRow.id} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRow(null);
                    console.log(12);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserBoard;
