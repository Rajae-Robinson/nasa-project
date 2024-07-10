let API_BASE_URL = 'v1'

if (process.env.NODE_ENV === 'development') {
  API_BASE_URL = 'http://localhost:3001/v1'
}

// AUTH
async function httpSignUp({name, email, password, passwordConfirm}) {
  try {
    return await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, email, password, passwordConfirm})
    })
  } catch(err) {
    return { ok: false }
  }
}

async function httpLogin({ email, password }) {
  try {
    return await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
  } catch(err) {
    return { ok: false }
  }
}

async function httpForgotPassword({ email }) {
  try {
    return await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email})
    })
  } catch(err) {
    return { ok: false }
  }
}

async function httpResetPassword({token, password, passwordConfirm}) {
  try {
    return await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, passwordConfirm }),
    })
  } catch(err) {
    return { ok: false }
  }
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
  httpSignUp,
  httpLogin,
  httpForgotPassword,
  httpResetPassword,
  httpGetPlanets,
  httpGetLaunches,
  httpPaginateLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};