const readline = require('readline');
const steamcommunity = require('steamcommunity');
const fs = require('fs');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var login, password, steamGuardCode, captcha;
var community = new steamcommunity();

//get creditentials
rl.question('Your steam account login : ', (steamLogin)=>{
	login = steamLogin;
	rl.question('Your steam account password : ', (steamPassword)=>{
		password = steamPassword;

		

		logIn();

	});
});

function logIn(){
	var creditentials = {
		accountName : login,
		password : password
	}

	community.login(creditentials, (err, res)=>{
		if(err){
			if(err.message.indexOf('SteamGuardMobile')!=-1){
				console.log(`You have two factor authentication already enabled.`);
				process.exit(1);
			}
			if(err.message.indexOf('SteamGuard')!=-1){
				console.log(`Check email (${err.emaildomain}) for Steam Guard Code`);

				rl.question('Steam Guard code : ', (code)=>{
					steamGuardCode = code;
					retryLogIn();
				});
			}else{
				if(err.message.indexOf('CAPTCHA')!=-1){
					console.log(`Completing captcha is needed to login. Read captcha on ${captchaurl.captchaurl} and enter it below.`)
					rl.question('Captcha : ', (enteredCaptcha)=>{
						captcha = enteredCaptcha;
						retryLogIn();
					});
				}else{
					console.log('Unknown error occured.');
					console.log(err);
					process.exit(1);
				}
			}
		}else{
			setup2FA();
		}

	
	})
}

function retryLogIn(){
	var creditentials = {
		accountName : login,
		password : password
	}

	if(captcha) creditentials.captcha = captcha;
	if(steamGuardCode) creditentials.authCode = steamGuardCode;

	community.login(creditentials, (err, res)=>{
		if(err){
			console.log('Error occured')
			console.log(err);
			process.exit(1);
		}

		setup2FA();
	})

}


var steamResponse;
function setup2FA(){
	

	community.enableTwoFactor((err, res)=> {
		if(err){
			console.log('Unknown error occured')
			console.log(err);
			process.exit(1);
		}

		if(res.status != 1){
			console.log('Unknown error occured')
			process.exit(1);
		}

		rl.question('Enter code sent by SMS : ', (smsCode) => {

			community.finalizeTwoFactor(res.shared_secret, smsCode, (err)=>{
				if(err){
					console.log('Unknown error occured')
					console.log(err);
					process.exit(1);
				}

				console.log(`Congratulations! You've setup 2FA authentication succesfully.`)
				console.log(`Below are sensitive data, which you will need to generate login codes, and accept mobile trade and market confirmations.`);
				console.log(`shared_secret: ${res.shared_secret}`);
				console.log(`identity_secret: ${res.identity_secret}`);
				console.log(`revocation_code: ${res.revocation_code}`);

				var dataToSave = `shared_secret: ${res.shared_secret}\nidentity_secret: ${res.identity_secret} \nrevocation_code: ${res.revocation_code}`;

				fs.writeFile(`2FAdata_${login}.txt`, dataToSave, (err)=>{
					if(!err){
						console.log(`These were also saved into file 2FAdata_${login}.txt`);
					}

					rl.close();
					process.exit(1);2
				});
			});
		});

	});
}