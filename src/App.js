import MetaMask from "./components/MetaMask";
import "./App.css";
//import { ethers } from "ethers";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Check how much gas you've spent</h1>
        <p>
          Connect your wallet and enter a date range to show how much gas you've
          spent in that time.
        </p>
        <MetaMask />
      </header>
    </div>
  );
}

export default App;
