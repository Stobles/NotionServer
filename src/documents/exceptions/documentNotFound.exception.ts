import { NotFoundException } from '@nestjs/common';

class DocumentNotFoundException extends NotFoundException {
  constructor(documentId: string) {
    super(`Document with id ${documentId} not found`);
  }
}

export default DocumentNotFoundException;
