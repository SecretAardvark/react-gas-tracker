import { ethers } from "ethers";
import { useState } from "react";

const MetaMask = (props) => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");

  const getAccounts = async () => {
    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts[0]);
        setAddress(accounts[0]);
        setBalance(await getEthBalance(accounts[0]));
        console.log(balance);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("No metamask!");
    }
  };

  return (
    <div>
      <button onClick={getAccounts}>{"connect Metamask"}</button>
      <div>
        <p>
          Wallet Address: {`${address.slice(0, 5)}... ${address.slice(-4)}`}
        </p>
        <p>{balance ? `Current Balance:  ${balance}` : ""}</p>
        <p>{address ? "gas spent: xxx" : ""}</p>
      </div>
    </div>
  );
};

const getEthBalance = async (address) => {
  if (typeof window.ethereum !== "undefined") {
    const account = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await account.getBalance(`${address}`);
    const balanceInEth = ethers.utils.formatEther(balance);
    console.log(balanceInEth);
    return balanceInEth;
  }
};

export default MetaMask;
