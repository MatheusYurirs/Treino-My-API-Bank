import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const router = express.Router();


//meotodo post faz a leitura e atualiza o arquivo..."posta as infos passadas para ele"
router.post("/", async (req, res, next) => {
    try {
        let account = req.body; 
         //verificação para o usuário
        if(!account.name || account.balance == null){
            throw new Error("Name e Balance são obrigatórios.");
        }
        //criar um objeto que recebe o acconts.json
        const data = JSON.parse(await readFile(global.fileName));

        account = { 
            id: data.nextId++, 
            name: account.name,
            balance: account.balance
        };
        data.accounts.push(account);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        //outra forma
        //dando parse no objeto para que ele não seja exibido de forma estranha
        //const json = JSON.parse(data);
        //finaliza essa execução 
        res.send(account);

        logger.info(`POST /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err);
    }

});

//metodo get faz a leitura e devolve pro usuario
router.get("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);
        logger.info("GET /account");
    } catch (err) {
        next(err);
    }
});

//retornando para o usuário de maneira específica usando o get by id, utilizando o find
router.get("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        //utilizando find para encontrar o id igual ao que a gente passou como parametro
        const account = data.accounts.find(
            account => account.id === parseInt(req.params.id));
        res.send(account);
        logger.info("GET /account/:id")
    } catch (err) {
        next(err);
    }
});

//metodo delete, que utiliza do filter para fazer a remoção do elemento na posição que ele está
router.delete("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));

        data.accounts = data.accounts.filter(
            account => account.id !== parseInt(req.params.id));
        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.end();
        logger.info(`DELETE /account/:id - ${req.params.id}`)
    } catch (err) {
        next(err);
    }

})

//metodo put, substitui o recurso total específico pelo ID
router.put("/", async (req, res, next) => {
    try {
        let account = req.body;

        if(!account.name || account.balance == null){
            throw new Error("Name e Balance são obrigatórios.");
        }

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(a => a.id === account.id);
        
        if(index === -1){
            throw new Error("Registro não encontrado");
        };
        
        data.accounts[index].name = account.name;
        data.accounts[index].balance = account.balance;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(account);

        logger.info(`PUT /account - ${JSON.stringify(account)}`)
    } catch (err) {
        next(err);
    }
});

//exemplo com patch
router.patch("/updateBalance", async (req, res, next) => {
    try {
        let account = req.body;

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.accounts.findIndex(a => a.id === account.id);

        if(!account.id || account.balance == null){
            throw new Error("ID e Balance são obrigatórios.");
        }

        if(index === -1){
            throw new Error("Registro não encontrado");
        };

        data.accounts[index].balance = account.balance;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(data.accounts[index]);

        logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`)

    } catch (err) {
        next(err);
    }
});

//tratamento de erros...
router.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} ${err.message}`);
    res.status(400).send({ error: err.message });
});




export default router;