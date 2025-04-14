const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");

const createEnvelope = async ({
  file_path,
  file_name,
  file_type,
  recipientEmail,
  recipientName,
}) => {
  try {
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(process.env.DOCUSIGN_API_BASE_PATH);

    const privateKey = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, "\n");

    const results = await apiClient.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATOR_KEY,
      process.env.DOCUSIGN_USER_ID,
      "signature",
      privateKey,
      3600
    );

    const accessToken = results.body.access_token;
    apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    const filePath = path.resolve(__dirname, `../${file_path}`);
    const fileBytes = fs.readFileSync(filePath);

    const envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject = "Please sign this document";

    const doc = new docusign.Document();
    doc.documentBase64 = Buffer.from(fileBytes).toString("base64");
    doc.name = file_name;
    doc.fileExtension = file_type;
    doc.documentId = "1";

    envelopeDefinition.documents = [doc];

    const signer = new docusign.Signer();
    signer.email = recipientEmail;
    signer.name = recipientName;
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

    return resultsEnvelope.envelopeId;
  } catch (error) {
    console.error("Error creating DocuSign envelope:", error);
    throw error;
  }
};

const createEmbeddedSigningUrl = async (
  envelopeId,
  recipientEmail,
  recipientName,
  returnUrl
) => {
  try {
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(process.env.DOCUSIGN_API_BASE_PATH);

    const privateKey = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, "\n");

    // Request a JWT User Token
    const results = await apiClient.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATOR_KEY,
      process.env.DOCUSIGN_USER_ID,
      "signature",
      privateKey,
      3600
    );

    const accessToken = results.body.access_token;
    apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    // Create the recipient view request
    const viewRequest = new docusign.RecipientViewRequest();
    viewRequest.returnUrl = returnUrl; // URL to redirect after signing
    viewRequest.authenticationMethod = "none";
    viewRequest.email = recipientEmail;
    viewRequest.userName = recipientName;
    viewRequest.clientUserId = "1"; // Unique identifier for the recipient

    // Generate the signing URL
    const resultsView = await envelopesApi.createRecipientView(
      accountId,
      envelopeId,
      { recipientViewRequest: viewRequest }
    );

    return resultsView.url;
  } catch (error) {
    console.error("Error creating embedded signing URL:", error);
    throw error;
  }
};

module.exports = { createEnvelope, createEmbeddedSigningUrl };
