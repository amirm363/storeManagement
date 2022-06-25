import React, { useEffect, useState } from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import "../styles/styles.css";

export default function TableRowComp(props) {
  const lastWeekDate = () => {
    let date = new Date(new Date().toDateString());
    let localDate = new Date(
      date.getTime() - 7 * 24 * 60 * 60 * 1000
    ).toLocaleString("iw-IL");
    return localDate.split(",")[0];
  };

  const [rowVal, setRowVal] = useState({
    name: props?.data?.name || "",
    catalogNum: props?.data?.catalogNum || "",
    description: props?.data?.description || "",
    prodType: props?.data?.prodType || "",
    date: lastWeekDate(),
    nameError: props?.data?.nameError || false,
    catalogError: props?.data?.catalogError || false,
  });

  const handleChange = (e) => {
    switch (e.target.name !== undefined) {
      case e.target.name === "cell2":
        if (e.target.value === "") {
          props.data.nameError = true;
        } else {
          console.log("NAME ERROR false");
          props.data.nameError = false;
        }
        setRowVal({ ...rowVal, name: e.target.value });
        props?.setCellValues(rowVal, props.data.rowNumber);
        break;

      case e.target.name === "cell3":
        let temp = e.target.value.replace(
          /\D|^[6-9][0-9]$|^5[1-9]$|...|00|^[0-9]\D/g,
          e.target.value.slice(0, -1)
        );
        if (temp === "") {
          props.data.catalogError = true;
        } else {
          props.data.catalogError = false;
        }

        setRowVal({ ...rowVal, catalogNum: temp });
        props?.setCellValues(rowVal, props.data.rowNumber);
        break;

      case e.target.name === "cell4":
        setRowVal({ ...rowVal, description: e.target.value });
        props?.setCellValues(rowVal, props.data.rowNumber);
        break;

      default:
        setRowVal({ ...rowVal, prodType: e.target.value });
        props?.setCellValues(rowVal, props.data.rowNumber);
        break;
    }
  };

  useEffect(() => {
    props?.setCellValues(rowVal, props.data.rowNumber);
  }, [rowVal]);

  return (
    <tr id="table-body">
      <td>
        <TextField
          InputProps={{ readOnly: true }}
          value={props.data.rowNumber}
          size="small"
          fullWidth
        />
      </td>
      <td>
        <TextField
          type="text"
          name="cell2"
          size="small"
          inputProps={{ maxLength: 50 }}
          required
          onChange={handleChange}
          value={rowVal.name}
          error={rowVal.nameError || props.data?.nameError}
          fullWidth
        />
      </td>
      <td>
        <TextField
          type="text"
          name="cell3"
          required
          size="small"
          fullWidth
          onChange={handleChange}
          value={rowVal?.catalogNum}
          error={props.data?.catalogError || rowVal.catalogError}
        />
      </td>
      <td>
        <TextField
          type="text"
          name="cell4"
          multiline
          maxRows="1"
          size="small"
          onChange={handleChange}
          fullWidth
          value={rowVal.description}
        />
      </td>
      <td>
        <Select
          name="cell5"
          size="small"
          value={rowVal.prodType}
          fullWidth
          onChange={handleChange}
        >
          <MenuItem value={1}>ירק</MenuItem>
          <MenuItem value={2}>פרי</MenuItem>
          <MenuItem value={3}>גידולי שדה</MenuItem>
        </Select>
      </td>
      <td>
        <TextField
          type="text"
          InputProps={{ readOnly: true }}
          value={rowVal.date}
          name="cell6"
          size="small"
          fullWidth
        />
      </td>
    </tr>
  );
}
