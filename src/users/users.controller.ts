import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { PatchUserDto } from './dto/patch-user.dto';
import { AtGuard } from 'src/common/guards';
import { SessionInfo } from 'src/common/decorators/sessionInfo.decorator';
import { GetSessionInfoDto } from 'src/common/decorators/dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';

@UseGuards(AtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AtGuard)
  @ApiOkResponse()
  getUser(@SessionInfo() session: GetSessionInfoDto): Promise<User> {
    return this.usersService.findById(session.sub);
  }

  @Patch()
  @UseGuards(AtGuard)
  @ApiOkResponse()
  patchOne(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() body: PatchUserDto,
  ): Promise<User> {
    return this.usersService.updateOne(session.sub, body);
  }
}
