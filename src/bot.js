import { relayPool } from "nostr-tools";
import { getPublicKey } from "nostr-tools";
import { decrypt, encrypt } from "nostr-tools/nip04.js";
import axios from "axios";
//import mempoolJS from "@mempool/mempool.js";

export function start_bot() {
  const pool = relayPool();

  const privatekey = process.env.NOSTR_PRIVATE_KEY;

  pool.setPrivateKey(privatekey);
  const mykey = getPublicKey(privatekey);

  //connects to relays
  //pool.addRelay("ws://127.0.0.1:7000", { read: true, write: true });
  pool.addRelay("wss://relay.damus.io", { read: true, write: true });
  // pool.addRelay("wss://relay.nostr.info", { read: true, write: true });
  // pool.addRelay("wss://nostr.onsats.org", { read: true, write: true });
  // pool.addRelay("wss://nostr-pub.wellorder.net", { read: true, write: true });

  //creates profile for bot
  const profile = {
    name: "mempool_bot",
    about: "bitcoin mempool bot, DM !commands for info",
  };

  pool.publish({
    pubkey: mykey,
    created_at: Math.round(Date.now() / 1000),
    kind: 0,
    tags: [[""]],
    content: JSON.stringify(profile),
  });

  const time = Math.round(Date.now() / 1000);
  //filters out all previously stored events on the relay at start up

  //only parses private messages sent to tx_bot
  pool.sub({
    cb: (event) => {
      event.created_at > time ? getTxhex(event) : {};
    },
    filter: [{ "#p": [mykey] }, { authors: [mykey] }],
  });

  function getTxhex(event) {
    try {
      const pubkey = event.pubkey;
      const message = decrypt(privatekey, pubkey, event.content);
      //const message = event.content;

      //takes the command from the message to be used in the switch instance
      const command = message.substring(0, message.indexOf(" "));
      //takes the data that was inputed after the command
      const request = message.substring(message.indexOf(" ") + 1);

      switch (command.toLowerCase()) {
        case "!txsend": {
          const config = {
            method: "post",
            url: "https://mempool.space/api/tx",
            data: request,
          };

          axios(config)
            .then(function (response) {
              //Responds with TXID if successful
              console.log(JSON.stringify(response.data));
              pool.publish({
                pubkey: mykey,
                created_at: Math.round(Date.now() / 1000),
                kind: 4,
                tags: [["p", pubkey]],
                content: encrypt(privatekey, pubkey, response.data),
              });
            })
            .catch(function (error) {
              if (error.response) {
                // Request made and server responded
                console.log(JSON.stringify(error.response.data));
                pool.publish({
                  pubkey: mykey,
                  created_at: Math.round(Date.now() / 1000),
                  kind: 4,
                  tags: [["p", pubkey]],
                  content: encrypt(privatekey, pubkey, error.response.data),
                });
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
        // case "!txinfo": {
        //   const {
        //     bitcoin: { transactions },
        //   } = mempoolJS({
        //     hostname: "mempool.space",
        //   });

        //   const txid = request;
        //   const txStatus = transactions.getTxStatus({ txid });
        //   console.log(txStatus);

        //   break;
        // }
        default: {
          const command_reply =
            "!txsend: Broadcast txhex\n!txinfo: retrieve info for txid\n!help: how to use";

          message.includes("!commands")
            ? pool.publish({
                pubkey: mykey,
                created_at: Math.round(Date.now() / 1000),
                kind: 4,
                tags: [["p", pubkey]],
                content: encrypt(privatekey, pubkey, command_reply),
              })
            : {};
          break;
        }
      }
    } catch (e) {
      //catches error messages without panicking, need to fix errors/format
      // console.warn(e);
    }
  }
}
