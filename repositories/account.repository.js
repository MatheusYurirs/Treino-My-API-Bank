import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function insertAccount(account) {
    //criar um objeto que recebe o acconts.json
    const data = JSON.parse(await readFile(global.fileName));

    account = {
        id: data.nextId++,
        name: account.name,
        balance: account.balance
    };
    data.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    return account;
}

async function getAccounts() {
    //criar um objeto que recebe o acconts.json
    const data = JSON.parse(await readFile(global.fileName));
    return data.accounts;
}

async function getAccount(id) {
    const accounts = await getAccounts();
    //utilizando find para encontrar o id igual ao que a gente passou como parametro
    const account = accounts.find(account => account.id === parseInt(id));
    if (account) {
        return account;
    }
    throw new Error("Registro não encontrado");
}



async function deleteAccount(id) {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(
        account => account.id !== parseInt(id));
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
}

async function updateAccount(account) {
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex(a => a.id === account.id);

    if (index === -1) {
        throw new Error("Registro não encontrado");
    };

    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    return data.accounts[index];
}


export default {
    getAccounts,
    getAccount,
    insertAccount,
    deleteAccount,
    updateAccount
}