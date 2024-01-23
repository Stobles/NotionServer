import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DbService } from 'src/db/db.service';
import { Document } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private db: DbService) {}
  async create(
    userId: string,
    createDocumentDto: CreateDocumentDto,
  ): Promise<Document> {
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
}
