import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Jwt } from '../../domain/aurora.types';
import { accounts } from '../../domain/persistence/seeds/iam-account.seed';
import { accessTokens } from '../../domain/persistence/seeds/o-auth-access-token.seed';
import { Utils } from '../../domain/shared/utils';

@Injectable()
export class TestingJwtService
{
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    getJwt(): string
    {
        const accessTokenPayload: Jwt = {
            jit: accessTokens[0].id,
            aci: accounts[0].id,
            iss: 'Hades Testing OAuth',
            iat: parseInt(Utils.now().format('X')),
            nbf: parseInt(Utils.now().format('X')),
            exp: parseInt(Utils.now().add(600, 'seconds').format('X')),
        };

        return this.jwtService.sign(accessTokenPayload);
    }
}