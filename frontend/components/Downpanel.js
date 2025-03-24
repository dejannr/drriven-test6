import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Downpanel({ profile, profileLoading }) {
  const { status } = useSession();
  // Set default selection to 'hideBoth'
  const [selectedButton, setSelectedButton] = useState('hideBoth');

  // Listen for the custom event to select the middle button.
  useEffect(() => {
    const handleDownpanelSelectMiddle = () => {
      setSelectedButton('hideBoth');
    };

    document.addEventListener('downpanelSelectMiddle', handleDownpanelSelectMiddle);

    return () => {
      document.removeEventListener('downpanelSelectMiddle', handleDownpanelSelectMiddle);
    };
  }, []);

  const showSidepanelOnly = () => {
    const sidepanel = document.querySelector('.drr-sidepanel');
    const rightpanel = document.querySelector('.drr-rightpanel');
    if (sidepanel) sidepanel.classList.add('drr-mob-show');
    if (rightpanel) rightpanel.classList.remove('drr-mob-show');
    setSelectedButton('sidepanel');
  };

  const hideBoth = () => {
    const sidepanel = document.querySelector('.drr-sidepanel');
    const rightpanel = document.querySelector('.drr-rightpanel');
    if (sidepanel) sidepanel.classList.remove('drr-mob-show');
    if (rightpanel) rightpanel.classList.remove('drr-mob-show');
    setSelectedButton('hideBoth');
  };

  const showRightpanelOnly = () => {
    const sidepanel = document.querySelector('.drr-sidepanel');
    const rightpanel = document.querySelector('.drr-rightpanel');
    if (sidepanel) sidepanel.classList.remove('drr-mob-show');
    if (rightpanel) rightpanel.classList.add('drr-mob-show');
    setSelectedButton('rightpanel');
  };

  if (status === "loading" || profileLoading) {
    return (
      <div className="drr-mob">
        <div className="drr-downpanel">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // Utility functions to compute classes.
  const getButtonClass = (buttonKey) =>
    selectedButton === buttonKey ? 'drr-downpanel-selected' : '';

  const getIconClass = (buttonKey, baseIcon) =>
    selectedButton === buttonKey ? `fa-solid ${baseIcon}` : `fa-regular ${baseIcon}`;

  return (
    <div className="drr-mob">
      <div className="drr-downpanel">
        <button className={getButtonClass('sidepanel')} onClick={showSidepanelOnly}>
          <i className={getIconClass('sidepanel', 'fa-compass')}></i>
        </button>
        <button className={getButtonClass('hideBoth')} onClick={hideBoth}>
          <i className={getIconClass('hideBoth', 'fa-square')}></i>
        </button>
        <button className={getButtonClass('rightpanel')} onClick={showRightpanelOnly}>
          <i className={getIconClass('rightpanel', 'fa-user')}></i>
        </button>
      </div>
    </div>
  );
}
