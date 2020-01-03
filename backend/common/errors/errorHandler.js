const status = require('http-status')
const { ValidationError } = require('./errors')

module.exports = async (error, request, reply) => { //eslint-disable-line
    console.log('WTf', error)
    /** Check if the error is s subclass of CustomError (purposefully thrown) */
    if (error.httpStatus) {
        return reply.code(error.httpStatus).send(error.toJSON())
    }

    /** Check if the error is one of the known types */
    switch (error.name) {
        case 'MongoError': {
            if (error.code === 11000) {
                const err = new ValidationError('Unique validation')
                return reply.code(err.httpStatus).send(error.toJSON())
            }
            break
        }
        default: {
            request.log.error({
                message: 'Unhandled error',
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
            })

            return reply.code(status.INTERNAL_SERVER_ERROR).send({
                message: 'Unexpected error',
                status: 500,
            })
        }
    }
}
