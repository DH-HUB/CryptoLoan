import { ethers } from "hardhat";
async function main() {
  const Factory = await ethers.getContractFactory("LoanSignatureRegistry");
  const c = await Factory.deploy();
  await c.waitForDeployment();
  console.log("LoanSignatureRegistry deployed to:", await c.getAddress());
}
main().catch((e) => { console.error(e); process.exitCode = 1; });
