import logo from "../../assets/logo.png";


export function Footer() {
    return (
        <footer className="bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-center items-center ">
                    <div className="space-y-6">
                        <img src={logo} alt="Logo" className="w-[250px] h-[110px]" />
{ 
                        }
                    </div>

                    <div className="h-full">
                        <h3 className="text-xl font-bold text-BLUE2 mb-4">
                            Links Úteis
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-[#4A4A4A] text-sm hover:text-BLUE2 transition-colors">
                                    Início
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#4A4A4A] text-sm hover:text-BLUE2 transition-colors">
                                    Profissionais
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#4A4A4A] text-sm hover:text-BLUE2 transition-colors">
                                    Sobre
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[#4A4A4A] text-sm hover:text-BLUE2 transition-colors">
                                    Contato
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="h-full">
                        <h3 className="text-xl font-bold text-BLUE2 mb-4">
                            Contato
                        </h3>
                        <div className="space-y-2">
                            <p className="text-[#4A4A4A] text-sm">
                                contato@calmmind.com.br
                            </p>
                            <p className="text-[#4A4A4A] text-sm">
                                (11) 9999-9999
                            </p>
                            <p className="text-[#4A4A4A] text-sm">
                                São Paulo, SP
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#E0E0E0] my-8"></div>

                <div className="text-center">
                    <p className="text-[#4A4A4A] text-sm">
                        © 2025 Viva Espaço Terapêutico. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
