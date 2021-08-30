const Discord = require("discord.js")
const ticketSystem = require('djs-ticketsystem');
const fs = require("fs");
require("better-sqlite3")
require('discord-reply');
const client = new Discord.Client({ ws: { properties: { $browser: "Discord iOS" }}}, { shardCount: 'auto' });
const disbut = require('discord-buttons');
disbut(client);
const commands = require('./help');
const prefix = require("discord-prefix");
const { set } = require("discord-prefix/handler");
let db = JSON.parse(fs.readFileSync("./database/ecdatabase.json", "utf8"));
var defaultPrefix = 't!';
let talkedRecently = new Set();
const ms = require("ms")


client.on("ready", () => {
    console.log(client.user.tag + " is ready")
    console.log(`Bot: ${client.user.tag}\nChannels: ${client.channels.cache.size}\nServers: ${client.guilds.cache.size}\nUsers: ${client.users.cache.size}`);



  let statuses = [
    `t!help to start using me`,
    `my website: https://website.mczgodpiggy.repl.co`,
    `my support server: https://dsc.gg/dragonhunter-org`
  ]

  setInterval(function () {
    let status = statuses[Math.floor(Math.random() * statuses.length)];

    client.user.setActivity(status, { type: 'STREAMING', url: "https://twitch.tv/mczgodpiggy" })
  }, 3000)
})

client.on("message", async (message) => {
  if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
  if (message.author.bot) return;
  let privateprefix = prefix.getPrefix(message.author.id)
    let guildPrefix = prefix.getPrefix(message.guild.id)
    if (!privateprefix) privateprefix = guildPrefix
    if (!guildPrefix) guildPrefix = defaultPrefix;
    let args = message.content.slice(guildPrefix.length || privateprefix.length).split(' ');
    if (message.content.startsWith(guildPrefix + "hi") || message.content.startsWith(privateprefix + "hi")) {
        const hi = new disbut.MessageButton()
        .setID("Hi")
        .setStyle("blurple")
        .setLabel("click me to send a Hi!")
        .setEmoji("👋")
        message.channel.send("testing", hi)
    } else if (message.content.startsWith(guildPrefix + "setprefix") || message.content.startsWith(privateprefix + "setprefix")) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply('you don\'t have admin perm to use this command');
        let guildPrefix = prefix.getPrefix(message.guild.id);
        if (!guildPrefix) guildPrefix = defaultPrefix;
        const args = message.content.slice(guildPrefix.length).split(' ');
        let newprefix = args.slice(1,2).join(" ")
        if (!newprefix) return message.lineReply("please give a prefix")
        prefix.setPrefix(newprefix, message.guild.id)
        await message.lineReply("done now prefix for this guild is " + "`" + newprefix + "`")
      } else if (message.content.startsWith(guildPrefix + "rate") || message.content.startsWith(privateprefix + "rate")) {
          const astar = new disbut.MessageMenuOption()
          .setEmoji("757544373113192489")
          .setLabel("1 star⭐")
          .setDescription("rate 1 star⭐")
          .setValue("astar")
          const twostar = new disbut.MessageMenuOption()
          .setEmoji("757544373113192489")
          .setLabel("2 star⭐⭐")
          .setDescription("rate 2 star⭐⭐")
          .setValue("twostar")
          const tstar = new disbut.MessageMenuOption()
          .setEmoji("757544373113192489")
          .setLabel("3 star⭐⭐⭐")
          .setDescription("rate 3 star⭐⭐⭐")
          .setValue("tstar")
          const fstar = new disbut.MessageMenuOption()
          .setEmoji("757544373113192489")
          .setLabel("4 star⭐⭐⭐⭐")
          .setDescription("rate 4 star⭐⭐⭐⭐")
          .setValue("fstar")
          const fistar = new disbut.MessageMenuOption()
          .setEmoji("757544373113192489")
          .setLabel("5 star⭐⭐⭐⭐⭐")
          .setDescription("rate 5 star⭐⭐⭐⭐⭐")
          .setValue("fistar")
          const ratemenu = new disbut.MessageMenu()
          .setID("rate")
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder("rate me")
          .addOption(astar)
          .addOption(twostar)
          .addOption(tstar)
          .addOption(fstar)
          .addOption(fistar)
          message.channel.send("rate me please", ratemenu)
      } else if (message.content.startsWith(guildPrefix + "help") || message.content.startsWith(privateprefix + "help")) {
        let addbot = new disbut.MessageButton()
        .setStyle('url')
        .setLabel('add my brother bot 𝔪𝔠𝔷𝔤𝔬𝔡𝔭𝔦𝔤𝔤𝔶.𝓘𝓞 to your servers') 
        .setURL("https://top.gg/bot/695922492027568176")
        let embed =  new Discord.MessageEmbed()
          .setTitle('help')
          .setColor('RANDOM')
          .setFooter(`Requested by: ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setThumbnail(client.user.displayAvatarURL());
        if (!args[1])
          embed
            .addField("Symbols", "<> Argument is required\n[] - Argument is optional")
            .setDescription(Object.keys(commands).map(command => `\`${command.padEnd(Object.keys(commands).reduce((a, b) => b.length > a.length ? b : a, '').length)}\` <a:arrow:875628899604762624> ${commands[command].description}\ncategory:\`${commands[command].category}\``).join('\n'));
        else {
          if (Object.keys(commands).includes(args[1].toLowerCase()) || Object.keys(commands).map(c => commands[c].aliases || []).flat().includes(args[1].toLowerCase())) {
            let command = Object.keys(commands).includes(args[1].toLowerCase())? args[1].toLowerCase() : Object.keys(commands).find(c => commands[c].aliases && commands[c].aliases.includes(args[1].toLowerCase()));
            embed
              .setTitle(`COMMAND - ${command}`)
              .addField("Symbols", "<> Argument is required\n[] - Argument is optional")
            if (commands[command].aliases)
              embed.addField('Command aliases', `\`${commands[command].aliases.join('`, `')}\``);
              if (!commands[command].category && privateprefix != guildPrefix)
              embed
              .addField('DESCRIPTION', commands[command].description)
              .addField('FORMAT-private prefix', `\`\`\`${privateprefix}${commands[command].format}\`\`\``)
              .addField("FORMAT-guild prefix", `\`\`\`${guildPrefix}${commands[command].format}\`\`\``)
              if (!commands[command].category && privateprefix == guildPrefix)
              embed
              .addField('DESCRIPTION', commands[command].description)
              .addField("FORMAT-guild prefix", `\`\`\`${guildPrefix}${commands[command].format}\`\`\``)
              if (privateprefix != guildPrefix)
            embed
              .addField('DESCRIPTION', commands[command].description)
              .addField("CATEGORY", commands[command].category)
              .addField('FORMAT-private prefix', `\`\`\`${privateprefix}${commands[command].format}\`\`\``)
              .addField("FORMAT-guild prefix", `\`\`\`${guildPrefix}${commands[command].format}\`\`\``)
              if (privateprefix == guildPrefix)
            embed
              .addField('DESCRIPTION', commands[command].description)
              .addField("CATEGORY", commands[command].category)
              .addField("FORMAT-guild prefix", `\`\`\`${guildPrefix}${commands[command].format}\`\`\``)
          } else {
            embed
              .setColor('RED')
              .setDescription('This command does not exist. Please use the help command without specifying any commands to list them all.');
          }
        }
        message.channel.send(embed, addbot);
      } else if (message.content.startsWith(guildPrefix + "ping") || message.content.startsWith(privateprefix + "ping")) {
          message.lineReply(`<a:check:850724870282674189>🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.<a:check:850724870282674189>`)
      } else if (message.content.startsWith(guildPrefix + "uptime") || message.content.startsWith(privateprefix + "uptime")) {
        let totalSeconds = (client.uptime / 1000);
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);
      let uptime = `${client.user.tag} online for \`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds\``;
      const uptimeembed = new Discord.MessageEmbed()
      .setTitle(client.user.tag + " up time")
      .setTimestamp()
      .setDescription(uptime)
      message.lineReply(uptimeembed)
      } else if (message.content.startsWith(guildPrefix + "setprivateprefix") || message.content.startsWith(privateprefix + "setprivateprefix") || message.content.startsWith(guildPrefix + "setpprefix") || message.content.startsWith(privateprefix + "setpprefix")) {
        const args = message.content.slice(guildPrefix.length).split(' ');
        let newprefix = args.slice(1,2).join(" ")
        if (!newprefix) return message.lineReply("please give a prefix")
        prefix.setPrefix(newprefix, message.author.id)
        await message.lineReply("done now prefix for you is " + "`" + newprefix + "`")
      }
      fs.writeFile("./database/ecdatabase.json", JSON.stringify(db), (x) => {
        if (x) console.error(x)
      });
})

client.on("message", async message => {
  if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
  if (message.guild.id === "797833180936667153") return;
  let privateprefix = prefix.getPrefix(message.author.id)
  let guildPrefix = prefix.getPrefix(message.guild.id)
  if (!privateprefix) privateprefix = guildPrefix
    if (!guildPrefix) guildPrefix = defaultPrefix;
    let args = message.content.slice(guildPrefix.length).split(' ');
    if (message.author.bot) return;
  if (message.author.bot) return;
  if (!db[message.author.id]) db[message.author.id] = {
    money: 0,
    xp: 0,
    level: 0,
    name_tag: message.author.tag
  }
  db[message.author.id].xp += Math.floor(Math.random() * 40) + 1;
  let userInfo = db[message.author.id];
    if(userInfo.xp > 887) {
        userInfo.level++
        userInfo.money += Math.floor(Math.random() * 887) + 1
        userInfo.xp = 0
     message.lineReplyNoMention(`🥳Congratulations, you level up to ${userInfo.level}🥳:tada:`)
    } 
  if (message.content.startsWith(guildPrefix + "profile") || message.content.startsWith(privateprefix + "profile")) {
    let userInfo = db[message.author.id];
        let member = message.mentions.members.first();
        if (member) {
        if (!db[member.id]) db[member.id] = {
          money: 0,
          xp: 0,
          level: 0,
          name_tag: member.user.tag
        }
      }
        let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(userInfo.name_tag)
        .setColor("GOLD")
        .addField("<a:money:875946394895130695>money<a:money:875946394895130695>", userInfo.money)
        .addField("<a:arrow_up:875998184177020958>Level<a:arrow_up:875998184177020958>", userInfo.level)
        .addField("<a:arrow_up:875998184177020958>XP<a:arrow_up:875998184177020958>", userInfo.xp+"/888");
        if(!member) return message.channel.send(embed)
        let memberInfo = db[member.id]
        let embed2 = new Discord.MessageEmbed()
        .setColor("GOLD")
        .setTimestamp()
        .setTitle(memberInfo.name_tag)
        .addField("<a:money:875946394895130695>money<a:money:875946394895130695>", memberInfo.money)
        .addField("<a:arrow_up:875998184177020958>Level<a:arrow_up:875998184177020958>", memberInfo.level)
        .addField("<a:arrow_up:875998184177020958>XP<a:arrow_up:875998184177020958>", memberInfo.xp+"/888")
        message.channel.send(embed2)
  } else if (message.content.startsWith(guildPrefix + "work") || message.content.startsWith(privateprefix + "work")) {
    if (talkedRecently.has(message.author.id)) {
      return message.lineReply("Wait 1 hour before getting working again.");
   } else {
    if (!db[message.author.id]) db[message.author.id] = {
      money: 0,
      xp: 0,
      level: 0,
      name_tag: message.author.tag
    }
    db[message.author.id].xp += Math.floor(Math.random() * 7) + 1;
    db[message.author.id].money += Math.floor(Math.random() * 10) + 1;
    const workembed = new Discord.MessageEmbed()
    .setTimestamp()
    .setTitle("<a:money:875946394895130695>" + message.author.tag + " is working<a:money:875946394895130695>")
    .setDescription("you worked for 1 hours and now you have " + db[message.author.id].money + "<a:money:875946394895130695>")
    message.lineReply(workembed)
    talkedRecently.add(message.author.id);
  setTimeout(() => {
    
    talkedRecently.delete(message.author.id);
    }, ms("1h"));
   }
  } else if (message.content.startsWith(guildPrefix + "bal") || message.content.startsWith(privateprefix + "bal")) {
    let userInfo = db[message.author.id];
        let member = message.mentions.members.first();
        if (member) {
        if (!db[member.id]) db[member.id] = {
          money: 0,
          xp: 0,
          level: 0,
          name_tag: member.user.tag
        }
      }
        let embed = new Discord.MessageEmbed()
        .setTimestamp()
        .setTitle(userInfo.name_tag)
        .setColor("GOLD")
        .addField("<a:money:875946394895130695>money<a:money:875946394895130695>", userInfo.money)
        if(!member) return message.channel.send(embed)
        let memberInfo = db[member.id]
        let embed2 = new Discord.MessageEmbed()
        .setColor("GOLD")
        .setTimestamp()
        .setTitle(memberInfo.name_tag)
        .addField("<a:money:875946394895130695>money<a:money:875946394895130695>", memberInfo.money)
        message.channel.send(embed2)
  }
  fs.writeFile("./database/ecdatabase.json", JSON.stringify(db), (x) => {
    if (x) console.log(x)
  });
})

client.on("clickButton", async (button) => {
    if (button.id === "Hi") {
      const hibtn = new disbut.MessageButton()
        .setID("Hi")
        .setStyle("green")
        .setLabel("click me to send a Hi!")
        .setEmoji("👋")
        .setDisabled()
        const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setTimestamp()
        .setTitle(`some one used the button`)
        .setDescription(`the person is <@${button.clicker.id}>`)
        await button.reply.think()
        await button.reply.edit("Hi👋" + `\n<@${button.clicker.id}>`)
        await button.message.edit({button: hibtn, embed: embed})
    }
})

client.on("clickMenu", async (menu) => {
    if (menu.id === "rate") {
        if (menu.values[0] === "astar") {
            await menu.message.edit("you rated 1 stars<:stars:757544373113192489>")
            await menu.reply.send("you rated 1 stars<:stars:757544373113192489>").then(reply => reply.delete())
        } else if (menu.values[0] === "twostar") {
            await menu.message.edit("you rated 2 stars<:stars:757544373113192489>")
            await menu.reply.send("you rated 2 stars<:stars:757544373113192489>").then(reply => reply.delete())
        } else if (menu.values[0] === "tstar") {
            await menu.message.edit("you rated 3 stars<:stars:757544373113192489>")
            await menu.reply.send("you rated 3 stars<:stars:757544373113192489>").then(reply => reply.delete())
        } else if (menu.values[0] === "fstar") {
            await menu.message.edit("you rated 4 stars<:stars:757544373113192489>")
            await menu.reply.send("you rated 4 stars<:stars:757544373113192489>").then(reply => reply.delete())
        } else if (menu.values[0] === "fistar") {
            await menu.message.edit("you rated 5 stars<:stars:757544373113192489>")
            await menu.reply.send("you rated 5 stars<:stars:757544373113192489>").then(reply => reply.delete())
        }
    }
})



client.login(process.env.TOKEN)