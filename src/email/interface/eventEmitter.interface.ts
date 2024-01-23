export interface EventPayloads {
  'user.verify-email': {
    id: string;
    name: string;
    email: string;
    link: string;
  };
}
