import { TextField } from "@mui/material";
import React from "react";
import "../styles/styles.css";

/* search component with Mui TextField comp that acts as search input,
it send the data back to TableRowComp to be processed*/
const SearchComp = (props) => {
  return (
    <div>
      <TextField
        label="חיפוש"
        size="small"
        onChange={(e) => props.setSearchedValue(e.target.value)}
      />
    </div>
  );
};

export default SearchComp;
