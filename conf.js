/*jslint node: true */
"use strict";

//exports.port = 6611;
//exports.myUrl = 'wss://mydomain.com/bb';

// for local testing
//exports.WS_PROTOCOL === 'ws://';
//exports.port = 16611;
//exports.myUrl = 'ws://127.0.0.1:' + exports.port;

exports.bServeAsHub = false;
exports.bLight = true;

exports.storage = 'sqlite';

exports.hub = process.env.devnet ? 'localhost:6611' : (process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb');
exports.deviceName = 'Cross-chain bridge watchdog';
exports.permanent_pairing_secret = '*';
exports.control_addresses = ['DEVICE ALLOWED TO CHAT'];
exports.payout_address = 'WHERE THE MONEY CAN BE SENT TO';
exports.bSingleAddress = true;
exports.bWantNewPeers = true;
exports.KEYS_FILENAME = 'keys.json';

// TOR
exports.socksHost = '127.0.0.1';
exports.socksPort = 9050;

exports.bNoPassphrase = true;
exports.explicitStart = true;

exports.MAX_UNSPENT_OUTPUTS = 10;
exports.CONSOLIDATION_INTERVAL = 12 * 3600 * 1000;

const bTest = process.env.devnet || process.env.testnet;

exports.max_ts_error = 60; // how far txts can be into the future due to clock difference

// Obyte
exports.token_registry_aa = "O6H6ZIFI57X3PLTYHOCVYPP5A553CYFQ";

exports.version = 'v1.1';

exports.export_factory_aas = {
	'v1': 'YOOQMPDNU3YU6CIN3MOVU6ILY3EVDTLE',
	'v1.1': 'FMAJSIMYTPFG2RIJJJGCYF4X6C6IP3MU',
};
exports.import_factory_aas = {
	'v1': 'KFAJZYLH6T3W2U6LNQJYIWXJVSBB24FN',
	'v1.1': '7D2CD23PJNIECSMQ4M5AMPTHH3FGGLQJ',
};
exports.export_assistant_factory_aas = {
	'v1': 'EKZPWMJOKI6LTRKQTEUD7IFK4BBR5GMK',
	'v1.1': 'HTK3O7RYNVO2BEUI5SZ2NAKRFUGXFMDX',
};
exports.import_assistant_factory_aas = {
	'v1': 'BRDUWQBFJZ277E3QUQXTMDGP3LLLGUO3',
	'v1.1': 'HS2PH23XIXELNUAUGXU3QYEVBI3WH3KP',
};
// exports.export_factory_aa = 'FVRNLCHSQA3XTR56OTMITTCYUYY5JDP6';
// exports.import_factory_aa = 'O2EWQTP5GC5O76FHNBFUYAHQRBGOONK7';
// exports.export_assistant_factory_aa = 'XIZNGEAFWMCCPCCDJ4XIGDODFF47QP5O';
// exports.import_assistant_factory_aa = '6733UA26EHZFZ62NFFJRNMY2EFV3WMHH';

exports.obyte_min_transfer_age = bTest ? 0.5 * 60 : 5 * 60; // 5 mins after MCI timestamp


// EVM
exports.evm_min_transfer_age = bTest ? 0.5 * 60 : 5 * 60; // 5 mins
exports.evm_count_blocks_for_finality = bTest ? 1 : 20; // 20 blocks
exports.evm_required_gas = 420e3 + 70e3; // total gas required for all steps of claiming, normally claim + withdraw
exports.evm_required_gas_with_pooled_assistant = 440e3 + 70e3; // total gas required for all steps of claiming eth
//exports.evm_required_gas_with_pooled_assistant = 520e3 + 90e3; // total gas required for all steps of claiming imported tokens

if (process.env.devnet){
	exports.ethereum_factory_contract_addresses = {
		'v1': '0xd5498A2e8E59821FEd5fEDad028284C31f95a0FF',
		'v1.1': '',
	};
	exports.ethereum_assistant_factory_contract_addresses = {
		'v1': '0x3D539b67e0bb2e9272808094838D158271A67Dba',
		'v1.1': '',
	};
	exports.bsc_factory_contract_addresses = {
		'v1': '',
		'v1.1': '',
	};
	exports.bsc_assistant_factory_contract_addresses = {
		'v1': '',
		'v1.1': '',
	};
	exports.polygon_factory_contract_addresses = {
		'v1': '',
		'v1.1': '',
	};
	exports.polygon_assistant_factory_contract_addresses = {
		'v1': '',
		'v1.1': '',
	};
}
else if (process.env.testnet) {
	exports.ethereum_factory_contract_addresses = {
		'v1': '0x13cF97EB9BF6245784f5FCfCC3Cb3Bd1B959A931',
		'v1.1': '',
	};
	exports.ethereum_assistant_factory_contract_addresses = {
		'v1': '0x39F9CC0a70a5327e129B1Aab6b3B265fA0C03C01',
		'v1.1': '',
	};
	exports.bsc_factory_contract_addresses = {
		'v1': '0x154cEF0ef08f715B66531017E6c2712BB85ac0e5',
		'v1.1': '',
	};
	exports.bsc_assistant_factory_contract_addresses = {
		'v1': '0x426D200d3572febdc2C154A58043bF9f857fb7E6',
		'v1.1': '',
	};
	exports.polygon_factory_contract_addresses = {
		'v1': '0x5e4E4eA9C780b6dF0087b0052A7A1ad039F398bB',
		'v1.1': '',
	};
	exports.polygon_assistant_factory_contract_addresses = {
		'v1': '0xd8BF89335214Caf4724739F52621bC6D70eF87bF',
		'v1.1': '',
	};
}
else {
	exports.ethereum_factory_contract_addresses = {
		'v1': '0x13C34d1b3928B13255F3619D3CA6645Fbadaf6BF',
		'v1.1': '',
	};
	exports.ethereum_assistant_factory_contract_addresses = {
		'v1': '0x12d40AA1861f32a08508ecE504269a1f12759F72',
		'v1.1': '',
	};
	exports.bsc_factory_contract_addresses = {
		'v1': '0x91C79A253481bAa22E7E481f6509E70e5E6A883F',
		'v1.1': '',
	};
	exports.bsc_assistant_factory_contract_addresses = {
		'v1': '0xd634330ca14524A43d193E1c2e92cbaB72952896',
		'v1.1': '',
	};
	exports.polygon_factory_contract_addresses = {
		'v1': '0x7EF26EF55FcE4032281783c70726af1bfB1d51e8',
		'v1.1': '',
	};
	exports.polygon_assistant_factory_contract_addresses = {
		'v1': '0xE740C62aC78bB2666Fa9465052D0a292D7C27A11',
		'v1.1': '',
	};
}


exports.infura_project_id = ''; // in conf.json
exports.polygon_polling_interval = 120; // in seconds

exports.max_exposure = 0.5; // up to 50% of the balance in asset can be sent in a counterstake

exports.recheck_timeout = 15 * 60 * 1000; // 15 mins: when to recheck if a tx was removed
//exports.transfer_wait_time = 30 * 60; // 30 mins: how long to wait for a claimed transfer if it was not immediately found

exports.bWatchdog = true;
exports.bClaimForOthers = true;
exports.bUseOwnFunds = true;
exports.bAttack = true; // whether to bite or just bark by emitting events (assuming bWatchdog = true)

exports.min_reward_ratio = 0.005; // claim for others if the reward is at least 0.5%

exports.webPort = process.env.testnet ? 7001 : 7000; // set to null in order to disable the web server

console.log('finished watchdog conf');
