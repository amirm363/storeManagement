import React, { useEffect, useState } from "react";
import "../styles/tableRowStyle.css";
import { Button } from "@mui/material";
import Plus from "@mui/icons-material/PlusOne";
import Save from "@mui/icons-material/SaveAltTwoTone";
import utils from "../utils/utils";

import TableRowComp from "./TableRowComp";
import SearchComp from "./SearchComp";

export default function TableComp(props) {
  const [cellValues, setCellValues] = useState([]);
  const [rows, setRows] = useState([]);
  const [hiddenVal, setHidden] = useState({
    blank: true,
    submit: true,
    saveError: true,
  });
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
      setHidden({ ...hiddenVal, blank: false });
    } else {
      const temp = rows;
      rows.at(-1).nameError = false;
      rows.at(-1).catalogError = false;
      setRows(temp);

      setHidden({ blank: true, submit: true, saveError: true });
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

  const saveToDB = async () => {
    if (!addRowIsAllowed()) {
      changeErrorState();
      setHidden({ ...hiddenVal, submit: false });
    } else {
      rows.at(-1).nameError = false;
      rows.at(-1).catalogError = false;
      setHidden({ ...hiddenVal, submit: true });
      try {
        await utils.sendDataToMongo(cellValues);
        props.setStatus(true);
        setHidden({ ...hiddenVal, saveError: true });
      } catch (error) {
        console.log(error);
        setHidden({ ...hiddenVal, saveError: false });
      }
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
        <Button
          startIcon={<Save />}
          onClick={saveToDB}
          color={
            !hiddenVal.saveError || !hiddenVal.submit ? "error" : "primary"
          }
        >
          Save
        </Button>
      </div>
      <p hidden={hiddenVal.blank} style={{ color: "red" }}>
        לא ניתן להוסיף שורה חדשה אם אחד מהשדות: "שם מוצר" או "מק"ט" לא מלאים
      </p>
      <p hidden={hiddenVal.submit} style={{ color: "red" }}>
        לא ניתן לשמור את הנתונים אם השדות המסומנים באדום ריקים
      </p>
      <p hidden={hiddenVal.saveError} style={{ color: "red" }}>
        .קרתה תקלה בעת שמירת הנתונים, הנתונים לא נשמרו, אנא נסה שנית
      </p>
    </div>
  );
}
