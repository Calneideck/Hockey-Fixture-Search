const fs = require('fs');
const lr = require('readline');

var fixtures = [];

var lineReader = lr.createInterface({
    input: fs.createReadStream('fixtures.csv')
});

lineReader.on('line', function (line) {
    var words = line.split(',');

    words[0] = words[0] // Round
    words[1] = words[1].replace(' - 2022', '')

    var date = new Date(0);
    var day = words[2].split('/')
    var time = words[5].split(':')
    date.setDate(day[0])
    date.setMonth(day[1] - 1)
    date.setFullYear(day[2])
    date.setHours(time[0])
    date.setMinutes(time[1])

    words[2] = date.getTime() / 1000 / 60
    words.splice(5, 1)
    fixtures.push(words.join(','))
});

lineReader.on('close', function () {
    console.log(fixtures.length + ' fixtures');
    saveFile();
});

function saveFile() {
    var filename = 'fixtures_cleaned.csv';
    fs.writeFileSync(filename, fixtures.join('\n'));
    console.log('Done!');
}