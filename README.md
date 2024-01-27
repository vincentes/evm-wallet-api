# evm-wallet-api

API for creating wallets.
```bash
npm i
```

## Server installation
SSH into the server and execute the following commands.

### MySQL installation
```bash
sudo apt update
```
```bash
sudo apt install mysql-server
```

```bash
sudo systemctl start mysql.service
```

### PM2 installation
```bash
npm install pm2@latest -g
```

```bash
pm2 start npm --name "evm-wallet-api" -- run dev
```
