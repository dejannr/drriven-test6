import { useSession } from 'next-auth/react';

export default function Downpanel({ profile, profileLoading }) {
  const { status } = useSession();

  const showSidepanelOnly = () => {
    const sidepanel = document.querySelector('.drr-sidepanel');
    const rightpanel = document.querySelector('.drr-rightpanel');
    if (sidepanel) sidepanel.classList.add('drr-mob-show');
    if (rightpanel) rightpanel.classList.remove('drr-mob-show');
  };

  const hideBoth = () => {
    const sidepanel = document.querySelector('.drr-sidepanel');
    const rightpanel = document.querySelector('.drr-rightpanel');
    if (sidepanel) sidepanel.classList.remove('drr-mob-show');
    if (rightpanel) rightpanel.classList.remove('drr-mob-show');
  };

  const showRightpanelOnly = () => {
    const sidepanel = document.querySelector('.drr-sidepanel');
    const rightpanel = document.querySelector('.drr-rightpanel');
    if (sidepanel) sidepanel.classList.remove('drr-mob-show');
    if (rightpanel) rightpanel.classList.add('drr-mob-show');
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

  return (
    <div className="drr-mob">
      <div className="drr-downpanel">
        <button onClick={showSidepanelOnly}>Show Sidepanel</button>
        <button onClick={hideBoth}>Hide Both</button>
        <button onClick={showRightpanelOnly}>Show Rightpanel</button>
      </div>
    </div>
  );
}
