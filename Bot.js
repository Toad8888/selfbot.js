const config = require("./require/properties.json");
const Discord = require('discord.js');
const fs = require('fs');
const exec = require('child_process').execFile;
const Words = require('./require/Words.json')
const Stats = require('./require/Stats.json')
const Sent = require('./require/Sent.json')
const GlobalWords = require('./require/global_words.json')
const beep = require('beepbeep')
const print = console.log;


Unformatted = function(args) {
    Channel.sendMessage(args);
}

console.log = function(args) {
    if (args.length >= 1950) {
        fs.writeFile('./require/ToHastebin.txt', args, function(Error) {
            if (Error) {
                Channel.sendMessage("```lua\n" + Error + "```");
            } else {
                var child = exec('hastebin', ['./require/ToHastebin.txt'], (error, stdout, stderr) => {
                    if (error) {
                        Channel.sendMessage(error);
                    } else {
                        Channel.sendMessage('```' + stdout + '```');
                    }
                })
            }
        })
    } else {
        if (args === "" || '') {
            return 0;
        } else {
            Channel.sendMessage("```\n" + args + "```");
        }
    }
}


const SelfBot = new Discord.Client();

const Prefix = config.Prefix;
const Token = config.Token;
const Ping = config.Ping;



const Commands = {
    "lua": {
        name: "lua",
        desc: "Executes lua code.",
        usage: "<code>",
        func: function(Message, Channel) {
            var ToExec = Message;
            if (Message[0] === "`") {
                var ToExec = Message.substring(6, Message.length - 3);
            } else {}
            fs.writeFile('./require/ToExecute.lua', ToExec, function(Error) {
                if (Error) {
                    console.log(Error, Channel);
                    print(Error);
                } else {
                    const child = exec('lua', ['./require/ToExecute.lua'], (error, stdout, stderr) => {
                        if (error) {
                            console.log(error, Channel);
                        } else {
                            console.log(stdout, Channel);
                        }
                    })
                }
            })
        }
    },
    "delete": {
        name: "delete",
        desc: "Deletes [number] previous messages",
        usage: "<number>",
        func: function(Message, Channel) {
            const ToDelete = Message;
            const Mes = parseInt(ToDelete);
            Channel.fetchMessages({
                    limit: 100
                })
                .then(messages => {
                    let msg_array = messages.array();
                    msg_array = msg_array.filter(m => m.author.id === SelfBot.user.id);
                    msg_array.length = Mes + 1;
                    msg_array.map(m => m.delete().catch(console.error));
                })
        }
    },
    "exec": {
        name: "exec",
        desc: "Runs Node.JS code in the bot environment",
        usage: "<code>",
        func: function(Message, Channel, UnformattedMessage) {
            const Channel = Channel;
            const  message = UnformattedMessage;
            ToEval = Message;
            try {
                eval(ToEval);
            } catch (Error) {
                console.log(Error, Channel);
            }
        }
    },
    "exit": {
        name: "exit",
        desc: "Closes the SelfBot",
        usage: "",
        func: function() {
            console.log("Exited", Channel);
            process.exit(0);
        }
    },
    "coin": {
        name: "coin",
        desc: "Flips a coin [x] times",
        usage: "<number>",
        func: function(Message, Channel) {
            ToFlip = Message;
            var Heads = 0;
            var Tails = 0;
            for (var i = 0; i < ToFlip; i++) {
                if (Math.random() > 0.5) {
                    Heads++;
                } else {
                    Tails++;
                }
            }
            if (Heads > Tails) {
                console.log("Heads won!\nHeads: " + Heads + "\nTails: " + Tails, Channel);
            } else if (Tails > Heads) {
                console.log("Tails won!\nTails: " + Tails + "\nHeads: " + Heads, Channel);
            } else {
                console.log("Tie!\nHeads: " + Heads + "\nTails: " + Tails, Channel);
            }
        }
    },
    "usage": {
        name: "usage",
        desc: "returns amount of times a word has been used",
        usage: "<string> or none",
        func: function(Message, Channel) {
            UsageArgs = Message;
            if (UsageArgs === "" || '') {
                var TemporaryWords = [];
                for (var Word in Words) {
                    TemporaryWords.push([Word, Words[Word]])
                }
                TemporaryWords.sort(function(b, a) {
                    return a[1] - b[1];
                })
                var TWords = "";
                for (i = 0; i < 10; i++) {
                    TWords = TWords + TemporaryWords[i][0] + ": " + TemporaryWords[i][1] + "\n";
                }
                console.log(TWords, Channel);
            } else {
                if (UsageArgs)
                    if (Words[UsageArgs]) {
                        console.log(UsageArgs + " was used " + Words[UsageArgs] + " times", Channel);
                    } else {
                        console.log(UsageArgs + " was never used", Channel)
                    }
            }
        }
    },
    "stats": {
        name: "stats",
        desc: "returns amount of messages recieved from different guilds",
        usage: "<guild> or none",
        func: function(Message, Channel) {
            if (Message === "" || '') {
                var TemporaryStats = [];
                for (var stats in Stats) {
                    TemporaryStats.push([stats, Stats[stats]])
                }
                TemporaryStats.sort(function(b, a) {
                    return a[1] - b[1];
                })
                var TStats = "";
                for (i = 0; i < 10; i++) {
                    TStats = TStats + TemporaryStats[i][0] + ": " + TemporaryStats[i][1] + "\n";
                }
                console.log(TStats, Channel);
            } else {
                if (Message) {
                    if (Stats[Message]) {
                        console.log("Received " + Stats[Message] + " messages from " + Message, Channel);
                    }
                }
            }
        }
    },
    "sent": {
        name: "sent",
        desc: "returns number of messages sent by the user",
        usage: "<channel> or none",
        func: function(Message, Channel) {
            if (Message === "") {
                var TemporarySent = [];
                for (var sent in Sent) {
                    TemporarySent.push([sent, Sent[sent]])
                }
                TemporarySent.sort(function(b, a) {
                    return a[1] - b[1];
                })
                var TSent = "";
                for (i = 0; i < 6; i++) {
                    TSent = TSent + TemporarySent[i][0] + ": " + TemporarySent[i][1] + "\n";
                }
                console.log(TSent, Channel);
            } else {
                if (Sent[Message]) {
                    console.log("You've sent " + Sent[Message] + " messages to " + Message, Channel);
                }
            }
        }
    },
    "globalusage": {
        name: "globalusage",
        desc: "returns number of times a word was used, if there is no args then it returns the top 15 words used",
        usage: "<word> or none",
        func: function(Message, Channel) {
            UsageArgs = Message;
            if (UsageArgs === "" || '') {
                var TemporaryWords = [];
                for (var GlobalWord in GlobalWords) {
                    TemporaryWords.push([GlobalWord, GlobalWords[GlobalWord]])
                }
                TemporaryWords.sort(function(b, a) {
                    return a[1] - b[1];
                })
                var TWords = "";
                for (i = 0; i < 25; i++) {
                    TWords = TWords + TemporaryWords[i][0] + ": " + TemporaryWords[i][1] + "\n";
                }
                console.log(TWords, Channel);
            } else {
                if (UsageArgs)
                    if (GlobalWords[UsageArgs]) {
                        console.log(UsageArgs + " was used " + GlobalWords[UsageArgs] + " times", Channel);
                    } else {
                        console.log(UsageArgs + " was never used", Channel)
                    }
            }
        }
    },
    "serverusage": {
        name: "serverusage",
        desc: "same as global usage but applies only to specific servers",
        usage: "<word> or none",
        func: function(Message, Channel) {

        }
    },
    "commands": {
        name: "commands",
        desc: "returns a list of commands",
        usage: "<none>",
        func: function(Message, Channel) {
            var temp = [];
            var tempstring = "";
            for (Command in Commands) {
                temp.push([Command]);
            }
            for (i = 0; i < temp.length; i++) {
                tempstring = tempstring + temp[i] + "\n";
            }
            console.log(tempstring, Channel);
        }
    },
    "c_usage": {
        name: "c_usage",
        desc: "returns usage for a specific command",
        usage: "<command>",
        func: function(Message, Channel) {
            if (Commands[Message]) {
                console.log([Commands[Message].usage], Channel);
            } else {
                console.log("That command does not exist", Channel);
            }
        }
    },
    "desc": {
        name: "desc",
        desc: "returns description for a specific command",
        usage: "<command>",
        func: function(Message, Channel) {
            if (Commands[Message]) {
                console.log([Commands[Message].desc], Channel);
            } else {
                console.log("That command does not exist", Channel);
            }
        }
    },
    "advcmds": {
        name: "advcmds",
        desc: "returns detailed list of commands",
        usage: "<none>",
        func: function(Message, Channel) {
            var temp = [];
            var tempstring = "";
            for (Command in Commands) {
                temp.push([Command, Commands[Command].desc, Commands[Command].usage]);
            }
            for (i = 0; i < temp.length; i++) {
                tempstring = tempstring + "Command: " + temp[i][0] + " Description: " + temp[i][1] + "\n"
            }
            console.log(tempstring, Channel);
        }
    },
    "python": {
        name: "python",
        desc: "Executes python code.",
        usage: "<code>",
        func: function(Message, Channel) {
            ToExec = Message;
            fs.writeFile('./require/ToExecute.py', ToExec, function(Error) {
                if (Error) {
                    console.log(Error, Channel);
                    print(Error);
                }
            })
            var child = exec('python', ['./require/ToExecute.py'], (error, stdout, stderr) => {
                if (error) {
                    console.log(error, Channel);
                } else {
                    print(stderr);
                    console.log(stdout, Channel);
                }
            })
        }
    },
    "C++": {
        name: "cpp",
        desc: "runs C++ code",
        usage: "<CPP>",
        func: function(Message, Channel) {
            if (Message[0] === "`") {
                Message = Message.substring(6, Message.length - 3);
            } else {}
            fs.writeFile('ToExecute.cpp', Message, function(Error) {
                if (Error) {
                    console.log(Error, Channel);
                    print(Error);
                }
            })
            var child = exec('g++', ['./require/ToExecute.cpp'], (error, stdout, stderr) => {
                if (error) {
                    console.log(error, Channel);
                } else {
                    console.log(stdout, Channel);
                    var child1 = exec('./a.out', (error, stdout, stderr) => {
                        if (error) {
                            console.log(error, Channel);
                            print(error);
                        }
                        console.log(stdout, Channel);
                    })
                }
            })
        }
    },
    "rect": { //also not finished
        name: "rect",
        desc: "Creates an ASCII rectangle",
        usage: "<Width>, <Height>, <Number>",
        func: function(Message, Channel) {
            var Width = Message[0]
            var Height = Message[1]
            var Num = Message[2]
            var str;
            print(Width);
            print(Height);
            print(Num);
            print(Message[1]);
            for (var i = 0; i < Width + 1; i++) {
                str = str + Num.toString();
            }
        }
    },
    "rust": {
        name: "rs",
        desc: "executes rust code",
        usage: "<Rust>",
        func: function(Message, Channel) {
            if (Message[0] === "`") {
                Message = Message.substring(7, Message.length - 3);
            } else {}
            fs.writeFile('./require/ToExecute.rs', Message, function(Error) {
                if (Error) {
                    console.log(Error, Channel);
                    print(Error);
                } else {
                    const child = exec('rustc', ['./require/ToExecute.rs'], (error, stdout, stderr) => {
                        if (error) {
                            console.log(error, Channel);
                        } else {
                            console.log(stdout, Channel);
                            const child1 = exec('./ToExecute', (error, stdout, stderr) => {
                                if (error) {
                                    console.log(error)
                                }
                                console.log(stdout, Channel)
                            })
                        }
                    })
                }
            })
        }
    },
    "perl": {
        name: "perl",
        desc: "executes perl",
        usage: "<Perl>",
        func: function(Message, Channel) {
            if (Message[0] === "`") {
                Message = Message.substring(7, Message.length - 3);
            } else {}
            fs.writeFile('./require/ToExecute.pl', Message, function(Error) {
                if (Error) {
                    console.log(Error, Channel)
                    print(Error);
                } else {
                    var child = exec("perl", ['./require/ToExecute.pl'], (error, stdout, stderr) => {
                        if (error) {
                            console.log(error, Channel);
                            print(error);
                        } else {
                            console.log(stdout, Channel);
                        }
                    })
                }
            })
        }
    }
}

SelfBot.on('ready', () => {
    print("Selfbot is now running.");
})

SelfBot.on('message', message => {
    if (message.author.id === SelfBot.user.id && message.content[0] === Prefix) {
        Channel = message.channel;
        for (var Command in Commands) {
            var key = Command;
            var name = Commands[key].name;
            var usage = Commands[key].usage;
            if (message.content.toLowerCase().startsWith(Prefix + name.toLowerCase())) {
                if (usage === "") {
                    Commands[Command].func();
                } else if (name === "exec") {
                    var ToCommand = message.content.split(" ").slice(1).join(" ");
                    Commands[Command].func(ToCommand, Channel, message);
                } else {
                    var ToCommand = message.content.split(" ").slice(1).join(" ");
                    Commands[Command].func(ToCommand, Channel);
                }
            }
        }
    } else if (message.author.id === SelfBot.user.id && message.author.bot === false) {
        Channel = message.channel;
        if (message.content.startsWith(Prefix)) {} else {
            var words = message.content.split(" ");
        }
        if (message.content.indexOf("```") !== -1 || message.content === "") {
            return 0;
        } else {
            if (Sent[message.channel.guild]) {
                if (Sent[message.channel.guild] === "undefined") {
                    Sent["Direct Message"]++;
                }
                Sent[message.channel.guild]++;
                Sent["Total"]++;
            } else {
                if (Sent[message.channel.guild] === "undefined") {
                    Sent["Direct Message"]++;
                }
                Sent[message.channel.guild] = 1;
                Sent["Total"]++;
            }
            for (var word in words) {
                var ToAdd = words[word];
                if (Words[ToAdd]) {
                    Words[ToAdd]++;
                } else {
                    Words[ToAdd] = 1;
                }
            } //https://getbible.net/json?scrip=luke%1:1-2
        }
    } else if (message.author.id && message.author.bot === false) {
        Channel = message.channel;
        if (message.content === SelfBot.user.id || message.content.toLowerCase().indexOf(SelfBot.user.id) !== -1) {
            beep();
            print("Message: " + message.content + "\n" + "Username: " + message.author.username + "\n" + "Server: " + message.channel.guild.name + "\n" + "Channel: " + message.channel.name);
        } else {
            var globalwords = message.content.split(" ");
            if (Stats[message.channel.guild]) {
                if (Stats[message.channel.guild] === "undefined") {
                    Stats["Direct Message"]++;
                }
                Stats[message.channel.guild]++;
            } else {
                if (Stats[message.channel.guild] === "undefined") {
                    Stats["Direct Message"]++;
                }
                Stats[message.channel.guild] = 1;
            }
            if (message.content.indexOf("```") !== -1 || message.content === "") {
                return 0;
            } else {
                for (var globalword in globalwords) {
                    var Global_ToAdd = globalwords[globalword].toLowerCase();
                    if (GlobalWords[Global_ToAdd]) {
                        GlobalWords[Global_ToAdd]++;
                    } else {
                        GlobalWords[Global_ToAdd] = 1;
                    }
                }
            }
        }
    }
})


setInterval(function() {
    fs.writeFile("./require/Words.json", JSON.stringify(Words), 'utf8', function(error) {
        if (error)
            print(error)
    })
}, 30000)

setInterval(function() {
    fs.writeFile("./require/global_words.json", JSON.stringify(GlobalWords), 'utf8', function(error) {
        if (error)
            print(error)
    })
}, 15000)

setInterval(function() {
    fs.writeFile("./require/Sent.json", JSON.stringify(Sent), 'utf8', function(error) {
        if (error)
            print(error)
    })
}, 30000)

setInterval(function() {
    fs.writeFile("./require/Stats.json", JSON.stringify(Stats), 'utf8', function(error) {
        if (error) {
            print(error)
        }
    })
}, 30000)

SelfBot.login(Token);
