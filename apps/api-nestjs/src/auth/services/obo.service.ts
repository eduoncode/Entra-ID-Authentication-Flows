import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';

@Injectable()
export class OboService {
  private cca: ConfidentialClientApplication;

  constructor() {
    const msalConfig: Configuration = {
      auth: {
        clientId: process.env.AZURE_CLIENT_ID!,
        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
        clientSecret: process.env.AZURE_CLIENT_SECRET!,
      },
    };
    this.cca = new ConfidentialClientApplication(msalConfig);
  }

  async getTokenOnBehalfOf(userAccessToken: string): Promise<string> {
    try {
      const response = await this.cca.acquireTokenOnBehalfOf({
        oboAssertion: userAccessToken,
        scopes: ['https://graph.microsoft.com/User.Read'],
      });

      if (!response?.accessToken) throw new Error('Token vazio');
      return response.accessToken;
    } catch (error) {
      console.error('Erro OBO:', error);
      throw new UnauthorizedException('Falha na troca de token On-Behalf-Of');
    }
  }
}
