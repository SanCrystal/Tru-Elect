//SPDX-License-Identifier:MIT
pragma solidity ^0.8.10;

/**
* @author Team-SALD - Polygon Internship 22
* @title An Election Dapp
*/
/**
 *@notice TruElect token interface 
 */

 interface ITruElectToken{
    /**
    * @dev balanceOf returns the number of token owned by the given address
    * @param contractOwner - address to fetch number of token for
    * @return - returns the number of tokens owned
    */
    function balanceOf(address contractOwner) external view returns (uint256);
 }

contract TruElect {

    constructor(address _tokenAddress) {
        tetToken = ITruElectToken(_tokenAddress);
        
        /** @notice add election committee head as the deployer of the contract */
        electionCommHead = msg.sender;
        
         /** @notice add election committee head as a voter */
        voters[msg.sender] = Voter("electionCommHead", true, false, 0, 4 );
    }

    /// ---------------------------------------- STRUCT ------------------------------------------ ///
    /** @notice structure for voters */
    struct Voter {
        string role;
        bool isRegistered;
        bool hasVoted;  
        uint votedCandidateId;
        uint8 votingPower;
    }

    /** @notice structure for candidates */
    struct Candidate {
        uint256 id;
        string name;   
        uint256 category;
        uint voteCount; 
    }
    
    /** @notice structure for election */
    struct Election {
        string category;
        uint256[] candidatesID;
        bool VotingStarted;
        bool VotingEnded;
        bool VotesCounted;
        bool isResultPublic;
        uint256 totalVotesCasted;
        string[] allowedVoters;
    }

    /// ---------------------------------------- VARIABLES ------------------------------------- ///
    /** @notice state variable for tokens */
    ITruElectToken public tetToken;

    /** @notice declare state variable election committee head */
    address public electionCommHead;

    /** @notice declare state variable candidatesCount */
    uint public candidatesCount = 0;

    /** @notice id of winner */
    uint private winningCandidateId;

    /** @notice array for categories */
    string[] public categories;

    /** @notice CategoryTrack */
    uint256 count = 1;

    /** @notice declare state variable _paused */
    bool public _paused;

    /** @notice election array */
    Election[] public activeElectionArrays;

    /** @notice electors consensus array */
    address[] private consensus;

    /**@notice electors counter */
    uint256 electorsCount;
    
    /// ------------------------------------- MAPPING ------------------------------------------ ///
    /** @notice mapping for list of voters addresses */
    mapping(address => Voter) public voters;

    /** @notice array for candidates */
    mapping(uint => Candidate) public candidates;

    /** voted for a category */
    mapping(uint256 => mapping(address => bool)) public votedForCategory;
    
    /** @notice mapping to check votes for a specific category */
    mapping(uint256=>mapping(uint256=>uint256)) public votesForCategory;
    
    /** @notice mapping for converting category string to uint */
    mapping(string => uint256) public Category;
    
    /** @notice tracks the winner in a catgory */
    mapping(string=>Candidate) private categoryWinner;

    /** @notice tracks the active election */
    mapping(string=>Election) public activeElections;

    /** @notice tracks the index of active election */
    mapping(string => uint) public activeModify;

    /** @notice electors consensus vote map */
    mapping(address=>bool) private hasConsented;

    /**@notice allowed voters (category=>user roles= true/false) */
    mapping(string=>mapping(string=>bool)) private allowedVoters;
  

    /// ------------------------------------- MODIFIER ------------------------------------------- ///
    /** @notice modifier to check that only the registered voters can call a function */
    modifier onlyRegisteredVoter() {

        /** @notice check that the sender is a registered voter */
        
        require(voters[msg.sender].isRegistered, 
           "You must be a registered voter");
       _;
    }

    /** @notice modifier to check that only the electors can call a function */
    modifier onlyElector() {
        require(compareStrings(voters[msg.sender].role, "electors"),"Only Electors have access");
        _;
    }
    
    /// @notice modifier to check that only the election committee head or electors can call a function
    modifier onlyGranted() {

        /// @notice check that sender is the election committee head
        require ((msg.sender == electionCommHead) || compareStrings(voters[msg.sender].role,"electors"), 
        "Access granted to only the election committee head or electors");
        _;
    }
 
    /** @notice modifier to check that function can only be called after the votes have been counted */
    modifier onlyAfterVotesCounted(string memory _category) {

        /** @notice require that this process only occurs after the votes are counted */
        require(activeElections[_category].VotesCounted == true,  
           "Only allowed after votes have been counted");
       _;
    }

    /** @notice modifier to check that contract is not paused */
    modifier onlyWhenNotPaused {
        require(!_paused, "Contract is currently paused");
        _;
    }

    /** @notice modifier to check that only the election committee head can call a function */
    modifier onlyElectionCommHead() {

        /** @notice check that sender is the election committee head */
        require(msg.sender == electionCommHead, 
        "Access granted to only the election committee head");
        _;
    }


    /// ---------------------------------------- EVENTS ----------------------------------------- ///
    /** @notice emit when a voter is registered */
    event VoterRegisteredEvent (
            string _role,address[] voterAddress
    ); 

    /// @notice emit when role is appointed
    event ChangeElectionCommHead (address adder, address newElectionCommHead);   
     
    /** @notice emit when candidate has been registered */
    event CandidateRegisteredEvent( 
        uint candidateId
    );
    
    /** @notice emit when voting process has started */
    event VotingStartedEvent (string category,bool status);
    
    /** @notice emit when voting process has ended */
    event VotingEndedEvent (string category,bool status);
    
    /** @notice emit when voter has voted */
    event VotedEvent (
        address voter,
        string category
    );
    
    /** @notice emit when votes have been counted */
    event VotesCountedEvent (string category,uint256 totalVotes);

    /** @notice emit event when concensus has been reached */
    event ConcensusVote(address electors,bool consent);

    
    /// --------------------------------------- FUNCTIONS ------------------------------------------- ///
    /** @dev helper function to compare strings */
    function compareStrings(string memory _str, string memory str) private pure returns (bool) {
        return keccak256(abi.encodePacked(_str)) == keccak256(abi.encodePacked(str));
    }

    /** 
    * @notice check the role of a specific address 
    * @dev funtion cannot be called if contract is paused
    */
    function checkRole(string memory _role,address _address) onlyWhenNotPaused public view 
        returns (bool) {
        return compareStrings( _role,voters[_address].role);
    }     
    
    /** 
    * @notice electors consensus vote function
    * @dev can be called by only the electors
    */
    function concensusVote() public onlyElector {
        require(hasConsented[msg.sender]==false,"You have already consented..");
        hasConsented[msg.sender]=true;
        consensus.push(msg.sender);

        /** @notice emit event of consesus results */
        emit ConcensusVote(msg.sender,true);
    }
    
    /** 
    * @notice function to change electors
    * @dev can be called by only the electors
    * @dev function cannot be called when contract is paused
    */
    function changeElectionCommHead(address _voter) onlyElector onlyWhenNotPaused public{
        require(voters[_voter].isRegistered ==true,"Can't assign a role of election committee head to a non voter.");
        uint256 consensusCheckpoint = 75*electorsCount;
        require(consensus.length*100 > consensusCheckpoint,"Requires Greater than 75% consent of electors to approve!");
        
        /** @notice change election committee head role */
        voters[_voter].role = "electionCommHead";
        voters[electionCommHead].role = "electors";
        electionCommHead = _voter;

        address[] memory _consensus = consensus;
        for(uint256 i;i<_consensus.length;i++){
            hasConsented[_consensus[i]]=false;
        }
        delete consensus;
        /** @notice emit event of new election committee head */
        emit ChangeElectionCommHead(msg.sender, _voter);
    } 

    /**
    * @notice upload csv file of voters
    * @dev only election committee head and elector can upload csv file of voters
    * @dev function cannot be called if contract is paused
    */
    function uploadVoter(string memory _role,uint8 votingPower,address[] calldata _address) onlyGranted onlyWhenNotPaused  external {
        /// @notice loop through the list of voters and upload
        require(
            _address.length >0,
            "Upload array of addresses"
        );
    
        for (uint i = 0; i < _address.length; i++) {
                 if(voters[_address[i]].isRegistered ==false)
                {voters[_address[i]] = Voter(_role, true, false, 0, votingPower ); } 
                if(compareStrings(_role, "electors")){electorsCount+=1;}   
        }    
        /// @notice emit voter registered event
        emit VoterRegisteredEvent(_role, _address);
    }
    
    /** 
    * @notice register candidate for election
    * @dev only election committee head and elector can register candidates for election
    * @dev function cannot be called if contract is paused
    */
    function registerCandidate(string memory candidateName, string memory _category) 
        public onlyGranted onlyWhenNotPaused {
        /** @notice check if the position already exists */
        require(Category[_category] != 0,"Category does not exist...");
        
        /** @dev initial state check */
            candidatesCount++;
        /** @notice add to candidate map by passing in the candidateCount aka id */
        candidates[candidatesCount] = Candidate(candidatesCount, candidateName, Category[_category], 0 );
        
        /** @notice emit event when candidate is registered */
        candidatesCount;
        emit CandidateRegisteredEvent(candidatesCount);
    }

    /** 
    * @notice add categories of offices for election
    * @dev only election committee head and elector can add categories for election
    * @dev function cannot be called if contract is paused
    */
    function addCategories(string memory _category) onlyGranted onlyWhenNotPaused public returns(string memory ){

        /** @notice add to the categories array */
        categories.push(_category);
        
        /** @notice add to the Category map */
        Category[_category] = count;
        count++;
        return _category;
    }
   
   /**
    * @notice function that return list of candidates
    * @dev function cannot be called if contract is paused
    */
    function getCandidates() public view  returns (Candidate[] memory) {
        Candidate[] memory contestants = new Candidate[] (candidatesCount);
        for(uint i=0; i < candidatesCount; i++){
            Candidate storage candidate = candidates[i+1];
            contestants[i] = candidate;
        }
        return contestants;
    }

    /**
    * @notice setup election
    * @dev takes in category and an array of candidates
    * @dev only election committee head and elector can setup election
    * @dev function cannot be called if contract is paused
    */
    function setUpElection (string memory _category,uint256[] memory _candidateID,string[] memory _allowedVoters) public onlyGranted onlyWhenNotPaused returns(bool){
    
    uint index = activeElectionArrays.length;
    activeModify[_category] =index;

        /** @notice create a new election and add to election queue */    
        activeElectionArrays.push( Election(
            _category,
            _candidateID,
            false,
            false,
            false,
            false,
            0,
            _allowedVoters
        ));
        //update allowedVoters map
        for(uint256 i=0;i<_allowedVoters.length;i++){
            allowedVoters[_category][_allowedVoters[i]]=true;
        }
        return true;
    }

    /** 
    * @notice clear election queue 
    * @dev only election committee head can clear the election queue
    * @dev function cannot be called if contract is paused    
    */
    function clearElectionQueue() public onlyElectionCommHead onlyWhenNotPaused{
        delete activeElectionArrays;
    }
    
    /** 
    * @notice start voting session for a caqtegory
    * @dev only election committee head can start voting session
    * @dev function cannot be called if contract is paused    
    */
    function startVotingSession(string memory _category) 
        public onlyElectionCommHead onlyWhenNotPaused {
        require(Category[_category] > 0, "no such category exist");
        
        /** @notice add election category to active elections */
        uint index = activeModify[_category];
         activeElections[_category]=activeElectionArrays[index];

         /** @notice update the activeElectionArrays */
         activeElectionArrays[index].VotingStarted=true;

        /** @notice start voting session */
        activeElections[_category].VotingStarted=true;

        /** @ notice emit event when voting starts */
        emit VotingStartedEvent(_category,true);
    }
    
    /** 
    * @notice end voting session for a category
    * @dev only election committee head can end the voting session
    * @dev function cannot be called if contract is paused
    */
    function endVotingSession(string memory _category) 
        public onlyElectionCommHead onlyWhenNotPaused {
        activeElections[_category].VotingEnded = true;
        
        /**@notice update the activeElectionArrays */ 
        uint addressEntityIndex = activeModify[_category];
        activeElectionArrays[addressEntityIndex].VotingEnded =true;
       
        /** @ notice emit event when voting ends */
        emit VotingEndedEvent(_category,true);
    }

    /** 
    * @notice function for voting process
    * @dev only registered voters can vote
    * @dev function cannot be called if contract is paused
    * @return category and candidate voted for
    */
    function vote(string memory _category, uint256 _candidateID) public onlyRegisteredVoter onlyWhenNotPaused returns (string memory, uint256) {
        
        /** @notice check that the voter/voter is qualified/eligible to vote for the category */
        require(allowedVoters[_category][voters[msg.sender].role]==true,"You are not Qualified to vote for this category ");
        
        /** @notice require that the session for voting is active */
        require(activeElections[_category].VotingStarted ==true,"Voting has not commmenced for this Category");
        
        /** @notice require that the session for voting is not yet ended */
        require(activeElections[_category].VotingEnded ==false,"Voting has ended for this Category");
       
        /** @notice check that votes are not duplicated */
        require(votedForCategory[Category[_category]][msg.sender]== false,"Cannot vote twice for a category..");

        /** @notice check that balance of voter is greater than zero.. 1 token per votes */
        require(tetToken.balanceOf(msg.sender) >1*1e18,"YouR balance is currently not sufficient to vote. Not a voter");
      
      /// @notice check that a candidate is valid for a vote in a category
        require(candidates[_candidateID].category == Category[_category],"Candidate is not Registered for this Office!");
        
        /** @notice ensure that there are no duplicate votes recorded for a candidates category. */
        uint256 votes = votesForCategory[_candidateID][Category[_category]]+=voters[msg.sender].votingPower;
        candidates[_candidateID].voteCount = votes;
        votedForCategory[Category[_category]][msg.sender]=true;
        
        /**
        * @notice emit event when a candidate is voted for
        * @dev emit person that voted and the candidate they voted for
        */
        emit VotedEvent(msg.sender, _category);

        return (_category, _candidateID);
    }

    /** 
    * @notice retrieve winning vote count in a specific category
    * @dev function can only be called after votes have been tallied
    * @dev function cannot be called if contract is paused
    */
    function getWinningCandidate(string memory _category) onlyAfterVotesCounted(_category) onlyWhenNotPaused public view
        returns (Candidate memory,uint256) {
        require(activeElections[_category].isResultPublic==true,"Result is not yet public");
        return (categoryWinner[_category],activeElections[_category].totalVotesCasted);
    }   
    
    /** 
    * @notice fetch a specific election 
    * @dev function cannot be called if contract is paused
    */
    function fetchElection() onlyWhenNotPaused public view returns (Election[] memory) {
        return activeElectionArrays;
    }

    /**
    * @notice compile votes for an election
    * @dev only election committee head and elector can compile votes
    * @dev function cannot be called if contract is paused
    */
    function compileVotes(string memory _position) onlyGranted onlyWhenNotPaused public  returns (uint total, uint winnigVotes, Candidate[] memory){
        
        /** @notice require that the category voting session is over before compiling votes */
        require(activeElections[_position].VotingEnded == true,"This session is still active for voting");
        uint winningVoteCount = 0;
        uint totalVotes=0;
        uint256 winnerId;
        uint winningCandidateIndex = 0;
        Candidate[] memory items = new Candidate[](candidatesCount);
        
        for (uint i = 0; i < candidatesCount; i++) {
            if (candidates[i + 1].category == Category[_position]) {
                totalVotes += candidates[i + 1].voteCount;        
                if ( candidates[i + 1].voteCount > winningVoteCount) {
                    
                    winningVoteCount = candidates[i + 1].voteCount;
                    uint currentId = candidates[i + 1].id;
                    winnerId= currentId;
                    
                    /** @dev winningCandidateIndex = i; */
                    Candidate storage currentItem = candidates[currentId];
                    items[winningCandidateIndex] = currentItem;
                    winningCandidateIndex += 1;
                }
            }
        } 
        
        /** @notice update election status */
        activeElections[_position].totalVotesCasted= totalVotes;
        activeElections[_position].VotesCounted=true;
        uint addressEntityIndex = activeModify[_position];
        activeElectionArrays[addressEntityIndex].VotesCounted =true;
        /** @notice update winner for the category */
        categoryWinner[_position]=candidates[winnerId];

        /**@notice update allowedVoters for category */ 
        string[] memory _allowedVoters = activeElections[_position].allowedVoters;
        for(uint256 i=0;i<_allowedVoters.length;i++){
            allowedVoters[_position][_allowedVoters[i]]=false;
        }
        return (totalVotes, winningVoteCount, items); 
    }
 
    /**
    * @notice setpPaused() is used to pause all functions in the contract in case of an emergency
    * @dev only election committee head can pause the contract
    */
    function setPaused(bool _value) public onlyElectionCommHead {
        _paused = _value;
    }

    /**
    * @notice only the election committee head and elector can make the election results public
    * @dev function cannot be called if contract is paused
    */
    function makeResultPublic(string memory _category) public onlyGranted onlyWhenNotPaused returns(Candidate memory,string memory) {

        /** @notice require that the category voting session is over before compiling votes */
        require(activeElections[_category].VotesCounted == true, "This session is still active, voting has not yet been counted");

        uint addressEntityIndex = activeModify[_category];
        
        activeElectionArrays[addressEntityIndex].isResultPublic =true;
        activeElections[_category].isResultPublic = true;
        return (categoryWinner[_category],_category);
        } 
    }
