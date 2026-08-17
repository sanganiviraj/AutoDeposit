const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("USDTMultisender Smart Contract", function () {
  let multisender;
  let mockToken;
  let mockUSDT6Decimals;
  let owner;
  let sender;
  let recipient1;
  let recipient2;
  let recipient3;
  let addrs;

  beforeEach(async function () {
    [owner, sender, recipient1, recipient2, recipient3, ...addrs] = await ethers.getSigners();

    const USDTMultisenderFactory = await ethers.getContractFactory("USDTMultisender");
    multisender = await USDTMultisenderFactory.deploy();

    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy("Mock USDT", "USDT", 18);
    mockUSDT6Decimals = await MockERC20Factory.deploy("Tether USD", "USDT", 6);

    // Mint tokens to sender
    await mockToken.mint(sender.address, ethers.parseUnits("10000", 18));
    await mockUSDT6Decimals.mint(sender.address, ethers.parseUnits("10000", 6));
  });

  describe("Successful Multisend Transfers", function () {
    it("should transfer tokens to 2 recipients correctly and update balances", async function () {
      const amount1 = ethers.parseUnits("100", 18);
      const amount2 = ethers.parseUnits("100", 18);
      const totalAmount = amount1 + amount2;

      const recipients = [recipient1.address, recipient2.address];
      const amounts = [amount1, amount2];

      await mockToken.connect(sender).approve(await multisender.getAddress(), totalAmount);

      const senderBalanceBefore = await mockToken.balanceOf(sender.address);

      await expect(
        multisender.connect(sender).multisend(await mockToken.getAddress(), recipients, amounts)
      )
        .to.emit(multisender, "MultisendExecuted")
        .withArgs(sender.address, await mockToken.getAddress(), 2, totalAmount);

      expect(await mockToken.balanceOf(recipient1.address)).to.equal(amount1);
      expect(await mockToken.balanceOf(recipient2.address)).to.equal(amount2);
      expect(await mockToken.balanceOf(sender.address)).to.equal(senderBalanceBefore - totalAmount);
    });

    it("should work with non-18 decimal tokens (e.g. 6 decimals USDT)", async function () {
      const amount1 = ethers.parseUnits("50", 6);
      const amount2 = ethers.parseUnits("150", 6);
      const totalAmount = amount1 + amount2;

      const recipients = [recipient1.address, recipient2.address];
      const amounts = [amount1, amount2];

      await mockUSDT6Decimals.connect(sender).approve(await multisender.getAddress(), totalAmount);

      await multisender.connect(sender).multisend(await mockUSDT6Decimals.getAddress(), recipients, amounts);

      expect(await mockUSDT6Decimals.balanceOf(recipient1.address)).to.equal(amount1);
      expect(await mockUSDT6Decimals.balanceOf(recipient2.address)).to.equal(amount2);
    });
  });

  describe("Validation & Custom Error Handling", function () {
    it("should revert with ZeroToken if token address is zero", async function () {
      await expect(
        multisender.connect(sender).multisend(
          ethers.ZeroAddress,
          [recipient1.address],
          [ethers.parseUnits("100", 18)]
        )
      ).to.be.revertedWithCustomError(multisender, "ZeroToken");
    });

    it("should revert with EmptyRecipients if recipients array is empty", async function () {
      await expect(
        multisender.connect(sender).multisend(await mockToken.getAddress(), [], [])
      ).to.be.revertedWithCustomError(multisender, "EmptyRecipients");
    });

    it("should revert with LengthMismatch if arrays have different lengths", async function () {
      await expect(
        multisender.connect(sender).multisend(
          await mockToken.getAddress(),
          [recipient1.address, recipient2.address],
          [ethers.parseUnits("100", 18)]
        )
      ).to.be.revertedWithCustomError(multisender, "LengthMismatch");
    });

    it("should revert with ZeroRecipient when a recipient address is 0x0", async function () {
      const recipients = [recipient1.address, ethers.ZeroAddress];
      const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("100", 18)];

      await mockToken.connect(sender).approve(await multisender.getAddress(), ethers.parseUnits("200", 18));

      await expect(
        multisender.connect(sender).multisend(await mockToken.getAddress(), recipients, amounts)
      )
        .to.be.revertedWithCustomError(multisender, "ZeroRecipient")
        .withArgs(1);
    });

    it("should revert with ZeroAmount when an amount is 0", async function () {
      const recipients = [recipient1.address, recipient2.address];
      const amounts = [ethers.parseUnits("100", 18), 0n];

      await mockToken.connect(sender).approve(await multisender.getAddress(), ethers.parseUnits("100", 18));

      await expect(
        multisender.connect(sender).multisend(await mockToken.getAddress(), recipients, amounts)
      )
        .to.be.revertedWithCustomError(multisender, "ZeroAmount")
        .withArgs(1);
    });

    it("should revert with TooManyRecipients if recipient count exceeds 100", async function () {
      const recipients = [];
      const amounts = [];

      for (let i = 0; i < 101; i++) {
        recipients.push(ethers.Wallet.createRandom().address);
        amounts.push(ethers.parseUnits("1", 18));
      }

      await expect(
        multisender.connect(sender).multisend(await mockToken.getAddress(), recipients, amounts)
      ).to.be.revertedWithCustomError(multisender, "TooManyRecipients");
    });
  });

  describe("Balance & Allowance Reverts", function () {
    it("should revert if sender allowance is less than total required amount", async function () {
      const recipients = [recipient1.address, recipient2.address];
      const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("100", 18)];

      // Approve only 150 instead of 200
      await mockToken.connect(sender).approve(await multisender.getAddress(), ethers.parseUnits("150", 18));

      await expect(
        multisender.connect(sender).multisend(await mockToken.getAddress(), recipients, amounts)
      ).to.be.reverted;
    });

    it("should revert if sender balance is less than total required amount", async function () {
      const poorUser = addrs[0];
      await mockToken.mint(poorUser.address, ethers.parseUnits("50", 18));

      const recipients = [recipient1.address];
      const amounts = [ethers.parseUnits("100", 18)];

      await mockToken.connect(poorUser).approve(await multisender.getAddress(), ethers.parseUnits("100", 18));

      await expect(
        multisender.connect(poorUser).multisend(await mockToken.getAddress(), recipients, amounts)
      ).to.be.reverted;
    });
  });

  describe("Atomicity & Partial Failure Protections", function () {
    it("should revert the entire transaction if any single transfer fails", async function () {
      const recipients = [recipient1.address, recipient2.address, recipient3.address];
      const amounts = [
        ethers.parseUnits("100", 18),
        ethers.parseUnits("1000000", 18), // Exceeds balance
        ethers.parseUnits("100", 18),
      ];

      await mockToken.connect(sender).approve(await multisender.getAddress(), ethers.parseUnits("1000200", 18));

      await expect(
        multisender.connect(sender).multisend(await mockToken.getAddress(), recipients, amounts)
      ).to.be.reverted;

      // Ensure recipient1 received 0 tokens due to total transaction rollback
      expect(await mockToken.balanceOf(recipient1.address)).to.equal(0);
    });
  });

  describe("Security & Non-Custodial Verification", function () {
    it("contract balance must remain 0 after multisend", async function () {
      const recipients = [recipient1.address, recipient2.address];
      const amounts = [ethers.parseUnits("100", 18), ethers.parseUnits("200", 18)];

      await mockToken.connect(sender).approve(await multisender.getAddress(), ethers.parseUnits("300", 18));

      await multisender.connect(sender).multisend(await mockToken.getAddress(), recipients, amounts);

      expect(await mockToken.balanceOf(await multisender.getAddress())).to.equal(0);
      expect(await ethers.provider.getBalance(await multisender.getAddress())).to.equal(0);
    });
  });
});
