import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Search } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResource, setFilterResource] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/audits');
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
      setLogs([
        {
          id: '1',
          action: 'CREATE',
          resource: 'model',
          resource_id: 'whisper-large-v3',
          actor: 'admin@mysubtitle.com',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          action: 'UPDATE',
          resource: 'dataset',
          resource_id: 'indic-subtitle-corpus',
          actor: 'admin@mysubtitle.com',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          action: 'DELETE',
          resource: 'job',
          resource_id: 'job-003',
          actor: 'user@mysubtitle.com',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.resource_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResource = filterResource === 'all' || log.resource === filterResource;
    return matchesSearch && matchesResource;
  });

  const getActionVariant = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'info';
      case 'DELETE':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track all administrative actions and changes
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by resource or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            options={[
              { value: 'all', label: 'All Resources' },
              { value: 'model', label: 'Models' },
              { value: 'dataset', label: 'Datasets' },
              { value: 'job', label: 'Jobs' },
              { value: 'user', label: 'Users' },
            ]}
          />
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Action</TableCell>
              <TableCell header>Resource</TableCell>
              <TableCell header>Resource ID</TableCell>
              <TableCell header>Actor</TableCell>
              <TableCell header>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant={getActionVariant(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{log.resource}</TableCell>
                <TableCell className="font-mono text-xs">{log.resource_id}</TableCell>
                <TableCell>{log.actor}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No audit logs found
          </div>
        )}
      </Card>
    </div>
  );
};
