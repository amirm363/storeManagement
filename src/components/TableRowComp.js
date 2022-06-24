import React, { useEffect, useState } from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import "../styles/styles.css";

export default function TableRowComp(props) {
  const [rowVal, setRowVal] = useState({
    name: props?.data?.name || "",
    catalogNum: props?.data?.catalogNum || "",
    description: props?.data?.description || "",
    prodType: props?.data?.prodType || "",
    date: props?.data?.date || new Date(),
    nameError: props?.data?.nameError || false,
    catalogError: props?.data?.catalogError || false,
  });

  const handleChange = (e) => {
    switch (e.target.name !== undefined) {
      case e.target.name === "cell2":
        if (e.target.value === "") {
          rowVal.nameError = true;
        } else {
          rowVal.nameError = false;
        }
        setRowVal({ ...rowVal, name: e.target.value });
        props?.setCellValues(rowVal, props.data.rowNumber);
        break;

      case e.target.name === "cell3":
        let temp = e.target.value.replace(
          /\D|^[6-9][0-9]$|^5[1-9]$|...|00/g,
          e.target.value.slice(0, -1)
        );
        if (temp === "") {
          rowVal.catalogError = true;
        } else {
          rowVal.catalogError = false;
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
          error={props.data?.nameError || rowVal.nameError}
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
          value={new Date(
            rowVal.date.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toDateString()}
          name="cell6"
          size="small"
          fullWidth
        />
      </td>
    </tr>
  );
}
