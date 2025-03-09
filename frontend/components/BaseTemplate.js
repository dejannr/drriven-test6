// components/BaseTemplate.js
import Link from 'next/link';
import Sidepanel from './Sidepanel';
import Rightpanel from './Rightpanel';


export default function BaseTemplate({ children }) {
  return (
    <div className="base-container">
      {/* Side Panel */}
      <Sidepanel />

      {/* Main Content */}
      <div className="drr-main">
        {children}
      </div>

        <Rightpanel/>
    </div>
  );
}
