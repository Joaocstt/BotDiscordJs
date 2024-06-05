const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "developer",
    description: "Veja o link para resgatar a insígnia de Desenvolvedor Ativo.",
    type: 1,

    run: async (client, interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        let embed = new EmbedBuilder()
            .setTitle("Resgate sua Insígnia de Desenvolvedor Ativo")
            .setDescription(`[Clique aqui para resgatar sua insígnia](https://discord.com/developers/active-developer)`)
            .setColor(0x7289DA) 
            .setFooter({ text: "Mantenha-se ativo e contribua para a comunidade!", iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        let button = new ButtonBuilder()
            .setCustomId('show_requirements')
            .setLabel('Ver Requisitos')
            .setStyle(ButtonStyle.Primary);

        let row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
}
