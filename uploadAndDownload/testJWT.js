"use strict";
const { JWT } = require("google-auth-library");

async function main(
  // Full path to the sevice account credential
  keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS
) {
  const keys = require(keyFile);
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: ["https://www.googleapis.com/auth/drive"]
  });
  const url = `https://www.googleapis.com/drive/v3/files/`;
  const res = await client.request({ url });
  console.log(res.data);

  // After acquiring an access_token, you may want to check on the audience, expiration,
  // or original scopes requested.  You can do that with the `getTokenInfo` method.
  const tokenInfo = await client.getTokenInfo(client.credentials.access_token);
  console.log(tokenInfo);
}

const args = process.argv.slice(2);
main(...args).catch(console.error);
