import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DbService } from 'src/db/db.service';
import { DocumentDto } from './dto/document.dto';
import { SearchParams } from './dto/search-document.dto';
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
        data: {
          ...data,
        },
      });
    } catch (e) {
      throw new DocumentNotFoundException(id);
    }
  }

  async deleteDocument(userId: string, id: string): Promise<DocumentDto> {
    const documents = await this.db.document.findMany({
      where: { userId },
    });

    if (documents.length === 1) {
      throw new BadRequestException('Вы не можете удалить последний документ.');
    }
    try {
      return await this.db.document.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new DocumentNotFoundException(id);
    }
  }

  async getAll(userId: string): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: { userId, isArchived: false },
      include: {
        favoritedBy: true,
        childrens: true,
      },
    });
  }

  async getById(userId: string, id: string): Promise<DocumentDto> {
    try {
      const result = await this.db.document.findFirst({
        where: { userId, id },
      });

      if (!result?.id) throw new DocumentNotFoundException(id);

      return result;
    } catch (e) {
      throw new DocumentNotFoundException(id);
    }
  }

  async getByParentId(
    userId: string,
    parentId: string | null = null,
  ): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: {
        userId,
        parentId,
        isArchived: false,
      },
      include: { favoritedBy: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getArchived(userId: string): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: {
        userId,
        isArchived: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchDocuments(
    userId: string,
    {
      filters = { isArchived: false },
      sort = { field: 'title', type: 'asc' },
      query = '',
      limit = 10,
    }: SearchParams,
  ): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: {
        userId,
        title: { contains: query },
        ...filters,
      },
      take: limit,
      include: { favoritedBy: true },
      orderBy: { [sort.field]: sort.type },
    });
  }

  async archive(userId: string, documentId: string): Promise<DocumentDto> {
    const document = await this.db.document.findFirst({
      where: { userId, id: documentId },
    });

    if (!document) throw new NotFoundException();

    await this.db.document.update({
      where: { userId, id: documentId },
      data: { isArchived: true },
    });

    await this.db.document.updateMany({
      where: { parentId: documentId },
      data: { isArchived: true },
    });

    return document;
  }

  async restore(userId: string, documentId: string): Promise<DocumentDto> {
    const document = await this.db.document.findFirst({
      where: { userId, id: documentId },
    });

    if (!document) throw new NotFoundException();

    await this.db.document.update({
      where: { userId, id: documentId },
      data: { isArchived: false },
    });

    await this.db.document.updateMany({
      where: { parentId: documentId },
      data: { isArchived: false },
    });

    return document;
  }
}
