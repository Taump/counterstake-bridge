const fs = require("fs");
const { ethers } = require("ethers");
const desktopApp = require("ocore/desktop_app.js");
const { getProvider } = require("./provider.js");
const { wait } = require('../utils.js');

const CounterstakeLibrary = require('./build/contracts/CounterstakeLibrary.json');
const Export = require('./build/contracts/Export.json');
const Import = require('./build/contracts/Import.json');
const CounterstakeFactory = require('./build/contracts/CounterstakeFactory.json');
const Oracle = require('./build/contracts/Oracle.json');
const VotedValueUint = require('./build/contracts/VotedValueUint.json');
const VotedValueUintArray = require('./build/contracts/VotedValueUintArray.json');
const VotedValueAddress = require('./build/contracts/VotedValueAddress.json');
const VotedValueFactory = require('./build/contracts/VotedValueFactory.json');
const ExportAssistant = require('./build/contracts/ExportAssistant.json');
const ImportAssistant = require('./build/contracts/ImportAssistant.json');
const AssistantFactory = require('./build/contracts/AssistantFactory.json');
const Governance = require('./build/contracts/Governance.json');
const GovernanceFactory = require('./build/contracts/GovernanceFactory.json');
const oracleJson = require('./build/contracts/Oracle.json');

const { utils: { parseEther }, constants: { AddressZero } } = ethers;

//const evmNetwork = 'Ethereum';
//const evmNetwork = 'BSC';
//const evmNetwork = 'Polygon';
const evmNetwork = 'Kava';

const evmNativePrice = 1; // the dollar price of the native token (ETH, BNB, etc)

const targetGasPrice = 35; // gwei

const opts = {
//	gasPrice: 8e9
};

process.on('unhandledRejection', up => {
	console.error('unhandledRejection event', up);
	throw up;
});


function link(contractJson, libName, libAddress) {
	const symbol = "__" + libName + "_".repeat(40 - libName.length - 2);
	const re = new RegExp(symbol, 'g');
	libAddress = libAddress.toLowerCase().replace(/^0x/, '');
	contractJson.bytecode = contractJson.bytecode.replace(re, libAddress);
	contractJson.deployedBytecode = contractJson.deployedBytecode.replace(re, libAddress);
}

async function deploy() {

//	const { mnemonic, infura_project_id } = process.env;
	const mnemonic = JSON.parse(fs.readFileSync(desktopApp.getAppDataDir() + '/keys.json')).mnemonic_phrase;

	const provider = getProvider(evmNetwork);
	
	const ethWallet = ethers.Wallet.fromMnemonic(mnemonic);
	console.error(`====== my ETH address on ${evmNetwork}: `, process.env.devnet ? await provider.getSigner().getAddress() : ethWallet.address);
	const signer = process.env.devnet ? provider.getSigner(0) : ethWallet.connect(provider);

	if (provider._websocket && !process.env.devnet) {
		provider.on('block', (blockNumber) => {
			console.log('got new block', blockNumber);
			provider._websocket.ping();
		});
	}


	async function createEvmOracle() {
		console.error(`deploying oracle on ${evmNetwork}`);
		const oracleFactory = ethers.ContractFactory.fromSolidity(oracleJson, ethWallet.connect(provider));
		const oracle = await oracleFactory.deploy(opts);
		console.error(evmNetwork, 'oracle', oracle.address);
		await oracle.deployTransaction.wait();
		console.log('mined');
		await wait(5000);
		return oracle;
	}
	
	async function getGasPrice() {
		return (await provider.getGasPrice()).toNumber() / 1e9;
	}

	async function waitForGasPrice() {
		while (true) {
			const gasPrice = await getGasPrice();
			console.log(`gas price`, gasPrice);
			if (gasPrice < targetGasPrice)
				break;
			await wait(60 * 1000);
		}
	}

	await waitForGasPrice();
	
	
	// oracle

	const ousdAsset = process.env.testnet ? 'CPPYMBzFzI4+eMk7tLMTGjLF4E60t5MUfo2Gq7Y6Cn4=' : '0IwAk71D5xFP0vTzwamKBwzad3I1ZUjZ1gdeB5OnfOg='; // won't work on devnet
	const oracle = await createEvmOracle(evmNetwork);
	const oracleAddress = oracle.address;
	let res = await oracle.setPrice("Obyte", "_NATIVE_", 20, evmNativePrice);
	await res.wait();
	console.log('set price Obyte mined');
	await wait(5000);
	res = await oracle.setPrice(ousdAsset, "_NATIVE_", 1, evmNativePrice);
	await res.wait();
	console.log('set price Obyte mined');
	await wait(5000);

	// Counterstake library

	const csLib = await ethers.ContractFactory.fromSolidity(CounterstakeLibrary, signer).deploy(opts);
	console.error('counterstake library', csLib.address);
	link(Export, 'CounterstakeLibrary', csLib.address);
	link(Import, 'CounterstakeLibrary', csLib.address);
	link(ExportAssistant, 'CounterstakeLibrary', csLib.address);
	await csLib.deployTransaction.wait();
	console.log('mined');
	await wait(2000);


	// Voted values

	const votedValueUint = await ethers.ContractFactory.fromSolidity(VotedValueUint, signer).deploy(opts);
	console.log('VotedValueUint master address', votedValueUint.address);
	await votedValueUint.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	const votedValueUintArray = await ethers.ContractFactory.fromSolidity(VotedValueUintArray, signer).deploy(opts);
	console.log('VotedValueUintArray master address', votedValueUintArray.address);
	await votedValueUintArray.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	const votedValueAddress = await ethers.ContractFactory.fromSolidity(VotedValueAddress, signer).deploy(opts);
	console.log('VotedValueAddress master address', votedValueAddress.address);
	await votedValueAddress.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	const votedValueFactory = await ethers.ContractFactory.fromSolidity(VotedValueFactory, signer).deploy(votedValueUint.address, votedValueUintArray.address, votedValueAddress.address, opts);
	console.log('VotedValueFactory address', votedValueFactory.address);
	await votedValueFactory.deployTransaction.wait();
	console.log('mined');
	await wait(2000);


	// Governance

	const governance = await ethers.ContractFactory.fromSolidity(Governance, signer).deploy(csLib.address, AddressZero, opts);
	console.log('Governance master address', governance.address);
	await governance.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	const governanceFactory = await ethers.ContractFactory.fromSolidity(GovernanceFactory, signer).deploy(governance.address, opts);
	console.log('GovernanceFactory address', governanceFactory.address);
	await governanceFactory.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	
	// Bridges

	// export
	const ex = await ethers.ContractFactory.fromSolidity(Export, signer).deploy("Obyte", "OETHasset", AddressZero, 160, 110, parseEther('100'), [14*3600, 3*24*3600, 7*24*3600, 30*24*3600], [4*24*3600, 7*24*3600, 30*24*3600], opts);
	console.log('export master address', ex.address);
	await ex.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	// import
	const im = await ethers.ContractFactory.fromSolidity(Import, signer).deploy("Obyte", "base", "Imported GBYTE master", "GBYTE_MASTER", AddressZero, oracleAddress, 160, 110, parseEther('100'), [14*3600, 3*24*3600, 7*24*3600, 30*24*3600], [4*24*3600, 7*24*3600, 30*24*3600], opts);
	console.log('import master address', im.address);
	await im.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	// counterstake factory
	const csFactory = await ethers.ContractFactory.fromSolidity(CounterstakeFactory, signer).deploy(ex.address, im.address, governanceFactory.address, votedValueFactory.address, opts);
	console.log(`deployed counterstake factory at address`, csFactory.address);
	await csFactory.deployTransaction.wait();
	console.log('mined');
	await wait(2000);


	// Assistants

	// export assistant
	const exas = await ethers.ContractFactory.fromSolidity(ExportAssistant, signer).deploy(ex.address, AddressZero, 100, 2000, AddressZero, 1, "Export assistant template", "EXAS", opts);
	console.log('export assistant master address', exas.address);
	await exas.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	// import assistant
	const imas = await ethers.ContractFactory.fromSolidity(ImportAssistant, signer).deploy(im.address, AddressZero, 100, 2000, 10, 1, "Import assistant template", "IMAS", opts);
	console.log('import assistant master address', imas.address);
	await imas.deployTransaction.wait();
	console.log('mined');
	await wait(2000);

	// assistant factory
	const assistantFactory = await ethers.ContractFactory.fromSolidity(AssistantFactory, signer).deploy(exas.address, imas.address, governanceFactory.address, votedValueFactory.address, opts);
	console.log(`deployed assistant factory at address`, assistantFactory.address);
	await assistantFactory.deployTransaction.wait();
	console.log('mined');
	await wait(2000);


	console.log('done');
	process.exit();
}


deploy();
