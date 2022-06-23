import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import "../styles/tableRowStyle.css";

const SearchComp = (props) => {
  const [searchVal, setSearchVal] = useState("");
  const sendValueUp = () => {
    if (window.confirm("check")) {
      console.log("ok");
    } else {
      console.log("not ok");
    }
    props.setSearchedValue(searchVal);
  };
  return (
    <div>
      <TextField
        label="חיפוש"
        size="small"
        onChange={(e) => setSearchVal(e.target.value)}
      />
      <Button
        variant="contained"
        id="searchButton"
        disableElevation
        onClick={sendValueUp}
      >
        חפש
      </Button>
    </div>
  );
};

export default SearchComp;
