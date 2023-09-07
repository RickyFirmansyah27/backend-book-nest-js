import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginateOption {
  public MaxSize: number;

  constructor() {
    this.MaxSize = 25
      ? Number(25)
      : 25;
  }
}
