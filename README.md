# nostr_txid_bot

## nostr bot that relays bitcoin txid's to the mempool. 

WORK IN PRORESS 

Send an encrypted direct message to txid_bot using your favourite nostr client, containing !txid followed by a bitcoin txid and the bot will forward the request to the mempool

current capability - connects to a local nostr relay, waits for a private direct message and prints the message to the console 

Once the app is at a working stage i will create an API for monitoring and other purposes and host a proof of concept in AWS

I will create a folder in this directory with some info on the resources i have used and what i have learned during this mini project


## Usage

Install and setup a local relay on port 7000 following the instructions here - [nostr-rs-relay](https://github.com/scsibug/nostr-rs-relay#quick-start):


clone this project to your local machine

```sh
git clone https://github.com/stum0/nostr_txid_bot.git
```
install the required dependencies

```sh
nmp install
```

start the bot and await messages

```sh
node txbot.mjs
```

you can test the bot by connecting to your local relay via another client, such as https://astral.ninja

make sure to remove all the other mainnet relays 





