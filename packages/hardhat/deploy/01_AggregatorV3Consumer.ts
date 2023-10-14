import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { network } from "hardhat";

/**
 * Deploy PriceFeedConsumer contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployAggregatorV3Consumer: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;
  const { ethers } = hre;

  const chainId = await hre.ethers.provider.getNetwork().then(network => network.chainId);

  log("------------------------------------");
  let priceFeedAddress: string | undefined;

  if (developmentChains.includes(network.name)) {
    // use mock address if on local network
    const MockV3Aggregator = await ethers.getContract("MockV3Aggregator");
    priceFeedAddress = MockV3Aggregator.address;
  } else {
    // use address from helper-hardhat-config if on testnet or live network
    priceFeedAddress = networkConfig[chainId].priceFeedAddress?.ETH_USD;
  }

  const args = [priceFeedAddress];
  await deploy("AggregatorV3Consumer", {
    from: deployer,
    args: args,
    log: true,
    autoMine: true,
  });

  // * HOW TO VERIFY : https://docs.scaffoldeth.io/deploying/deploy-smart-contracts#4-verify-your-smart-contract
};

export default deployAggregatorV3Consumer;

deployAggregatorV3Consumer.tags = ["aggregator", "all"];