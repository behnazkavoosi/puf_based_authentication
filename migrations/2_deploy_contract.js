const pufAuth = artifacts.require("pufAuth");

module.exports = function(deployer) {
  deployer.deploy(pufAuth);
};
