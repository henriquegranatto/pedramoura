const {Account,Payment,Account_Log} = require('../../mongo/app')

class Model
{
    /**
     * Busca as informações de um usuário
     * @param {object} data: Filtro de busca do usuário
     * @returns {object}: Retorno do banco de dados
     */
    static async selectAccount(data)
    {
        return await Account.find(data)
    }

    /**
     * Cria um usuário
     * @param {object} data: Informações para cadastro do usuário
     * @returns {object}: Retorno do banco de dados
     */
    static async insertAccount(data)
    {
        return await (await new Account(data)).save()
    }

    /**
     * Atualiza o cadastro de um usuário
     * @param {object} data: Informações para atualização dos dados do usuário
     * @returns {object}: Retorno do banco de dados
     */
    static async updateAccount(query, update)
    {
        return await Account.findOneAndUpdate(query, update)
    }

    /**
     * Cria um log para um evento na conta
     * @param {object} data: Informações do evento
     * @returns {object}: Retorno do banco de dados
     */
    static async insertAccountLog(data)
    {
        return await (await new Account_Log(data)).save()
    }

    /**
     * Busca as informações do login de um usuário
     * @param {object} data: Filtro de busca do dados de login
     * @returns {object}: Retorno do banco de dados
     */
    static async selectAccountLog(data)
    {
        return await Account_Log.find(data)
    }

    /**
     * Busca as informações de um meio de pagamento
     * @param {object} data: Filtro de busca do usuário
     * @returns {object}: Retorno do banco de dados
     */
    static async selectPayment(data)
    {
        return await Payment.find(data)
    }

    /**
     * Cria um meio de pagamento
     * @param {object} data: Informações para cadastro do usuário
     * @returns {object}: Retorno do banco de dados
     */
    static async insertPayment(data)
    {
        return await (await new Payment(data)).save()
    }

    /**
     * Atualiza um meio de pagamento
     * @param {object} data: Informações para atualização dos dados do usuário
     * @returns {object}: Retorno do banco de dados
     */
    static async updatePayment(query, update)
    {
        return await Payment.findOneAndUpdate(query, update)
    }
}

module.exports = Model