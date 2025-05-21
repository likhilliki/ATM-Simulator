import { ReactNode, useEffect, useState } from "react";

interface ATMLayoutProps {
  children: ReactNode;
  title?: string;
}

export function ATMLayout({ children, title = "SecureBank ATM" }: ATMLayoutProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="atm-casing p-4 md:p-8 max-w-4xl mx-auto mt-8 mb-8 bg-white rounded-xl shadow-lg">
      <div className="atm-header flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-3xl mr-2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h5"/></svg>
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
        </div>
        <div id="time-display" className="text-gray-500">
          {formatTime()}
        </div>
      </div>
      
      <div className="screen-container bg-white rounded-lg shadow-md p-6 relative fade-in">
        {children}
      </div>
    </div>
  );
}
