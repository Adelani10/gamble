const { assert, expect } = require("chai")
const { deployments, getNamedAccounts, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config.js")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Gamble", () => {
          let gamble, deployer
          const stakingFee = ethers.utils.parseEther("0.1")
          const odd = 2
          beforeEach(async () => {
              await deployments.fixture(["all"])
              deployer = (await getNamedAccounts()).deployer
              gamble = await ethers.getContract("Gamble", deployer)
          })

          describe("constructor", () => {
              it("initializes the game and sets the owner", async () => {
                  const owner = await gamble.getOwner()
                  assert.equal(owner, deployer)
              })
          })

          describe("placeBet", () => {
              it("reverts if no money is sent to the contract, updates the playerToAmountStaked mapping and emits an event", async () => {
                  await expect(gamble.placeBet()).to.be.revertedWith("Gamble__InsufficientFunds()")
                  await expect(gamble.placeBet({ value: stakingFee })).to.emit(
                      gamble,
                      "playerStaked",
                  )
                  const amt = await gamble.getAmountStakedByPlayer(deployer)
                  console.log(amt.toString())
                  assert.equal(amt.toString(), stakingFee)
              })
          })

          describe("setOdds", () => {
              it("reverts if it has no value", async () => {
                  await expect(gamble.setOdds(1)).to.be.revertedWith("Gamble__ZeroOdds()")
              })

              it("should set the odd for each fixture", async () => {
                  await gamble.setOdds(odd)
                  const res = await gamble.getOdds()
                  assert.equal(res.toString(), odd.toString())
              })
          })

          describe("withdraw", () => {
              it("correctly calculates the payout & resets the playerToAmountStaked mapping", async () => {
                  const startingBal = await ethers.provider.getBalance(deployer)
                  console.log(startingBal.toString())
                  await gamble.placeBet({ value: stakingFee })
                  await gamble.setOdds(odd)
                  await gamble.withdraw()
                  assert.equal(await gamble.getAmountStakedByPlayer(deployer).toString(), "0")
                  const closingBal = await ethers.provider.getBalance(deployer)
                  console.log(closingBal.toString())
              })
          })
      })
