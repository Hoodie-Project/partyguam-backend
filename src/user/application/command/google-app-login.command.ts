import { ICommand } from '@nestjs/cqrs';

export class GoogleAppLoginCommand implements ICommand {
  constructor(readonly uid: string) {}
}
