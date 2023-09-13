/** Dependencies */
require('dotenv').config()
const jwt = require('jsonwebtoken')
const passport = require("passport")
const Base64 = require("crypto-js/enc-base64");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const JwtStrategy = require('passport-jwt').Strategy

/** Middlewares */
const Model = require('./Model')

class Account
{
    /**
     * Realiza o login do usuário
     * @param {object} data: Dados do usuário para realizar o login 
     * @returns {object}: Resultado da tentativa de login
     */
    static async login(data)
    {
        const plataforms = ["google"]
        const app = ["postman.playgain.com.br"]
        const account = await Model.selectAccount({email: data.email})

        /** Caso a conta não exista ou tenha sido deletada, retorna  403 */
        if(account.length === 0 || account[0].deleted == 1) 
            return {status: 403, message: 'Login unsuccessfully', data: {}}

        /** Caso o aplicativo usada para login não tenha sido informado ou não exista, retorna HTTP 401 */
        if(!app.includes(data.app))
            return {status: 401, message: 'Login unsuccessfully', data: {}}

        /** Caso a plataforma usada para login não tenha sido informada ou não exista, retorna HTTP 401 */
        if(!plataforms.includes(data.plataform))
            return {status: 401, message: 'Login unsuccessfully', data: {}}

        const payload = 
        {
            aud: data.app,
            datetime: Date.now(),
            iss: "api.playgain.com.br",
            sub: `login.${data.plataform}`,
        }

        payload.jti = Base64.stringify(hmacSHA512(JSON.stringify(payload), `${payload.datetime}`))
        const secret = process.env.JWT_SECRET
        const token = jwt.sign(payload, secret)

        await Model.updateAccount({referral: account[0].referral}, {token: token})
        await Model.insertAccountLog({event: 'LOGIN', account: account[0].referral, token, metadata: {...payload}})

        return {status: 200, message: 'Login successfully', data: {token: token}}
    }

    /**
     * Autentica o token JWT
     * @param {string} data: Token JWT enviado
     * @return {object}: Resultado da validação do token
     */
    static async authenticate(data)
    {
        const login = await Model.selectAccountLog({event: 'LOGIN', token: data.split(" ")[1]})

        /** Caso o evento de login associado ao token não exista, retorna HTTP 401 */
        if(login.length === 0 || login.length > 1)
            return {status: 401, message: 'Authentication failed', data: {}}

        const account = await Model.selectAccount({referral: login[0].account, token: login[0].token})

        /** Caso a conta não exista ou tenha sido deletada, retorna  403 */
        if(account.length === 0 || account[0].deleted == 1) 
            return {status: 403, message: 'Authentication failed', data: {}}

        const payload = 
        {
            passReqToCallback: false,
            issuer: "api.playgain.com.br",
            audience: login[0].metadata.app,
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: (data) => data.token,
            jsonWebTokenOptions:
            {
                datetime: login[0].metadata.datetime,
                sub: `login.${login[0].metadata.plataform}`
            }
        }

        passport.use(new JwtStrategy(payload))
        console.log(passport.authenticate('jwt'))
        
        return {status: 200, message: 'Successfully authenticated', data: {}}
    }

    /**
     * Realiza o cadastro de um novo usuário
     * @param {object} data: Dados do usuário para cadastro 
     * @returns {object}: Resultado da tentativa de cadastro
     */
    static async register(data)
    {
        const plataforms = ["google"]
        const hasAccount = await Model.selectAccount({email: data.email})

        /** Caso o aplicativo usada para login não tenha sido informado ou não exista, retorna HTTP 401 */
        if(!plataforms.includes(data.plataform))
            return {status: 400, message: 'Register unsuccessfully', data: {}}

        if(hasAccount.length === 0)
        {
            await Model.insertAccount({
                referral: Date.now(), 
                [data.plataform]: data.account, 
                email: data.email, 
                name: data.name, 
                photo: data.photo
            })

            return {status: 201, message: 'Account successfully create', data: {}}
        }

        return {status: 403, message: 'Account unsuccessfully create', data: {}}
    }

    /**
     * Realiza o logout do usuário
     * @param {object} data: Token do usuário
     * @returns {object}: Resultado da tentativa de logout
     */
    static async logout(data)
    {
        await Model.updateAccount({referral: data.account.referral}, {token: null})
        await Model.insertAccountLog({event: 'LOGOUT', account: data.account.referral, token: data.token})

        return {status: 200, message: 'Logout successfully', data: {}}
    }

    /**
     * Busca os dados do usuário
     * @param {object} data: Token do usuário
     * @returns {object}: Resultado da tentativa de busca
     */
    static async account(data)
    {
        const payment = (await Model.selectPayment({account: data.account.referral, deleted: 0}))

        if(payment.length > 0)
        {
            data.account.payment = payment
        }

        return {status: 200, message: 'Account found, send data', data: data}
    }

    /**
     * Realiza o cadastro de um novo meio de pagamento
     * @param {object} data: Dados do usuário para cadastro 
     * @returns {object}: Resultado da tentativa de cadastro
     */
    static async insertPayment(data)
    {
        await Model.insertPayment({
            account: data.account.referral,
            type: data.type,
            metadata: data.metadata
        })

        return {status: 201, message: 'Payment successfully saved', data: {}}
    }

    /**
     * Deleta um meio de pagamento
     * @param {object} data: Dados do usuário para cadastro 
     * @returns {object}: Resultado da tentativa de cadastro
     */
    static async deletePayment(data)
    {
        await Model.updatePayment({_id: data.payment}, {deleted: 1})
        return {status: 200, message: 'Payment successfully deleted', data: {}}
    }
}

module.exports = Account