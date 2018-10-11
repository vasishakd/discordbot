module.exports = class Writer {
    writeFile(file, args) {
        let fs = require('fs');
        let fileData = fs.readFileSync(file, 'utf8');
        let content = JSON.parse(fileData);
        
        for (let key in args) {
            content[key] = args[key];
        }
        content = JSON.stringify(content);
        fs.writeFileSync("./botconfig.json", content);
    }
};