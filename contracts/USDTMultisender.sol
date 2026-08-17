// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title USDTMultisender
 * @notice Independent, non-custodial smart contract for executing batch BEP-20 / ERC-20 token transfers.
 * @dev Transfers tokens directly from msg.sender to each recipient in a single transaction using SafeERC20.
 *      Does NOT retain, store, custody, or charge fees on any funds.
 */
contract USDTMultisender {
    using SafeERC20 for IERC20;

    /// @notice Maximum allowed recipients per batch transaction to prevent block gas limit exhaustion.
    uint256 public constant MAX_RECIPIENTS = 100;

    // --- Custom Errors ---
    error ZeroToken();
    error EmptyRecipients();
    error LengthMismatch();
    error TooManyRecipients();
    error ZeroRecipient(uint256 index);
    error ZeroAmount(uint256 index);

    // --- Events ---
    event MultisendExecuted(
        address indexed sender,
        address indexed token,
        uint256 recipientCount,
        uint256 totalAmount
    );

    /**
     * @notice Execute a batch transfer of an ERC-20 / BEP-20 token to multiple recipients.
     * @param token The ERC-20 token contract address (e.g., BEP-20 USDT).
     * @param recipients Array of destination addresses.
     * @param amounts Array of token amounts corresponding to each recipient.
     */
    function multisend(
        IERC20 token,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        if (address(token) == address(0)) {
            revert ZeroToken();
        }

        uint256 recipientCount = recipients.length;

        if (recipientCount == 0) {
            revert EmptyRecipients();
        }

        if (recipientCount > MAX_RECIPIENTS) {
            revert TooManyRecipients();
        }

        if (recipientCount != amounts.length) {
            revert LengthMismatch();
        }

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < recipientCount; ) {
            address recipient = recipients[i];
            uint256 amount = amounts[i];

            if (recipient == address(0)) {
                revert ZeroRecipient(i);
            }

            if (amount == 0) {
                revert ZeroAmount(i);
            }

            totalAmount += amount;

            token.safeTransferFrom(msg.sender, recipient, amount);

            unchecked {
                ++i;
            }
        }

        emit MultisendExecuted(msg.sender, address(token), recipientCount, totalAmount);
    }
}
