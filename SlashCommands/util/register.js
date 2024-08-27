const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  name: "register",
  description:
    "Inicie o processo de registro para receber a tag de 'Amigo' no servidor.",
  type: 1,

  run: async (client, interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.reply({
        content:
          "Você precisa ter permissões de administrador para usar este comando.",
        ephemeral: true,
      });
    }

    let embed = new EmbedBuilder()
      .setTitle("Bem-vindo ao Browns!")
      .setDescription(
        "Olá e bem-vindo ao **Browns!** Para solicitar a tag de 'Amigo', você precisa iniciar o processo de registro.\n\n" +
          "1. **Clique no botão abaixo** para começar o registro.\n" +
          "2. **Preencha o formulário** com suas informações. Isso nos ajudará a conhecer melhor você.\n" +
          "3. **Aguarde a nossa aprovação**. Iremos revisar sua solicitação e setar sua tag.\n\n" +
          "Se você tiver alguma dúvida, Foda-se!"
      )
      .setColor(0x7289da)
      .setFooter({
        text: "Os Browns!",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    let button = new ButtonBuilder()
      .setCustomId("start_registration")
      .setLabel("Iniciar Registro")
      .setStyle(ButtonStyle.Primary);

    let row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false,
    });
  },
};
