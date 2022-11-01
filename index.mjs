import {relayPool} from 'nostr-tools'
import { getPublicKey } from 'nostr-tools'
import { decrypt } from 'nostr-tools/nip04.js'


const pool = relayPool()
//temp private key for testing, will add local file or something similar
const privatekey = 'a2de924a9e5a7d6cfade35ee5954de7a2bcbc82adc3e0c22e35576b913d21ac1'
//public key for users to message/add. need to add names
const key = getPublicKey(privatekey)

//connects to local relay for now
pool.addRelay('ws://127.0.0.1:7000', {read: true, write: true})

//subscribes only to private encrypted message events that are sent to this user/bot
pool.sub({cb: getTxid,   filter: [{ "#p": [key] }, { authors: [key] }]})

function getTxid(event) {
  try {
  const pubkey = event.pubkey
  console.log(pubkey)
  const message = decrypt(privatekey, pubkey, event.content)
  //TODO# check message for !txid message event and broadcast message to mempool api 
  console.log(message)
  } 
  //catches error messages without panicking, need to fix errors/format
  catch (e) {
    console.warn(e)
  }
}


