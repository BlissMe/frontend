import { BrowserRouter } from "react-router-dom";
import Routerset from "./routes/Routerset";
import { useDisableDevTools } from "./helpers/useDisableDevTools";

function App() {
  // useDisableDevTools();

  return (
    <BrowserRouter>
      <Routerset />
    </BrowserRouter>
  );
}

export default App;
