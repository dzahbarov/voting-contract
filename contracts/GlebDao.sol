// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";


contract GlebDao {

    uint256 constant private PROPOSAL_TTL = 3 days;
    uint8 constant private MAX_PROPOSALS = 3;

    ERC20Votes private token;

    bytes32[MAX_PROPOSALS] private activeProposals;

    mapping (bytes32 => Proposal) proposals;
    mapping (address => mapping (bytes32 => Vote)) votes;

    struct Proposal {
        uint256 createdAtBlock;
        uint256 expiredAt;
        uint256 agree;
        uint256 disagree;
    }

    struct Vote {
        bool agree;
        uint256 value;
    }

    event CreatedProposal(bytes32 indexed proposalHash, address indexed creator, uint256 expiredAt, uint256 startBlock);
    event FinishedProposal(bytes32 indexed proposalHash, string result);
    event NewVote(bytes32 indexed proposalHash, address indexed voter, bool agreed, uint256 weight);

    modifier voteAllowed {
        require(token.balanceOf(msg.sender) > 0, "GlebDao: Not enough balance");
        _;
    }

    modifier proposalUnique(bytes32 proposalHash) {
        require(proposals[proposalHash].expiredAt == 0, "GlebDao: Proposal already exists");
        _;
    }

    modifier proposalExists(bytes32 proposalHash) {
        require(proposals[proposalHash].expiredAt != 0, "GlebDao: Proposal doesn't exist");
        require(proposals[proposalHash].expiredAt > block.timestamp, "GlebDao: Proposal discarded");
        _;
    }

    constructor(address _tokenAddress) {
        token = ERC20Votes(_tokenAddress);
    }

    // Creates proposal. Try to find free slot (not active proposal). 
    function createProposal(bytes32 proposalHash) external voteAllowed proposalUnique(proposalHash) {
        uint8 idx = MAX_PROPOSALS;
        for (uint8 i = 0; i < MAX_PROPOSALS; i++) {
            if (proposals[activeProposals[i]].expiredAt < block.timestamp) {
                idx = i;
                break;  
            }
        }

        require(idx != MAX_PROPOSALS, "GlebDao: Max proposals number reached");
        
        proposals[proposalHash] = Proposal({
            createdAtBlock: block.number,
            expiredAt: block.timestamp + PROPOSAL_TTL,
            agree: 0,
            disagree: 0
        });

        activeProposals[idx] = proposalHash;

        emit CreatedProposal(proposalHash, msg.sender, block.timestamp + PROPOSAL_TTL, block.number);
    }

    // Make vote. Assume that voter can change his vote by new vote. (old revert)
    function vote(bytes32 proposalHash, bool agree, uint256 value) proposalExists(proposalHash) voteAllowed external {
        Proposal storage proposal = proposals[proposalHash];
        
        require(token.getPastVotes(msg.sender, proposal.createdAtBlock) >= value, "Not enough tokens");

        Vote storage lastVote = votes[msg.sender][proposalHash];

        if (lastVote.agree) {
            proposal.agree -= lastVote.value;
        } else {
            proposal.disagree -= lastVote.value;
        }

        lastVote.agree = agree;
        lastVote.value = value;

        if (agree) {
            proposal.agree += value;
        } else {
            proposal.disagree += value;
        }

        emit NewVote(proposalHash, msg.sender, agree, value);
        _checkState(proposalHash);
    }

    // check if proposal finished.
    function _checkState(bytes32 proposalHash) internal {
        Proposal storage proposal = proposals[proposalHash];
        uint256 totalSupply = token.getPastTotalSupply(proposal.createdAtBlock);

        if (proposal.agree > totalSupply / 2) {
            delete proposals[proposalHash];
            emit FinishedProposal(proposalHash, "Proposal accepted");
        } else if (proposal.disagree > totalSupply / 2) {
            delete proposals[proposalHash];
            emit FinishedProposal(proposalHash, "Proposal declined");
        }
    }

    // returns hashes in queue. maybe zeros or discarded.
    function getProposals() external view returns (bytes32[3] memory) {
        return activeProposals;
    }

    // returns proposal
    function getProposal(bytes32 proposalHash) external view returns (Proposal memory)  {
        return _getProposal(proposalHash);
    }

    // returns proposal
    function _getProposal(bytes32 proposalHash) proposalExists(proposalHash) internal view returns (Proposal storage) {
        Proposal storage proposal = proposals[proposalHash];
        return proposal;
    }
}