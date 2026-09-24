import { expect } from "chai";
import { ethers } from "hardhat";

describe("LoanSignatureRegistry", function () {
  it("should allow user then admin signatures", async () => {
    const [user, admin] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LoanSignatureRegistry");
    const c = await Factory.deploy();
    await c.waitForDeployment();

    const loanId = 42;
    const hash = ethers.keccak256(ethers.toUtf8Bytes("contract-demo"));

    await expect(c.connect(admin).signByAdmin(loanId, hash)).to.be.revertedWith("USER must sign first");
    await c.connect(user).signByUser(loanId, hash);
    await c.connect(admin).signByAdmin(loanId, hash);

    expect(await c.isFullySigned(loanId)).to.eq(true);
  });
});
