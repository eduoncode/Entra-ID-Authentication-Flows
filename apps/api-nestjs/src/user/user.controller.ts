import { Scopes, ScopesGuard } from '@auth/guards/scopes.guard';
import { OboService } from '@auth/services/obo.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseGuards(AuthGuard('jwt'), ScopesGuard)
export class UserController {
  constructor(private readonly oboService: OboService) {}

  @Get('profile')
  @Scopes('access_as_user')
  getUserProfile(@Req() req: any) {
    console.log(req.user);
    return {
      message: 'Acesso concedido via Delegated Scope: access_as_user',
      scope: req.user.scp,
      user: req.user.preferred_username,
    };
  }

  @Get('profile-downstream')
  @Scopes('access_as_user')
  async getProfileFromGraph(@Req() req: any) {
    const authHeader = req.headers.authorization;
    const userToken = authHeader.split(' ')[1];

    const graphToken = await this.oboService.getTokenOnBehalfOf(userToken);

    const graphResponse = await fetch(process.env.GRAPH_API_ENDPOINT!, {
      headers: { Authorization: `Bearer ${graphToken}` },
    });

    const graphData = await graphResponse.json();

    return {
      message: 'Dados integrados via On-Behalf-Of Flow',
      downstreamData: graphData,
    };
  }
}
