import { Injectable, Logger } from '@nestjs/common';
import { ProcessingState } from '../processing.service';

@Injectable()
export class ReadyNode {
  private readonly logger = new Logger(ReadyNode.name);

  async execute(state: ProcessingState): Promise<Partial<ProcessingState>> {
    this.logger.log(`Ready node reached for ${state.docId}`);
    // mark as ready by returning a summary field (allowed in ProcessingState)
    return { summary: state.summary || '' };
  }
}
