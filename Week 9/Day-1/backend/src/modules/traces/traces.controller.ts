import { Controller, Get, Param } from '@nestjs/common';
import { TracesService } from './traces.service';

@Controller('trace')
export class TracesController {
  constructor(private readonly traces: TracesService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    const t = await this.traces.findById(id);
    if (!t) return { ok: false, message: 'Trace not found' };
    return { ok: true, trace: t };
  }
}
