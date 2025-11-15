import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Table, TableHead, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Plus, Building2, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Organization } from '../types/auth';
import toast from 'react-hot-toast';

export const Organizations: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchOrganizations();
    } else {
      setLoading(false);
    }
  }, [isSuperAdmin]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrganization = async (formData: any) => {
    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
      const { error } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          slug,
          plan: formData.plan,
          quota_minutes: parseInt(formData.quota_minutes),
          status: formData.status,
        });

      if (error) throw error;

      toast.success('Organization created successfully');
      setShowAddModal(false);
      fetchOrganizations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create organization');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'trial':
        return 'info';
      case 'suspended':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'unlimited':
        return 'success';
      case 'enterprise':
        return 'info';
      case 'professional':
        return 'primary';
      case 'starter':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            You don't have permission to access this page.
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalQuota = organizations.reduce((sum, org) => sum + org.quota_minutes, 0);
  const totalUsed = organizations.reduce((sum, org) => sum + org.used_minutes, 0);
  const activeOrgs = organizations.filter(org => org.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Organizations</h1>
          <p className="text-gray-400 mt-1">
            Manage organizations and their quotas
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Organization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Organizations</p>
              <p className="text-3xl font-bold text-white">{organizations.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Organizations</p>
              <p className="text-3xl font-bold text-white">{activeOrgs}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Usage Rate</p>
              <p className="text-3xl font-bold text-white">
                {totalQuota > 0 ? Math.round((totalUsed / totalQuota) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Name</TableCell>
              <TableCell header>Plan</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Quota</TableCell>
              <TableCell header>Used</TableCell>
              <TableCell header>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-white">{org.name}</div>
                    <div className="text-sm text-gray-400">{org.slug}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getPlanBadgeVariant(org.plan)}>
                    {org.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(org.status)}>
                    {org.status}
                  </Badge>
                </TableCell>
                <TableCell>{org.quota_minutes.toLocaleString()} min</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{
                            width: `${Math.min((org.used_minutes / org.quota_minutes) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 min-w-[80px]">
                      {org.used_minutes.toLocaleString()} min
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(org.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AddOrganizationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddOrganization}
      />
    </div>
  );
};

const AddOrganizationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    plan: 'trial',
    quota_minutes: '100',
    status: 'trial',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', plan: 'trial', quota_minutes: '100', status: 'trial' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Organization">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Organization Name"
          placeholder="Acme Corp"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <Select
          label="Plan"
          value={formData.plan}
          onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
          options={[
            { value: 'trial', label: 'Trial' },
            { value: 'starter', label: 'Starter' },
            { value: 'professional', label: 'Professional' },
            { value: 'enterprise', label: 'Enterprise' },
            { value: 'unlimited', label: 'Unlimited' },
          ]}
        />
        <Input
          type="number"
          label="Monthly Quota (minutes)"
          value={formData.quota_minutes}
          onChange={(e) => setFormData({ ...formData, quota_minutes: e.target.value })}
          required
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          options={[
            { value: 'trial', label: 'Trial' },
            { value: 'active', label: 'Active' },
            { value: 'suspended', label: 'Suspended' },
          ]}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Organization</Button>
        </div>
      </form>
    </Modal>
  );
};
