/* global BigInt */

import { ethers } from "ethers";
import { useState } from "react";

const MetaMask = (props) => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [usdPrice, setUsdPrice] = useState(0);
  const [totalGas, setTotalGas] = useState(0);

  const getAccounts = async () => {
    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log(accounts[0]);
        setAddress(accounts[0]);

        const ethBalance = await getEthBalance(accounts[0]);
        setBalance(ethBalance);

        const usdPrice = await getUsdPrice();
        setUsdPrice(usdPrice);
        const transactions = await getTransactions(accounts[0]);
        let gasPerTx = convertToEth(transactions, accounts[0]);
        let gasTotal = getTotalGas(gasPerTx);
        console.log(gasTotal);
        setTotalGas(gasTotal);
        console.log(balance);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("No metamask!");
    }

    console.log(address);
    console.log(balance);
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

  const getTransactions = async (address) => {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const transactions = data.result;
    console.log(transactions);
    return transactions;
  };

  const getUsdPrice = async () => {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
    const response = await fetch(url);
    const data = await response.json();
    const usdPrice = data["ethereum"]["usd"];
    console.log(usdPrice);
    return usdPrice;
  };

  const convertToEth = (transactions, address) => {
    let gasPerTx = [];
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].from === address) {
        let gasInEth =
          BigInt(transactions[i].gasUsed) * BigInt(transactions[i].gasPrice);
        gasPerTx.push(ethers.utils.formatEther(gasInEth));
      }
    }
    return gasPerTx;
  };

  const getTotalGas = (gasPerTx) => {
    let totalGas = 0;
    for (let i = 0; i < gasPerTx.length; i++) {
      totalGas += parseFloat(gasPerTx[i]);
    }
    return totalGas;
  };

  return (
    <div onLoad={getAccounts}>
      {!address ? (
        <button onClick={getAccounts}>{"connect Metamask"}</button>
      ) : (
        <p></p>
      )}
      <div>
        {address ? (
          <p>
            Wallet Address: {`${address.slice(0, 5)}... ${address.slice(-4)}`}
          </p>
        ) : (
          <p></p>
        )}
        {balance ? <p> Current Balance: {balance.slice(0, 6)} </p> : <p></p>}
        <p>
          {address
            ? `You've spent ⟠${totalGas.toPrecision(4)} in gas!\n thats $${(
                totalGas * usdPrice
              ).toPrecision(5)}!`
            : ""}
        </p>
      </div>
    </div>
  );
};

const API_KEY = "N4BBIS5GHB73M8IPTREGWP3IDR49Z3VA9D";

export default MetaMask;
