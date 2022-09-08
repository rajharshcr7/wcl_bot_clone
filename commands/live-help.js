module.exports = {
    name: 'help',
    aliases: ['help'],
    description: 'Lists the commands for WCL',
    args: false,
    execute: async (message) => {
        const com = `Roster Rep Only
wcl add - allows you to add a player to the roster
wcl remove - allows you to remove a player from the roster\n\n
Representative Only
wcl sch - go for a war scheduling
wcl delsch - delete a scheduled war
wcl subs - Allows you to take a subtitute!
More commands coming soon.........\n\n
All Warriors of WCL 🙂
wcl abbs - lists all the clan abbreviations for a division
wcl attackframe - shows Champion(eSports) attack frame
wcl reps - lists the clan representative for a clan
wcl roster - lists the clan's roster
wcl search - searches a player for all available rosters
wcl standings - lists official standing according to a division
wcl stats - shows scheduled war detail with the war stats(if active)
wcl vdual - shows all duals in a particular division
wcl viewwars - shows all war scores of a particular clan
More commands coming soon.........`
        message.channel.send('```plaintext\n' + com + '\n```')
    }
}