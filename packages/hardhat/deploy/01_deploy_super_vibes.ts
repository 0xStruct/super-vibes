import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import LZ_ENDPOINTS from "../constants/layerzeroEndpoints.json";
import ONFT_ARGS from "../constants/onftArgs.json";

const deploySuperVibes: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log(`>>> your address: ${deployer}`);
  console.log(hre.network.name);

  const lzEndpointAddress = LZ_ENDPOINTS[hre.network.name];
  const onftArgs = ONFT_ARGS[hre.network.name];
  console.log({ onftArgs });
  console.log(`[${hre.network.name}] LayerZero Endpoint address: ${lzEndpointAddress}`);

  await deploy("SuperVibes", {
    from: deployer,
    args: [150000, lzEndpointAddress, onftArgs.startMintId, onftArgs.endMintId],
    log: true,
    waitConfirmations: 1,
  });
};

export default deploySuperVibes;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deploySuperVibes.tags = ["SuperVibes"];
