import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import "../styles/styles.css";

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
