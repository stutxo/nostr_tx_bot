import { relayPool } from "nostr-tools";
import { getPublicKey } from "nostr-tools";
import { decrypt } from "nostr-tools/nip04.js";
import axios from "axios";

const pool = relayPool();
//temp private key for testing, will add local file or something similar
const privatekey =
  "a2de924a9e5a7d6cfade35ee5954de7a2bcbc82adc3e0c22e35576b913d21ac1";
//public key for users to message/add. need to add names
const key = getPublicKey(privatekey);

//connects to local relay for now
pool.addRelay("ws://127.0.0.1:7000", { read: true, write: true });
const time = Date.now() / 1000;
//filters out all previously stored events on the relay at start up
//only parses private messages sent to tx_bot
pool.sub({
  cb: (event) => {
    event.created_at > time ? getTxhex(event) : {};
  },
  filter: [{ "#p": [key] }, { authors: [key] }],
});

function getTxhex(event) {
  try {
    const pubkey = event.pubkey;
    const message = decrypt(privatekey, pubkey, event.content);

    //takes the command from the message to be used in the switch instance
    const command = message.substring(0, message.indexOf(" "));
    //takes the data that was inputed after the command
    const request = message.substring(message.indexOf(" ") + 1);

    switch (command.toLowerCase()) {
      case "!tx": {
        const config = {
          method: "post",
          url: "https://mempool.space/api/tx",
          data: request,
        };

        axios(config)
          .then(function (response) {
            //Responds with TXID if successful
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            if (error.response) {
              // Request made and server responded
              console.log(JSON.stringify(error.response.data));
            } else if (error.request) {
              // The request was made but no response was received
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
          });

        break;
      }
    }
  } catch (e) {
    //catches error messages without panicking, need to fix errors/format
    console.warn(e);
  }
}
