export class Player {
  name: string;
  role: string;
  host: boolean;

  constructor(name: string, role: string, host: boolean) {
    this.name = name;
    this.role = role;
    this.host = host;
  }
}
