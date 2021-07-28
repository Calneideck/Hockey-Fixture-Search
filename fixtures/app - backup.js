const fs = require('fs');
const lr = require('readline');

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_ROW_COUNT = 2000;

if (process.argv.length < 3)
    return console.error('Node app <input>');

var fixtures = [];
var fileCount = 0;
var prefix = process.argv[2].split('.');
prefix.pop();
prefix = prefix.join('.');

var lineReader = lr.createInterface({
    input: fs.createReadStream(process.argv[2])
});

lineReader.on('line', function (line) {
    var words = line.split(',');
    var fixture = {};
    fixture.competition = words[0];
    fixture.round = Number(words[1]);
    fixture.home_team = words[2];
    fixture.away_team = words[3];

    var date = new Date(words[4]);
    fixture.date = date.toLocaleDateString()

    /*fixture.date = date.toDateString();
    fixture.date = fixture.date.substr(0, fixture.date.length - 5);

    var hours = date.getHours();
    var pm = hours > 12;
    if (pm)
        hours -= 12;
    var mins = date.getMinutes();
    fixture.time = hours + ':' + (mins < 10 ? '0' : '') + mins + (pm ? ' PM' : ' AM');

    fixture.time = date.getTime()*/

    fixture.time = words[5];
    fixture.venue = words[6];
    fixtures.push(fixture);
});

lineReader.on('close', function () {
    console.log(fixtures.length + ' fixtures');
    for (var i = 0; i < fixtures.length; i += MAX_ROW_COUNT)
        saveFile(fixtures.slice(i, i + MAX_ROW_COUNT));
});

function saveFile(_fixtures) {
    var text = 'INSERT INTO fixture (competition, round, home_team, away_team, date, time, venue) VALUES '
    for (var i = 0; i < _fixtures.length; i++) {
        text += '("' + _fixtures[i].competition + '",'
        text += '"' + _fixtures[i].round + '",'
        text += '"' + _fixtures[i].home_team + '",'
        text += '"' + _fixtures[i].away_team + '",'
        text += '"' + _fixtures[i].date + '",'
        text += '"' + _fixtures[i].time + '",'
        text += '"' + _fixtures[i].venue + '")'
        if (i < _fixtures.length - 1)
            text += ','
    }
    var filename = prefix + (++fileCount) + '.sql';
    fs.writeFileSync(filename, text);
    console.log(filename);
}