// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract REAL is ERC20, Ownable {

    constructor() ERC20("REAL", "BRT"){}

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function deposit(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }

    function withdraw(uint _amount) external onlyOwner {
        require(balanceOf(msg.sender) >= _amount);
        _burn(msg.sender, _amount);

        payable(msg.sender).transfer(_amount);
    }

}
