import { AlertCircle } from "lucide-react";

// Form Field Component
const FormField = ({ label, error, touched, children, required = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-gray-800">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && touched && (
      <div className="flex items-center gap-1 text-red-600 text-sm">
        <AlertCircle size={14} />
        {error}
      </div>
    )}
  </div>
);

export default FormField;