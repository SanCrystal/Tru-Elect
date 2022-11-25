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
    mapping(address => bool) public elector;

    /// ------------------------------------- MODIFIER ------------------------------------------ ///
    /** @notice modifier to restrict who can call the function */
    modifier onlyGranted() {
        /** @notice check that sender is the chairman or elector */
        require(msg.sender == chairman || elector[msg.sender] == true, 
        "Access granted to only the chairman or elector");
        _;
    }

     constructor() ERC20("TruElectToken", "TET") {
        chairman = msg.sender;
        _mint(msg.sender, 40 * 1e18);
    }
    
     /// ------------------------------------- FUNCTIONS ------------------------------------------ ///
    /** @dev helper function to compare strings */
    function compareStrings(
        string memory _str, 
        string memory str) private pure returns (bool) {
        return keccak256(abi.encodePacked(_str)) == keccak256(abi.encodePacked(str));
    }
    
    /** 
    * @notice mints specified amount of tokens to an address.
    * @dev only the elector and the chairman can mint tokens
    */
    function mint(address _to, uint256 _amount) public onlyGranted{
        _mint(_to, _amount);
    }
    /** @notice mints specified amount of tokens to voters. */
    function mintToVoter(address[] calldata _address) onlyGranted external  {
        /** 
        * @notice upload the list of voters and mint the specified amount of tokens to each address
        * @dev check that the list is not empty
        */
        require(
            _address.length > 0,
            "Upload array of addresses"
        );
        
        for (uint i = 0; i < _address.length; i++) {
            /** @dev mint 1 token each to voters */
            _mint(_address[i], 1 * 1e18);
        }       
    }
}

