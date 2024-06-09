let API_BASE_URL = 'v1'

if (process.env.NODE_ENV === 'development') {
  API_BASE_URL = 'http://localhost:3001/v1'
}

async function httpGetPlanets() {
  const response = await fetch(`${API_BASE_URL}/planets`)
  return await response.json()
}

async function httpGetLaunches() {
  const response = await fetch(`${API_BASE_URL}/launches?limit=20`)
  return await response.json()
  // implement pagination
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_BASE_URL}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(launch)
    })
  } catch(err) {
    return { ok: false }
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_BASE_URL}/launches/${id}`, {
      method: 'DELETE',
    })
  } catch(err) {
    return {ok: false}
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};