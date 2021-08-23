import { GraphQLInt, GraphQLList } from "graphql";
import Account from "../types/Account.js";
import accountService from "../../services/account.service.js";

const accountQueries ={
    getAccounts: {
        type: new GraphQLList(Account),
        resolve: () => accountService.getAccounts()
    },
    getAccount: {
        type: Account,
        args: {
            id: {
                name: "id",
                type: GraphQLInt

            }
        },
        resolve: (_,args) => accountService.getAccount(args.id)
    }
};

export default accountQueries;