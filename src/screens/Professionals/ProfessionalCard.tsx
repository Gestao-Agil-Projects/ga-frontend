import type { Professional } from './mockProfessionals';

export default function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <header className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {professional.avatarUrl ? (
            <img src={professional.avatarUrl} alt={professional.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">{professional.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{professional.name}</h3>
          <p className="text-sm text-gray-500">{professional.title}</p>
        </div>
      </header>

      <p className="text-sm text-gray-600 mt-4 line-clamp-4">{professional.bio}</p>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-2">Horários disponíveis:</p>
        <div className="flex flex-wrap gap-2">
          {professional.times.slice(0,4).map((t, idx) => (
            <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">{t}</span>
          ))}
          {professional.times.length > 4 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">+{professional.times.length - 4}</span>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4" type="button">📅 Agendar Consulta</button>
      </div>
    </article>
  );
}
