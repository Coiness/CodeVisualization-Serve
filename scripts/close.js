const fs = require("fs");
let pid = fs.readFileSync("logs/pid.log");
process.kill(pid);
