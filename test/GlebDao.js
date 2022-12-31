const { ethers } = require("hardhat");
const { Contract } = require("ethers")
const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");


describe("Test", function () {
  let glebDao;
  let glebToken;

 
  this.beforeEach(async function () {
    [owner] = (await hre.ethers.getSigners())
    console.log("owner:", owner.address)

    // Deploy GlebToken
    const GlebToken = await hre.ethers.getContractFactory("GlebToken", owner);
    glebToken = await GlebToken.deploy();
    await glebToken.deployed();
    console.log("Gleb token deployed to:", glebToken.address);

    // Deploy Dao
    const GlebDao = await hre.ethers.getContractFactory("GlebDao", owner);
    glebDao = await GlebDao.deploy(glebToken.address);
    await glebDao.deployed();
    console.log("GlebDao deployed to:", glebDao.address);
  })

  it("Create proposal", async function(){
        await expect(
            glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
        ).to.emit(glebDao, "CreatedProposal")
        console.log("Proposal successfully created and event emited");
  })

  it("Create proposal with the same name", async function(){
    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    console.log("Proposal successfully created");
    await expect(
        glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    ).to.be.revertedWith("GlebDao: Proposal already exists")  
    console.log("Creating proposal with existing name sucessuly reverted");
  })

  it("Create 3 proposals", async function(){
    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    console.log("1 proposal created");
    await glebDao.createProposal("0x626c756510000000000000000000000000000000000000000000000000000000")
    console.log("2 proposal created");
    await glebDao.createProposal("0x626c756520000000000000000000000000000000000000000000000000000000")
    console.log("3 proposal created");
  })

  it("Create 4 proposals", async function(){
    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    console.log("1 proposal created");
    await glebDao.createProposal("0x626c756510000000000000000000000000000000000000000000000000000000")
    console.log("2 proposal created");
    await glebDao.createProposal("0x626c756520000000000000000000000000000000000000000000000000000000")
    console.log("3 proposal created");
    await expect(
      glebDao.createProposal("0x626c756530000000000000000000000000000000000000000000000000000000")
    ).to.be.revertedWith("GlebDao: Max proposals number reached")
    console.log("4 proposal sucussfuly reverted when max amount reached");
  })

  it("Base accept", async function() {
    await glebToken.delegate(owner.address)

    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    console.log("Proposal created");
    console.log("Vote by all tokens for accept");
    await expect(
        glebDao.vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 100 * 10**6)
    )
    .to.emit(glebDao, "NewVote")
    .to.emit(glebDao, "FinishedProposal")
    .withArgs("0x626c756500000000000000000000000000000000000000000000000000000000", "Proposal accepted")
    console.log("Proposal successully accepted and event emitted");
  })

  it("Make 2 votes by one account", async function() {
    await glebToken.delegate(owner.address)

    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    console.log("Proposal created");
    console.log("Vote by 30% tokens for accept");
    await glebDao.vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 30 * 10**6)
    console.log("revert old vote and vote by by 60% tokens for accept");
    await expect(
        glebDao.vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 60 * 10**6)
    )
    .to.emit(glebDao, "NewVote")
    .to.emit(glebDao, "FinishedProposal")
    .withArgs("0x626c756500000000000000000000000000000000000000000000000000000000", "Proposal accepted")
    console.log("Proposal successully accepted and event emitted");
  })

  it("Base decliend", async function() {
    await glebToken.delegate(owner.address)

    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")

    console.log("Proposal created");
    console.log("Vote by all tokens for decline");
    
    await expect(
        glebDao.vote("0x626c756500000000000000000000000000000000000000000000000000000000", false, 100 * 10**6)
    )
    .to.emit(glebDao, "NewVote")
    .to.emit(glebDao, "FinishedProposal")
    .withArgs("0x626c756500000000000000000000000000000000000000000000000000000000", "Proposal declined")
    console.log("Proposal successully decliend and event emitted");
  })

  it("Base expired", async function() {
    await glebToken.delegate(owner.address)
  
    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    console.log("Proposal created");
    await time.increase(3600*24*3);
    console.log("Skip 3 days and try to vote")
    await expect(
        glebDao.vote("0x626c756500000000000000000000000000000000000000000000000000000000", false, 100 * 10**6)
    ).to.revertedWith("GlebDao: Proposal discarded")
    console.log("Vote successfully reverted by ttl")
  })

  it("Vote for absent proposal", async function() {
    await glebToken.delegate(owner.address)
    console.log("Try to vote for absent proposal")
    await expect(
        glebDao.vote("0x626c756500000000000000000000000000000000000000000000000000000000", false, 100 * 10**6)
    ).to.revertedWith("GlebDao: Proposal doesn't exist")
    console.log("Vote successully reverted")
  })

  it("Get absent proposal", async function() {
    await glebToken.delegate(owner.address)
    console.log("Try to get for absent proposal")
    await expect(
        glebDao.getProposal("0x626c756500000000000000000000000000000000000000000000000000000000")
    ).to.revertedWith("GlebDao: Proposal doesn't exist")
    console.log("tx successully reverted")
  })
  

  it("can't vote because doesn't have tokens", async function() {
    await glebToken.delegate(owner.address)
    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000");
    console.log("Proposal created");
    [owner, voter] = await hre.ethers.getSigners()
    console.log("Try to vote without tokens")
    await expect(
        glebDao.connect(voter).vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 100 * 10**6)
    ).to.revertedWith("GlebDao: Not enough balance")
    console.log("tx successfuly reverted")
  })

  it("can't vote because doesn't delegate", async function() {
    await glebToken.delegate(owner.address)

    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000");
    console.log("Proposal created");
    [owner, voter] = await hre.ethers.getSigners()
    console.log("send tokens to new voter");
    glebToken.transfer(voter.address, 20*10**6)
    await expect(
        glebDao.connect(voter).vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 100 * 10**6)
    ).to.revertedWith("Not enough tokens");
    console.log("tx successfuly reverted")
  })

  it("2 voters accept/accept", async function() {
    [voter1, voter2, voter3] = await hre.ethers.getSigners()
    console.log("send tokens to voter2");
    await glebToken.transfer(voter2.address, 33*10**6)
    console.log("send tokens to voter3");
    await glebToken.transfer(voter3.address, 33*10**6)
    console.log("balance voter1: ", await glebToken.balanceOf(voter1.address));
    console.log("balance voter2: ", await glebToken.balanceOf(voter2.address));
    console.log("balance voter3: ", await glebToken.balanceOf(voter3.address));


    console.log("voter1 delefate tokens");
    await glebToken.connect(voter1).delegate(voter1.address)
    console.log("voter2 delefate tokens");
    await glebToken.connect(voter2).delegate(voter2.address)
    console.log("voter3 delefate tokens");
    await glebToken.connect(voter3).delegate(voter3.address)

    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000");
    console.log("proposal created");
    
    console.log("voter1 vote for accept");
    await glebDao.connect(voter1).vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 34 * 10**6)
    console.log("voter2 also vote for accept");
    await expect(
        glebDao.connect(voter2).vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 33 * 10**6)
    ).to.emit(glebDao, "FinishedProposal")
    .withArgs("0x626c756500000000000000000000000000000000000000000000000000000000", "Proposal accepted");
    console.log("Proposal successfully accepted");
  })

  it("3 voters accept/decline/accept", async function() {
    [voter1, voter2, voter3] = await hre.ethers.getSigners()
    console.log("send tokens to voter2");
    await glebToken.transfer(voter2.address, 33*10**6)
    console.log("send tokens to voter3");
    await glebToken.transfer(voter3.address, 33*10**6)
    console.log("balance voter1: ", await glebToken.balanceOf(voter1.address));
    console.log("balance voter2: ", await glebToken.balanceOf(voter2.address));
    console.log("balance voter3: ", await glebToken.balanceOf(voter3.address));


    console.log("voter1 delegate tokens");
    await glebToken.connect(voter1).delegate(voter1.address)
    console.log("voter2 delegate tokens");
    await glebToken.connect(voter2).delegate(voter2.address)
    console.log("voter3 delegate tokens");
    await glebToken.connect(voter3).delegate(voter3.address)


    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000");
    console.log("proposal created");
    
    console.log("voter1 vote for accept");
    await glebDao.connect(voter1).vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 34 * 10**6)
    console.log("voter2 vote for decline");
    await glebDao.connect(voter2).vote("0x626c756500000000000000000000000000000000000000000000000000000000", false, 33 * 10**6)
    console.log("voter3 vote for accept");
    await expect(
        glebDao.connect(voter3).vote("0x626c756500000000000000000000000000000000000000000000000000000000", true, 33 * 10**6)
    ).to.emit(glebDao, "FinishedProposal")
    .withArgs("0x626c756500000000000000000000000000000000000000000000000000000000", "Proposal accepted");
    console.log("Proposal successfully accepted");
  })

  it("3 voters accept/decline/decline", async function() {
    [voter1, voter2, voter3] = await hre.ethers.getSigners()
    console.log("send tokens to voter2");
    await glebToken.transfer(voter2.address, 33*10**6)
    console.log("send tokens to voter3");
    await glebToken.transfer(voter3.address, 33*10**6)
    console.log("balance voter1: ", await glebToken.balanceOf(voter1.address));
    console.log("balance voter2: ", await glebToken.balanceOf(voter2.address));
    console.log("balance voter3: ", await glebToken.balanceOf(voter3.address));


    console.log("voter1 delegate tokens");
    await glebToken.connect(voter1).delegate(voter1.address)
    console.log("voter2 delegate tokens");
    await glebToken.connect(voter2).delegate(voter2.address)
    console.log("voter3 delegate tokens");
    await glebToken.connect(voter3).delegate(voter3.address)


    await glebDao.createProposal("0x626c756500000000000000000000000000000000000000000000000000000000");
    console.log("proposal created");
    
    console.log("voter1 vote for accept");
    await glebDao.connect(voter1).vote("0x626c756500000000000000000000000000000000000000000000000000000000", true,  34 * 10**6)
    console.log("voter2 vote for decline");
    await glebDao.connect(voter2).vote("0x626c756500000000000000000000000000000000000000000000000000000000", false, 33 * 10**6)
    console.log("voter3 vote for accept");
    await expect(
        glebDao.connect(voter3).vote("0x626c756500000000000000000000000000000000000000000000000000000000", false, 33 * 10**6)
    ).to.emit(glebDao, "FinishedProposal")
    .withArgs("0x626c756500000000000000000000000000000000000000000000000000000000", "Proposal declined");
    console.log("Proposal successfully declined");
  })
})