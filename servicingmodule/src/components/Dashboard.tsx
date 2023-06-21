import fakeData from "./MOCK_DATA.json";
import * as React from "react";
import { useTable, useSortBy } from "react-table";

interface DataType {
  id: number;
  name: string;
  email: string;
  status: string;
  date: string;
}

function App() {
  const data = React.useMemo<DataType[]>(() => fakeData, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id" as const,
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
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div className="container">
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
                  {console.log(column.isSortedDesc) as React.ReactNode}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "∨" : "∧") : ""}
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
              <tr {...row.getRowProps()}>
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
    </div>
  );
}

export default App;
