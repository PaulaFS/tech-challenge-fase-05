export type ActivityCategory =
  | "saude"
  | "casa"
  | "estudo"
  | "trabalho"
  | "compromisso"
  | "outros";

export type ActivityStatus = "pendente" | "concluida";

export interface Activity {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: ActivityCategory;
  status: ActivityStatus;
  createdAt: string;
  completedAt?: string;
}