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

export const Datasets: React.FC = () => {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/datasets');
      setDatasets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      toast.error('Failed to load datasets');
      setDatasets([
        {
          id: '1',
          slug: 'indic-subtitle-corpus',
          type: 'subtitle',
          languages: ['hi', 'ta', 'te'],
          status: 'active',
          license: 'MIT',
          size_gb: 12.5,
        },
        {
          id: '2',
          slug: 'speech-alignment-dataset',
          type: 'speech',
          languages: ['hi', 'en'],
          status: 'active',
          license: 'Apache-2.0',
          size_gb: 8.3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDataset = async (formData: any) => {
    try {
      await api.post('/datasets', formData);
      toast.success('Dataset added successfully');
      setShowAddModal(false);
      fetchDatasets();
    } catch (error) {
      toast.error('Failed to add dataset');
    }
  };

  const openDatasetDetails = async (dataset: any) => {
    try {
      const response = await api.get(`/datasets/${dataset.slug}`);
      setSelectedDataset(response.data);
      setShowDetailModal(true);
    } catch (error) {
      setSelectedDataset(dataset);
      setShowDetailModal(true);
    }
  };

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.slug?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || dataset.languages?.includes(filterLanguage);
    return matchesSearch && matchesLanguage;
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Datasets</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and explore your datasets
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Dataset
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            options={[
              { value: 'all', label: 'All Languages' },
              { value: 'hi', label: 'Hindi' },
              { value: 'ta', label: 'Tamil' },
              { value: 'te', label: 'Telugu' },
              { value: 'en', label: 'English' },
            ]}
          />
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell header>Dataset Name</TableCell>
              <TableCell header>Type</TableCell>
              <TableCell header>Languages</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>License</TableCell>
              <TableCell header>Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDatasets.map((dataset) => (
              <TableRow key={dataset.id} onClick={() => openDatasetDetails(dataset)}>
                <TableCell className="font-medium">{dataset.slug}</TableCell>
                <TableCell>{dataset.type}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {dataset.languages?.slice(0, 3).map((lang: string) => (
                      <Badge key={lang} variant="info">{lang}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={dataset.status === 'active' ? 'success' : 'warning'}>
                    {dataset.status}
                  </Badge>
                </TableCell>
                <TableCell>{dataset.license || 'N/A'}</TableCell>
                <TableCell>{dataset.size_gb ? `${dataset.size_gb} GB` : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No datasets found
          </div>
        )}
      </Card>

      <AddDatasetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDataset}
      />

      {selectedDataset && (
        <DatasetDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          dataset={selectedDataset}
        />
      )}
    </div>
  );
};

const AddDatasetModal: React.FC<any> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    slug: '',
    type: 'subtitle',
    domain: 'general',
    license: 'MIT',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ slug: '', type: 'subtitle', domain: 'general', license: 'MIT' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Dataset">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Dataset Slug"
          placeholder="e.g., indic-subtitle-corpus"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
        <Select
          label="Dataset Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          options={[
            { value: 'subtitle', label: 'Subtitle' },
            { value: 'speech', label: 'Speech' },
            { value: 'text', label: 'Text' },
          ]}
        />
        <Input
          label="Domain"
          placeholder="e.g., general, medical, legal"
          value={formData.domain}
          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
        />
        <Select
          label="License"
          value={formData.license}
          onChange={(e) => setFormData({ ...formData, license: e.target.value })}
          options={[
            { value: 'MIT', label: 'MIT' },
            { value: 'Apache-2.0', label: 'Apache 2.0' },
            { value: 'CC-BY-4.0', label: 'CC BY 4.0' },
          ]}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Dataset</Button>
        </div>
      </form>
    </Modal>
  );
};

const DatasetDetailModal: React.FC<any> = ({ isOpen, onClose, dataset }) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Dataset Slug</h3>
            <p className="text-lg text-slate-900 dark:text-white mt-1">{dataset.slug}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Type</h3>
            <p className="text-lg text-slate-900 dark:text-white mt-1">{dataset.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Languages</h3>
            <div className="flex gap-2 mt-1">
              {dataset.languages?.map((lang: string) => (
                <Badge key={lang} variant="info">{lang}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">License</h3>
            <p className="text-slate-900 dark:text-white mt-1">{dataset.license || 'N/A'}</p>
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
      id: 'datasheet',
      label: 'Datasheet',
      content: (
        <div className="text-slate-500 dark:text-slate-400">
          Datasheet information coming soon...
        </div>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dataset.slug} size="lg">
      <Tabs tabs={tabs} />
    </Modal>
  );
};
