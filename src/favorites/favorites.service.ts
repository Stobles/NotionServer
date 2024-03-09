import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteDto } from './dto/favorite.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(private db: DbService) {}

  async getAll(userId: string) {
    const favorites = await this.db.favorite.findMany({
      where: { userId },
      include: { document: true },
    });

    const favoriteDocuments = favorites.filter((favorite) => {
      if (!favorite?.document?.isArchived) return favorite.document;
    });

    return favoriteDocuments;
  }

  async getById(userId: string, documentId: string) {
    const favorite = await this.db.favorite.findMany({
      where: { userId, documentId },
      include: { document: true },
    });

    return favorite;
  }

  async toggleFavorite({
    userId,
    documentId,
  }: CreateFavoriteDto): Promise<FavoriteDto> {
    try {
      const exists = await this.db.favorite.findFirst({
        where: { userId, documentId },
      });

      if (exists) {
        const result = await this.db.favorite.delete({
          where: {
            userId,
            documentId,
            userId_documentId: {
              userId,
              documentId,
            },
          },
        });

        return result;
      }

      return await this.db.favorite.create({
        data: { userId, documentId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('User or Document were not found');
        }
      }
      throw new BadRequestException(error);
    }
  }
}
