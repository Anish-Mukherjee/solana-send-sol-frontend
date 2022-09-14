import { FC, useState } from "react";
import styles from "../styles/Home.module.css";
import * as Web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const SendSolForm: FC = () => {
  const [txnSig, setTxnSig] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const sendSol = (event) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      alert("Wallet not connected or no publicKey");
      return;
    }
    const txnUrl = `https://explorer.solana.com/tx/${txnSig}?cluster=devnet`;
    const transaction = new Web3.Transaction();
    const recipientPubkey = new Web3.PublicKey(event.target.recipient.value);
    const sendSolInstruction = Web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubkey,
      lamports: Web3.LAMPORTS_PER_SOL * event.target.amount.value,
    });
    transaction.add(sendSolInstruction);
    sendTransaction(transaction, connection).then((sig) => {
      setTxnSig(sig);
      console.log(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
    });
  };

  return (
    <div>
      <form onSubmit={sendSol} className={styles.form}>
        <label htmlFor="amount">Amount (in SOL) to send:</label>
        <input
          id="amount"
          type="text"
          className={styles.formField}
          placeholder="e.g. 0.1"
          required
        />
        <br />
        <label htmlFor="recipient">Send SOL to:</label>
        <input
          id="recipient"
          type="text"
          className={styles.formField}
          placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
          required
        />
        <button type="submit" className={styles.formButton}>
          Send
        </button>
      </form>
    </div>
  );
};
