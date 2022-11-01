# nostr_tx_bot

## nostr bot that relays raw bitcoin transactions to the mempool. 

WORK IN PRORESS 

Send an encrypted direct message to tx_bot using your favourite nostr client, containing !tx followed by a raw bitcoin transaction and the bot will forward the request to the mempool

current capability - connects to a local nostr relay, waits for a private direct message and prints the message to the console 

Once the app is at a working stage i will create an API for monitoring and other purposes and host a proof of concept in AWS

I will create a folder in this directory with some info on the resources i have used and what i have learned during this mini project


## Usage

Install and setup a local relay on port 7000 following the instructions here - [nostr-rs-relay](https://github.com/scsibug/nostr-rs-relay#quick-start):


clone this project to your local machine

```sh
git clone https://github.com/stum0/nostr_tx_bot.git
```
install the required dependencies

```sh
nmp install
```

start the bot and await messages

```sh
node txbot.mjs
```

you can test the bot by connecting to your local relay via another client, such as https://astral.ninja and sending a DM to the public key that is generated. For now the public key is hardcoded as the following: 

```sh
tx_bot public key: bb9b8dd498ffe5b1672992bd3d03d5020cd08517e7f8165643a7d063abf5998e
```

make sure to remove all the other mainnet relays





