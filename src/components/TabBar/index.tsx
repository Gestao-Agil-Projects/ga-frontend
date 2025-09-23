interface TabOption {
    id: string;
    label: string;
}

interface TabBarProps {
    tabs: TabOption[];
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    className?: string;
    activeTabClassName?: string;
    inactiveTabClassName?: string;
    indicatorClassName?: string;
}

export default function TabBar({ 
    tabs, 
    activeTab, 
    setActiveTab,
    className = "relative mb-6",
    activeTabClassName = "text-gray-800",
    inactiveTabClassName = "text-gray-500 hover:text-gray-700",
    indicatorClassName = "bg-white shadow-sm"
}: TabBarProps) {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const tabWidth = 100 / tabs.length;

    return (
        <div className={className}>
            <div className="flex bg-gray-200 rounded-full p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 py-1 px-4 text-sm font-medium transition-all duration-300 z-10 flex items-center justify-center ${
                            activeTab === tab.id
                                ? activeTabClassName
                                : inactiveTabClassName
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            {/* Indicador Animado */}
            <div 
                className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out z-0 ${indicatorClassName}`}
                style={{
                    left: `${activeIndex * tabWidth + 0.5}%`,
                    right: `${100 - (activeIndex + 1) * tabWidth + 0.5}%`
                }}
            />
        </div>
    );
}