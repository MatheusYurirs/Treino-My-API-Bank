import express from "express";
import winston from "winston";
import accountsRouter from "./routes/account.routes.js"
//readFile e Write file... com promises para não ficar tratando callback no node
import { promises as fs } from "fs";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./doc.js";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import AccountService from "./services/account.service.js";
import Schema from "./schema/index.js";

const { readFile, writeFile } = fs;

//deixa o arquivo de forma global
global.fileName = "accounts.json";

//Uso do winston funcional
const { combine, printf, label, timestamp } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
}

)

//o objeto logger recebe um winston para uso de logs
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-bank-api.log" })
    ],
    format: combine(
        label({ label: "my-bank-api" }),
        timestamp(),
        myFormat
    )
});
/*
const schema = buildSchema(`
    type Account {
        id: Int
        name: String
        balance: Float  
    } 
    input AccountInput{
        id: Int
        name: String
        balance: Float
    }
    type Query {
        getAccounts: [Account]
        getAccount(id: Int):  Account 
    }
    type Mutation {
        createAccount(account: AccountInput): Account
        deleteAccount(id: Int): Boolean
        updateAccount(account: AccountInput): Account
    }
`);
//resolvers
const root = {
    getAccounts: () => AccountService.getAccounts(),
    getAccount(args) {
        return AccountService.getAccount(args.id)
    },
    createAccount({account}) {
        return AccountService.createAccount(account);    
    },
    deleteAccount(args){
        AccountService.deleteAccount(args.id);
    },
    updateAccount({account}){
        return AccountService.updateAccount(account);
    }
}
*/
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
//usa o router do express exportado da pasta routes/accounts
app.use("/account", accountsRouter);
//teste com graphql
app.use("/graphql", graphqlHTTP({
    schema: Schema,
    //rootValue: root,
    graphiql: true
}));

app.listen(3000, async () => {
    try {
        //usando await precisa de usar uma função async
        await readFile(global.fileName);
        global.logger.info("API SUBIU");
    } catch (err) {
        const initialJson = {
            //id para incrementação 
            nextId: 1,
            //array para incrementar o nextID
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
            global.logger("API SUUBIU, E CRIOU ARQUIVO");
        }).catch(err => {
            global.logger.error(err);
        });
    }



});