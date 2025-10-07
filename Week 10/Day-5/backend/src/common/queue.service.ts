import { Injectable, Logger } from '@nestjs/common';

export interface QueueItem<T> {
  id: string;
  data: T;
  retries: number;
  maxRetries: number;
}

@Injectable()
export class QueueService<T> {
  private readonly logger = new Logger(QueueService.name);
  private queue: QueueItem<T>[] = [];
  private processing = false;
  private processCallback: (item: T) => Promise<void>;

  constructor() {}

  setProcessor(callback: (item: T) => Promise<void>) {
    this.processCallback = callback;
  }

  async enqueue(id: string, data: T, maxRetries = 3): Promise<void> {
    this.queue.push({ id, data, retries: 0, maxRetries });
    this.logger.log(`Enqueued item ${id}. Queue size: ${this.queue.length}`);

    if (!this.processing) {
      await this.processQueue();
    }
  }

  async enqueueMany(
    items: Array<{ id: string; data: T }>,
    maxRetries = 3,
  ): Promise<void> {
    items.forEach((item) => {
      this.queue.push({ id: item.id, data: item.data, retries: 0, maxRetries });
    });
    this.logger.log(
      `Enqueued ${items.length} items. Queue size: ${this.queue.length}`,
    );

    if (!this.processing) {
      await this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    this.logger.log('Starting queue processing...');

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) continue;

      try {
        this.logger.log(
          `Processing item ${item.id} (attempt ${item.retries + 1}/${item.maxRetries + 1})`,
        );
        await this.processCallback(item.data);
        this.logger.log(`Successfully processed item ${item.id}`);
      } catch (error) {
        this.logger.error(`Error processing item ${item.id}:`, error.message);

        // Retry if not exceeded max retries
        if (item.retries < item.maxRetries) {
          item.retries++;
          this.queue.push(item);
          this.logger.log(
            `Re-queuing item ${item.id}. Retry ${item.retries}/${item.maxRetries}`,
          );
        } else {
          this.logger.error(`Max retries exceeded for item ${item.id}`);
        }
      }

      // Add a small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    this.processing = false;
    this.logger.log('Queue processing completed');
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }
}
