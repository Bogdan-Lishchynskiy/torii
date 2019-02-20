const axios = require('axios');

function getConfig() {
  return {
    headers: {
      'x-api-key': '0ce51d9b6ef97cd11f4102bfd92f115f2ba10f52',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
}

async function getAllUsers() {
  return await axios.get('https://console.jumpcloud.com/api/systemusers', getConfig())
}


async function getAllApllication() {
  return await axios.get('https://console.jumpcloud.com/api/applications ', getConfig());
}

async function getApplicationUsers() {
  return (await getAllApllication()).data.results
    .map(async (app) => {
      const usersApp = await axios.get(`https://console.jumpcloud.com/api/v2/applications/${app['_id']}/users`, getConfig())
      const {
        config,
        ...clearApp
      } = app;
      return ({
        ...clearApp,
        users: usersApp.data
      });
    })
}

async function getResult() {
  const [apps, users] = [
    await Promise.all(await getApplicationUsers()),
    (await getAllUsers()).data.results
  ];
  console.log('-----------------------------------------> All Users')
  console.log(users);
  return apps.map(app => {
    const appUserIds = app.users.map(user => user['id'])
    return {
      ...app,
      users: users.filter(user => appUserIds.includes(user['_id']))
        .map(({
          _id,
          firstname,
          lastname
        }) => ({
          _id,
          firstname,
          lastname
        }))
    }
  })
}

getResult()
  .then(apps => {
    console.log('-----------------------------------------> Apps with users')
    apps.forEach((el) => {
      console.log(el);
    })
  })
  .catch(err => console.error(err))