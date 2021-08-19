import express from "express";
import AccountController from "../controllers/account.controller.js"

const router = express.Router();

//meotodo post faz a leitura e atualiza o arquivo..."posta as infos passadas para ele"
router.post("/", AccountController.createAccount);
//metodo get faz a leitura e devolve pro usuario
router.get("/", AccountController.getAccounts); 
//retornando para o usuário de maneira específica usando o get by id, utilizando o find
router.get("/:id",AccountController.getAccount);
//metodo delete, que utiliza do filter para fazer a remoção do elemento na posição que ele está
router.delete("/:id",AccountController.deleteAccount);
//metodo put, substitui o recurso total específico pelo ID
router.put("/",AccountController.updateAccount);
//exemplo com patch
router.patch("/updateBalance", AccountController.updateBalance);

//tratamento de erros...
router.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} ${err.message}`);
    res.status(400).send({ error: err.message });
});

export default router;