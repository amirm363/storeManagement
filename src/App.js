import { Button } from "@mui/material";
import { useState } from "react";
import "./App.css";
import TableComp from "./components/TableComp";

function App() {
  // State that states if the user left the edit table page
  const [abortVal, setAbortVal] = useState(false);
  // State that changes the buttons and what is rendered on the screen
  const [status, setStatus] = useState(false);

  // function to leave the table edit page
  const abortFunc = () => {
    if (window.confirm("האם אתה בטוח שברצונך לעזוב את הדף?")) {
      setAbortVal(true);
    }
  };
  //  function that allows the user go back to the table edit page after he left it
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
