// graphClient.js
const { Client } = require("@microsoft/microsoft-graph-client");
const { InteractiveBrowserCredential } = require('@azure/identity');

const credential = new InteractiveBrowserCredential({
  clientId: process.env.CLIENT_ID,
  tenantId: process.env.TENANT_ID,
  clientSecret: process.env.SECRET_ID,
});

const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
      return tokenResponse.token;
    },
  },
});

module.exports = graphClient;