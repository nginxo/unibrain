import React from 'react';
import { Database, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';
import { database } from '../services/databaseAdapter';

export const DatabaseStatus: React.FC = () => {
  const mode = database.getMode();
  
  if (import.meta.env.PROD) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed top-4 right-4 bg-slate-800 text-white p-3 rounded-lg shadow-lg z-50 max-w-xs">
      <div className="flex items-center space-x-2 mb-2">
        {mode === 'local' ? (
          <HardDrive className="w-4 h-4 text-blue-400" />
        ) : (
          <Database className="w-4 h-4 text-green-400" />
        )}
        <span className="text-sm font-semibold">Database</span>
      </div>
      
      <div className="text-xs space-y-1">
        {mode === 'local' ? (
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
            <div>
              <div className="font-medium">Locale (LocalStorage)</div>
              <div className="text-slate-300">
                Nessuna configurazione richiesta!
                <br />Dati memorizzati nel browser
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-3 h-3 text-green-400 mt-0.5" />
            <div>
              <div className="font-medium">Supabase Cloud</div>
              <div className="text-slate-300">
                Database configurato e connesso
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
