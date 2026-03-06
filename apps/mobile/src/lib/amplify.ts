import { Amplify } from 'aws-amplify';
import { DEMO_MODE } from './demo';

if (!DEMO_MODE) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID!,
        signUpVerificationMethod: 'code',
      },
    },
  });
}
