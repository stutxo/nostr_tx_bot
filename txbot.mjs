import { relayPool } from "nostr-tools";
import { getPublicKey } from "nostr-tools";
import { decrypt } from "nostr-tools/nip04.js";
import mempoolJS from "@mempool/mempool.js";

const pool = relayPool();
//temp private key for testing, will add local file or something similar
const privatekey =
  "a2de924a9e5a7d6cfade35ee5954de7a2bcbc82adc3e0c22e35576b913d21ac1";
//public key for users to message/add. need to add names
const key = getPublicKey(privatekey);

//connects to local relay for now
pool.addRelay("ws://127.0.0.1:7000", { read: true, write: true });
const time = Date.now() / 1000
//filters out all previously stored events on the relay at start up 
//and only parses private messages sent to tx_bot
 const ev = pool.sub({cb:(event) => {
        
        event.created_at > time ? getTxhex(event) : {};
      
}, filter: [{ "#p": [key] }, { authors: [key] }]});

function getTxhex(event) {
  try {
    const pubkey = event.pubkey;
    const message = decrypt(privatekey, pubkey, event.content);
    //TODO check message for !tx message event and broadcast message to mempool api
    if (message.includes("!tx")) {
      const txhex = [message.slice(4)];
      sendTxhex(txhex);
    }
  } catch (e) {
    //catches error messages without panicking, need to fix errors/format
    console.warn(e);
  }
}

//sends txhex to mempool.space api
async function sendTxhex(txhex) {
  const {
    bitcoin: { transactions },
  } = mempoolJS();

  try {
    const postTx = await transactions.postTx({ txhex });
    console.log(JSON.stringify(postTx));
  } catch (e) {
    console.log(JSON.stringify(e));
  }
}
