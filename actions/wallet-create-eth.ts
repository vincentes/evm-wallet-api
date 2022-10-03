import { decrypt, encrypt } from "../utils/encrypt";

const HdKeyring = require('@metamask/eth-hd-keyring');
var fs = require('fs');

const STORAGE_FILE = "storage.json";

export type Wallet = {
    address: string;
    privateKey: string;
}

export class ApproHotWallet extends HdKeyring {
    constructor() {
        const storageExists = fs.existsSync(STORAGE_FILE);
        let json;
        if (storageExists) {
            const file = fs.readFileSync(STORAGE_FILE, 'utf8');
            const encrypted = JSON.parse(file);
            json = JSON.parse(decrypt(encrypted));
            console.debug("Loaded storage file.");
        } else {
            console.debug("No storage file found.");
        }
        super(json);

        if (!storageExists) {
            this.generateRandomMnemonic();
            this.persist();
        }
    }

    async generateHotWallet() {
        this.addAccounts(1);
        this.persist();
        const accounts = await this.getAccounts();
        const generatedAccount = accounts[this.wallets.length - 1];
        const privateKey = await this.exportAccount(generatedAccount);
        return {
            address: generatedAccount,
            privateKey
        };
    }

    async getHotWallet(address: string) {
        const accounts: string[] = await this.getAccounts();
        if (accounts.includes(address)) {
            return {
                address,
                privateKey: this.exportAccount(address)
            };
        }
        throw new Error("UHW not found");
    }

    async exists(address: string) {
        const accounts: string[] = await this.getAccounts();
        return accounts.includes(address);
    }

    private async persist() {
        this.serialize().then((json: any) => {
            const encrypted = encrypt(JSON.stringify(json));
            const stringified = JSON.stringify(encrypted);
            fs.writeFileSync(STORAGE_FILE, stringified, {
                encoding: 'utf-8'
            });
        });
    }
}

