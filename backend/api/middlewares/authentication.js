const Account = require('../../domain/Account/Account')

module.exports = async (request, response, next) =>
{
    if(!request.user)
        response.status(401)

    next()
}