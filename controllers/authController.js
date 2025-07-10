const { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand } = require('@aws-sdk/client-cognito-identity-provider');
const crypto = require('crypto');

// Configure AWS Cognito v3 client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

// Helper to generate Cognito SECRET_HASH
function getSecretHash(username, clientId, clientSecret) {
  return crypto.createHmac('sha256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

exports.login = async (req, res) => {
  const { username, password, companyName, newPassword, session } = req.body;
  if (!username || !companyName || (!password && !newPassword)) {
    return res.status(400).json({ message: 'Username, password/newPassword, and company name are required.' });
  }

  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;

  try {
    let cognitoResponse;
    if (newPassword && session) {
      // Handle NEW_PASSWORD_REQUIRED challenge
      const challengeResponses = {
        USERNAME: username,
        NEW_PASSWORD: newPassword,
        ...(clientSecret ? { SECRET_HASH: getSecretHash(username, clientId, clientSecret) } : {}),
      };
      if (req.body.phone_number) {
        challengeResponses.phone_number = req.body.phone_number;
        challengeResponses.phone_number_verified = "true";
      }
      const challengeParams = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: clientId,
        Session: session,
        ChallengeResponses: challengeResponses,
      };
      const challengeCommand = new RespondToAuthChallengeCommand(challengeParams);
      cognitoResponse = await cognitoClient.send(challengeCommand);
    } else {
      // Normal login
      const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          ...(clientSecret ? { SECRET_HASH: getSecretHash(username, clientId, clientSecret) } : {}),
        },
      };
      try {
        const command = new InitiateAuthCommand(params);
        cognitoResponse = await cognitoClient.send(command);
      } catch (cognitoErr) {
        if (cognitoErr.name === 'NotAuthorizedException') {
          return res.status(401).json({ message: 'Invalid username or password.', details: cognitoErr.message });
        }
        if (cognitoErr.name === 'UserNotFoundException') {
          return res.status(401).json({ message: 'User not found in Cognito.', details: cognitoErr.message });
        }
        if (cognitoErr.name === 'InvalidParameterException') {
          return res.status(400).json({ message: 'Invalid parameters sent to Cognito.', details: cognitoErr.message });
        }
        return res.status(500).json({ message: 'Cognito error', error: cognitoErr.message });
      }
      if (cognitoResponse.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        return res.status(200).json({
          message: 'NEW_PASSWORD_REQUIRED',
          challengeName: cognitoResponse.ChallengeName,
          session: cognitoResponse.Session,
          username,
        });
      }
    }

    // Step 2: Validate user/company in DB using appdataController.getAppDataBasedOnFilter logic
    const collection = req.db.collection('appdata');
    const pipeline = [
      { $match: { username, companyName } }
    ];
    const userArr = await collection.aggregate(pipeline).toArray();
    const user = userArr[0];
    if (!user) {
      return res.status(401).json({ message: 'User not found for this company.' });
    }
    // Step 3: Success
    return res.status(200).json({
      message: 'Login successful',
      token: cognitoResponse.AuthenticationResult.IdToken,
      user,
    });
  } catch (err) {
    if (err.name === 'NotAuthorizedException') {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    if (err.name === 'InvalidPasswordException') {
      return res.status(400).json({ message: 'Password does not meet requirements.' });
    }
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
