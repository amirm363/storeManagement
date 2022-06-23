import React, { useEffect, useState } from "react";
import "../styles/tableRowStyle.css";
import { Button } from "@mui/material";
import Plus from "@mui/icons-material/PlusOne";
import Save from "@mui/icons-material/SaveAltTwoTone";

import TableRowComp from "./TableRowComp";
import SearchComp from "./SearchComp";

export default function TableComp() {
  const [cellValues, setCellValues] = useState([]);
  const [rows, setRows] = useState([]);
  const [hiddenVal, setHidden] = useState({ blank: true, submit: true });
  const [searchedValue, setSearchedValue] = useState("");

  // Functions that passed as props to the child component and fetches data from it to fill cellValues.
  const getCellData = (rowVal, rowNumber) => {
    const newArr = cellValues;
    newArr[rowNumber - 1] = {
      name: rowVal.name,
      catalogNum: rowVal.catalogNum,
      description: rowVal.description,
      prodType: rowVal.prodType,
      date: rowVal.date,
    };
    setCellValues(newArr);
  };

  const searchRow = (searchedVal) => {
    if (searchedVal === "") searchedVal = undefined;
    let tempRow = cellValues.find((row) => row.name === searchedVal);
    console.log(tempRow);
    tempRow ? setSearchedValue([firstRow]) : setSearchedValue("");
  };
  //   allows to create the first row in the table
  const firstRow = {
    setCellValues: getCellData,
    rowNumber: "1",
    nameError: false,
    catalogError: false,
  };
  useEffect(() => {
    setRows([firstRow]);
  }, []);

  // function that checks if any of the input fields are blank
  const addRowIsAllowed = () => {
    let flag = true;
    cellValues.forEach((elem) => {
      if (elem.name === "" || elem.catalogNum === "") flag = false;
    });

    console.log("flag");
    console.log(flag);
    return flag;
  };

  const changeErrorState = () => {
    if (cellValues[cellValues.length - 1].name === "") {
      const temp = rows;
      rows.at(-1).nameError = true;
      setRows(temp);
    }
    if (cellValues[cellValues.length - 1].catalogNum === "") {
      const temp = rows;
      rows.at(-1).catalogError = true;
      setRows(temp);
    }
  };

  const addRow = () => {
    console.log(cellValues);
    if (!addRowIsAllowed()) {
      changeErrorState();
      console.log("INSIDE THE IF");
      setHidden({ ...hiddenVal, blank: false });
    } else {
      const temp = rows;
      rows.at(-1).nameError = false;
      rows.at(-1).catalogError = false;
      setRows(temp);
      setHidden({ ...hiddenVal, blank: true });
      setRows((previousRows) => {
        return [
          ...previousRows,
          {
            setCellValues: getCellData,
            rowNumber: rows.length + 1,
            priceError: false,
            quantityError: false,
          },
        ];
      });
    }
  };
  return (
    <div id="main-div">
      <div>
        <SearchComp setSearchedValue={searchRow} />
      </div>
      <table>
        <thead>
          <tr id="table-head">
            <th>מספר</th>
            <th>שם המוצר</th>
            <th>מק"ט</th>
            <th>תיאור המוצר</th>
            <th>סוג המוצר</th>
            <th>תאריך שיווק</th>
          </tr>
        </thead>
        <tbody>
          {searchedValue !== ""
            ? searchedValue.map((row, index) => {
                return <TableRowComp key={index} data={row} />;
              })
            : rows.map((row, index) => {
                return (
                  <TableRowComp
                    key={index}
                    data={row}
                    cellValues={cellValues[index]}
                  />
                );
              })}
        </tbody>
      </table>
      <div id="buttons">
        <Button startIcon={<Plus />} size="large" onClick={addRow}>
          Add new
        </Button>
        <Button startIcon={<Save />}>Save</Button>
      </div>
      <p hidden={hiddenVal.blank} style={{ color: "red" }}>
        לא ניתן להוסיף שורה חדשה אם אחד מהשדות: "שם מוצר" או "מק"ט" לא מלאים
      </p>
    </div>
  );
}
