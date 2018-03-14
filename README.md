# node-steam-activate-2fa
Simple node.js console app to activate two factor authentication and get secret codes (shared_secred, identity_secret and revocation code) without mobile Steam app.

## Usage
Firstly you need Steam account with  a phone number already linked with and verified (you can do it here https://store.steampowered.com/phone/add).
Then clone this repo and run ```npm install``` within its folder, to install needed dependencies, and then run ```npm start```.
You will be questioned for your Steam login and password, and other needed informations.
After a successfull process your secret code will be printed out in console and saved to 2FAdata_YOURSTEAMLOGIN.txt file.