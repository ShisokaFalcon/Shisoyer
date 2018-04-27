const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

//fs.readdir("./commands/", (err, files) => {

    //if(err) console.log(err);

    //let jsfile = files.filter(f => f.split(".").pop() == "js")
    //if(jsfile.lenght <= -0){
        //console.log("Não conseguiu encontrar comandos!");
        //return;
    //}

    //jsfile.forEach((f, i) =>{
        //let props = require(`./commands/${f}`);
        //console.log(`${f} carregado!`);
        //bot.commands.set(props.help.name, props);
    //});

//});


bot.on("ready", async () => {
    console.log(`${bot.user.username} está online!`);
    
    bot.user.setActivity("www.otakutube.site", {type: "WATCHING"})

    //bot.user.setGame("www.otakutube.site");
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.lenght));
    if(commandfile) commandfile.run(bot,message,args);

    if(cmd === `${prefix}ping`){
        return message.channel.send("Pong!");
    }
    if(cmd === `${prefix}infobot`){

        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setDescription("Informações do Bot")
        .setColor("#15f153")
        .setThumbnail(bicon)
        .addField("Nome do Bot", bot.user.username)
        .addField("Data de Criação", bot.user.createdAt)
        .addField("Criadores", "Shisoka!#4181 e Slayer#1196")

        return message.channel.send(botembed);
    }
    if(cmd === `${prefix}serverinfo`){

        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("Informações do Servidor")
        .setColor("#15f153")
        .setThumbnail(sicon)
        .addField(":newspaper: Nome do Servidor", message.guild.name)
        .addField(":date: Data de Criação", message.guild.createdAt)
        .addField(":clock1: Você Entrou em", message.member.joinedAt)
        .addField(":anger: Membros", message.guild.memberCount)

        return message.channel.send(serverembed);
    }
    if(cmd === `${prefix}denunciar`){

        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("Não encontrei o usuário :(")
        let reason = args.join(" ").slice(22);

        let reportEmbed = new Discord.RichEmbed()
        .setDescription("~Denúncias~")
        .setColor("#ff0000")
        .addField("Usuário Denunciado", `${rUser} ID: ${rUser.id}`)
        .addField("Denunciado Por", `${message.author} ID: ${message.author.id}`)
        .addField("Canal", message.channel)
        .addField("Data", message.createdAt)
        .addField("Motivo", reason)

        let reportschannel = message.guild.channels.find(`name`, "📍-chat-staff");
        if(!reportschannel) return message.channel.send("Não encontrei o chat de denuncias!");


        message.delete().catch(O_o=>{});
        reportschannel.send(reportEmbed);

        //s!reportar @pessoa -MOTIVO-

        return;
    }
    if(cmd === `${prefix}kick`){

        let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!kUser) return message.channel.send("Não encontrei o usuário :(");
        let kReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Nao tem permissao para fazer isso!");
        if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**Dica:** Eu não consigo expulsar cargo maior que eu, e nem bot.");

        let kickEmbed = new Discord.RichEmbed()
        .setDescription("~Kick~")
        .setColor("#ff0000")
        .addField("Usuário Expulso", `${kUser} ID: ${kUser.id})`)
        .addField("Expulso Por", `<@${message.author.id}> ID: ${message.author.id})`)
        .addField("Canal", message.channel)
        .addField("Data", message.createdAt)
        .addField("Motivo", kReason)

        let kickChannel = message.guild.channels.find(`name`, "📍-chat-staff");
        if(!kickChannel) return message.channel.send("Não encontrei o chat de expulsões");

        message.guild.member(kUser).kick(kReason);
        kickChannel.send(kickEmbed);

        return;
    }
    if(cmd === `${prefix}ban`){

        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send("Não encontrei o usuário :(");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Nao tem permissao para fazer isso!");
        if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send("**Dica:** Eu não consigo banir cargo maior que eu, e nem bot.");

        let banEmbed = new Discord.RichEmbed()
        .setDescription("~Banimento~")
        .setColor("#960002")
        .addField("Usuário Banido", `${bUser} ID: ${bUser.id})`)
        .addField("Banido Por", `<@${message.author.id}> ID: ${message.author.id})`)
        .addField("Canal", message.channel)
        .addField("Data", message.createdAt)
        .addField("Motivo", bReason)

        let banChannel = message.guild.channels.find(`name`, "📍-chat-staff");
        if(!banChannel) return message.channel.send("Não encontrei o chat de banimento");

        message.guild.member(bUser).ban(bReason);
        banChannel.send(banEmbed);

        return;
    }
});

bot.login(botconfig.token);