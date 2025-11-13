"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import {
  Condition,
  ConditionGroup,
  ConditionField,
  ConditionOperator,
  LogicalOperator,
  FieldType,
  OPERATOR_LABELS,
  getOperatorsForFieldType,
  MEMBER_FIELDS,
  ATTENDANCE_FIELDS,
  GIVING_FIELDS,
} from '../types/trigger.types';

interface ConditionBuilderProps {
  value: ConditionGroup | null;
  onChange: (value: ConditionGroup) => void;
  availableFields?: ConditionField[];
}

export default function ConditionBuilder({
  value,
  onChange,
  availableFields = MEMBER_FIELDS,
}: ConditionBuilderProps) {
  // Initialize with empty group if null
  const conditionGroup = value || {
    id: generateId(),
    operator: LogicalOperator.AND,
    conditions: [],
  };

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: generateId(),
      field: availableFields[0]?.key || '',
      operator: ConditionOperator.EQUALS,
      value: '',
      fieldType: availableFields[0]?.type || FieldType.STRING,
    };

    onChange({
      ...conditionGroup,
      conditions: [...conditionGroup.conditions, newCondition],
    });
  };

  const handleAddGroup = () => {
    const newGroup: ConditionGroup = {
      id: generateId(),
      operator: LogicalOperator.AND,
      conditions: [],
    };

    onChange({
      ...conditionGroup,
      conditions: [...conditionGroup.conditions, newGroup],
    });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = conditionGroup.conditions.filter((_, i) => i !== index);
    onChange({
      ...conditionGroup,
      conditions: newConditions,
    });
  };

  const handleUpdateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = [...conditionGroup.conditions];
    const condition = newConditions[index] as Condition;
    newConditions[index] = { ...condition, ...updates };
    onChange({
      ...conditionGroup,
      conditions: newConditions,
    });
  };

  const handleUpdateGroup = (index: number, updates: Partial<ConditionGroup>) => {
    const newConditions = [...conditionGroup.conditions];
    const group = newConditions[index] as ConditionGroup;
    newConditions[index] = { ...group, ...updates };
    onChange({
      ...conditionGroup,
      conditions: newConditions,
    });
  };

  const handleToggleOperator = () => {
    onChange({
      ...conditionGroup,
      operator: conditionGroup.operator === LogicalOperator.AND
        ? LogicalOperator.OR
        : LogicalOperator.AND,
    });
  };

  return (
    <div className="space-y-4">
      {/* Group Operator Toggle */}
      {conditionGroup.conditions.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Match</span>
          <button
            type="button"
            onClick={handleToggleOperator}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              conditionGroup.operator === LogicalOperator.AND
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {conditionGroup.operator === LogicalOperator.AND ? 'ALL' : 'ANY'}
          </button>
          <span className="text-sm text-gray-600">of the following conditions:</span>
        </div>
      )}

      {/* Conditions List */}
      <div className="space-y-3">
        {conditionGroup.conditions.map((item, index) => {
          if ('field' in item) {
            // It's a Condition
            return (
              <ConditionRow
                key={item.id}
                condition={item}
                availableFields={availableFields}
                onUpdate={(updates) => handleUpdateCondition(index, updates)}
                onRemove={() => handleRemoveCondition(index)}
              />
            );
          } else {
            // It's a ConditionGroup (nested)
            return (
              <div key={item.id} className="ml-6 pl-4 border-l-2 border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Nested Group</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <ConditionBuilder
                  value={item}
                  onChange={(updated) => handleUpdateGroup(index, updated)}
                  availableFields={availableFields}
                />
              </div>
            );
          }
        })}
      </div>

      {/* Empty State */}
      {conditionGroup.conditions.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-sm text-gray-500 mb-3">No conditions added yet</p>
          <button
            type="button"
            onClick={handleAddCondition}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Add your first condition
          </button>
        </div>
      )}

      {/* Add Buttons */}
      {conditionGroup.conditions.length > 0 && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddCondition}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Condition
          </button>
          <button
            type="button"
            onClick={handleAddGroup}
            className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            Add Group
          </button>
        </div>
      )}
    </div>
  );
}

// Condition Row Component
interface ConditionRowProps {
  condition: Condition;
  availableFields: ConditionField[];
  onUpdate: (updates: Partial<Condition>) => void;
  onRemove: () => void;
}

function ConditionRow({ condition, availableFields, onUpdate, onRemove }: ConditionRowProps) {
  const selectedField = availableFields.find(f => f.key === condition.field);
  const fieldType = selectedField?.type || FieldType.STRING;
  const availableOperators = getOperatorsForFieldType(fieldType);

  const handleFieldChange = (fieldKey: string) => {
    const field = availableFields.find(f => f.key === fieldKey);
    if (field) {
      const operators = getOperatorsForFieldType(field.type);
      onUpdate({
        field: fieldKey,
        fieldType: field.type,
        operator: operators[0], // Reset to first available operator
        value: '', // Reset value
      });
    }
  };

  const handleOperatorChange = (operator: ConditionOperator) => {
    onUpdate({ operator });
  };

  const handleValueChange = (value: any) => {
    onUpdate({ value });
  };

  return (
    <div className="flex items-start gap-2 p-3 bg-white border border-gray-200 rounded-lg">
      {/* Field Selector */}
      <select
        value={condition.field}
        onChange={(e) => handleFieldChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {availableFields.map((field) => (
          <option key={field.key} value={field.key}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator Selector */}
      <select
        value={condition.operator}
        onChange={(e) => handleOperatorChange(e.target.value as ConditionOperator)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {availableOperators.map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABELS[op]}
          </option>
        ))}
      </select>

      {/* Value Input */}
      {!needsNoValue(condition.operator) && (
        <ValueInput
          fieldType={fieldType}
          operator={condition.operator}
          value={condition.value}
          onChange={handleValueChange}
          options={selectedField?.options}
        />
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// Value Input Component
interface ValueInputProps {
  fieldType: FieldType;
  operator: ConditionOperator;
  value: any;
  onChange: (value: any) => void;
  options?: { value: string; label: string }[];
}

function ValueInput({ fieldType, operator, value, onChange, options }: ValueInputProps) {
  // For BETWEEN operator, we need two values
  if (operator === ConditionOperator.BETWEEN) {
    const [min, max] = Array.isArray(value) ? value : ['', ''];
    return (
      <div className="flex-1 flex gap-2">
        <input
          type={fieldType === FieldType.NUMBER ? 'number' : fieldType === FieldType.DATE ? 'date' : 'text'}
          value={min}
          onChange={(e) => onChange([e.target.value, max])}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Min"
        />
        <span className="text-gray-500 self-center">and</span>
        <input
          type={fieldType === FieldType.NUMBER ? 'number' : fieldType === FieldType.DATE ? 'date' : 'text'}
          value={max}
          onChange={(e) => onChange([min, e.target.value])}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Max"
        />
      </div>
    );
  }

  // For IN/NOT_IN operators with enum, show multi-select
  if ((operator === ConditionOperator.IN || operator === ConditionOperator.NOT_IN) && options) {
    return (
      <select
        multiple
        value={Array.isArray(value) ? value : []}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, option => option.value);
          onChange(selected);
        }}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        size={Math.min(options.length, 4)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // For enum fields, show dropdown
  if (fieldType === FieldType.ENUM && options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // For boolean fields, show checkbox
  if (fieldType === FieldType.BOOLEAN) {
    return (
      <div className="flex-1 flex items-center px-3">
        <input
          type="checkbox"
          checked={value === true || value === 'true'}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
    );
  }

  // Default input based on field type
  return (
    <input
      type={
        fieldType === FieldType.NUMBER ? 'number' :
        fieldType === FieldType.DATE ? 'date' :
        'text'
      }
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter value..."
    />
  );
}

// Helper Functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function needsNoValue(operator: ConditionOperator): boolean {
  return [
    ConditionOperator.IS_EMPTY,
    ConditionOperator.IS_NOT_EMPTY,
  ].includes(operator);
}
