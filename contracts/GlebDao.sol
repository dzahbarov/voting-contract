// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";


contract GlebDao {

    uint256 constant private PROPOSAL_TTL = 3 days;
    uint8 constant private MAX_PROPOSALS = 3;

    ERC20Votes private token;

    Proposal[MAX_PROPOSALS] private proposals;

    mapping(bytes32 => uint8) proposalToIdx;
 
    enum ProposalState {
        Absent,
        Accepted,
        Rejected,
        Active,
        Expired
    }

    struct Proposal {
        ProposalState state;
        uint256 createdAtBlock;
        uint256 expiredAt;
        uint256 agree;
        uint256 disagree;
    }

    struct Vote {
        bool agree;
        uint256 weight;
    }


    event CreatedProposal(bytes32 indexed proposalId, uint256 expiration, uint256 startBlock,  address indexed author);
    event FinishedProposal(bytes32 indexed proposalId, ProposalState state);

    modifier voteAllowed {
        require(token.balanceOf(msg.sender) > 0, "GlebDao: Not enough balance");
        _;
    }

    modifier proposalUnique(bytes32 _proposalId) {
        require(proposals[proposalToIdx[_proposalId]].state == ProposalState.Absent, "GlebDao: Proposal already exists");
        _;
    }


    constructor(address _tokenAddress) {
        token = ERC20Votes(_tokenAddress);
    }

    function createProposal(bytes32 _proposalId) external voteAllowed proposalUnique(_proposalId) {
        uint8 idx = MAX_PROPOSALS;
        for (uint8 i = 0; i < MAX_PROPOSALS; i++) {
            if (proposals[i].state == ProposalState.Absent || proposals[i].expiredAt >= block.timestamp) {
                idx = i;
                break;
            }
        }

        require(idx != MAX_PROPOSALS, "GlebDao: Max proposals number reached");

        proposalToIdx[_proposalId] = idx;

        proposals[idx] = Proposal({
            state: ProposalState.Active,
            createdAtBlock: block.number,
            expiredAt: block.timestamp + PROPOSAL_TTL,
            agree: 0,
            disagree: 0
            // idx: idx
        });

        emit CreatedProposal(_proposalId, block.timestamp + PROPOSAL_TTL, block.number, msg.sender);
    }

    // function vote(bytes32 _proposalId, uint256 weight, bool agree) {
// 
    // }


    function _checkState(bytes32 _proposalId) internal {
        Proposal storage proposal = proposals[proposalToIdx[_proposalId]];
        uint256 totalSupply = token.getPastTotalSupply(proposal.createdAtBlock);

        if (proposal.agree > totalSupply / 2) {
            proposal.expiredAt = 0;
            emit FinishedProposal(_proposalId, ProposalState.Accepted);
        } else if (proposal.disagree > totalSupply / 2) {
            proposal.expiredAt = 0;
            emit FinishedProposal(_proposalId, ProposalState.Rejected);
        } else if (proposal.expiredAt >= block.timestamp) {
            emit FinishedProposal(_proposalId, ProposalState.Expired);
        }
    }

    function getProposal(bytes32 _proposalId) internal view returns (Proposal storage) {
        Proposal storage proposal = proposals[proposalToIdx[_proposalId]];
        require(proposal.state != ProposalState.Absent, "Proposal doesn't exists");
        require(proposal.expiredAt < block.timestamp, "Proposal expired");
        return proposal;
    }
}