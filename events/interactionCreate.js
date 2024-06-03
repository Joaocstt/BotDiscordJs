const { Client, EmbedBuilder } = require('discord.js');
const client = require('../index.js');

client.on("interactionCreate", async (interaction) => {
    if (!interaction.guild) return;

    try {
        if (interaction.isCommand()) {
            const cmd = client.slashCommands.get(interaction.commandName);
            if (!cmd) return;

            const args = [];
            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }

            await cmd.run(client, interaction, args);
        }

        if (interaction.isContextMenuCommand()) {
            await interaction.deferReply({ ephemeral: false });
            const command = client.slashCommands.get(interaction.commandName);
            if (command) await command.run(client, interaction);
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'show_requirements') {
                let requirementsEmbed = new EmbedBuilder()
                    .setTitle("Requisitos para a Insígnia de Desenvolvedor Ativo")
                    .setDescription("1. Ter criado pelo menos um aplicativo no Discord.\n2. Ter pelo menos um comando ativo.\n3. Manter seu aplicativo ativo e funcional.\n4. Contribuir positivamente para a comunidade de desenvolvedores do Discord.")
                    .setColor(0x7289DA)
                    .setFooter({ text: "Boa sorte!", iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                await interaction.reply({ embeds: [requirementsEmbed], ephemeral: true });
            }
        }
    } catch (error) {
        console.error('Erro ao lidar com a interação:', error);
    }
});

