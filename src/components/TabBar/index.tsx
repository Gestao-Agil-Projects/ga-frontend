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
    activeTabClassName = "text-[var(--color-primary)]",
    inactiveTabClassName = "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]",
    indicatorClassName = "bg-[var(--color-surface)] shadow-sm border border-[var(--color-primary-lighter)]"
}: TabBarProps) {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const tabWidth = 100 / tabs.length;

    return (
        <div className={className}>
            <div className="relative flex rounded-full p-1 bg-[rgba(125,212,220,0.18)]">
                <div 
                    className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out z-0 ${indicatorClassName}`}
                    style={{
                        left: `${activeIndex * tabWidth + 0.5}%`,
                        width: `${tabWidth - 1}%`
                    }}
                />
                
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 py-1 px-4 text-sm font-medium transition-all duration-300 z-10 flex items-center justify-center rounded-full ${
                            activeTab === tab.id
                                ? activeTabClassName
                                : inactiveTabClassName
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
