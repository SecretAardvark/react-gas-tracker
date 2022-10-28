import { useState } from "react";
import { ethers } from "ethers";

const Balance = async (props) => {
  console.log(props.address);
  const [balance, setBalance] = useState("");

  const getEthBalance = async (address) => {
    if (typeof window.ethereum !== "undefined") {
      const account = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await account.getBalance(`${address}`);
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
    }
  };

  await getEthBalance();
  return <p>{balance ? `Current Balance:  ${balance}` : ""}</p>;
};

export default Balance;
