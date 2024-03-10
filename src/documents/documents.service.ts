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
import { removeSpacesAndSpecialChars } from 'src/common/utils/removeSpacesAndSpecialChars';

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
    const documentsCount = await this.db.document.count({
      where: { userId },
    });

    if (documentsCount === 1) {
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

  async archive(userId: string, documentId: string): Promise<DocumentDto> {
    const document = await this.db.document.findFirst({
      where: { userId, id: documentId },
    });

    if (!document) throw new NotFoundException();

    const documentsCount = await this.db.document.count({
      where: { userId, isArchived: false },
    });

    if (documentsCount === 1) {
      throw new BadRequestException('Вы не можете удалить последний документ.');
    }

    await this.db.document.update({
      where: { userId, id: documentId },
      data: { isArchived: true },
    });

    const childrens = await this.db.document.findMany({
      where: { parentId: documentId },
    });

    childrens.forEach((child) => this.archive(userId, child.id));

    return document;
  }

  async restore(userId: string, documentId: string): Promise<DocumentDto> {
    const document = await this.db.document.findFirst({
      where: { userId, id: documentId },
      include: { parent: true },
    });

    if (!document) throw new NotFoundException();

    await this.db.document.update({
      where: { userId, id: documentId },
      data: {
        isArchived: false,
        parentId: document?.parent?.isArchived ? null : document.parentId,
      },
    });

    const childrens = await this.db.document.findMany({
      where: { parentId: documentId },
    });

    childrens.forEach((child) => this.restore(userId, child.id));

    return document;
  }

  async addCover(userId: string, documentId: string, fileName: string) {
    const fileNameChanged = removeSpacesAndSpecialChars(fileName);
    return await this.db.document.update({
      where: {
        userId,
        id: documentId,
      },
      data: { coverImage: fileNameChanged },
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
      parent = false,
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
      include: { favoritedBy: true, parent },
      orderBy: { [sort.field]: sort.type },
    });
  }
}
