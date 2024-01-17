const { deployments } = require("hardhat")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Gamble", () => {
          let gamble, deployer
          beforeEach(async () => {
              await deployments.fixture(["all"])
              deployer = (await getNamedAccounts).deployer
              gamble = await ethers.getContract("Gamble", deployer)
          })

          
      })
