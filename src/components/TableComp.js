import React, { useEffect, useState } from "react";
import "../styles/styles.css";
import { Button } from "@mui/material";
import Plus from "@mui/icons-material/PlusOne";
import Save from "@mui/icons-material/SaveAltTwoTone";
import utils from "../utils/utils";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import TableRowComp from "./TableRowComp";
import SearchComp from "./SearchComp";

const emptyRow = (rowNum) => {
  return {
    rowNumber: rowNum,
    nameError: false,
    catalogError: false,
    prodType: -1
  }
}

export default function TableComp(props) {
  const updateRowName = (value, row) => {
    let newRows = [...rows];
    let rowToUpdate = rows[parseInt(row.key)]

    rowToUpdate.props.data.name = value;
    newRows[row.key] = rowToUpdate;

    setRows(newRows);
  }

  const updateRowCatalogNumber = (value, row) => {
    let newRows = [...rows];
    let rowToUpdate = rows[parseInt(row.key)]

    rowToUpdate.props.data.catalogNum = value;
    newRows[row.key] = rowToUpdate;

    setRows(newRows);
  }

  const updateRowDescription = (value, row) => {
    let newRows = [...rows];
    let rowToUpdate = rows[parseInt(row.key)]

    rowToUpdate.props.data.decription = value;
    newRows[row.key] = rowToUpdate;

    setRows(newRows);
  }
  
  const updateRowProdType = (value, row) => {
    let newRows = [...rows];
    let rowToUpdate = rows[parseInt(row.key)]
    rowToUpdate.props.data.prodType = value;
    newRows[row.key] = rowToUpdate;

    setRows(newRows);
  }

  const [rows, setRows] = useState([
                                    <TableRowComp
                                      key={0}
                                      data={emptyRow(1)}
                                      updateRowName={updateRowName}
                                      updateRowCatalogNumber={updateRowCatalogNumber}
                                      updateRowDescription={updateRowDescription}
                                      updateRowProdType={updateRowProdType}
                                  />
  ]);

  const [filteredRows, setFilteredRows] = useState([]);

  const [hiddenVal, setHidden] = useState({
    blank: true,
    submit: true,
    saveError: true,
  });

  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  const searchRow = (searchedVal) => {
      let searchResults = []

      rows.forEach(row => {
        if (row.props.data.name.includes(searchedVal)) searchResults.push(row)
      })
      setFilteredRows(searchResults)
  };

  // function that checks if any of the input fields are blank
  const addRowIsAllowed = () => {
    let flag = true;
    rows.forEach((elem) => {
      const data = elem.props.data;
      if (!data.name || !data.catalogNum) flag = false;
    });

    return flag;
  };

  const changeErrorState = () => {
    let newRows = []
    rows.forEach(row => {
      let tempRow = row;
      
      if(row.props.data.name && row.props.data.catalogNum){
        newRows.push(tempRow)
      } else {
        if(!row.props.data.name){
          tempRow.props.data.nameError = true;
        } 
        if(!row.props.data.catalogNum){
          tempRow.props.data.catalogError = true;
        }
        newRows.push(tempRow)
      }
    })

    console.log('newRows ;:')
    console.log(newRows)
    setRows(newRows);
  };

  const addRow = () => {
    if (!addRowIsAllowed()) {
      changeErrorState();
      setHidden({ ...hiddenVal, blank: false });
    } else {
      let tempRows = rows;
      tempRows.push(
        <TableRowComp
            key={rows.length}
            data={emptyRow(rows.length + 1)}
            updateRowName={updateRowName}
            updateRowCatalogNumber={updateRowCatalogNumber}
            updateRowDescription={updateRowDescription}
            updateRowProdType={updateRowProdType}
        />
      )
      setRows(tempRows);
      setHidden({ blank: true, submit: true, saveError: true });
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
        await utils.sendDataToMongo(rows);
        props.setStatus(true);
        setHidden({ ...hiddenVal, saveError: true });
      } catch (error) {
        console.log(error);
        setHidden({ ...hiddenVal, saveError: false });
      }
    }
  };

  const renderBody = () => {
    let activeRows = [];
    activeRows = filteredRows.length !== 0 ? filteredRows : rows;
    return activeRows.map((row, index) => {
              return <TableRowComp 
                        key={index} 
                        data={row} 
                        updateRowName={updateRowName}
                        updateRowCatalogNumber={updateRowCatalogNumber}
                        updateRowDescription={updateRowDescription}
                        updateRowProdType={updateRowProdType}
                      />
            })
  }

  return (
    <div id="main-div">
      <div>
      <Dialog
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Must Fill Search Text..."}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setModalIsOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
      </div>
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
          {renderBody()}
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
