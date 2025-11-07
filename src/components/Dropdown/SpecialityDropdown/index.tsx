import { createPortal } from "react-dom";
import { Search } from "lucide-react";

interface SpecialityDropdownProps {
    isVisible: boolean;
    position: { top: number; left: number; width: number };
    isLoadingSpecialities: boolean;
    filteredSpecialities: Array<{ id: string; title: string }>;
    specialities?: string[];
    editingId?: string | null;
    editingTitle?: string;
    setEditingTitle?: (title: string) => void;
    handleSaveEdit?: (id: string) => void;
    handleCancelEdit?: () => void;
    handleEditSpeciality?: (speciality: any) => void;
    handleSpecialitySelect?: (id: string) => void;
    capitalizeFirstLetter?: (str: string) => string;
    showEditButtons?: boolean;
}

export function SpecialityDropdown({
    isVisible,
    position,
    isLoadingSpecialities,
    filteredSpecialities,
    specialities = [],
    editingId,
    editingTitle,
    setEditingTitle,
    handleSaveEdit,
    handleCancelEdit,
    handleEditSpeciality,
    handleSpecialitySelect,
    capitalizeFirstLetter,
    showEditButtons = false
}: SpecialityDropdownProps) {
    if (!isVisible) return null;

    return createPortal(
        <div 
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] custom-scrollbar"
            style={{
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: '120px',
                overflowY: filteredSpecialities.length > 3 ? 'auto' : 'hidden',
                borderRadius: '8px',
                margin: 0,
                padding: 0
            }}
        >
            {isLoadingSpecialities ? (
                <div className="text-center py-4">
                    <div className="text-sm text-gray-600">Carregando especialidades...</div>
                </div>
            ) : filteredSpecialities.length === 0 ? (
                <div className="text-center py-4">
                    <Search className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <div className="text-gray-600 font-medium">Nenhuma especialidade encontrada</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Tente outro termo de busca
                    </div>
                </div>
            ) : (
                <div className="py-1">
                    {filteredSpecialities.map((speciality) => (
                        <div
                            key={speciality.id}
                            className="relative group"
                        >
                            {showEditButtons && editingId === speciality.id ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-neutral-50 h-10">
                                    <input
                                        type="text"
                                        value={editingTitle || ''}
                                        onChange={(e) => setEditingTitle?.(e.target.value)}
                                        className="flex-1 px-2 py-1 rounded text-sm bg-white focus:outline-none h-7"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit?.(speciality.id);
                                            if (e.key === 'Escape') handleCancelEdit?.();
                                        }}
                                    />
                                    <button
                                        onClick={() => handleSaveEdit?.(speciality.id)}
                                        className="p-1 text-green-600 rounded h-7 w-7 flex items-center justify-center"
                                        title="Salvar"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="p-1 text-red-600 rounded h-7 w-7 flex items-center justify-center"
                                        title="Cancelar"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleSpecialitySelect?.(speciality.id)}
                                >
                                    <span className="text-sm text-gray-900 font-medium">
                                        {capitalizeFirstLetter ? capitalizeFirstLetter(speciality.title) : speciality.title}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {specialities.includes(speciality.id) && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                        {showEditButtons && handleEditSpeciality && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditSpeciality(speciality);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-opacity"
                                                title="Editar especialidade"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>,
        document.body
    );
}
