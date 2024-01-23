import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { AtGuard } from 'src/common/guards';
import { SessionInfo } from 'src/common/decorators/sessionInfo.decorator';
import { GetSessionInfoDto } from 'src/common/decorators/dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { Document } from '@prisma/client';

@UseGuards(AtGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiBody({
    type: CreateDocumentDto,
  })
  create(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.create(session.sub, createDocumentDto);
  }
}
