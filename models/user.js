const client = require('./postgre.js');

async function addUser(req) {
  try {
  //  await client.connect();
    let idOfUser = await client.query("select max(id) from test ");

    await client.query("insert into test values ($1,$2,$3,$4)", [++idOfUser.rows[0].max || 1, req.body.email, req.body.name, req.body.password], (err, res) => {
      if (err){
        console.log("Error " + err);
        //return false;
}
      else{
        console.log(req.session.id);
        req.session.userid = ++idOfUser.rows[0].max;
        console.log(req.session.userid);
        return req.session.userid;
    }});
  } catch (err) {
    console.log("From catch error " + err);
  }
}

function checkIfExist(req) {
  try {
    let result = client.query("select id from test where email = $1", [req]);
    console.log(result);
    if (result.rows == undefined) {
      console.log('User do not exist');
      return true;
    } else {
      console.log("User exist");
      return false;
    }
  } catch (e) {
    console.log(e);
  }
}

async function clientConnect() {
  try {
    console.log('connected');
    await client.connect();
  } catch (e) {
    console.log(e);
  }
}

async function clientDisconnect() {
  try {
    console.log('disconected');
    client.end();
  } catch (e) {
    console.log(e);
  }
}

async function findUser(req) {
  try {
    //client.connect();
    let result = await client.query("select id from test where email = $1 ", [req.body.email]); //, (err, res) => {
    console.log(result.rows[0].id);
    return result.rows[0].id;
  } catch (e) {
    console.log(e);
  }
}

function getDayOfWeek(date) {
  var myDate = new Date(date.replace(/(\d+).(\d+).(\d+)/, "$3/$2/$1"));
  return (["7", "1", "2", "3", "4", "5", "6"][myDate.getDay()]);
}

function getTime(time) {
  time.split(':');
  return (parseInt(time[0]) * 60 + parseInt(time[1]));
}

function getDate(date) {
  let arr = date.split('.');
  return ((parseInt(arr[2]) - 2018) * 365 + parseInt(arr[1]) * 30 + parseInt(arr[0]));
}

async function addEvent(req) {
  try {
    let id = await client.query("select max(id) from events ");
    console.log("Max id" + id.rows[0].max);
    let day = await getDayOfWeek(req.body.day);
    let time = await getTime(req.body.time);
    let date = await getDate(req.body.day);
    //let userid = await client.query("select * from test where id = $1", [req.session.userId]);
    console.log(id.rows[0].max, req.body.data, req.session.userId, day, time, req.body.day);
    await client.query("insert into events values ($1,$2,$3,$4,$5,$6)", [++id.rows[0].max, req.body.data, userid.rows[0].id, day, time, date]);
    console.log("Event saved");
  } catch (e) {
    console.log(e);
  }
}

async function findEvents(req) {
  try {
    let id = req.session.userid;
    let fromDay = await getDayOfWeek(req.body.fromDay);
    let toDay = await getDayOfWeek(req.body.toDay);
    let fromTime = await getTime(req.body.fromTime);
    let toTime = await getTime(req.body.toTime);
    let fromDate = await getDate(req.body.fromDay);
    let toDate = await getDate(req.body.toDay);
    let res = client.query("select * from events where day>$1 and day<$2 and time > $3 and time < $4 and date > $5 and date < $6", [fromDay, toDay, fromTime, toTime, fromDate, toDate]);
    console.log(res.rows);
    return res.rows;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  addUser,
  checkIfExist,
  addEvent,
  findUser,
  clientConnect,
  clientDisconnect,
  findEvents
}
