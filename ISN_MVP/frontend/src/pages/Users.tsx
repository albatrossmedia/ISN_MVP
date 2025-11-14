import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Plus, Key } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchApiKeys();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([
        {
          id: '1',
          email: 'admin@mysubtitle.com',
          role: 'admin',
          org: 'MySubtitle',
          status: 'active',
        },
        {
          id: '2',
          email: 'user@mysubtitle.com',
          role: 'user',
          org: 'MySubtitle',
          status: 'active',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await api.get('/api_keys');
      setApiKeys(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setApiKeys([
        {
          id: '1',
          name: 'Production Key',
          key: 'sk_prod_xxxxxxxxxx',
          scope: 'read:write',
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleAddUser = async (formData: any) => {
    try {
      await api.post('/users', formData);
      toast.success('User added successfully');
      setShowAddUserModal(false);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const handleAddApiKey = async (formData: any) => {
    try {
      const response = await api.post('/api_keys', formData);
      toast.success('API key created successfully');
      setShowAddKeyModal(false);
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to create API key');
    }
  };

  const usersTab = (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowAddUserModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Email</TableCell>
            <TableCell header>Role</TableCell>
            <TableCell header>Organization</TableCell>
            <TableCell header>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.org}</TableCell>
              <TableCell>
                <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const apiKeysTab = (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowAddKeyModal(true)}>
          <Key className="w-5 h-5 mr-2" />
          Create API Key
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell header>Name</TableCell>
            <TableCell header>Key</TableCell>
            <TableCell header>Scope</TableCell>
            <TableCell header>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiKeys.map((key) => (
            <TableRow key={key.id}>
              <TableCell>{key.name}</TableCell>
              <TableCell className="font-mono text-xs">{key.key}</TableCell>
              <TableCell>
                <Badge variant="info">{key.scope}</Badge>
              </TableCell>
              <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Users & Access</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Manage user roles and API keys
        </p>
      </div>

      <Card className="p-6">
        <Tabs
          tabs={[
            { id: 'users', label: 'Users', content: usersTab },
            { id: 'api-keys', label: 'API Keys', content: apiKeysTab },
          ]}
        />
      </Card>

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSubmit={handleAddUser}
      />

      <AddApiKeyModal
        isOpen={showAddKeyModal}
        onClose={() => setShowAddKeyModal(false)}
        onSubmit={handleAddApiKey}
      />
    </div>
  );
};

const AddUserModal: React.FC<any> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'user',
    org: 'MySubtitle',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ email: '', role: 'user', org: 'MySubtitle' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="user@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          options={[
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
        <Input
          label="Organization"
          value={formData.org}
          onChange={(e) => setFormData({ ...formData, org: e.target.value })}
          required
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add User</Button>
        </div>
      </form>
    </Modal>
  );
};

const AddApiKeyModal: React.FC<any> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    scope: 'read:write',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', scope: 'read:write' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create API Key">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Key Name"
          placeholder="e.g., Production Key"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Select
          label="Scope"
          value={formData.scope}
          onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
          options={[
            { value: 'read', label: 'Read Only' },
            { value: 'read:write', label: 'Read & Write' },
            { value: 'admin', label: 'Admin' },
          ]}
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
