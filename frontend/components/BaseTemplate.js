// components/BaseTemplate.js
import Link from 'next/link';
import Sidepanel from './Sidepanel';

export default function BaseTemplate({ children }) {
  return (
    <div className="base-container">
      {/* Side Panel */}
      <Sidepanel />

      {/* Main Content */}
      <div className="drr-main">
        {children}
      </div>
    </div>
  );
}
