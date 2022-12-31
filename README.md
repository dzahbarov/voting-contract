# Voting contract

## How run? 
1. Set alchemy url in .env file. Example
```
ALCHEMY_URL=https://eth-mainnet.alchemyapi.io/v2/<token>
```
2. Run command for testing
```
npx hardhat test
```

## Test log example
```
  Test
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0xaB837301d12cDc4b97f1E910FC56C9179894d9cf
GlebDao deployed to: 0x4ff1f64683785E0460c24A4EF78D582C2488704f
Proposal successfully created and event emited
    ✔ Create proposal
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x1D3EDBa836caB11C26A186873abf0fFeB8bbaE63
GlebDao deployed to: 0x9C85258d9A00C01d00ded98065ea3840dF06f09c
Proposal successfully created
Creating proposal with existing name sucessuly reverted
    ✔ Create proposal with the same name (47ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0xbe18A1B61ceaF59aEB6A9bC81AB4FB87D56Ba167
GlebDao deployed to: 0x25C0a2F0A077F537Bd11897F04946794c2f6f1Ef
1 proposal created
2 proposal created
3 proposal created
    ✔ Create 3 proposals (53ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0xeC1BB74f5799811c0c1Bff94Ef76Fb40abccbE4a
GlebDao deployed to: 0xF6a8aD553b265405526030c2102fda2bDcdDC177
1 proposal created
2 proposal created
3 proposal created
4 proposal sucussfuly reverted when max amount reached
    ✔ Create 4 proposals (75ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0xAe9Ed85dE2670e3112590a2BB17b7283ddF44d9c
GlebDao deployed to: 0xD1760AA0FCD9e64bA4ea43399Ad789CFd63C7809
Proposal created
Vote by all tokens for accept
Proposal successully accepted and event emitted
    ✔ Base accept (61ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0xDf951d2061b12922BFbF22cb17B17f3b39183570
GlebDao deployed to: 0x4f42528B7bF8Da96516bECb22c1c6f53a8Ac7312
Proposal created
Vote by 30% tokens for accept
revert old vote and vote by by 60% tokens for accept
Proposal successully accepted and event emitted
    ✔ Make 2 votes by one account (132ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x67baFF31318638F497f4c4894Cd73918563942c8
GlebDao deployed to: 0x6533158b042775e2FdFeF3cA1a782EFDbB8EB9b1
Proposal created
Vote by all tokens for decline
Proposal successully decliend and event emitted
    ✔ Base decliend (126ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0xF85895D097B2C25946BB95C4d11E2F3c035F8f0C
GlebDao deployed to: 0x0b27a79cb9C0B38eE06Ca3d94DAA68e0Ed17F953
Proposal created
Skip 3 days and try to vote
Vote successfully reverted by ttl
    ✔ Base expired (158ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x408F924BAEC71cC3968614Cb2c58E155A35e6890
GlebDao deployed to: 0x773330693cb7d5D233348E25809770A32483A940
Try to vote for absent proposal
Vote successully reverted
    ✔ Vote for absent proposal (56ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x532802f2F9E0e3EE9d5Ba70C35E1F43C0498772D
GlebDao deployed to: 0xdB012DD3E3345e2f8D23c0F3cbCb2D94f430Be8C
Try to get for absent proposal
tx successully reverted
    ✔ Get absent proposal (55ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x1eB5C49630E08e95Ba7f139BcF4B9BA171C9a8C7
GlebDao deployed to: 0x6e0a5725dD4071e46356bD974E13F35DbF9ef367
Proposal created
Try to vote without tokens
tx successfuly reverted
    ✔ can't vote because doesn't have tokens (91ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x1f53E116c31F171e59f45f0752AEc5d1F5aA3714
GlebDao deployed to: 0xa31F4c0eF2935Af25370D9AE275169CCd9793DA3
Proposal created
send tokens to new voter
tx successfuly reverted
    ✔ can't vote because doesn't delegate (126ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0xA3f7BF5b0fa93176c260BBa57ceE85525De2BaF4
GlebDao deployed to: 0x25A1DF485cFBb93117f12fc673D87D1cddEb845a
send tokens to voter2
send tokens to voter3
balance voter1:  BigNumber { value: "34000000" }
balance voter2:  BigNumber { value: "33000000" }
balance voter3:  BigNumber { value: "33000000" }
voter1 delefate tokens
voter2 delefate tokens
voter3 delefate tokens
proposal created
voter1 vote for accept
voter2 also vote for accept
Proposal successfully accepted
    ✔ 2 voters accept/accept (327ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x7036124464A2d2447516309169322c8498ac51e3
GlebDao deployed to: 0xeE1eb820BeeCED56657bA74fa8D70748D7A6756C
send tokens to voter2
send tokens to voter3
balance voter1:  BigNumber { value: "34000000" }
balance voter2:  BigNumber { value: "33000000" }
balance voter3:  BigNumber { value: "33000000" }
voter1 delegate tokens
voter2 delegate tokens
voter3 delegate tokens
proposal created
voter1 vote for accept
voter2 vote for decline
voter3 vote for accept
Proposal successfully accepted
    ✔ 3 voters accept/decline/accept (431ms)
owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Gleb token deployed to: 0x6D712CB50297b97b79dE784d10F487C00d7f8c2C
GlebDao deployed to: 0x04F339eC4D75Cf2833069e6e61b60eF56461CD7C
send tokens to voter2
send tokens to voter3
balance voter1:  BigNumber { value: "34000000" }
balance voter2:  BigNumber { value: "33000000" }
balance voter3:  BigNumber { value: "33000000" }
voter1 delegate tokens
voter2 delegate tokens
voter3 delegate tokens
proposal created
voter1 vote for accept
voter2 vote for decline
voter3 vote for accept
Proposal successfully declined
    ✔ 3 voters accept/decline/decline (455ms)


  15 passing (14s)
```
