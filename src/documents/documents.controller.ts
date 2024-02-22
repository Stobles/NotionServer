import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { AtGuard } from 'src/common/guards';
import { SessionInfo } from 'src/common/decorators/sessionInfo.decorator';
import { GetSessionInfoDto } from 'src/common/decorators/dto';
import { ApiBody, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { DocumentDto } from './dto/document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

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
    const data = { userId: session.sub, ...createDocumentDto };
    return this.documentsService.create(data);
  }

  @Patch()
  @ApiBody({
    type: UpdateDocumentDto,
  })
  update(
    @Query('id') id: string,
    data: UpdateDocumentDto,
  ): Promise<DocumentDto> {
    return this.documentsService.updateDocument(id, data);
  }

  @Get()
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  getAll(@SessionInfo() session: GetSessionInfoDto): Promise<DocumentDto[]> {
    return this.documentsService.getAll(session.sub);
  }

  @Get('/findByParent')
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  getByParentId(
    @SessionInfo() session: GetSessionInfoDto,
    @Query('parentId') parentId?: string,
  ): Promise<DocumentDto[]> {
    return this.documentsService.getByParentId(session.sub, {
      parentId,
    });
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
