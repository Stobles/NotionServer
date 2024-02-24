import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private db: DbService) {}

  async getAll(userId: string) {
    return await this.db.favorite.findMany({
      where: { userId },
    });
  }

  async toggleFavorite({
    userId,
    documentId,
  }: CreateFavoriteDto): Promise<FavoriteDto> {
    const exists = await this.db.favorite.findFirst({
      where: { userId, documentId },
    });

    if (exists) {
      return await this.db.favorite.deleteMany({
        where: { userId, documentId },
      })[0];
    }

    return await this.db.favorite.create({
      data: { userId, documentId },
    });
  }
}
