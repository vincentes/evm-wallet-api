import { Tron } from "./tron/init";

var fs = require('fs');


export type Wallet = {
    address: string;
    privateKey: string;
}

export class TronHotWallet {
    private wallets: Wallet[] = [];

    constructor() {
        const storageExists = fs.existsSync("tron-storage.json");
        let json;
        if (storageExists) {
            json = JSON.parse(fs.readFileSync("tron-storage.json", 'utf8'));
            console.debug("THW - Loaded storage file.");
        } else {
            console.debug("THW - No storage file found.");
            this.persist();
        }

        if (storageExists) {
            this.wallets = json;
        }
    }

    async generateHotWallet() {
        const account = await Tron.createAccount();
        const wallet = {
            address: account.address.base58,
            privateKey: account.privateKey
        };

        this.wallets.push(wallet);
        this.persist();
        return wallet;
    }

    async getHotWallet(address: string) {
        const wallet = this.wallets.find(w => w.address === address);
        if (wallet) {
            return wallet;
        }

        throw new Error("THW not found");
    }

    async exists(address: string) {
        return this.wallets.map(wallet => wallet.address).includes(address);
    }

    private async persist() {
        fs.writeFileSync("tron-storage.json", JSON.stringify(this.wallets), {
            encoding: 'utf-8'
        });
    }
}

