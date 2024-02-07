import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { AtGuard } from 'src/common/guards';
import { SessionInfo } from 'src/common/decorators/sessionInfo.decorator';
import { GetSessionInfoDto } from 'src/common/decorators/dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { DocumentDto } from './dto/document.dto';

@UseGuards(AtGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiBody({
    type: CreateDocumentDto,
  })
  @ApiCreatedResponse({
    type: DocumentDto,
  })
  create(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentDto> {
    return this.documentsService.create(session.sub, createDocumentDto);
  }

  @Get()
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  getAll(@SessionInfo() session: GetSessionInfoDto): Promise<DocumentDto[]> {
    return this.documentsService.getAll(session.sub);
  }

  @Get('/findByTitle')
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  getByTitle(
    @SessionInfo() session: GetSessionInfoDto,
    @Query('title') title: string,
    @Query('limit', ParseIntPipe) limit?: number,
  ): Promise<DocumentDto[]> {
    return this.documentsService.getByTitle(session.sub, { title, limit });
  }
}
