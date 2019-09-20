const fs = require("fs");
const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const SERVICE_URL = process.argv[2] || 'https://www.eliteprospects.com/team/108/sc-bern'
const TEAM = SERVICE_URL.split('/')[5]

function saveData(content) {
  fs.writeFile("./data/players_" + TEAM + ".json", content, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!", "./data/players_" + TEAM + ".json")
  });
}

request.get(SERVICE_URL, (error, response, body) => {
  if (error) {
    return console.error(error);
  }

  let dom = new JSDOM(body);
  let rows = dom.window.document.querySelectorAll(".table.roster tbody > tr:not(.title)")

  let teamData = []

  rows.forEach(row => {
    teamData.push({
      name: row.querySelector('.sorted').textContent.trim(),
      height: +row.querySelector('.height').textContent.trim(),
      weight: +row.querySelector('.weight').textContent.trim()
    })
  })

  saveData(JSON.stringify(teamData))
});