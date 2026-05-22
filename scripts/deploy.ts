// @ts-nocheck
import { network } from "hardhat";

const { ethers, networkName } = await network.create();
const [deployer] = await ethers.getSigners();

console.log(`Deploying NinetyPlus to ${networkName}...`);
console.log("Deployer:", deployer.address);

const ninetyPlus = await ethers.deployContract("NinetyPlus");

console.log("Waiting for deployment confirmation...");
await ninetyPlus.waitForDeployment();

const address = await ninetyPlus.getAddress();
console.log("NinetyPlus deployed to:", address);
