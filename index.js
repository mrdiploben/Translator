const Discord = require('discord.js');
const { translate } = require('@vitalets/google-translate-api');
const os = require("os");
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const TOKEN = 'MTE5MzI4NTA2NTI1MDE4MTIxMA.GWxnl5.Ajh_ve_JPqzgUdtmdGwklsFPrs3sBMamYSMwgA';
const channelId = '1185549868995977238';

// Load or create configuration file
let config = {};
const configFile = 'config.json';
if (fs.existsSync(configFile)) {
  config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} else {
  fs.writeFileSync(configFile, JSON.stringify(config));
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity('Messages | Prefix ! | Made by aquaben10', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = '!';
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    if (message.channelId === await getTranslationChannel(message.guild.id)) {
      const fail = new Discord.MessageEmbed()
      .setColor('#ff0800')
      .setTitle('Command Failure!')
      .setDescription(`Commands do not work in this channel! Use another channel!`);

      return message.reply({ embeds: [fail] });
    }
    const embed1 = new Discord.MessageEmbed()
      .setTitle(`Bot commands!`)
      .addField('!setchannel (REQUIRES MANAGE SERVER)', 'Set the channel where the bot will translate messages!')
      .addField('!help', 'Displays this embed!')
      .addField('!ping', 'Returns the ping of the bot!')
      .addField('!botinfo', 'Shows you nerdy stats about the bot')
      .addField('!uptime', 'Tells you my uptime!')
      .addField('!credits', 'Tells you who made this wonderful bot!')
      .setColor('#00eaff');
    return message.reply({ embeds: [embed1] });
  }

  if (command === 'ping') {
    if (message.channelId === await getTranslationChannel(message.guild.id)) {
      const fail = new Discord.MessageEmbed()
      .setColor('#ff0800')
      .setTitle('Command Failure!')
      .setDescription(`Commands do not work in this channel! Use another channel!`);

      return message.reply({ embeds: [fail] });
    }
    const ping = Date.now() - message.createdTimestamp;

    const embed = new Discord.MessageEmbed()
      .setColor('#00eaff')
      .setTitle('Pong!')
      .setDescription(`Bot Latency: \`${ping}ms\`\n\nAPI Latency: \`${client.ws.ping}ms\``);

    message.reply({ embeds: [embed] });
  }

  if (command === 'uptime') {
    if (message.channelId === await getTranslationChannel(message.guild.id)) {
      const fail = new Discord.MessageEmbed()
      .setColor('#ff0800')
      .setTitle('Command Failure!')
      .setDescription(`Commands do not work in this channel! Use another channel!`);

      return message.reply({ embeds: [fail] });
    }
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);

    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = new Discord.MessageEmbed()
      .setColor('#00eaff')
      .setTitle('Bot Uptime!')
      .setDescription(`Uptime: \`${uptimeString}\``);

    message.reply({ embeds: [embed] });
  }
  if (command === 'credits') {
    if (message.channelId === await getTranslationChannel(message.guild.id)) {
      const fail = new Discord.MessageEmbed()
      .setColor('#ff0800')
      .setTitle('Command Failure!')
      .setDescription(`Commands do not work in this channel! Use another channel!`);

      return message.reply({ embeds: [fail] });
    }
    const embed = new Discord.MessageEmbed()
      .setTitle('Translator Bot Contributors!')
      .setDescription('Have you wondered whoever made me? Well I sure have, and here he are.\n\n**Owners**: \`aquaben10#0\`')
      .setColor('#00eaff')
    message.reply({ embeds: [embed] });
  }

  if (command === 'botinfo') {
    if (message.channelId === await getTranslationChannel(message.guild.id)) {
      const fail = new Discord.MessageEmbed()
      .setColor('#ff0800')
      .setTitle('Command Failure!')
      .setDescription(`Commands do not work in this channel! Use another channel!`);

      return message.reply({ embeds: [fail] });
    }
    const processorInfo = os.cpus()[0].model;
    const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const usedMemory = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
    const osInfo = `${os.type()} ${os.release()}`;
    const nodeVersion = process.versions.node;
    const { version: discordJsVersion } = require("discord.js");

    const embed = new Discord.MessageEmbed()
      .setTitle('Bot Information')
      .setDescription(`Important information about the bot!\n\n\`Version\`: \`0.01 beta\`\n\`CPU Information:\`: \`${processorInfo}\`\n\`Total RAM\`: \`${totalMemory}GB\`\n\`Used Memory:\` \`${usedMemory}MB\`\n\`NodeJS Version:\` \`${nodeVersion}\`\n\`Discord.JS Version:\` \`${discordJsVersion}\`\n\`Operating System:\` \`${osInfo}\``)
      .setColor('#00eaff')
    message.reply({ embeds: [embed] });
  }

  if (command === 'setchannel') {
    // Check if the user has the necessary permissions (e.g., manage server)
    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.reply('You do not have permission to use this command.');
    }

    // Get the mentioned channel
    const mentionedChannel = message.mentions.channels.first();
    if (!mentionedChannel) {
      return message.reply('Please mention a valid channel.');
    }

    config[message.guild.id] = {
      translationChannel: mentionedChannel.id,
    };
    fs.writeFileSync(configFile, JSON.stringify(config));

    return message.reply(`Translation channel set to: ${mentionedChannel}`);
  }

  if (message.channelId === getTranslationChannel(message.guild.id)) {
    try {
      const translationResult = await translate(message.content, { to: 'en' });

      if (translationResult.text) {
        const embed = new Discord.MessageEmbed()
          .setTitle(`${message.author.username}, (${message.author.id}) said:`)
          .addField('Original', message.content)
          .addField('Translated', translationResult.text)
          .setColor('#00eaff');
        message.delete();
        message.channel.send({ embeds: [embed] });
      } else {
        console.error('Translation result is empty');
      }
    } catch (error) {
      console.error('Error occurred while translating:', error);
    }
  }
});

function getTranslationChannel(guildId) {
  return config[guildId]?.translationChannel || channelId;
}

client.login(TOKEN);
