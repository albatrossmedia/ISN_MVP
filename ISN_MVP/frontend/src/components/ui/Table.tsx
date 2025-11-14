import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-slate-200 dark:divide-slate-700 ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHead: React.FC<TableProps> = ({ children }) => {
  return (
    <thead className="bg-slate-50 dark:bg-slate-900/50">
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableProps> = ({ children }) => {
  return (
    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
      {children}
    </tbody>
  );
};

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, onClick, className = '' }) => {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: React.ReactNode;
  header?: boolean;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, header = false, className = '' }) => {
  const Tag = header ? 'th' : 'td';
  const baseStyles = header
    ? 'px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider'
    : 'px-6 py-4 text-sm text-slate-900 dark:text-slate-100';

  return <Tag className={`${baseStyles} ${className}`}>{children}</Tag>;
};
