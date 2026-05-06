const PASSWORD = 'Petvalu2026'
const SESSION_KEY = 'fire_inspect_auth'

export function login(password: string): boolean {
  if (password === PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true')
    return true
  }
  return false
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}
