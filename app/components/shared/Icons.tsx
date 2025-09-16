import React from 'react';
interface IconProps {
  path: string;
  className?: string;
}

const Icon = ({ path, className = "w-6 h-6" }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => <Icon path="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" className={className} />;
const DashboardIcon = () => <Icon path="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />;
const SparklesIcon = ({ className }: { className?: string }) => <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.197-.398a2.25 2.25 0 001.423-1.423l.398-1.197.398 1.197a2.25 2.25 0 001.423 1.423l1.197.398-1.197.398a2.25 2.25 0 00-1.423 1.423z" className={className} />;
const ChatBubbleIcon = () => <Icon path="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />;
const UserCircleIcon = () => <Icon path="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />;
const PlusIcon = ({ className }: { className?: string }) => <Icon path="M12 4.5v15m7.5-7.5h-15" className={className || "w-5 h-5"} />;
const SendIcon = () => <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5" />;
const XMarkIcon = ({ className }: { className?: string }) => <Icon path="M6 18L18 6M6 6l12 12" className={className} />;
const SunIcon = () => <Icon path="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />;
const MoonIcon = () => <Icon path="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />;
const TrashIcon = ({ className }: { className?: string }) => <Icon path="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.718c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" className={className} />;
const PencilSquareIcon = ({ className }: { className?: string }) => <Icon path="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.781a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className={className} />;
const Bars3Icon = () => <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />;
const Cog6ToothIcon = () => <Icon path="M9.594 3.94c.09-.542.56-.94 1.11-1.153L12 2.25l1.313.537c.55.213 1.02.611 1.11 1.153.09.54-.09 1.09-.537 1.313L12 5.79l-1.886-.537c-.447-.223-.627-.773-.537-1.313zM21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0zM14.625 12a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />;
const SettingsIcon = () => <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />;
const BellIcon = ({ className }: { className?: string }) => <Icon path="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" className={className} />;
const CheckIcon = ({ className }: { className?: string }) => <Icon path="M4.5 12.75l6 6 9-13.5" className={className} />;

// CreditWise Logo Components
const CreditWiseLogo = ({ className = "w-32 h-32", showText = true }: { className?: string; showText?: boolean }) => (
  <div className="flex flex-col items-center space-y-2">
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Credit Card */}
      <rect 
        x="30" 
        y="60" 
        width="120" 
        height="75" 
        rx="8" 
        ry="8" 
        fill="none" 
        stroke="#1e5f8b" 
        strokeWidth="4"
      />
      {/* Card stripe */}
      <rect 
        x="30" 
        y="75" 
        width="120" 
        height="8" 
        fill="#1e5f8b"
      />
      {/* Card chip */}
      <rect 
        x="45" 
        y="95" 
        width="20" 
        height="15" 
        rx="2" 
        ry="2" 
        fill="none" 
        stroke="#1e5f8b" 
        strokeWidth="2"
      />
      {/* Card numbers representation */}
      <rect x="45" y="115" width="8" height="3" fill="#1e5f8b" />
      <rect x="57" y="115" width="8" height="3" fill="#1e5f8b" />
      <rect x="69" y="115" width="8" height="3" fill="#1e5f8b" />
      <rect x="81" y="115" width="8" height="3" fill="#1e5f8b" />
      
      {/* Checkmark circle */}
      <circle 
        cx="140" 
        cy="140" 
        r="25" 
        fill="#1e5f8b"
      />
      {/* Checkmark */}
      <path 
        d="M130 140 L137 147 L150 130" 
        fill="none" 
        stroke="white" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
    
    {showText && (
      <div className="text-2xl font-bold text-[#1e5f8b] tracking-wide">
        CreditWise
      </div>
    )}
  </div>
);

const CreditWiseIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg 
    viewBox="0 0 200 200" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Credit Card */}
    <rect 
      x="30" 
      y="60" 
      width="120" 
      height="75" 
      rx="8" 
      ry="8" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    {/* Card stripe */}
    <rect 
      x="30" 
      y="75" 
      width="120" 
      height="8" 
      fill="currentColor"
    />
    {/* Card chip */}
    <rect 
      x="45" 
      y="95" 
      width="20" 
      height="15" 
      rx="2" 
      ry="2" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    />
    {/* Card numbers representation */}
    <rect x="45" y="115" width="8" height="3" fill="currentColor" />
    <rect x="57" y="115" width="8" height="3" fill="currentColor" />
    <rect x="69" y="115" width="8" height="3" fill="currentColor" />
    <rect x="81" y="115" width="8" height="3" fill="currentColor" />
    
    {/* Checkmark circle */}
    <circle 
      cx="140" 
      cy="140" 
      r="25" 
      fill="currentColor"
    />
    {/* Checkmark */}
    <path 
      d="M130 140 L137 147 L150 130" 
      fill="none" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export {
  Icon,
  CreditCardIcon,
  DashboardIcon,
  SparklesIcon,
  ChatBubbleIcon,
  UserCircleIcon,
  PlusIcon,
  SendIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  TrashIcon,
  PencilSquareIcon,
  Bars3Icon,
  Cog6ToothIcon,
  SettingsIcon,
  BellIcon,
  CheckIcon,
  CreditWiseLogo,
  CreditWiseIcon
};

