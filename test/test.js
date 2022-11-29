const { expect, should } = require("chai");
const { ethers, getChainId } = require("hardhat");

let tokenContract,votingContract;

/**
 * voter - fourthAddress
 * elector - secondAddress
 * 
 */
describe("TruElectToken and TruElectVoting Contract Deployment...", function(){
    ;
    it("should deploy the TruElectToken contract", async function(){
        //Get Contract from Contract Factory
        const TruElectTokenContract = await ethers.getContractFactory("TruElectToken");
        const [owner] = await ethers.getSigners()
        // here we deploy the contract
        const deployedTruElectTokenContract = await TruElectTokenContract.connect(owner).deploy();
    
        // Wait for it to finish deploying
        tokenContract = await deployedTruElectTokenContract.deployed();
    
        // print the address of the deployed contract
        console.log(
            "\n TruElect Contract Address:",
            tokenContract.address
        );
        console.log("passed...")
        // print the address of the deployed contract
        console.log(
            "\n should deploy the TruElectVoting contract \n Deploying..."
        );
        const TruElectVotingContract = await ethers.getContractFactory("TruElect");
        // here we deploy the contract
        const deployedTruElectVotingContract = await TruElectVotingContract.connect(owner).deploy(tokenContract.address);
    
        // Wait for it to finish deploying
        votingContract = await deployedTruElectVotingContract.deployed();
    
        // print the address of the deployed contract
        console.log(
            "\n ElectionVoting Contract Address:",
            votingContract.address
        );
        console.log("passed...")
      });
   

    it("Should mint 40 tokens to deployer address",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        ownerBalance = await tokenContract.balanceOf(owner.address);
        totalSupply = await tokenContract.totalSupply();
        console.log("totalsupply::",totalSupply," ownerbalance::",ownerBalance)
        await expect(ownerBalance).to.be.equal(totalSupply);
        console.log("passed..");
    });
    it("Should mint tokens to address",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        contractElectionCommHead = await tokenContract.electionCommHead();
        console.log("token election committee head",contractElectionCommHead)
        minted = await tokenContract.connect(owner).mint(secondAddress.address,10);
        bal = await tokenContract.balanceOf(secondAddress.address);
        console.log("bal===",bal)
        expect(bal).to.be.equal(10)
        console.log("passed..");
    });
    it("Should not mint tokens to address if caller is not an elector or election committee head",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        await expect(tokenContract.connect(thirdAddress).mint(secondAddress.address,10)).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log("passed..");
    });
    it("Should mint tokens to voters Electors if caller is election committee head or elector",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        minted = await tokenContract.connect(owner).mintToVoter(20,"electors",[eightAddress.address,secondAddress.address,tenthAddress.address]);
        bal = await tokenContract.balanceOf(eightAddress.address);
        expect(bal).to.be.equal(ethers.utils.parseEther("20"));
        console.log("passed..");
    });
    it("Should not mint tokens to voters if caller is not the election committee head or elector",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        await expect(tokenContract.connect(fourthAddress).mintToVoter(20,"electors",[eightAddress.address,secondAddress.address,tenthAddress.address])).to.be.revertedWith("Access granted to only the election committee head or elector");
       
        console.log("passed..");
    });
    it("Should revert if there are no address to mint to ...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        await expect(tokenContract.connect(owner).mintToVoter(20,"electors",[])).to.be.revertedWith("Upload array of addresses");
       
        console.log("passed..");
    });
    it("Should mint to voters...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        mintToVoter =await tokenContract.connect(owner).mintToVoter(5,"voter",[fourthAddress.address]);
        bal = await tokenContract.balanceOf(fourthAddress.address);
        expect(bal).to.be.equal(ethers.utils.parseEther("5"));
        console.log("passed..");
    });
    it("Should mint to elector...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        const  initbal = await tokenContract.balanceOf(secondAddress.address);
        burnToken = await tokenContract.connect(secondAddress).transfer(owner.address,initbal);
        mintToVoter =await tokenContract.connect(owner).mintToVoter(10,"elector",[secondAddress.address]);
        const  bal = await tokenContract.balanceOf(secondAddress.address);
        expect(bal).to.be.equal(ethers.utils.parseEther("10"));
        console.log("passed..");
    });

});

///@notice test for checking roles of voters on different states of the contract.
describe("Check Role of a voter...",function(){
    it("Should not be able to check role when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).checkRole("elector",secondAddress.address)).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should be able to check role when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is not paused.");
        paused = await votingContract.connect(owner).checkRole("elector",secondAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(false);
        console.log('\t',"Passed ....");     
    });
    it("Should be able to check role if role is elector",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role is an elector.");
        paused = await votingContract.connect(owner).checkRole("electors",secondAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(false);
        console.log('\t',"Passed ....");     
    });
    it("Should be able to check role if role is election committee head",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role is a election committee head.");
        paused = await votingContract.connect(owner).checkRole("election committee head",secondAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(false);
        console.log('\t',"Passed ....");     
    });
    it("Should be able to check role if role is voter",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role is a voter.");
        uploadVoter = await votingContract.connect(owner).uploadVoter("voter",1,[fourthAddress.address])
        paused = await votingContract.connect(owner).checkRole("voter",fourthAddress.address);
        const tx = await paused;
        expect(tx).to.be.equal(true);
        console.log('\t',"Passed ....");     
    });
})

///@notice test for uploading voters with different roles.
describe("Uploading voters...",function(){
    it("Should not be able to upload voter if caller is not the election committee head",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload voters when caller is not the election committee head.");
        await expect(votingContract.connect(thirdAddress).uploadVoter("elector",2,[secondAddress.address])).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log('\t',"Passed ...."); 
    });
    it("Should be able to upload voter if caller is the election committee head",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload voters when caller is the election committee head.");
        uploadVoter = await votingContract.connect(owner).uploadVoter("elector",2,[secondAddress.address]);
        const tx = await uploadVoter.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ...."); 
   
    });
    it("Should not be able to upload voter if caller is not a elector ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload voters when caller is not the elector.");
        await expect(votingContract.connect(thirdAddress).uploadVoter("elector",2,[fourthAddress.address])).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log('\t',"Passed ....");
    });
    it("Should be able to upload voter if caller is a elector ",async function(){

        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload voters when caller is the elector.");
        //upload elector as voter
        uploadVoter = await votingContract.connect(owner).uploadVoter("elector",2,[secondAddress.address]);
        uploadVoterByNewelector =await votingContract.connect(secondAddress).uploadVoter("elector",2,[thirdAddress.address]);
        const tx = await uploadVoterByNewelector.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    it("Should not upload voters if there are no voters(address of potential voters)",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to upload voters when there are no voters.");
        //upload elector as voter
        await expect(votingContract.connect(owner).uploadVoter("elector",2,[])).to.be.revertedWith("Upload array of addresses");
        console.log('\t',"Passed ....");
    });
    it("Should not be able to upload voters when contract is paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to upload voters when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).uploadVoter("elector",2,["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"])).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should be able to upload voters when contract is not paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log('\t',"Attempting to upload voters when contract is not paused.");
        paused = await votingContract.connect(owner).uploadVoter("elector",2,["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]);
        const tx = await paused.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");     
    });
})
///@notice test for Registering candidates.
describe("Registering Candidates for an election...",function(){
    it("Should not be able to register candidate if caller is not the election committee head",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is not the election committee head.");
        //add category
        addCategory = await votingContract.connect(owner).addCategories("president");
        await expect(votingContract.connect(fourthAddress).registerCandidate("Santa","president")).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log('\t',"Passed ....");
    });
    it("Should be able to register candidate if caller is the election committee head",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is the election committee head.");
        registerCandidate = await votingContract.connect(owner).registerCandidate("Santa","president");
        const tx = await registerCandidate.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    it("Should not be able to register candidate if caller is not a elector ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is not a elector.");
        //remove elector role from an address
        await expect(votingContract.connect(fourthAddress).registerCandidate("Santa","president")).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log('\t',"Passed ....");
    });
    it("Should be able to register candidate if caller is a elector ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when caller is not a elector.");
        //remove elector role from an address
        registerCandidate1 =await votingContract.connect(secondAddress).registerCandidate("Santa","president");
        const tx = await registerCandidate1.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    it("Should only be able to register candidate when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when contract is not paused.");
        paused = await votingContract.connect(owner).registerCandidate("Santa","president");
        const tx = await paused.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");  
    });
    it("Should not be able to register candidate when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).registerCandidate("Santa","president")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should not be able to register candidate if the category does not exit",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to register candidate when candidate category does not exist.");
       await expect(votingContract.connect(owner).registerCandidate("Santa","vice president")).to.be.revertedWith("Category does not exist...");
       console.log('\t',"Passed ....")
    });
})
///@notice test to Add Categories of an election.
describe("Add Categories of an election...",function(){
    it("Should only be able to add a category when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Add Categories when contract is not paused.");
        paused = await votingContract.connect(owner).addCategories("senate");
        const tx = await paused.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");  
    });
    it("Should not be able to add a category when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Add Categories when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).addCategories("counsellor")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
   
    });
   
    it("Should be able to add a category if caller is a elector ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to add a category when caller is not a elector.");
        //remove elector role from an address
        addCategory1 =await votingContract.connect(secondAddress).addCategories("headboy");
        const tx = await addCategory1.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
});
describe("Set up election...",function(){
    it("Should not be able to Set up an election if caller is not the election committee head or elector",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up election as a non election committee head....");
        await expect(votingContract.connect(fourthAddress).setUpElection("president",[1,2],["electionCommHead","elector"])).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log('\t',"Passed ....");
    });
    it("Should be able to Set up an election if caller is the election committee head or elector",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up election when caller is the election committee head.");
        setUpElection = await votingContract.connect(owner).setUpElection("president",[1,2],["electionCommHead","elector"]);
        const tx = await setUpElection.wait();
        expect(tx.status).to.be.equal(1);
        console.log('\t',"Passed ...."); 
   
    });
    it("Should only be able to Set up an election when contract is not paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Set up election when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).setUpElection("president",[1,2],["electionCommHead","elector"])).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    
    
})
///@notice test to Clear election Queue.
describe("Clear election Queue...",function(){
    it("Should not be able to clear election Queue if caller is not the election committee head",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to clear election Queue as a non election committee head....");
        await expect(votingContract.connect(secondAddress).clearElectionQueue()).to.be.revertedWith("Access granted to only the election committee head");
        console.log('\t',"Passed ....");
    });
    it("Should be able to clear election queue if caller is the election committee head",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to assign role as a election committee head....");
        //add address as a voter
        clearQueue = await votingContract.connect(owner).clearElectionQueue();
        const tx = await clearQueue.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....");
    });

    it("Should not be able to clear election queue when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to clear election queue when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).clearElectionQueue()).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    
})
///@notice test to Start Voting Session.
describe("Start Voting Session...",function(){
    it("Should not be able to Start Voting Session if caller is not the election committee head",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to clear election queue as a non election committee head....");
        await expect(votingContract.connect(secondAddress).startVotingSession("president")).to.be.revertedWith("Access granted to only the election committee head");
        console.log('\t',"Passed ....");
    });
    it("Should be able to Start Voting Session if caller is the election committee head",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to set up election when caller is the election committee head.");
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2],["electionCommHead","elector"]);

        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        console.log('\t',"Passed ....");
    });
    
    it("Should not be able to Start Voting Session when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Start Voting Session when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).startVotingSession("president")).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should revert if category does not exist",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to start voting session for an unknown category.");
        await expect(votingContract.connect(owner).startVotingSession("local election committee head")).to.be.revertedWith("no such category exist");
        console.log('\t',"Passed ....")
    });
    
})
///@notice test to End Voting Session.
describe("End Voting Session...",function(){
    it("Should not be able to End Voting Session if caller is not the election committee head",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to clear election queue as a non election committee head....");
        await expect(votingContract.connect(secondAddress).endVotingSession("president")).to.be.revertedWith("Access granted to only the election committee head");
        console.log('\t',"Passed ....");
    });
    it("Should be able to End Voting Session if caller is the election committee head",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to End Voting Session when caller is the election committee head.");
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2],["electionCommHead","elector"]);

        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        endVotingSession = await votingContract.connect(owner).endVotingSession("president");
        const tx2 = await endVotingSession.wait();
        expect(tx2.status).to.be.equal(1);

        console.log('\t',"Passed ....");
    });
  
    it("Should not be able to End Voting Session when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Check the role when contract is paused.");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(owner).endVotingSession("president")).to.be.revertedWith("Contract is currently paused");
        console.log('\t',"Passed ....")
        const unpaused = await votingContract.connect(owner).setPaused(false);
        clearElectionQueue = await votingContract.connect(owner).clearElectionQueue();
    });
    
})
///@notice test for Voting for a Category.
describe("Voting For a Candidate Category ...",function(){
    before(async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        addC = await votingContract.connect(owner).addCategories("headboy");
        setUpElection1 = await votingContract.connect(owner).setUpElection("president",[1,2],["electionCommHead","elector"]);
        const tx = await setUpElection1.wait();
        expect(tx.status).to.be.equal(1);
        setUpElection2 = await votingContract.connect(owner).setUpElection("headboy",[1,2],["elector","voter"]);
        const tx2 = await setUpElection2.wait();
        candidateCount = await votingContract.connect(owner).candidatesCount();
        console.log("candidate count. ",candidateCount)
        expect(tx2.status).to.be.equal(1);
        
    });
    it("Should not be able to  vote if caller is not Eligible to vote for a category",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        startVotinsession = await votingContract.connect(owner).startVotingSession("president");
        const tx1 = await startVotinsession.wait();
        expect(tx1.status).to.be.equal(1);
        console.log('\t',"Attempting to setup election.");
        console.log('\t',"Attempting to vote.");
        await expect(votingContract.connect(fourthAddress).vote("president",1)).to.be.revertedWith("You are not Qualified to vote for this category ");
        console.log('\t',"Passed ....");   
    });
    it("Should not be able to  vote if caller is not voter",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote.");
        await expect(votingContract.connect(fifthAddress).vote("president",1)).to.be.revertedWith("You must be a registered voter");
        console.log('\t',"Passed ....");   
    });
    
    it("Should not be able to vote when contract is paused",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote when contract is paused.");
       //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
       await expect(votingContract.connect(owner).vote("president",1)).to.be.revertedWith("Contract is currently paused");
       console.log('\t',"Passed ....")
       const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should not be able to vote when if voting has not commenced ",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote when voting has not commenced.");
    
       await expect(votingContract.connect(secondAddress).vote("headboy",3)).to.be.revertedWith("Voting has not commmenced for this Category");
       console.log('\t',"Passed ....")
      });
    it("Should not be able to vote if candidate is not registered for an office",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote for a candidate that is not registered for an office.");
    
       await expect(votingContract.connect(owner).vote("president",10)).to.be.revertedWith("Candidate is not Registered for this Office!");
       console.log('\t',"Passed ....")
    });

    it("Should not be able to vote for a category twice",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote for a candidate twice.");
        const firstVote = await votingContract.connect(owner).vote("president",1);
        await expect(votingContract.connect(owner).vote("president",1)).to.be.revertedWith("Cannot vote twice for a category..");
        console.log('\t',"Passed ....")
    });
    it("Should not be able to vote token is less than threshold of 1*10**18",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress] = await ethers.getSigners();
        tb1= await tokenContract.balanceOf(secondAddress.address);
        console.log("balance elector ==== ",tb1);
        console.log('\t',"Attempting to burn account balance.");
        transferBalance = await tokenContract.connect(secondAddress).transfer(owner.address,ethers.utils.parseEther("10"));
        console.log("Transferred..");
        console.log('\t',"Attempting to vote with a low balance.");
        await expect(votingContract.connect(secondAddress).vote("president",1)).to.be.revertedWith("YouR balance is currently not sufficient to vote. Not a voter");
        console.log('\t',"Passed ....")
        mintToAddress = await tokenContract.connect(owner).mint(secondAddress.address,ethers.utils.parseEther("10"));
      
    });
    
    it("Should not be able to vote if voting has ended for a category",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        mintToAddress = await tokenContract.connect(owner).mint(secondAddress.address,ethers.utils.parseEther("10"));
        console.log('\t',"Attempting to when voting has ended for a category");
        endVotingSession = await votingContract.connect(owner).endVotingSession("president");
        voter = await votingContract.connect(owner).voters(secondAddress.address);
        console.log(voter)
        await expect(votingContract.connect(secondAddress).vote("president",1)).to.be.revertedWith("Voting has ended for this Category");
        console.log('\t',"Passed ....")
    });
    
})
///@notice test for Get Winning Candidate for a Category.
describe("Get Winning Candidate for a Category ...",function(){
    
    it("Should not be able to Get Winning Candidate if votes has not been counted",async function(){
        const [owner,secondAddress] = await ethers.getSigners();

        console.log("\t","Attempting to get winning candidate when votes has not been counted");
        await expect(votingContract.connect(owner).getWinningCandidate("president")).to.be.revertedWith("Only allowed after votes have been counted");
        console.log('\t',"Passed ....")
    });
    it("Should not be able to Get Winning Candidate when contract is paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when contract is paused");
        endVotingSession = await votingContract.connect(owner).endVotingSession("president");
        compileVotes = await votingContract.connect(owner).compileVotes("president");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(owner).getWinningCandidate("president")).to.be.revertedWith("Contract is currently paused");
        console.log('\t',"Passed ....")
        const unpaused = await votingContract.connect(owner).setPaused(false);
    });
    it("Should only be able to Get Winning Candidate when result is not made public",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when result has not been made public");
        await expect(votingContract.connect(owner).getWinningCandidate("president")).to.be.revertedWith("Result is not yet public");
        console.log('\t',"Passed ....");
    });
    it("Should only be able to Get Winning Candidate when result is  made public",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to get winning candidate when contract is not paused");
         //end voting
         makeresultpublic = await votingContract.connect(owner).makeResultPublic("president");
        winningCandidate = await votingContract.connect(owner).getWinningCandidate("president");
        console.log("here winning candidate",winningCandidate)
        expect(winningCandidate[0].id).to.equal(1);
        console.log('\t',"Passed ....");
    });
   
})
///@notice test for fetching election.
describe("Fetch election ...",function(){
    it("Should only be able to fetch election when contract is not paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to fetch election when contract is not paused");
        elections = await votingContract.connect(owner).fetchElection();
        expect(elections.length).to.greaterThan(1);
        console.log('\t',"Passed ....");

    });
    it("Should not be able to fetch election  when contract is paused",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to fetch election  when contract is paused");
        //pause the contract
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(owner).fetchElection()).to.be.revertedWith("Contract is currently paused");
        console.log('\t',"Passed ....")
        const unpaused = await votingContract.connect(owner).setPaused(false);
    
    });
})
///@notice test for Compiling Votes for an election.
describe("Compiling Votes for an election ...",function(){
    before("Set up election and vote",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        addCategory = await votingContract.connect(owner).addCategories("senate");
        registerCandidate = await votingContract.connect(owner).registerCandidate("prince","senate");
        registerCandidate1 = await votingContract.connect(owner).registerCandidate("charming","senate");
        setUpElection = await votingContract.connect(owner).setUpElection("senate",[4,5],["electionCommHead","elector","voter"]);
        startVotingSession = await votingContract.connect(owner).startVotingSession("senate");
        firstVote = await  votingContract.connect(secondAddress).vote("senate",4);
        secondVote = await votingContract.connect(owner).vote("senate",5);
    })
    
    it("Should not be able to Compiling Votes if caller is not the election committee head",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes if caller is not the election committee head");
        await expect(votingContract.connect(fifthAddress).compileVotes("senate")).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log('\t',"passed")
        
    });
    it("Should not be able to Compiling Votes if caller is not a elector ",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes if caller is not the elector");
        await expect(votingContract.connect(fourthAddress).compileVotes("senate")).to.be.revertedWith("Access granted to only the election committee head or elector");
        console.log('\t',"passed")
    });
    it("Should not be able to Compiling Votes when voting session has not ended",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes when voting session has not ended");
        await expect(votingContract.connect(secondAddress).compileVotes("senate")).to.be.revertedWith("This session is still active for voting");
        console.log('\t',"passed")
    });
    it("Should not be able to Compiling Votes  when contract is paused",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes when contract is paused");
        endVotingSession = await votingContract.connect(owner).endVotingSession("senate");
        //compile votes 
        compileVotes = await votingContract.connect(owner).compileVotes("senate");
        //pause the contract
         const paused = await votingContract.connect(owner).setPaused(true);
         await expect(votingContract.connect(owner).getWinningCandidate("senate")).to.be.revertedWith("Contract is currently paused");
         console.log('\t',"Passed ....")
         const unpaused = await votingContract.connect(owner).setPaused(false);
   
    });
    it("Should only be able to Compiling Votes  when contract is not paused",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Compiling Votes when contract is not paused");
        compiled = await votingContract.connect(secondAddress).compileVotes("senate");
        const tx= await compiled.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"passed")
    });
    
})
///@notice test for Pausing Contract.
describe("Pausing Contract ...",function(){
    it("Should not be able to Pause Contract if caller is not the election committee head",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        console.log("\t","Attempting to Pause Contract if caller is the election committee head");
        await expect(votingContract.connect(secondAddress).setPaused(true)).to.be.revertedWith("Access granted to only the election committee head");
        console.log('\t',"passed")
    });
    it("Should be able to Pause Contract if caller is the election committee head",async function(){
        
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to  Pause Contract if caller is not the election committee head");
        //pause the contract
        paused = await votingContract.connect(owner).setPaused(true);
        const tx = await paused.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....")
        const unpaused = await votingContract.connect(owner).setPaused(false);
  

    });
    
})
///@notice test for Making election result public.
describe("Make election result public ...",function(){
    before("Set up election and vote",async function(){
        const [owner,secondAddress] = await ethers.getSigners();
        addCategory = await votingContract.connect(owner).addCategories("counsellor");
        registerCandidate = await votingContract.connect(owner).registerCandidate("prince","counsellor");
        registerCandidate1 = await votingContract.connect(owner).registerCandidate("charming","counsellor");
        setUpElection = await votingContract.connect(owner).setUpElection("counsellor",[6,7],["electionCommHead","elector","voter"]);
        startVotingSession = await votingContract.connect(owner).startVotingSession("counsellor");
        firstVote = await  votingContract.connect(secondAddress).vote("counsellor",7);
        secondVote = await votingContract.connect(owner).vote("counsellor",6);
    })
    it("Should not be able to make election result public if caller is not the election committee head",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to make election result public if caller is not the election committee head");
        await expect(votingContract.connect(fifthAddress).makeResultPublic("senate")).to.be.revertedWith("Access granted to only the election committee head, elector or electors");
        console.log('\t',"Passed ....")
    });
    it("Should be able to make election result public if caller is the election committee head",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to  make election result public if caller is not the election committee head");
        makeresultpublic = await votingContract.connect(owner).makeResultPublic("senate");
        const tx = await makeresultpublic.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....")
    });
    it("Should not be able to make election result public if caller is not the elector",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress] = await ethers.getSigners();
         console.log("\t","Attempting to  make election result public if caller is not the elector");
        await expect(votingContract.connect(fourthAddress).makeResultPublic("senate")).to.be.revertedWith("Access granted to only the election committee head, elector or electors");
        console.log('\t',"Passed ....")
    
    });
    it("Should be able to make election result public if caller is the elector",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress] = await ethers.getSigners();
        console.log("\t","Attempting to  make election result public if caller is the elector");
        makeresultpublic = await votingContract.connect(secondAddress).makeResultPublic("senate");
        const tx = await makeresultpublic.wait();
        expect(tx.status).to.equal(1);
        console.log('\t',"Passed ....")
    });
    // it("Should be able to make election result public if caller is an elector",async function(){
    //     const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
    //     console.log("\t","Attempting to  make election result public if caller is an elector");
    //     addVoter = await votingContract.connect(owner).uploadVoter("electors",3,[eightAddress.address]);
    //     makeresultpublic = await votingContract.connect(eightAddress).makeResultPublic("senate");
    //     const tx = await makeresultpublic.wait();
    //     expect(tx.status).to.equal(1);
    //     console.log('\t',"Passed ....")
    // });
    it("Should not be able to make election result public if the session is still active",async function(){
        const [owner] = await ethers.getSigners();
        console.log("\t","Attempting to  make election result public when session is still active");
        endVotingSession = await votingContract.connect(owner).endVotingSession("counsellor");
        await expect(votingContract.connect(owner).makeResultPublic("counsellor")).to.be.revertedWith("This session is still active, voting has not yet been counted");
        console.log('\t',"Passed ....")
    });
    
})

///@notice test to get candidates
describe("Candidates for elections",function(){
    it("Should be able to get candidates", async function(){
        //get signers
        const [owner] = await ethers.getSigners();    
        console.log("\t","Attempting to get candidates...");     
        getCandidates = await votingContract.connect(owner).getCandidates();
        expect(getCandidates.length).to.be.greaterThan(1);
        console.log("passed...");
    }) 
})
///@notice test for Changing election committee head roles to voters.
describe("Change election committee head role... and concensus voting",function(){
    before("Upload electors..",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
           addVoter2 = await votingContract.connect(owner).uploadVoter("electors",3,[seventhAddress.address])
         addVoter3 = await votingContract.connect(owner).uploadVoter("electors",3,[tenthAddress.address])
       
    })
    it("Should not be able to Change election committee head role if caller is not an elector",async function(){
        const [owner,secondAddress,thirdAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change election committee head role as a non elector....");
        await expect(votingContract.connect(secondAddress).changeElectionCommHead(secondAddress.address)).to.be.revertedWith("Only Electors have access");
        console.log('\t',"Passed ....");
    });
   
    it("Should revert if address is a non voter",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change election committee head role to a non voter....");
        await expect(votingContract.connect(eightAddress).changeElectionCommHead(ninthAddress.address)).to.be.revertedWith("Can't assign a role of election committee head to a non voter.")
        addVoter1 = await votingContract.connect(owner).uploadVoter("electors",3,[ninthAddress.address]) 
        console.log('\t',"Passed ....");
    });
    it("Should revert if consensus is less than 75% from the electors",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change election committee head role when consensus is less than 75% from the electors");
        await expect(votingContract.connect(eightAddress).changeElectionCommHead(ninthAddress.address)).to.be.revertedWith("Requires Greater than 75% consent of Electors to approve!") 
        console.log('\t',"Passed ....");
    });
    it("Should revert when contract is paused",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change election committee head role when contract is paused....");
        const paused = await votingContract.connect(owner).setPaused(true);
        await expect(votingContract.connect(eightAddress).changeElectionCommHead(seventhAddress.address)).to.be.revertedWith("Contract is currently paused");
        const unpaused = await votingContract.connect(owner).setPaused(false);
        console.log('\t',"Passed ....");
    
    });
    it("Should revert if voter for a consensus is not an elector",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to vote for a consensus as a non elector....");
        await expect(votingContract.connect(secondAddress).changeElectionCommHead(seventhAddress.address)).to.be.revertedWith("Only electors have access");
        console.log('\t',"Passed ....");
    
    });
    it("Should revert if elector has already giving consent(no duplicate consent)",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress,ninthAddress,tenthAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to give consent twice....");
        //consent by electors
        consent1 = await votingContract.connect(eightAddress).concensusVote();
        await expect(votingContract.connect(eightAddress).concensusVote()).to.be.revertedWith("You have already consented..");
        console.log('\t',"Passed ....");
        consent2 = await votingContract.connect(seventhAddress).concensusVote();
        consent3 = await votingContract.connect(ninthAddress).concensusVote();
        consent4 = await votingContract.connect(tenthAddress).concensusVote();
       
    });
    it("Should be able to Change election committee head role if caller is an elector and a concensus have been reached...",async function(){
        const [owner,secondAddress,thirdAddress,fourthAddress,fifthAddress,sixthAddress,seventhAddress,eightAddress] = await ethers.getSigners();
        console.log('\t',"Attempting to Change election committee head role as a election committee head....");
        changeElectionCommHead =await votingContract.connect(eightAddress).changeElectionCommHead(eightAddress.address);
        const tx = await changeElectionCommHead.wait();
        expect(tx.status).to.equal(1);
        newElectionCommHead = await votingContract.connect(owner).electionCommHead();
        expect(newElectionCommHead).to.equal(eightAddress.address);
        console.log('\t',"Passed ....");
    });
})
