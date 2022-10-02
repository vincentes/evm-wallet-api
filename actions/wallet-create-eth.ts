const HdKeyring = require('@metamask/eth-hd-keyring');
var fs = require('fs');


export type Wallet = {
    address: string;
    privateKey: string;
}

export class ApproHotWallet extends HdKeyring {
    constructor() {
        const storageExists = fs.existsSync("storage.json");
        let json;
        if (storageExists) {
            json = JSON.parse(fs.readFileSync("storage.json", 'utf8'));
            console.debug("Loaded storage file.");
        } else {
            console.debug("No storage file found.");
        }
        console.log("json", json);
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
            console.debug("json", JSON.stringify(json));
            fs.writeFileSync("storage.json", JSON.stringify(json), {
                encoding: 'utf-8'
            });
        });
    }
}

