// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";


contract GlebDao {

    uint256 constant private PROPOSAL_TTL = 3 days;
    uint8 constant private MAX_PROPOSALS = 3;

    ERC20Votes public token;

    enum ProposalState {
        Accepted,
        Rejected,
        Pending,
        Expired
    }

    struct Proposal {
        ProposalState state;
        uint256 createdAt;
        uint256 expiredAt;
        
    }

    modifier voteAllowed {
        require(token.balanceOf(msg.sender) > 0, "GlebDao: Not enough balance");
        _;
    }


    constructor(address _tokenAddress) {
        token = ERC20Votes(_tokenAddress);
    }






    // event ProposalFinished()

    
}