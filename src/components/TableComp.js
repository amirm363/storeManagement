import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import { Button } from "@mui/material";
import Plus from "@mui/icons-material/PlusOne";
import Save from "@mui/icons-material/SaveAltTwoTone";
import utils from "../utils/utils";

import TableRowComp from "./TableRowComp";
import SearchComp from "./SearchComp";

// Constant that defines a new unintialized row
const emptyRow = {
  name: "",
  catalogNum: "",
  description: "",
  prodType: "",
  date: new Date(),
  nameError: false,
  catalogError: false,
};

export default function TableComp(props) {
  // State that holds the data of the table rows
  const [cellValues, setCellValues] = useState([
    { ...emptyRow, rowNumber: "1" },
  ]);
  // State that holds data on fields that should be visilbe or hidden dynamically
  const [hiddenVal, setHidden] = useState({
    blank: true,
    submit: true,
    saveError: true,
    notFound: true,
  });

  // State that holds a new components array that it will create by the "searchRow" and a flag to know if a search already happened
  const [searchedValue, setSearchedValue] = useState({
    searchedVals: [],
    didSearch: false,
  });

  // Functions that passed as props to the child component and fetches data from it to fill cellValues.
  const getCellData = (rowVal, rowNumber) => {
    const newArr = cellValues;
    newArr[rowNumber - 1] = {
      rowNumber: rowNumber,
      name: rowVal.name,
      catalogNum: rowVal.catalogNum,
      description: rowVal.description,
      prodType: rowVal.prodType,
      date: rowVal.date,
      nameError: rowVal.nameError,
      catalogError: rowVal.catalogError,
    };
    setCellValues(newArr);
  };

  // Function that passed to SearchComp to retrive the search value from the user input.
  const searchRow = (searchedVal) => {
    let searchedResults = [];
    // Searching for the searched name value inside cellValues state and creating a new components array to render.
    cellValues.forEach((row) => {
      if (row.name.includes(searchedVal)) {
        searchedResults.push(
          <TableRowComp
            key={row.rowNumber - 1}
            data={row}
            setCellValues={getCellData}
          />
        );
      }
    });

    if (!searchedVal) {
      setSearchedValue({ searchedVals: [], didSearch: false });
      setHidden({ ...hiddenVal, notFound: true });
    } else if (searchedResults.length !== 0) {
      setSearchedValue({ searchedVals: [...searchedResults], didSearch: true });
      setHidden({ ...hiddenVal, notFound: true });
    } else {
      setHidden({ ...hiddenVal, notFound: false });
    }
  };

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
      const temp = cellValues;
      temp.at(-1).nameError = true;
      setCellValues(temp);
    }
    if (cellValues[cellValues.length - 1].catalogNum === "") {
      const temp = cellValues;
      temp.at(-1).catalogError = true;
      setCellValues(temp);
    }
  };

  const addRow = () => {
    console.log(cellValues);
    if (!addRowIsAllowed()) {
      console.log("CHECKS IF HERE");
      changeErrorState();
      setHidden({ ...hiddenVal, blank: false });
    } else {
      const temp = cellValues;
      temp.at(-1).nameError = false;
      temp.at(-1).catalogError = false;
      setCellValues(temp);

      setHidden({ blank: true, submit: true, saveError: true, notFound: true });
      setCellValues([
        ...cellValues,
        { ...emptyRow, rowNumber: cellValues.length + 1 },
      ]);
    }
  };

  const saveToDB = async () => {
    if (!addRowIsAllowed()) {
      changeErrorState();
      setHidden({ ...hiddenVal, submit: false });
    } else {
      const temp = cellValues;
      temp.at(-1).nameError = false;
      temp.at(-1).catalogError = false;
      setCellValues(temp);
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

  const renderBody = () => {
    if (searchedValue.didSearch) {
      return searchedValue.searchedVals.map((row, index) => {
        console.log(row);
        return row;
      });
    } else
      return cellValues.map((row, index) => {
        console.log("cellValues ROW");
        console.log(cellValues);
        return (
          <TableRowComp key={index} data={row} setCellValues={getCellData} />
        );
      });
  };

  return (
    <div id="main-div">
      <div>
        <SearchComp setSearchedValue={searchRow} />
        <p hidden={hiddenVal.notFound} style={{ color: "red" }}>
          לא נמצאו התאמות
        </p>
      </div>
      <div
        style={
          hiddenVal.notFound
            ? { visibility: "visible" }
            : { visibility: "hidden" }
        }
      >
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
          <tbody>{renderBody()}</tbody>
        </table>

        <div
          id="buttons"
          style={
            hiddenVal.notFound && !searchedValue.didSearch
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
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
    </div>
  );
}
