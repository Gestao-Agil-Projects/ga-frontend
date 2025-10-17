import editIcon from "../../assets/editIcon.svg";
import padlockIcon from "../../assets/padlockIcon.svg";
import trashIcon from "../../assets/trashIcon.svg";

interface ProfessionalCardProps {
  name: string;
  specialty: string;
  photoUrl?: string;
  consultationsCount?: number;
}

export default function ProfessionalCard({
  name,
  specialty,
  photoUrl,
}: ProfessionalCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start gap-[14px] max-w-[544.5px] max-h-[164.35px]">
      <div className=" flex gap-4 items-center">
        <img
          src={
            photoUrl ||
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
          }
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Dr. Antônio Costa
          </h3>
          <p className="text-sm text-gray-500">Psicologia Clínica</p>
          <p className="text-sm text-gray-500 mt-1">5 consultas hoje</p>
        </div>
      </div>

      <div className="flex gap-[7px] w-full">
        <button
          className="bg-[#F0ECE6] border border-black/10 text-black rounded px-4 py-1 max-w-[227.7px] h-28px flex-1 flex items-center justify-center gap-2"
          style={{ width: "100%", height: "28px" }}
        >
          <img src={editIcon} alt="editar" className="w-5 h-5" />
          Editar
        </button>

        <button
          className="bg-[#7BB3F0] border border-black/10 text-black rounded px-4 py-1 max-w-[227.7px] h-28px flex-1 flex items-center justify-center gap-2"
          style={{ width: "100%", height: "28px" }}
        >
          <img src={padlockIcon} alt="bloquear" className="w-5 h-5" />
          Bloquear
        </button>

        <button
          className="bg-[#D4183D] rounded max-h-[28px] flex items-center justify-center "
          style={{ width: "31.5px", height: "28px" }}
        >

          <img src={trashIcon} alt="lixo" className="w-5 h-5" />

        </button>
      </div>
    </div>
  );
}
