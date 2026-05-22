import { ethers } from "hardhat";

const [deployer] = await ethers.getSigners();

console.log(`Deploying NinetyPlus...`);
console.log("Deployer:", deployer.address);

const NinetyPlus = await ethers.getContractFactory("NinetyPlus");
const ninetyPlus = await NinetyPlus.deploy();

console.log("Waiting for deployment confirmation...");
await ninetyPlus.waitForDeployment();

const address = await ninetyPlus.getAddress();
console.log("NinetyPlus deployed to:", address);
