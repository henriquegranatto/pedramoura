const validate = require("validate.js");

class Validator
{
    /**
     * Valida os dados utilizados para realizar o login
     * @param {object} data: dados a serem validados 
     * @returns {mixed}: <object> caso haja dados inválidos | <undefined> caso os dados estejam corretos 
     */
    static async login(data)
    {
        const template = 
        {
            plataform:
            {
                type: "string",
                presence: {presence: true, allowEmpty: false, message: "Field 'type' is required in request payload"},
                inclusion: {within: ["google"], message: '%{value} is not included in the list of available values'}
            },
            app:
            {
                type: "string",
                presence: {presence: true, allowEmpty: false, message: "Field 'type' is required in request payload"},
                inclusion: {within: ["postman.playgain.com.br"], message: '%{value} is not included in the list of available values'}
            },
            email:
            {
                type: "string",
                format: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                presence: {presence: true, allowEmpty: false, message: "Field 'email' is required in request payload"}
            },
            account:
            {
                type: "string",
                length: {minimum: 20},
                presence: {presence: true, allowEmpty: false, message: "Field 'account' is required in request payload"}
            }
        }

        return await validate(data, template)
    }

    /**
     * Valida os dados utilizados para realizar o cadastro
     * @param {object} data: dados a serem validados 
     * @returns {mixed}: <object> caso haja dados inválidos | <undefined> caso os dados estejam corretos 
     */
    static async register(data)
    {
        const template = 
        {
            email:
            {
                type: "string",
                format: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
                presence: {presence: true, allowEmpty: false, message: "Field 'email' is required in request payload"}
            },
            plataform:
            {
                type: "string",
                inclusion: {within: ["google"], message: "Field 'type' is required in request payload"},
                presence: {presence: true, allowEmpty: false, message: "Field 'type' is required in request payload"},
            },
            account:
            {
                type: "string",
                length: {minimum: 20},
                presence: {presence: true, allowEmpty: false, message: "Field 'account' is required in request payload"}
            },
            name:
            {
                type: "string",
                presence: {presence: true, allowEmpty: false, message: "Field 'name' is required in request payload"},
            },
            photo:
            {
                type: "string",
                presence: {presence: true, allowEmpty: false, message: "Field 'photo' is required in request payload"},
            }
        }

        return await validate(data, template)
    }

    /**
     * Valida os dados utilizados para realizar o cadastro do meio de pagamento
     * @param {object} data: dados a serem validados 
     * @returns {mixed}: <object> caso haja dados inválidos | <undefined> caso os dados estejam corretos 
     */
    static async insertPayment(data)
    {
        const template = 
        {
            type:
            {
                type: "string",
                presence: {presence: true, allowEmpty: false, message: "Field 'type' is required in request payload"},
                inclusion: {within: ["PAYPAL", "PICPAY", "TED", "PIX"], message: '%{value} is not included in the list of available values'}
            },
            metadata:
            {
                presence: {presence: true, allowEmpty: false, message: "Field 'metadata' is required in request payload"}
            }
        }

        return await validate(data, template)
    }

    /**
     * Valida os dados utilizados para realizar a remoção do meio de pagamento
     * @param {object} data: dados a serem validados 
     * @returns {mixed}: <object> caso haja dados inválidos | <undefined> caso os dados estejam corretos 
     */
    static async deletePayment(data)
    {
        const template = 
        {
            payment:
            {
                type: "string",
                presence: {presence: true, allowEmpty: false, message: "Field 'payment' is required in request payload"},
            },
        }

        return await validate(data, template)
    }
}

module.exports = Validator