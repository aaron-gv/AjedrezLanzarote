export interface Evento {
    id: string;
    title: string;
    url: string;
    startDate: Date | null;
    endDate: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
}