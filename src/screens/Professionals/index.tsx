import { useMemo, useState } from 'react';
import { Search, Frown } from 'lucide-react';
import ProfessionalCard from './ProfessionalCard.tsx';
import { professionals as mockProfessionals } from './mockProfessionals.ts';
import type { Professional } from './mockProfessionals.ts';

export function Professionals() {
    const [query, setQuery] = useState('');
    const [specialty, setSpecialty] = useState('all');

        const specialties = useMemo(() => {
            const set = new Set<string>();
            mockProfessionals.forEach((p: Professional) => p.specialties.forEach((s: string) => set.add(s)));
            return ['all', ...Array.from(set)];
        }, []);

        const filtered = useMemo<Professional[]>(() => {
            return mockProfessionals.filter((p: Professional) => {
                const q = query.trim().toLowerCase();
                const matchesQuery =
                    q === '' ||
                    p.name.toLowerCase().includes(q) ||
                    p.bio.toLowerCase().includes(q) ||
                    p.specialties.some((s: string) => s.toLowerCase().includes(q));
                const matchesSpecialty = specialty === 'all' || p.specialties.includes(specialty);
                return matchesQuery && matchesSpecialty;
            });
        }, [query, specialty]);

    return (
        <section id="professionals-section" className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-blue-600 font-semibold">Nossos Profissionais</h2>
                    <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                        Conecte-se com profissionais especializados e qualificados. Encontre o
                        profissional ideal para suas necessidades.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
                    <div className="flex-1 w-full md:w-2/3">
                        <label className="relative block">
                            <span className="sr-only">Buscar</span>
                            <input
                                className="placeholder:italic placeholder:text-slate-400 block w-full bg-white border border-slate-200 rounded-lg py-3 pl-10 pr-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                                placeholder="Buscar por nome ou especialização..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400"><Search className="w-4 h-4" /></span>
                        </label>
                    </div>

                    <div className="w-full md:w-1/3">
                        <select
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-primary-300"
                        >
                            {specialties.map((s) => (
                                <option key={s} value={s}>
                                    {s === 'all' ? 'Todas as especializações' : s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    {filtered.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4">
                                <Frown className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum profissional encontrado</h3>
                            <p className="text-sm text-gray-500 mb-4">Tente alterar os filtros ou limpar a busca para ver mais profissionais.</p>
                            <div className="flex items-center justify-center gap-3">
                                <button onClick={() => { setQuery(''); setSpecialty('all'); }} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">Limpar filtros</button>
                                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-gray-700 px-4 py-2 rounded-md">Voltar ao topo</button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((p) => (
                                <ProfessionalCard key={p.id} professional={p} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
