export type Professional = {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  avatarUrl?: string;
  times: string[];
};

export const professionals: Professional[] = [
  {
    id: '1',
    name: 'Dra. Ana Silva',
    title: 'Psicologia Clínica e Terapia Cognitiva',
    bio: 'Especialista em ansiedade, depressão e relacionamentos. Abordagem humanizada com foco no bem-estar integral do paciente.',
    specialties: ['Psicologia Clínica', 'Terapia Cognitiva'],
    times: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendes',
    title: 'Psicologia Organizacional',
    bio: 'Focado em desenvolvimento de carreira, liderança e gestão de equipes. Experiência em grandes corporações.',
    specialties: ['Organizacional'],
    times: ['08:00', '09:00', '17:00'],
  },
  {
    id: '3',
    name: 'Dra. Mariana Costa',
    title: 'Psicologia Infantil e Adolescente',
    bio: 'Atendimento de crianças e adolescentes com técnicas lúdicas e adaptadas para cada faixa etária.',
    specialties: ['Infantil', 'Adolescente'],
    times: ['10:00', '11:00', '14:00'],
  },
];
