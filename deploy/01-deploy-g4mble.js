const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const {verify} = require("../utils/verify")
require("dotenv").config()



module.exports = async function({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const chainId = network.config.chainId

    log("----------------------------------------------------------------")
    let gamble

    gamble = await deploy("Gamble", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations
    })

    if(!developmentChains.includes(network.name) && process.env.SEPOLIA_RPC_URL){
        log("verifying contract, pls wait...")
        await verify(gamble.address, [])
    }

    log("----------------------------------------------------------------")
    
}

module.exports.tags = ["gamble", "all"]