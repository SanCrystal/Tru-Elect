//implement ethers from hardhat
const{ethers} = require("hardhat");

async function main(){
     /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so election token here is a factory for instances of our election contract.
  */
 console.log("deploying TruElectToken contract.......")
    const TruElectTokenContract = await ethers.getContractFactory("TruElectToken");
    const [owner] = await ethers.getSigners();
     // here we deploy the contract
    const deployedTruElectTokenContract = await TruElectTokenContract.connect(owner).deploy();

    // Wait for it to finish deploying
  await deployedTruElectTokenContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 TruElect Contract Address:",
    deployedTruElectTokenContract.address
  );

 console.log("deploying TruElectVoting contract.......")
    const TruElectVotingContract = await ethers.getContractFactory("TruElect");
     // here we deploy the contract
    const deployedTruElectVotingContract = await TruElectVotingContract.connect(owner).deploy(deployedTruElectTokenContract.address);

    // Wait for it to finish deploying
  await deployedTruElectVotingContract.deployed();

  // print the address of the deployed contract
  console.log(
    "\n 🏵 TruElect Contract Address:",
    deployedTruElectVotingContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
