var comp = document.getElementById('comp');
var round = document.getElementById('round');
var team = document.getElementById('team');
var date = document.getElementById('date');
var venue = document.getElementById('venue');
var chkMen = document.getElementById('chk-men');
var chkWomen = document.getElementById('chk-women');
var chkMensMasters = document.getElementById('chk-men-masters');
var chkWomensMasters = document.getElementById('chk-women-masters');
var rowHolder = document.getElementById('row-holder');
var fixtureCount = document.getElementById('fixture-count');

var terms = ['competition', 'round', 'team', 'date', 'venue'];
var searchNodes = [comp, round, team, date, venue];
var checks = [chkMen, chkWomen, chkMensMasters, chkWomensMasters];
var checkNames = ['mens', 'womens', 'mensmasters', 'womensmasters'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function search() {
    var req = {};
    for (var i = 0; i < terms.length; i++)
        if (searchNodes[i].value)
            req[terms[i]] = searchNodes[i].value;

    for (var i = 0; i < checks.length; i++)
        if (checks[i].checked)
            req[checkNames[i]] = true;

    $.get('fixtures.php', req, function(data) {
        // Remove previous rows
        while (rowHolder.childElementCount > 0)
            rowHolder.removeChild(rowHolder.children[0]);

        var result = JSON.parse(data);
        fixtureCount.innerHTML = result.length + ' found'

        for (var i = 0; i < result.length; i++) {
            // Add new row
            var row = document.createElement('tr');
            rowHolder.appendChild(row);

            // Add cells
            for (var key in result[i]) {
                var cell = document.createElement('td');
                var text = result[i][key];

                if (key == 'date') {
                    var aDate = new Date(text);
                    text = aDate.getDate() + ' ' + months[aDate.getMonth()];
                } else if (key == 'time') {
                    var temp = text.split(':');
                    var hour = Number(temp[0]);
                    if (hour == 0) {
                        text = '';
                    } else {
                        var pm = hour >= 12;
                        if (hour > 12)
                            hour -= 12;
                            
                        text = hour + ':' + temp[1] + ' ' + (pm ? 'PM' : 'AM');
                    }
                }

                cell.innerHTML = text;
                row.appendChild(cell);
            }
        }
    });
}
