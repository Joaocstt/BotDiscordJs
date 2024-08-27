const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "comandos",
  description: "Lista os comandos disponíveis para configurar o jogo.",
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
      .setTitle("Comandos de Configuração do Jogo")
      .setDescription(
        "- Aumentar o brilho do jogo: `Profile_gamma 1 - 100`\n" +
          "- Aumentar o tamanho da mira: `Profile_ReticuleSize (numero)`\n" +
          "- FPS/GPU/CPU/PL/TEMP: `Cl_DrawPerfs`\n" +
          "- FPS: `Cl_DrawFps`\n" +
          "- Colocar bind : `bind keyboard 'TECLA' 'COMANDO'`\n" +
          "- Remover Todas as Binds : `unbind all`\n" +
          "- Mudar Mira : `bind keyboard 'LETRA' 'toggle profile_reticule 0 1'`\n" +
          "- Mudar Sensibilidade : `Profile_MouseOnFootScale`"
      )
      .setColor(0x7289da)
      .setFooter({
        text: "Comandos do Jogo",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
