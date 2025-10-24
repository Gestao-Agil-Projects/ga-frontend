export function Footer() {
    return (
        <footer className="bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-primary mb-4">
                            Calm Mind
                        </h3>
                        <p className="text-neutral-19 text-sm leading-relaxed">
                            Conectando pessoas a profissionais de psicologia qualificados para promover saúde mental e bem-estar emocional.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-primary mb-4">
                            Links Úteis
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-neutral-19 text-sm hover:text-primary transition-colors">
                                    Início
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-neutral-19 text-sm hover:text-primary transition-colors">
                                    Profissionais
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-neutral-19 text-sm hover:text-primary transition-colors">
                                    Sobre
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-neutral-19 text-sm hover:text-primary transition-colors">
                                    Contato
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-primary mb-4">
                            Contato
                        </h3>
                        <div className="space-y-2">
                            <p className="text-neutral-19 text-sm">
                                contato@calmmind.com.br
                            </p>
                            <p className="text-neutral-19 text-sm">
                                (11) 9999-9999
                            </p>
                            <p className="text-neutral-19 text-sm">
                                São Paulo, SP
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-17 my-8"></div>

                <div className="text-center">
                    <p className="text-neutral-19 text-sm">
                        © 2025 Calm Mind. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
