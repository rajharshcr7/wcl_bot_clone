const fs = require('fs');
const mongoose = require('mongoose');
module.exports = {
    name: 'updatedb',
    aliases: ['updb'],
    description: 'Updates database for each change of clan(tag)/abb',
    args: false,
    execute: async (message, args) => {
        async function allabbs() {
            return mongoose.model('ALL ABBS', new mongoose.Schema({
                populate_data: {
                    type: Array,
                    ref: mongoose.model('ABBS', new mongoose.Schema({
                        div: {
                            type: String,
                            required: true
                        },
                        values: {
                            type: Array,
                            required: true,
                        }
                    }, { collection: 'abbs' }))
                }
            }, { collection: 'all_abbs' }));
        }
        if (message.author.id === '531548281793150987') {
            var data = fs.readFileSync('./commands/abbs.json');
            var myObject = JSON.parse(data);
            const allAbbs = await allabbs();

            const abbData = await allAbbs.find().populate('populate_data');

            const producedAbbs = [];
            abbData[0].populate_data.forEach(data => {
                data.values.forEach(div_abb => {
                    div_abb.push(data.div)
                    producedAbbs.push(div_abb);
                });
            });

            myObject["values"] = producedAbbs

            var newData = JSON.stringify(myObject);
            fs.writeFile('./commands/abbs.json', newData, (err) => {
                if (err) {
                    throw err.message;
                }
                message.reply(`Updated!\nTotal data : ${producedAbbs.length}`);
            });
        }
    }
}