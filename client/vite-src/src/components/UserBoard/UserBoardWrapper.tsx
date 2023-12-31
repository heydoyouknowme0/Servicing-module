import { useState, useMemo, useCallback, useEffect } from "react";
import { useTable, useSortBy, CellProps } from "react-table";
import { format } from "date-fns";
import { DataType } from "../../types/user.type";
import UserBoardSubTable from "./UserBoardSubTable";
import "./UserPrint.css";
import userService from "../../services/user.service";
import { Table, Button, Modal } from "react-bootstrap";

interface UserBoardWrapperProps {
  showAdminBoard?: boolean;
}

const UserBoardWrapper: React.FC<UserBoardWrapperProps> = ({
  showAdminBoard,
}) => {
  const [userData, setUserData] = useState<DataType[]>([]);
  const [selectedRow, setSelectedRow] = useState<DataType | null>(null);

  const handleStatusChange = useCallback(
    (newStatus: number, row: DataType) => {
      userService.changeStatus(newStatus, row.id).then(() => {
        const updatedData = userData.map((dataRow) => {
          if (dataRow.id === row.id) {
            return { ...dataRow, status: newStatus };
          }
          return dataRow;
        });

        setUserData(updatedData);
      });
    },
    [userData]
  );

  useEffect(() => {
    userService
      .getUserBoard(showAdminBoard)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [showAdminBoard]);

  const handleRowClick = useCallback((rowData: DataType) => {
    setSelectedRow(rowData);
  }, []);

  const handleDelete = useCallback(
    (id: number, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      userService
        .deleteData(id)
        .then(() => {
          setUserData((prevData) => prevData.filter((row) => row.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting row:", error);
        });
    },
    []
  );

  const getStatusString = useCallback((status: number | string) => {
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

  const formattedData = useMemo(() => {
    return userData.map((row) => {
      return {
        ...row,
        createdAt: format(new Date(row.createdAt), "dd-MM-yyyy"),
        status: getStatusString(row.status),
      };
    });
  }, [userData]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: (_: any, rowIndex: number) => rowIndex + 1,
        className: "d-none d-md-table-cell",
      },
      {
        Header: "Name",
        accessor: "userName" as const,
        className: "d-none d-sm-table-cell",
      },
      {
        Header: "Company Name",
        accessor: "companyName" as const,
      },
      {
        Header: "Requester",
        accessor: "requester" as const,
        className: "d-none d-md-table-cell",
      },
      {
        Header: "Driver",
        accessor: "driver" as const,
        className: "d-none d-md-table-cell",
      },
      {
        Header: "Servicer",
        accessor: "servicer" as const,
        className: "d-none d-md-table-cell",
      },
      {
        Header: "Email",
        accessor: "email" as const,
        className: "d-none d-sm-table-cell",
      },
      {
        Header: "Status",
        accessor: "status" as const,
      },
      {
        Header: "Date",
        accessor: "createdAt" as const,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: formattedData,
        initialState: {
          hiddenColumns: showAdminBoard
            ? ["requester"]
            : showAdminBoard === false
            ? ["servicer"]
            : ["driver"],
        },
      },
      useSortBy
    );

  return (
    <div className="container-md table-responsive d-print-none">
      <Table hover className="d-print-none" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={"header"}>
              {headerGroup.headers.map((column) => (
                <th
                  className={`col ${column.className}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id}
                >
                  {column.render("Header") as React.ReactNode}
                  <span className="ms-1">
                    {column.isSorted ? (column.isSortedDesc ? "⇓" : "⇑") : ""}
                  </span>
                </th>
              ))}
              <th style={{ textAlign: "center" }} key={`del`}>
                #
              </th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => handleRowClick(row.original)}
                className={
                  selectedRow?.id === row.original.id ? "selected" : ""
                }
                key={row.id}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id}
                    className={cell.column.className}
                  >
                    {cell.render("Cell") as React.ReactNode}
                  </td>
                ))}
                <td style={{ textAlign: "center" }} key={`d-${row.id}`}>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="py-0 px-1"
                    onClick={(event) => handleDelete(row.original.id, event)}
                  >
                    ❌
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal
        show={!!selectedRow}
        onHide={() => {
          setSelectedRow(null);
        }}
        keyboard={false}
        scrollable={true}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title as="h1" className="modal-title fs-3">
            Request Details
          </Modal.Title>
        </Modal.Header>
        <UserBoardSubTable
          selectedRow={selectedRow}
          handleStatusChange={handleStatusChange}
          getStatusString={getStatusString}
          showAdminBoard={showAdminBoard}
        />
      </Modal>
    </div>
  );
};

export default UserBoardWrapper;
