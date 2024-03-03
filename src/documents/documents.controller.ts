import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { AtGuard } from 'src/common/guards';
import { SessionInfo } from 'src/common/decorators/sessionInfo.decorator';
import { GetSessionInfoDto } from 'src/common/decorators/dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { DocumentDto } from './dto/document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { SearchParams } from './dto/search-document.dto';

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
    @Body() data: UpdateDocumentDto,
  ): Promise<DocumentDto> {
    return this.documentsService.updateDocument(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({
    type: DocumentDto,
  })
  delete(
    @SessionInfo() session: GetSessionInfoDto,
    @Param('id') id: string,
  ): Promise<DocumentDto> {
    return this.documentsService.deleteDocument(session.sub, id);
  }

  @Get()
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  getAll(@SessionInfo() session: GetSessionInfoDto): Promise<DocumentDto[]> {
    return this.documentsService.getAll(session.sub);
  }

  @Get('/getById')
  @ApiOkResponse({
    type: DocumentDto,
  })
  getById(
    @SessionInfo() session: GetSessionInfoDto,
    @Query('id') id: string,
  ): Promise<DocumentDto> {
    return this.documentsService.getById(session.sub, id);
  }

  @Get('/getByParentId')
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'parentId',
    required: false,
  })
  getByParentId(
    @SessionInfo() session: GetSessionInfoDto,
    @Query('parentId') parentId?: string,
  ): Promise<DocumentDto[]> {
    return this.documentsService.getByParentId(session.sub, parentId);
  }

  @Get('/getArchived')
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  getArchived(
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<DocumentDto[]> {
    return this.documentsService.getArchived(session.sub);
  }

  @Post('search')
  @ApiOkResponse({
    type: DocumentDto,
    isArray: true,
  })
  search(
    @SessionInfo() session: GetSessionInfoDto,
    @Body() searchParams?: SearchParams,
    @Body('limit', ParseIntPipe) limit?: number,
  ): Promise<DocumentDto[]> {
    return this.documentsService.searchDocuments(session.sub, {
      ...searchParams,
      limit,
    });
  }

  @Patch('archive/:id')
  archive(
    @SessionInfo() session: GetSessionInfoDto,
    @Param('id') documentId: string,
  ) {
    return this.documentsService.archive(session.sub, documentId);
  }

  @Patch('restore/:id')
  restore(
    @SessionInfo() session: GetSessionInfoDto,
    @Param('id') documentId: string,
  ) {
    return this.documentsService.restore(session.sub, documentId);
  }
}
