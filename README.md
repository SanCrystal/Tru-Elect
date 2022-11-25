# TruElect Dapp

<!-- <p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1LB_g7gQyeFogizQaGCBNi85a1kXp3tYH" alt="site"/>
</p> -->

> ## Table of contents
- [Overview](#overview)
- [Core Features Implemented](#core-features-implemented)
- [Technologies](#technologies)
- [Repo Setup](#repo-setup)
- [Requirements](#requirements)
- [Setup the Project](#setup-the-project)
  - [Install Hardhat](#install-hardhat)
  - [Env Setup](#env-setup)
  - [Setup Hardhat.config](#setup-hardhatconfig)
- [Create the SmartContract](#create-the-smartcontract)
  - [Compile](#compile)
  - [Deploy](#deploy)
  - [Verify](#verify)
- [Setup the Frontend](#setup-the-frontend)
  - [Install Dependencies](#install-dependencies)
  - [Steps to host the live site on Vercel](#steps-to-host-the-live-site-on-vercel)
- [Testing the Smartcontract](#testing-the-smartcontract)
- [TruElect Contract Address](#TruElect-contract-address)
- [Live Link](#live-link)
- [Contributors](#contributors)
- [Contributing to the project](#contributing-to-the-project)
#
> ## Overview
<p align="justify">
TruElect as an app which can be used to setup an election. The major stakeholders here are the electoral board, who are involved in stetting up the election and the voters.
</p>


#
> ## Core Features Implemented

`Deployment on a faster network`
- Deployment on polygon for speed, gas fees & optimization.

`Upload Stakeholders & mint`
- Batch upload voter addresses.
- A certain amount of tokens are minted to voters during upload.
- Ability to restrict the voting power of voters to only those who have a token.

`Setup elections and compile votes`
- Restrict the power to set up and compile votes to only the chairman and electoral board.
- Ability to set up multiple elections at the same time.
- Restrict the ability for anyone who isn't a registered voter to vote.
- Ability for eligible voters to vote for candidates in different election categories simultaneously.
- Ability to limit registered voters from voting in specific elections, for example voters can't vote in an election for assigning electoral board.
- Ability to register candidates to contest for specific positions.
- Restrict registered voters from voting multiple times for different candidates in the same category.
- Check to prevent users from voting for a candidate that doesn't exist for that category.
- Ability for registered voters to view history of past elections.
- Ability for the chairman to view the election queue.
- Restrict the start and end of a voting session to only the chairman.
- Ability to compile votes for different election categories.
- Ability for the chairman and electors to make the election results public.
- Restrict the ability of the voters to view the election results until it is made public.

`Remove Chairman`
- Ability to change the current chairman based on a consensus of above 75% vote from the board of electors.

`Security`
- Ability for the chairman to pause and unpause the contract for security reasons. 
- If there's a vulnerability or a security breach, the contract functionality can be paused so the vulnerability can't be abused until the problem has been resolved.

`Test Coverage`
- Unit testing ensures that all the codes meet the quality standards and the functions return the expected output.
- Test coverage shows us the extent of how much of our codes are covered by tests. We ideally aim for 100% coverage.

`Natspec commenting`
- This documentation provides information about the codebase and their implementation for both technical and non technical people. 


</p>

#
> ## Technologies
| <b><u>Stack</u></b> | <b><u>Usage</u></b> |
| :------------------ | :------------------ |
| **`Solidity`**      | Smart contract      |
| **`React JS`**      | Frontend            |

#
> ## Repo Setup

<p align="justify">
To setup the repo, first fork the Team-LADS Tru-Elect repo, then clone the forked repository to create a copy on your local machine.
</p>

    $ git clone https://github.com/<your-forked-repo>/Tru-Elect.git

<p align="justify">
Change directory to the cloned repo and set the Team-LADS Tru-Elect repository as the "upstream" and your forked repository as the "origin" using gitbash.
</p>

    $ git remote add upstream https://github.com/Team-LADS/Tru-Elect.git

#

> ## Requirements
#
- Hardhat
- Alchemy key
- Metamask key
- Polygonscan.com API Url
- Node JS
#
> ## Setup the Project
**`*Note:`**

<p align="justify">
This project was setup on a windows 10 system using the gitbash terminal. Some of the commands used may not work with the VScode terminal, command prompt or powershell.
</p>

The steps involved are outlined below:-
#
> ### Install Hardhat
The first step involves cloning and installing hardhat.
```shell
# cd Tru-Elect

$ npm i -D hardhat

$ npm install

$ npm i --save-dev "@nomiclabs/hardhat-waffle" "ethereum-waffle" "chai" "@nomiclabs/hardhat-ethers" "ethers" "web3" "@nomiclabs/hardhat-web3" "@nomiclabs/hardhat-etherscan" "@openzeppelin/contracts" 

$ npm i --save-dev "dotenv" "@tenderly/hardhat-tenderly" "hardhat-gas-reporter" "hardhat-deploy" "ganache"
```
> ### Env Setup
 Next create a `.env` file by using the sample.env. Retrieve your information from the relevant sites and input the information where needed in the `.env` file.

`To retrieve your metamask private key.`
- Open your account details by clicking on the three dots on the metamask extension on your chrome browser
- Click on export private key
- Verify your password
- Copy your private key and place it in the .env file

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1oDl0IbicD7LhNOcYUbGzBYTJdduWim1t" alt="metamask"/>
</p>

#
`To retrieve your alchemy key.`
- Login to your account on [alchemy](https://www.alchemy.com/)
- Once you're redirected to your [dashboard](https://dashboard.alchemyapi.io/), click on create app.
- Fill in the relevant details especially the chain and network
- Once the app has been created, click on view key.
- Copy the HTTP and place it in the .env file.

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1vPvT5LJRJy6B8hSi_3mPo16wC4u6MnEK" alt="alchemy"/>
  
</p>

#
`To retrieve your polygonscan key.`
- Login to [polygonscan](https://polygonscan.com/) and hover over the dropdown arrow for your profile on the navbar.
- Click on API keys and add to create a new project (optional step).
- Once the project has been created, click on the copy button to copy the API key.
- Paste it in the .env file

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1x1h2DqgWNGFzx47sNAVY0uUk_WaJx3wi" alt="polygon key"/>
</p>

#
> ### Setup Hardhat.config


Below is the setup for the hardhat.config.json

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=1-vWH8_zI8DTzvnRM4gcwX2HWsHuCd0O0" alt="hardhat"/>
</p>

#
> ## Create the SmartContract
  - First write the Smartcontract codes within the contracts folder.
  - The next step involves the compilation, deployment and verification of the contract on the testnet.

> ### Compile
- To compile the smartcontract before deployment:
```
$ npx hardhat compile
```
#
> ### Deploy
- To deploy the smartcontract:
```
$ npx hardhat run scripts/deploy.js --network mumbai
```
#
> ### Verify
- To verify the smartcontract:
```
<!-- $ npx hardhat verify 0xD6c7Bc7089DBe4DC6D493E35eaC3dAf5b18FC04d 0xC291B856723080177f983CB32C275D1e56f91841 --network mumbai -->
```
- Note for verificition, the first address is the TruElectToken address, while the second is the TruElect address.

#
> ## Setup the Frontend
- First run the frontend on your local server to ensure it's fully functional before building for production.
#
> ### Install Dependencies
- Setup and install dependencies

```shell
# cd frontend

$ npm install

$ npm run dev
```
> ### Steps to host the live site on Vercel
- Create an account on [vercel](https://vercel.com/) and authorize your [GitHub](https://github.com/Polygon-Team-LADS) account.

- Once you're redirected to the Dashboard, click on the drop down menu and select `Add GitHub Org or Account`.

- In the pop-up window, select the install option.

- Once installation is completed, return to the dashboard and click `new project`.

- Select the Team-LADS organization and select the TruElect repo to import the project.

- Enter the relevant details and click `Deploy`.


#
> ## Testing the Smartcontract

- Coverage is used to view the percentage of the code required by tests and unittests were implemented to ensure that the code functions as expected
#
**`Coverage Test`**
- To test the smartcontract, first open a terminal and run the following command:

- First install Solidity Coverage
```
  $ npm i solidity-coverage
```
- Add `require('solidity-coverage')` to hardhat.config.json

- Install Ganache
``` 
  $ npm i ganache-cli
``` 
- Run coverage
```
$ npx hardhat coverage --network localhost

# if you get errors and you want to trace the error in the terminal
$ npx hardhat coverage --network localhost --show-stack-traces
```
#

<p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=16zXW2QHBBinyC0adq1Cd41YUD1grjR1X" alt="coverage tests"/>
</p>


#
> ## TruElect Contract Address

- https://mumbai.polygonscan.com/address/0x1A45159517c58B0E5E0F7482807a642Ea4Ce71CF#code
# 



> ## Live Link
  
- https://TruElect-school.vercel.app/
#

> ## Contributors

This Project was created by the members of Team-LADS during the Polygon Internship.

``` 
- KordJs (Ajibadeabd@gmail.com)
- Sancrystal (anyanwu.amanzearthur@gmail.com)
- Godand (Godhanded0@gmail.com)
- PaulineB (paulinebanye@gmail.com)
```

<!-- <p align="center" width="100%">
  <img src="https://drive.google.com/uc?export=view&id=17igBfE_fikN2_NGJ0am0IaK8V1IW3Q-8" alt="Team-LADS"/>
</p> -->

#
> ## Contributing to the project

If you find something worth contributing, please fork the repo, make a pull request and add valid and well-reasoned explanations about your changes or comments.

Before adding a pull request, please note:

- This is an open source project.
- Your contributions should be inviting and clear.
- Any additions should be relevant.
- New features should be easy to contribute to.

All **`suggestions`** are welcome!
#
> ##### README Created by `pauline-banye` for Team-LADS
