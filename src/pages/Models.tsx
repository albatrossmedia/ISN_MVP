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
import { Plus, Search } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const Models: React.FC = () => {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await api.get('/models');
      setModels(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load models');
      setModels([
        {
          id: '1',
          slug: 'whisper-large-v3',
          type: 'ASR',
          status: 'active',
          default_version: 'v3.0',
          owner_org: 'MySubtitle',
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          slug: 'subtitle-align-bert',
          type: 'NLP',
          status: 'active',
          default_version: 'v1.2',
          owner_org: 'MySubtitle',
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = async (formData: any) => {
    try {
      await api.post('/models', formData);
      toast.success('Model added successfully');
      setShowAddModal(false);
      fetchModels();
    } catch (error) {
      toast.error('Failed to add model');
    }
  };

  const openModelDetails = async (model: any) => {
    try {
      const response = await api.get(`/models/${model.slug}`);
      setSelectedModel(response.data);
      setShowDetailModal(true);
    } catch (error) {
      setSelectedModel(model);
      setShowDetailModal(true);
    }
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = model.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || model.type === filterType;
    return matchesSearch && matchesType;
  });

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Models</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your model registry and versions
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Model
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'ASR', label: 'ASR' },
              { value: 'NLP', label: 'NLP' },
              { value: 'Translation', label: 'Translation' },
            ]}
          />
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Model Name</TableCell>
              <TableCell header>Type</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Default Version</TableCell>
              <TableCell header>Owner</TableCell>
              <TableCell header>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredModels.map((model) => (
              <TableRow key={model.id} onClick={() => openModelDetails(model)}>
                <TableCell className="font-medium">{model.slug}</TableCell>
                <TableCell>{model.type}</TableCell>
                <TableCell>
                  <Badge variant={model.status === 'active' ? 'success' : 'warning'}>
                    {model.status}
                  </Badge>
                </TableCell>
                <TableCell>{model.default_version || 'N/A'}</TableCell>
                <TableCell>{model.owner_org}</TableCell>
                <TableCell>
                  {new Date(model.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredModels.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No models found
          </div>
        )}
      </Card>

      <AddModelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddModel}
      />

      {selectedModel && (
        <ModelDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          model={selectedModel}
          onUpdate={fetchModels}
        />
      )}
    </div>
  );
};

const AddModelModal: React.FC<any> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    slug: '',
    type: 'ASR',
    description: '',
    owner_org: 'MySubtitle',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ slug: '', type: 'ASR', description: '', owner_org: 'MySubtitle' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Model">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Model Slug"
          placeholder="e.g., whisper-large-v3"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
        <Select
          label="Model Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={[
            { value: 'ASR', label: 'ASR' },
            { value: 'NLP', label: 'NLP' },
            { value: 'Translation', label: 'Translation' },
          ]}
        />
        <Input
          label="Description"
          placeholder="Brief description of the model"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <Input
          label="Owner Organization"
          value={formData.owner_org}
          onChange={(e) => setFormData({ ...formData, owner_org: e.target.value })}
          required
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Model</Button>
        </div>
      </form>
    </Modal>
  );
};

const ModelDetailModal: React.FC<any> = ({ isOpen, onClose, model }) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Model Slug</h3>
            <p className="text-lg text-slate-900 dark:text-white mt-1">{model.slug}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Type</h3>
            <p className="text-lg text-slate-900 dark:text-white mt-1">{model.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</h3>
            <Badge variant={model.status === 'active' ? 'success' : 'warning'} className="mt-1">
              {model.status}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Description</h3>
            <p className="text-slate-900 dark:text-white mt-1">
              {model.description || 'No description available'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'versions',
      label: 'Versions',
      content: (
        <div className="text-slate-500 dark:text-slate-400">
          Version management coming soon...
        </div>
      ),
    },
    {
      id: 'datasets',
      label: 'Linked Datasets',
      content: (
        <div className="text-slate-500 dark:text-slate-400">
          No linked datasets
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={model.slug} size="lg">
      <Tabs tabs={tabs} />
    </Modal>
  );
};
