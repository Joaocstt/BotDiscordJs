const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "avatar",
    description: "Veja o avatar de um usuário.",
    type: 1,
    options: [
        {
            name: 'user',
            description: 'O usuário cujo avatar você deseja ver.',
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],

    run: async (client, interaction) => {
        const user = interaction.options.getUser('user') || interaction.user;
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        let embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatarURL)
            .setFooter({ text: `Requisitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
