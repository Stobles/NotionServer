import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DbService } from 'src/db/db.service';
import { DocumentDto } from './dto/document.dto';
import { SearchParams } from './dto/search-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private db: DbService) {}
  async create(
    userId: string,
    createDocumentDto: CreateDocumentDto,
  ): Promise<DocumentDto> {
    try {
      return await this.db.document.create({
        data: {
          title: createDocumentDto.title,
          parentId: createDocumentDto?.parentId || null,
          userId,
        },
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
  async getAll(userId: string): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: { userId },
    });
  }

  async getByTitle(
    userId: string,
    { title, limit }: SearchParams,
  ): Promise<DocumentDto[]> {
    return await this.db.document.findMany({
      where: { userId, title: { contains: title } },
      take: limit,
    });
  }
}
