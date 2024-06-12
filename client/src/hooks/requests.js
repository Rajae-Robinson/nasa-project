let API_BASE_URL = 'v1'

if (process.env.NODE_ENV === 'development') {
  API_BASE_URL = 'http://localhost:3001/v1'
}

async function httpGetPlanets() {
  const response = await fetch(`${API_BASE_URL}/planets`)
  return await response.json()
}

async function httpGetLaunches() {
  const response = await fetch(`${API_BASE_URL}/launches`)
  return await response.json()
}

async function httpPaginateLaunches({page, limit}) {
  const response = await fetch(`${API_BASE_URL}/launches?page=${page}&limit=${limit}`)
  return await response.json()
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
  httpPaginateLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};