const hre = require("hardhat");

async function getBalances(address){
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses){
  let counter=0;
  for(const address of addresses){
    console.log(`address ${counter++}, balance: `, await getBalances(address))
  }
}

async function consoleMemos(memos){
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, name: ${name}, from: ${from}, message: ${message}`)
  }
}

async function main() {
  
  const [owner, from1, from2, from3] = await hre.ethers.getSigners();
  const chai = await hre.ethers.getContractFactory('Chai');
  const contract = await chai.deploy(); // instance of contract

  await contract.deployed();
  console.log('address of contract: ', contract.address);

  const addresses = [owner.address, from1.address,];

  console.log('before buying chai')
  await consoleBalances(addresses);

  const amount = {value: hre.ethers.utils.parseEther("1")};
  await contract.connect(from1).buyChai('from1', 'trial', amount)
  await contract.connect(from2).buyChai('from2', 'trial', amount)
  await contract.connect(from3).buyChai('from3', 'trial', amount)

  console.log('after buying chai')
  await consoleBalances(addresses);
  
  const memos = await contract.getMemos();
  consoleMemos(memos);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
