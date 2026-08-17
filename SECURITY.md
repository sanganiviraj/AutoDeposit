# SECURITY.md - Security Model & Smart Contract Audit

## Non-Custodial Invariants

This application is designed as an **independent, fully non-custodial Web3 dApp**. 

### Critical Security Protections:
- **Zero Private Key Access**: The application **never** asks for, receives, stores, or transmits seed phrases, private keys, or wallet passwords.
- **Client-Side Signing**: All blockchain transaction signatures occur exclusively inside the user's wallet (e.g. Trust Wallet, Metamask, or WalletConnect-compatible wallet).
- **Zero Custody**: Funds are transferred directly from `msg.sender` (user's wallet) to destination recipient addresses in a single atomic transaction. Contract balance remains 0 at all times.

---

## Smart Contract Audit Summary (`USDTMultisender.sol`)

Before deployment to mainnet, the smart contract logic was audited against key Web3 security criteria:

| Security Check | Audit Status | Details |
| :--- | :--- | :--- |
| **Function Call Access** | **PASSED** | `multisend` is callable by any external caller (`external`). No restricted admin methods exist. |
| **Token Transfer Bounds** | **PASSED** | Any ERC-20 / BEP-20 token address conforming to `IERC20` can be processed. |
| **Custody Risk** | **PASSED** | Zero custody. Tokens do not pass into contract storage; `safeTransferFrom` executes directly between `msg.sender` and `recipients[i]`. |
| **Ownership Controls** | **PASSED** | No owner, no `Ownable` inheritance, no admin withdrawal functions. |
| **Upgradeability Risk** | **PASSED** | Contract is non-upgradeable and immutable. Logic cannot be altered post-deployment. |
| **Hidden / Referral Fees** | **PASSED** | 0% application fees, 0% referral fees, 0% developer commissions. Only normal BSC gas is paid. |
| **Approval Abuse Risk** | **PASSED** | Frontend requests exact token allowance (`approve(spender, total)`). Never requests `MaxUint256`. |
| **Malicious ERC-20 Behavior**| **PASSED** | Protected by OpenZeppelin `SafeERC20`. Non-standard return values or reentrancy attempts are mitigated. |
| **Batch Transfer Atomicity**| **PASSED** | Atomic execution. If any single recipient transfer fails, the entire batch transaction reverts. |

---

## Custom Errors & Validation Matrix

```solidity
error ZeroToken();                 // Reverts if token contract is 0x0 address
error EmptyRecipients();           // Reverts if recipient list is empty
error LengthMismatch();            // Reverts if recipient and amount array lengths differ
error TooManyRecipients();         // Reverts if recipient count > 100
error ZeroRecipient(uint256 index);// Reverts if recipient address at index is 0x0
error ZeroAmount(uint256 index);   // Reverts if amount at index is 0
```

---

## Environment & Secrets Exposure Guidelines

### Frontend Environment (`.env`)
The frontend bundle built by Vite exposes variables prefixed with `VITE_`.
- `VITE_REOWN_PROJECT_ID` - Public WalletConnect configuration identifier. **SAFE TO EXPOSE**.
- `VITE_BSC_RPC_URL` - Public RPC node URL. **SAFE TO EXPOSE**.
- `VITE_MULTISENDER_ADDRESS` - Public contract address. **SAFE TO EXPOSE**.

### Deployment Environment (`DEPLOYER_PRIVATE_KEY`)
- `DEPLOYER_PRIVATE_KEY` is **ONLY** accessed by Hardhat deployment scripts (`scripts/deploy.ts`).
- **NEVER** prefix deployer keys with `VITE_`.
- **NEVER** commit real private keys to git repositories.
