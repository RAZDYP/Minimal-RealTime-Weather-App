const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8")

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp - 273).toFixed(2)); //tempVal is the home.html file and orgVal is the data from the api
    temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min - 273).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max - 273).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=8c76b8636139fa79fc30381f2a0b3487")
            .on
            (
                "data", (chunk) => {
                    const objdata = JSON.parse(chunk);
                    const arrData = [objdata];
                    console.log(arrData[0].main.temp);
                    const realTimeData = arrData
                        .map((val) => replaceVal(homeFile, val))
                        .join("");
                    res.write(realTimeData);
                }
            )
            .on("end", (err) => {
                if (err)
                    return console.log("connection closed due to errors", err);
                res.end();
            })
    }
});

server.listen(8000, "localhost", () => {
    console.log('Server running at http://localhost:8000/');
});
