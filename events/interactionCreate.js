const {
  Client,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  PermissionsBitField,
} = require("discord.js");
const client = require("../index.js");

client.pendingRequests = new Collection();

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
      if (interaction.customId === "show_requirements") {
        let requirementsEmbed = new EmbedBuilder()
          .setTitle("Requisitos para a Insígnia de Desenvolvedor Ativo")
          .setDescription(
            "1. Ter criado pelo menos um aplicativo no Discord.\n2. Ter pelo menos um comando ativo.\n3. Manter seu aplicativo ativo e funcional.\n4. Contribuir positivamente para a comunidade de desenvolvedores do Discord."
          )
          .setColor(0x7289da)
          .setFooter({
            text: "Boa sorte!",
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setTimestamp();

        await interaction.reply({
          embeds: [requirementsEmbed],
          ephemeral: true,
        });
      }

      if (interaction.customId === "start_registration") {
        // Definir o modal
        const modal = new ModalBuilder()
          .setCustomId("registerModal")
          .setTitle("Formulário de Registro");

        const nameInput = new TextInputBuilder()
          .setCustomId("nameInput")
          .setLabel("Qual é o seu vulgo?")
          .setStyle(TextInputStyle.Short);

        const reasonInput = new TextInputBuilder()
          .setCustomId("reasonInput")
          .setLabel('Por que você deseja a tag de "Amigo"?')
          .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(
          reasonInput
        );

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === "registerModal") {
        const name = interaction.fields.getTextInputValue("nameInput");
        const reason = interaction.fields.getTextInputValue("reasonInput");

        // Enviar para o canal de revisão
        const reviewChannel = client.channels.cache.get("1275162968136486970");
        if (!reviewChannel) {
          console.error("Canal de revisão não encontrado.");
          return;
        }

        const reviewEmbed = new EmbedBuilder()
          .setTitle("Novo Registro para Tag de 'Amigo'")
          .setDescription(`**Nome:** ${name}\n**Motivo:** ${reason}`)
          .setColor(0x00ff00)
          .setFooter({
            text: "Revisão Necessária",
            iconURL: interaction.client.user.displayAvatarURL({
              dynamic: true,
            }),
          })
          .setTimestamp();

        const approveButton = new ButtonBuilder()
          .setCustomId("approve_registration")
          .setLabel("Aprovar")
          .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
          .setCustomId("reject_registration")
          .setLabel("Rejeitar")
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(
          approveButton,
          rejectButton
        );

        const sentMessage = await reviewChannel.send({
          embeds: [reviewEmbed],
          components: [row],
        });

        client.pendingRequests.set(sentMessage.id, {
          userId: interaction.user.id,
          name: name,
        });

        await interaction.reply({
          content: `Obrigado, ${name}! Sua solicitação foi enviada para revisão.`,
          ephemeral: true,
        });
      }
    }

    if (interaction.isButton()) {
      if (
        interaction.customId === "approve_registration" ||
        interaction.customId === "reject_registration"
      ) {
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          )
        ) {
          return interaction.reply({
            content: "Você não tem permissão para usar este botão.",
            ephemeral: true,
          });
        }
        const isApproval = interaction.customId === "approve_registration";

        // Desativar os botões
        const disabledRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("approve_registration")
            .setLabel("Aprovar")
            .setStyle(ButtonStyle.Success)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("reject_registration")
            .setLabel("Rejeitar")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );

        await interaction.message.edit({
          components: [disabledRow],
        });

        await interaction.reply({
          content: `Você ${isApproval ? "aprovou" : "rejeitou"} a solicitação.`,
          ephemeral: true,
        });

        const requestData = client.pendingRequests.get(interaction.message.id);
        if (requestData) {
          const userId = requestData.userId;
          const name = requestData.name;

          const user = await client.users.fetch(userId);

          if (user) {
            await user.send({
              content: `Sua solicitação foi ${
                isApproval ? "aprovada" : "rejeitada"
              }. ${
                isApproval
                  ? "Você agora possui a tag de 'Amigo'!"
                  : "Infelizmente, você não foi aprovado."
              }`,
            });

            if (isApproval) {
              const guildMember = interaction.guild.members.cache.get(userId);
              if (guildMember) {
                const role = interaction.guild.roles.cache.find(
                  (role) => role.name === "Amigos"
                );
                if (role) {
                  await guildMember.roles.add(role);

                  await guildMember.setNickname(name);
                }
              }
            }
          } else {
            console.error("Usuário não encontrado.");
          }

          client.pendingRequests.delete(interaction.message.id);
        } else {
          console.error("Dados da solicitação não encontrados.");
        }
      }
    }
  } catch (error) {
    console.error("Erro ao lidar com a interação:", error);
  }
});
