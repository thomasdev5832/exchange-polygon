// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DREX is ERC20, Ownable {
    address public _owner;

    constructor(address initialOwner) Ownable(initialOwner) ERC20("DREX", "DRX"){
        _owner = initialOwner;
    }

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
