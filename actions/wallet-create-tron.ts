import { decrypt, encrypt } from "../utils/encrypt";
import { Tron } from "./tron/init";

var fs = require('fs');

const STORAGE_FILE = "tron-storage.json";

export type Wallet = {
    address: string;
    privateKey: string;
}

export class TronHotWallet {
    private wallets: Wallet[] = [];

    constructor() {
        const storageExists = fs.existsSync(STORAGE_FILE);
        if (storageExists) {
            const file = fs.readFileSync(STORAGE_FILE, 'utf8');
            console.log(file);
            const encrypted = JSON.parse(file);
            console.log(encrypted);
            this.wallets = JSON.parse(decrypt(encrypted));
            console.debug("THW - Loaded storage file.");
        } else {
            console.debug("THW - No storage file found.");
            this.persist();
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
        const encrypted = encrypt(JSON.stringify(this.wallets));
        const stringified = JSON.stringify(encrypted);
        fs.writeFileSync(STORAGE_FILE, stringified, {
            encoding: 'utf-8'
        });
    }
}

