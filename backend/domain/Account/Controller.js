/** Subdomain */
const Account = require('./Account')

/** Middlewares */
const Validator = require('./Validator')

class Controller
{
    /**
     * Solicita o login do usuário ao subdmínio
     * @param {object} request: Request HTTP recebida através do módulo API 
     * @returns {object}: Status HTTP e payload do response da requisição
     */
    static async login(request)
    {      
        const validate = await Validator.login(request.body)

        if(validate != undefined)
        {
            return {status: 400, body: validate}
        }

        const {status, message, data} = await Account.login(request.body)        
        return {status: status, body: {message, data}}
    }

    /**
     * Solicita a criação de um novo usuário
     * @param {object} request:Request HTTP recebida através do módulo API 
     * @returns: Status HTTP e payload do response da requisição
     */
    static async register(request)
    {
        const validate = await Validator.register(request.body)

        if(validate != undefined)
        {
            return {status: 400, body: validate}
        }

        const {status, message, data} = await Account.register(request.body)        
        return {status: status, body: {message, data}}
    }

    /**
     * Solicita o logout do usuário ao subdmínio
     * @param {object} request: Request HTTP recebida através do módulo API 
     * @returns {object}: Status HTTP e payload do response da requisição
     */
    static async logout(request)
    {
        const {token, account} = request.headers
        const {status, message, data} = await Account.logout({token, account})        
        return {status: status, body: {message, data}}
    }

    /**
     * Solicita os dados do usuário
     * @param {object} request: Request HTTP recebida através do módulo API 
     * @returns {object}: Status HTTP e payload do response da requisição
     */
    static async account(request)
    {
        const {account} = request.headers
        const {status, message, data} = await Account.account({account})        
        return {status: status, body: {message, data}}
    }

    /**
     * Solicita o cadastro ou remoção de uma forma de pagamento
     * @param {object} request: Request HTTP recebida através do módulo API 
     * @returns {object}: Status HTTP e payload do response da requisição
     */
    static async payment(request)
    {
        const account = 
        {
            POST: (data) => this.insertPayment(data),
            DELETE: (data) => this.deletePayment(data),
        }

        return await account[request.method](request)
    }

    /**
     * Solicita o cadastro de uma forma de pagamento
     * @param {object} request: Request HTTP recebida através do módulo API 
     * @returns {object}: Status HTTP e payload do response da requisição
     */
    static async insertPayment(request)
    {
        const {account} = request.headers
        const validate = await Validator.insertPayment(request.body)

        if(validate != undefined)
        {
            return {status: 400, body: validate}
        }

        const {status, message, data} = await Account.insertPayment({account, ...request.body})   
        return {status: status, body: {message, data}}
    }

    /**
     * Solicita a remoção de uma forma de pagamento
     * @param {object} request: Request HTTP recebida através do módulo API 
     * @returns {object}: Status HTTP e payload do response da requisição
     */
    static async deletePayment(request)
    {
        const validate = await Validator.deletePayment(request.body)

        if(validate != undefined)
        {
            return {status: 400, body: validate}
        }

        const {status, message, data} = await Account.deletePayment(request.body)        
        return {status: status, body: {message, data}}
    }
}

module.exports = Controller