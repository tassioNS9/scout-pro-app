export interface MatchItem {
  id: number;
  time: number | string;
  nomeTimeAdversario: number | string;
  placarTime: number | null;
  placarTimeAdversario: number | null;
  data: Date;
  campeonato: string | null;
  categoria: string;
  status: string | null;
}

interface UseItemMatchCardViewModelParams {
  match: MatchItem;
}

const statusMetadata: Record<
  string,
  { label: string; className: string; textClassName: string }
> = {
  planejada: {
    label: "Planejada",
    className: "border-blue-200 bg-blue-100",
    textClassName: "text-blue-700",
  },
  em_andamento: {
    label: "Em Andamento",
    className: "border-emerald-200 bg-emerald-100",
    textClassName: "text-emerald-700",
  },
  finalizada: {
    label: "Finalizada",
    className: "border-slate-200 bg-slate-100",
    textClassName: "text-slate-700",
  },
};

const defaultStatus = statusMetadata.planejada;

export const useItemMatchCardViewModel = ({
  match,
}: UseItemMatchCardViewModelParams) => {
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const status = statusMetadata[match.status ?? ""] ?? defaultStatus;

  return {
    match,
    formattedDate: formatDate(match.data),
    status,
  };
};
