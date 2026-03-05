import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CognitoAuthGuard } from '../auth/cognito.guard.js';
import { SearchService } from './search.service.js';

@ApiTags('search')
@ApiBearerAuth()
@UseGuards(CognitoAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query('q') query: string,
    @Query('placeId') placeId?: string,
    @Query('category') category?: string,
    @Query('mode') mode?: string,
  ) {
    if (mode === 'semantic') {
      return this.searchService.semanticSearch(query);
    }
    return this.searchService.searchNL(query, { placeId, category });
  }

  @Post('voice')
  voiceSearch(@Body('audioBase64') audioBase64: string) {
    return this.searchService.voiceSearch(audioBase64);
  }
}
