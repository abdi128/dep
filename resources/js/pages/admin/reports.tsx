import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Download, FileText, FileDigit, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Reports() {
  const [exportType, setExportType] = useState<'csv' | 'json'>('csv');
  const [exportDataType, setExportDataType] = useState<'patients' | 'appointments' | 'billing'>('patients');
  const [isExporting, setIsExporting] = useState(false);

  const generateDummyData = () => {
    // Replace this with actual data fetching in a real implementation
    const data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        id: i + 1,
        name: `Item ${i + 1}`,
        date: new Date().toISOString().split('T')[0],
        value: Math.floor(Math.random() * 1000)
      });
    }
    return data;
  };

  const exportData = () => {
    setIsExporting(true);
    const data = generateDummyData();
    
    if (exportType === 'csv') {
      exportAsCSV(data);
    } else {
      exportAsJSON(data);
    }
    
    setIsExporting(false);
  };

  const exportAsCSV = (data: any[]) => {
    let csvContent = '';
    
    // Headers
    const headers = Object.keys(data[0]);
    csvContent += headers.join(',') + '\n';
    
    // Rows
    data.forEach(item => {
      csvContent += headers.map(header => item[header]).join(',') + '\n';
    });
    
    downloadFile(csvContent, 'text/csv', `${exportDataType}_export.csv`);
  };

  const exportAsJSON = (data: any[]) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'application/json', `${exportDataType}_export.json`);
  };

  const downloadFile = (content: string, mimeType: string, fileName: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Head title="Data Exports" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Data Export Center</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-medium">Data Type</label>
              <select 
                className="w-full p-2 border rounded"
                value={exportDataType}
                onChange={(e) => setExportDataType(e.target.value as any)}
              >
                <option value="patients">
                  <Users className="inline mr-2" size={16} />
                  Patients
                </option>
                <option value="appointments">
                  <Calendar className="inline mr-2" size={16} />
                  Appointments
                </option>
                <option value="billing">
                  <FileDigit className="inline mr-2" size={16} />
                  Billing
                </option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Export Format</label>
              <select 
                className="w-full p-2 border rounded"
                value={exportType}
                onChange={(e) => setExportType(e.target.value as any)}
              >
                <option value="csv">
                  <FileText className="inline mr-2" size={16} />
                  CSV
                </option>
                <option value="json">
                  <FileText className="inline mr-2" size={16} />
                  JSON
                </option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={exportData}
                disabled={isExporting}
                className="w-full"
              >
                <Download className="mr-2" size={16} />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Exports will include all available data for the selected type.</p>
            <p>For date-filtered exports, please contact support.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}