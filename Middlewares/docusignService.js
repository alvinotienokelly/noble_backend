// Middlewares/docusignService.js
const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");
const logger = require("./logger");

const createEnvelope = async (document) => {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_API_BASE_PATH);

  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, "\n");

  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATOR_KEY,
    process.env.DOCUSIGN_USER_ID,
    "signature",
    fs.readFileSync(path.join(__dirname, "private.key")),
    3600
  );

  const accessToken = results.body.access_token;

  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

  const filePath = path.resolve(__dirname, `../${document.file_path}`);
  const fileBytes = fs.readFileSync(filePath);

  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = "Please sign this document";

  const doc = new docusign.Document();
  doc.documentBase64 = Buffer.from(fileBytes).toString("base64");
  doc.name = document.file_name;
  doc.fileExtension = document.file_type;
  doc.documentId = "1";

  envelopeDefinition.documents = [doc];

  const signer = new docusign.Signer();
  signer.email = "alvinodiwuor@gmail.com"; // Replace with recipient's email
  signer.name = "Alvin Odiwuor"; // Replace with recipient's name
  signer.recipientId = "1";
  signer.routingOrder = "1";

  const signHere = new docusign.SignHere();
  signHere.documentId = "1";
  signHere.pageNumber = "1";
  signHere.recipientId = "1";
  signHere.tabLabel = "SignHereTab";
  signHere.xPosition = "200";
  signHere.yPosition = "200";

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  signer.tabs = tabs;

  envelopeDefinition.recipients = new docusign.Recipients();
  envelopeDefinition.recipients.signers = [signer];

  envelopeDefinition.status = "sent";

  const resultsEnvelope = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition,
  });

  //log docusign respose
  return resultsEnvelope.envelopeId;
};

const createEmbeddedSigningUrl = async (
  document,
  recipientEmail,
  recipientName,
  returnUrl
) => {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(process.env.DOCUSIGN_API_BASE_PATH);

  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, "\n");
  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATOR_KEY,
    process.env.DOCUSIGN_USER_ID,
    "signature",
    fs.readFileSync(path.join(__dirname, "private.key")),
    3600
  );

  const accessToken = results.body.access_token;
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

  const filePath = path.resolve(__dirname, `../${document.file_path}`);
  const fileBytes = fs.readFileSync(filePath);

  const envelopeDefinition = new docusign.EnvelopeDefinition();
  envelopeDefinition.emailSubject = "Please sign this document";

  const doc = new docusign.Document();
  doc.documentBase64 = Buffer.from(fileBytes).toString("base64");
  doc.name = document.file_name;
  doc.fileExtension = document.file_type;
  doc.documentId = "1";

  envelopeDefinition.documents = [doc];

  const signer = new docusign.Signer();
  signer.email = recipientEmail;
  signer.name = recipientName;
  signer.recipientId = "1";
  signer.routingOrder = "1";
  signer.clientUserId = "1"; // Required for embedded signing

  const signHere = new docusign.SignHere();
  signHere.documentId = "1";
  signHere.pageNumber = "1";
  signHere.recipientId = "1";
  signHere.tabLabel = "SignHereTab";
  signHere.xPosition = "200";
  signHere.yPosition = "200";

  const tabs = new docusign.Tabs();
  tabs.signHereTabs = [signHere];
  signer.tabs = tabs;

  envelopeDefinition.recipients = new docusign.Recipients();
  envelopeDefinition.recipients.signers = [signer];

  envelopeDefinition.status = "sent";

  const resultsEnvelope = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition,
  });

  const envelopeId = resultsEnvelope.envelopeId;

  const viewRequest = new docusign.RecipientViewRequest();
  viewRequest.returnUrl = returnUrl;
  viewRequest.authenticationMethod = "none";
  viewRequest.email = recipientEmail;
  viewRequest.userName = recipientName;
  viewRequest.clientUserId = "1";

  const resultsView = await envelopesApi.createRecipientView(
    accountId,
    envelopeId,
    {
      recipientViewRequest: viewRequest,
    }
  );

  // Log DocuSign response using Winston

  return resultsView.url;
};

module.exports = { createEnvelope, createEmbeddedSigningUrl };
