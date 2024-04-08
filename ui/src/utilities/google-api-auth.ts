import { google } from 'googleapis'

export async function getOAuthClient() {

  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET
  const redirectURI = process.env.REDIRECT_URI

  return new google.auth.OAuth2(clientId, clientSecret, redirectURI)
}

export async function getOAuthURL() {
  return (await getOAuthClient()).generateAuthUrl({ access_type: 'offline', scope: [] })
}