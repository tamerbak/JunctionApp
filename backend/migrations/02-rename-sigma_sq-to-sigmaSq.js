const mongoose = require('mongoose')
const Promise = require('bluebird')

module.exports = {
    index: 2,
    name: '02-rename-sigma_sq-to-sigmaSq',
    description: 'Rename sigma_sq in GaveProject to sigmaSq',
    run: async () => {
        const res = await mongoose
            .model('GavelProject')
            .updateMany(
                { sigma_sq: { $exists: true } },
                { $rename: { sigma_sq: 'sigmaSq' } },
                { multi: true },
            )
        console.log('Done with gavelproject', res.n, res.nModified)

        const psres = await mongoose
            .model('ProjectScore')
            .updateMany(
                { max_score: { $exists: true } },
                { $rename: { max_score: 'maxScore' } },
                { multi: true },
            )

        console.log('Done with ProjectScore', psres.n, psres.nModified)

        return Promise.resolve()
    },
}
