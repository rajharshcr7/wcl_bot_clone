const fs = require('fs');
const indWarSchema = require('./war&schedule&standings/individualWarRecord');

module.exports = {
    name: 'insertwars',
    aliases: ['iwars'],
    description: 'Insert official wars',
    args: true,
    length: 3,
    category: "admins",
    usage: 'wk-Starting-Ending clanAbb opponentAbb1 opponentAbb2 ... ...',
    missing: ['`wk-Starting-Ending`, ', '`clanAbb`, ', '`opponentAbb1`, ', '`opponentAbb2`, ', '`...`, ', '`...`'],
    explanation: `Ex: bcl iwars wk-1-7 ABC XYZ PQR\n\nwhere wk-1-7 is wk 1 to 7\nABC - clanAbb\nXYZ - opponentAbb for wk1\nPQR - opponentAbb for wk2\n\nWeek code/range
    1: 'WK1',
    2: 'WK2',
    3: 'WK3',
    4: 'WK4',
    5: 'WK5',
    6: 'WK6',
    7: 'WK7',
    8: 'WK8',
    9: 'WK9',
    10: 'WK10',
    11: 'WK11',
    12: 'R128',
    13: 'R64',
    14: 'R32',
    15: 'WC',
    16: 'WC2',
    17: 'QF',
    18: 'SF',
    19: 'F'\n\nNote: Once the command is used, then the opponents are locked!`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const notForUseChannels = require('./live-notForUseChannels');

        // playoff round for champ division to be asked
        const week = {
            1: 'WK1',
            2: 'WK2',
            3: 'WK3',
            4: 'WK4',
            5: 'WK5',
            6: 'WK6',
            7: 'WK7',
            8: 'WK8',
            9: 'WK9',
            10: 'WK10',
            11: 'WK11',
            12: 'R128',
            13: 'R64',
            14: 'R32',
            15: 'WC',
            16 : 'WC2',
            17: 'QF',
            18: 'SF',
            19: 'F',
        };

        function divCheck(ABB) {
            var ABBSobject = fs.readFileSync('./bcl-commands/abbs.json');
            var abbs = JSON.parse(ABBSobject);

            var div = [];
            abbs.values.forEach(abb => {
                if (abb[2] == ABB)
                    div.push(abb[0], abb[1], abb[2], abb[3]);
            })
            return div;
        }

        try {
            if (!notForUseChannels.includes(message.channel.id) && message.member.hasPermission('MANAGE_ROLES')) {

                // checking week ranges
                const weeks = args[0].toUpperCase().split('-');
                if ((!week[weeks[1]] || !week[weeks[2]]) && !(parseInt(weeks[2], 10) - parseInt(weeks[1], 10) < 0)) {
                    message.reply(`Invalid week range bound **${weeks[1]}** or **${weeks[2]}**!`);
                    return;
                }

                // week range matching and arguments length
                if ((parseInt(weeks[2], 10) - parseInt(weeks[1], 10) + 1) != args.length - 2) {
                    message.reply(`Number of weeks didn't matched with number of opponents!`);
                    return;
                }

                // abb check and identify division
                var opponentClans = [];
                var clan = [];
                for (var i = 0; i < args.length; i++) {
                    if (i != 0) {
                        var div = divCheck(args[i].toUpperCase());
                        if (div.length === 0) {
                            message.reply(`Invalid clan abb **${args[i].toUpperCase()}**!`);
                            return;
                        }
                        if (i != 1) {
                            opponentClans.push(div);
                        } else if (i === 1) {
                            clan.push(div);
                        }
                    }
                }
                const checkIndAbb = await indWarSchema.findOne({ abb: args[1].toUpperCase() })
                if (checkIndAbb) {
                    var checkForAlreadyExistWeek = Object.keys(checkIndAbb.opponent);
                    if (checkForAlreadyExistWeek.find(function (week) { return week === `WK${weeks[1]}` })) {
                        message.reply(`Week index **WK${weeks[1]}** already exists for **${clan[0][1]}**!`);
                        return;
                    } else {
                        var tempOpponent = checkIndAbb.opponent;
                        var messageString = '';
                        for (var i = parseInt(weeks[1], 10), j = 0; i <= parseInt(weeks[2], 10), j <= parseInt(weeks[2], 10) - parseInt(weeks[1], 10); i++, j++) {
                            var opponentObjectData = new Object;
                            opponentObjectData['abb'] = opponentClans[j][2];
                            opponentObjectData['clanTag'] = opponentClans[j][0];
                            opponentObjectData['status'] = 'UNDECLARED';
                            opponentObjectData['starFor'] = 0;
                            opponentObjectData['starAgainst'] = 0;
                            opponentObjectData['perDest'] = 0;
                            opponentObjectData['warID'] = null;
                            opponentObjectData['deleteHistory'] = null;
                            tempOpponent[week[i]] = opponentObjectData;
                            indWarSchema.no_of_matches++;

                        }
                        await indWarSchema.findOneAndUpdate({ abb: args[1].toUpperCase() },
                            {
                                opponent: tempOpponent
                            }
                        ).then((insWar) => console.log(insWar))
                        await message.react('✅');
                        message.reply(`Scheduled **${args[1].toUpperCase()}** from Week ${week[parseInt(weeks[1], 10)]} to ${week[parseInt(weeks[2], 10)]}\n` + "```plaintext\n" + messageString + "```");
                    }

                } else {
                    var opponentObject = new Object;
                    var messageString = '';
                    for (var i = parseInt(weeks[1], 10); i <= parseInt(weeks[2], 10); i++) {
                        var opponentObjectData = new Object;
                        opponentObjectData['abb'] = opponentClans[i - 1][2];
                        opponentObjectData['clanTag'] = opponentClans[i - 1][0];
                        opponentObjectData['status'] = 'UNDECLARED';
                        opponentObjectData['starFor'] = 0;
                        opponentObjectData['starAgainst'] = 0;
                        opponentObjectData['perDest'] = 0;
                        opponentObjectData['warID'] = null;
                        opponentObjectData['deleteHistory'] = null;
                        opponentObject[week[i]] = opponentObjectData;
                        messageString += `${week[i]} | ${args[1].toUpperCase()}    vs     ${opponentClans[i - 1][2]}\n`;
                    }
                    const insertWar = new indWarSchema({
                        abb: args[1].toUpperCase(),
                        div: clan[0][3],
                        clanTag: clan[0][0],
                        no_of_matches: args.length - 2,
                        opponent: opponentObject,
                        status: 'LOCKED'
                    })
                    await insertWar.save()
                        .then((insWar) => console.log(insWar));

                    await message.react('✅');
                    message.reply(`Scheduled **${args[1].toUpperCase()}** from Week ${weeks[1]} to ${weeks[2]}\n` + "```plaintext\n" + messageString + "```");
                }
            } else {
                return message.reply(`You can't use this command here!`);
            }
        } catch (err) {
            console.log(err);
            message.reply(err.message);
        }
    }
}