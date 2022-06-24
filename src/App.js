import { Button } from "@mui/material";
import { useState } from "react";
import "./App.css";
import TableComp from "./components/TableComp";

function App() {
  const [abortVal, setAbortVal] = useState(false);
  const [status, setStatus] = useState(false);

  const abortFunc = () => {
    if (window.confirm("האם אתה בטוח שברצונך לעזוב את הדף?")) {
      setAbortVal(true);
    }
  };

  const backToMenu = () => {
    setStatus(false);
  };
  return (
    <div className="App">
      {status ? (
        <div>
          <h3>המידע נשמר בהצלחה, לחזרה לתפריט</h3>
          <Button variant="outlined" onClick={backToMenu}>
            לחץ כאן
          </Button>
        </div>
      ) : (
        <div>
          {abortVal ? (
            <p>לחזרה לעריכת הטבלה</p>
          ) : (
            <TableComp setStatus={setStatus} />
          )}

          <Button
            variant="outlined"
            onClick={!abortVal ? abortFunc : () => setAbortVal(false)}
          >
            {!abortVal ? "ביטול" : "לחץ כאן"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
