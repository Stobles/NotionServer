import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DbService } from 'src/db/db.service';
import { DocumentDto } from './dto/document.dto';
import {
  SearchByTitleParams,
  SearchByParentParams,
} from './dto/search-document.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { UpdateDocumentDto } from './dto/update-document.dto';
import DocumentNotFoundException from './exceptions/documentNotFound.exception';

@Injectable()
export class DocumentsService {
  constructor(private db: DbService) {}

  @OnEvent('documents.create')
  async create(createDocumentDto: CreateDocumentDto): Promise<DocumentDto> {
    try {
      return await this.db.document.create({
        data: {
          userId: createDocumentDto.userId,
          title: createDocumentDto.title,
          parentId: createDocumentDto?.parentId || null,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async updateDocument(
    id: string,
    data: UpdateDocumentDto,
  ): Promise<DocumentDto> {
    try {
      return await this.db.document.update({
        where: {
          id,
        },
        data,
      });
    } catch (e) {
      throw new DocumentNotFoundException(id);
    }
  }

  async getAll(userId: string): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: { userId },
    });
  }

  async getByParentId(
    userId: string,
    { parentId }: SearchByParentParams,
  ): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: { userId, parentId: parentId === 'null' ? null : parentId },
    });
  }

  async getByTitle(
    userId: string,
    { title, limit }: SearchByTitleParams,
  ): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: { userId, title: { contains: title } },
      take: limit,
    });
  }
}
