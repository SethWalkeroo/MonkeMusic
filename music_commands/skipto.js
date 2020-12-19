module.exports = {
	name: 'skipto',
	description: 'Skip to a certain position in the queue.',
	usage: '[skipto [position]',
	guildOnly: true,
	cooldown: 2,
	async execute(message, args) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return await message.channel.send('You have to be in a voice channel to skip a song.');
		if (!serverQueue) return await message.channel.send('There are no songs playing to skip to!');
		if (!serverQueue.connection.dispatcher) return await message.channel.send('There are no songs playing to skip to!');
		if (!args[0]) return await message.channel.send('Please specify which position you want to skip to!');

		const amount = parseInt(args[0]) - 1;

		if (isNaN(amount)) {
			return await message.channel.send('That doesn\'t seem to be a valid number.');
		} else if (amount < 0 || amount > serverQueue.songs.length) {
			return await message.channel.send(`Please enter a value that is in range of the current queue size (${serverQueue.songs.length}).`);
		}

		serverQueue.songs.splice(0, amount - 1);
		await serverQueue.connection.dispatcher.end();

		if (!message.client.config.silent) {
			await message.channel.send(`Skipped  to queue position ${amounts}! :monkey_face: :thumbup:`);
		} else {
			await message.react('⏩');
		}
	},
};