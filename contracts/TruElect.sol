//SPDX-License-Identifier: MIT

/**
* @author Team-SALD - Polygon Internship 2022
* @title TruElectToken minting contract
*/
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

 contract TruElectToken is ERC20{
    address public chairman;
    /// ------------------------------------- MAPPING ------------------------------------------ ///
    mapping(address => bool) public teacher;
    mapping(address => bool) public electors;

      /// ------------------------------------- MODIFIER ------------------------------------------ ///
    /** @notice modifier to restrict who can call the function */
    modifier onlyAccess() {

        /** @notice check that sender is the chairman or teacher */
        require(msg.sender == chairman || teacher[msg.sender] == true, 
        "Access granted to only the chairman or teacher");
        _;
    }

     constructor() ERC20("TruElectToken", "TET") {
        chairman = msg.sender;
        _mint(msg.sender,40*1e18);
    }
    
     /// ------------------------------------- FUNCTIONS ------------------------------------------ ///
    /** @dev helper function to compare strings */
    function compareStrings(string memory _str, string memory str) private pure returns (bool) {
        return keccak256(abi.encodePacked(_str)) == keccak256(abi.encodePacked(str));
    }
    
    /** 
    * @notice mints specified amount of tokens to an address.
    * @dev only the teacher and the chairman can mint tokens
    */
    function mint(address _to, uint256 _amount) public onlyAccess{
        _mint(_to, _amount);
    }
    /** @notice mints specified amount of tokens to stakeholders. */
    function mintToStakeholder(uint256 _amountOftoken, string calldata _role, address[] calldata _address) onlyAccess external  {
        
        /** 
        * @notice upload the list of voters and mint the specified amount of tokens to each address
        * @dev check that the list is not empty
        */
        require(
            _address.length >0,
            "Upload array of addresses"
        );
        
        for (uint i = 0; i < _address.length; i++) {
            
            /** @dev mint 5 tokens to voters,10 tokens to teachers and 20 to electors */
            _mint(_address[i],_amountOftoken*1e18);

            if(compareStrings(_role,"teacher")) {
                teacher[_address[i]]=true; 
            } 
            else if(compareStrings(_role,"electors")){
                electors[_address[i]]=true;
            }  
        }       
    }
}

