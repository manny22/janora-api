import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (!user.isActive || user.deletedAt) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return this.generateTokens(user);
  }

  async refresh(userId: string, oldRefreshToken: string) {
    const tokens = await this.generateTokens(
      await this.prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    );

    // Revoke old token
    await this.prisma.refreshToken.updateMany({
      where: { token: oldRefreshToken },
      data: { isRevoked: true },
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
    return { message: 'Sesión cerrada correctamente' };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        propertyId: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }

  private async generateTokens(user: { id: string; email: string; role: string; propertyId: string | null }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      propertyId: user.propertyId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
      }),
      this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
      }),
    ]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
