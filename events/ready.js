const client = require('../index.js');
const {ActivityType } = require('discord.js');

// Lista de atividades
const activities = [
  { name: "Fivem", type: ActivityType.Playing },
  { name: "Fivem", type: ActivityType.Watching },
];

client.on('ready', async () => {
    console.log("✅ - Logado em " + client.user.username + " com sucesso!");

    let index = 0;

    // Define a atividade inicial
    client.user.setActivity(activities[index].name, { type: activities[index].type });

    // Alterna entre as atividades em intervalos regulares
    setInterval(() => {
        index = (index + 1) % activities.length;
        client.user.setActivity(activities[index].name, { type: activities[index].type });
    }, 9000); // Altere o tempo conforme necessário (em milissegundos)
});

