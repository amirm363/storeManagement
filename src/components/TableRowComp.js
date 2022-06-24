import React from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import "../styles/styles.css";

export default function TableRowComp(props) {
  console.log('props ::')
  console.log(props)
  return (
    <tr id="table-body">
      <td>
        <TextField
          name="rowNumber"
          type="number"
          value={props.data.props.data.rowNumber}
          size="small"
          fullWidth
          InputProps={{ readOnly: true }}
        />
      </td>
      <td>
        <TextField
          name="name"
          type="text"
          size="small"
          inputProps={{ maxLength: 50 }}
          required
          onChange={(e) => props.updateRowName(e.target.value, props.data)}
          value={props.data.props.data.name || ''}
          error={props.data.props.data.nameError}
          fullWidth
        />
      </td>
      <td>
        <TextField
          name="catalogNumber"
          type="text"
          required
          size="small"
          fullWidth
          onChange={(e) => props.updateRowCatalogNumber(e.target.value, props.data)}
          value={props.data.props.data.catalogNum || ''}
          error={props.data.props.data.catalogError}
        />
      </td>
      <td>
        <TextField
          name="decription"
          type="text"
          multiline
          maxRows="1"
          size="small"
          onChange={(e) => props.updateRowDescription(e.target.value, props.data)}
          fullWidth
          value={props.data.props.data.description || ''}
        />
      </td>
      <td>
        <Select
          name="prodType"
          size="small"
          value={props.data.props.data.prodType}
          fullWidth
          onChange={(e) => props.updateRowProdType(e.target.value, props.data)}
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
          value={new Date()}
          name="cell6"
          size="small"
          fullWidth
        />
      </td>
    </tr>
  );
}
