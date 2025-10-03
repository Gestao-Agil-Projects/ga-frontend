import { X } from "lucide-react";
import Modal from "react-modal";
import { professionals } from "../../../data/professionals";
import { type Appointment } from "../../../data/appointments";
import ButtonClose from "../../Buttons/ButtonClose";

interface ModalAppointmentProps {
    isOpen: boolean;
    onClose: () => void;
    onCancelAppointment: () => void;
    selectedAppointment: Appointment | null;
}

export function ModalAppointment({ 
    isOpen, 
    onClose, 
    onCancelAppointment, 
    selectedAppointment 
}: ModalAppointmentProps) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            {selectedAppointment && (
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-base font-semibold">Detalhes do Agendamento</h2>
                        <ButtonClose onClose={onClose} />
                    </div>
                
                    <div className="p-4 space-y-3">
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                            {selectedAppointment.time} - {professionals.find(p => p.id === selectedAppointment.professionalId)?.name}
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-gray-700 text-sm">Paciente</span>
                                    <span className="text-xs text-green-600 font-medium">Status</span>
                                </div>
                                <div className="text-gray-900 font-medium text-sm">{selectedAppointment.patientName}</div>
                                <div className="text-xs text-green-600 font-medium inline-flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                    Confirmado
                                </div>
                            </div>
                        
                            {selectedAppointment.phone && (
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-xs">📞</span>
                                        <span className="font-medium text-gray-700 text-xs">Telefone</span>
                                    </div>
                                    <div className="text-gray-900 text-sm">{selectedAppointment.phone}</div>
                                </div>
                            )}
                        
                            {selectedAppointment.email && (
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-xs">✉️</span>
                                        <span className="font-medium text-gray-700 text-xs">Email</span>
                                    </div>
                                    <div className="text-gray-900 text-sm">{selectedAppointment.email}</div>
                                </div>
                            )}
                        
                            <div>
                                <span className="font-medium text-gray-700 text-xs">Duração</span>
                                <div className="text-gray-900 text-sm">{selectedAppointment.duration} minutos</div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 pt-3">
                            <button
                                onClick={onCancelAppointment}
                                className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 font-medium transition-colors text-xs"
                            >
                                Cancelar Agendamento
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 font-medium transition-colors text-xs"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}
