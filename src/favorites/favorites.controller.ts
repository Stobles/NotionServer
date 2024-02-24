import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoritesService } from './favorites.service';
import { FavoriteDto } from './dto/favorite.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get('/:id')
  @ApiOkResponse({
    type: FavoriteDto,
    isArray: true,
  })
  async getAll(@Param('id') userId: string): Promise<FavoriteDto[]> {
    return this.favoritesService.getAll(userId);
  }

  @Post()
  @ApiOkResponse({
    type: FavoriteDto,
  })
  async toggleFavorite(@Body() body: CreateFavoriteDto): Promise<FavoriteDto> {
    return this.favoritesService.toggleFavorite(body);
  }
}
