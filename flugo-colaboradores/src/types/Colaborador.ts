export interface Colaborador {
  id?: string;
  nome: string;
  email: string;
  ativo: boolean;
  departamento?: string;
  criadoEm: Date;
}
