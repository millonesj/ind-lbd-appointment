import { Controller, Get } from '@nestjs/common';
import { AppService } from '../application/app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get ' })
  @ApiResponse({
    status: 200,
    description: 'The application is working correctly',
  })
  getStatus() {
    return { message: 'ok' };
  }
}
