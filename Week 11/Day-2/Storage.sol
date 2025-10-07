// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract Storage {
    uint count;

    constructor()  {
        count = 1;
    }
    function getCount() public view returns(uint){
    return count;
    }
    function setCount() public{
        count++;
    }
}