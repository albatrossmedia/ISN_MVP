import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Plus, Key, Copy, Eye, EyeOff, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { ApiKey } from '../types/auth';
import toast from 'react-hot-toast';

export const ApiKeyManagement: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newGeneratedKey, setNewGeneratedKey] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const query = isAdmin
        ? supabase
            .from('api_keys')
            .select('*')
            .eq('organization_id', user?.role?.organization_id || '')
        : supabase.from('api_keys').select('*').eq('user_id', user?.id || '');

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = (): string => {
    const prefix = 'sk_live_';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const hashApiKey = async (key: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleAddApiKey = async (formData: any) => {
    try {
      const fullKey = generateApiKey();
      const keyHash = await hashApiKey(fullKey);
      const keyPrefix = fullKey.substring(0, 12) + '...';

      const { error } = await supabase.from('api_keys').insert({
        user_id: user?.id,
        organization_id: user?.role?.organization_id,
        name: formData.name,
        key_prefix: keyPrefix,
        key_hash: keyHash,
        scope: formData.scope,
        rate_limit: parseInt(formData.rate_limit),
        expires_at: formData.expires_at || null,
        is_active: true,
      });

      if (error) throw error;

      setNewGeneratedKey(fullKey);
      setShowAddModal(false);
      setShowKeyModal(true);
      fetchApiKeys();
      toast.success('API key created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create API key');
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;

      toast.success('API key deactivated');
      fetchApiKeys();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400 mt-1">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Create API Key
        </Button>
      </div>

      <Card className="p-6 bg-blue-500/10 border-blue-400/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-400 mb-1">Security Notice</h3>
            <p className="text-sm text-gray-300">
              API keys provide full access to your account. Keep them secure and never share them in publicly
              accessible areas. You can only view the full key once during creation.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        {apiKeys.length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No API keys yet</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Key
            </Button>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Name</TableCell>
                <TableCell header>Key</TableCell>
                <TableCell header>Scope</TableCell>
                <TableCell header>Rate Limit</TableCell>
                <TableCell header>Last Used</TableCell>
                <TableCell header>Status</TableCell>
                <TableCell header>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <div className="font-medium text-white">{key.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs text-gray-300">
                        {visibleKeys.has(key.id) ? key.key_prefix : '••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        {visibleKeys.has(key.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {key.scope.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{key.rate_limit.toLocaleString()}/hr</TableCell>
                  <TableCell>
                    {key.last_used_at
                      ? new Date(key.last_used_at).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={key.is_active ? 'success' : 'danger'}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteKey(key.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <AddApiKeyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddApiKey}
      />

      <ShowNewKeyModal
        isOpen={showKeyModal}
        onClose={() => {
          setShowKeyModal(false);
          setNewGeneratedKey('');
        }}
        apiKey={newGeneratedKey}
      />
    </div>
  );
};

const AddApiKeyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    scope: ['read'],
    rate_limit: '1000',
    expires_at: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', scope: ['read'], rate_limit: '1000', expires_at: '' });
  };

  const toggleScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      scope: prev.scope.includes(scope)
        ? prev.scope.filter(s => s !== scope)
        : [...prev.scope, scope],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create API Key">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Key Name"
          placeholder="Production Key"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Permissions
          </label>
          <div className="space-y-2">
            {['read', 'write', 'delete'].map((scope) => (
              <label key={scope} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.scope.includes(scope)}
                  onChange={() => toggleScope(scope)}
                  className="rounded border-gray-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300 capitalize">{scope}</span>
              </label>
            ))}
          </div>
        </div>

        <Input
          type="number"
          label="Rate Limit (requests/hour)"
          value={formData.rate_limit}
          onChange={(e) => setFormData({ ...formData, rate_limit: e.target.value })}
          required
        />

        <Input
          type="date"
          label="Expiration Date (optional)"
          value={formData.expires_at}
          onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Key</Button>
        </div>
      </form>
    </Modal>
  );
};

const ShowNewKeyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}> = ({ isOpen, onClose, apiKey }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your New API Key">
      <div className="space-y-4">
        <div className="p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-400 mb-1">
                Save This Key Now
              </h4>
              <p className="text-sm text-gray-300">
                This is the only time you'll see the full API key. Make sure to copy it now and store it securely.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">API Key</label>
            <Button size="sm" variant="ghost" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
          <code className="block text-sm text-green-400 font-mono break-all">
            {apiKey}
          </code>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>I've Saved My Key</Button>
        </div>
      </div>
    </Modal>
  );
};
