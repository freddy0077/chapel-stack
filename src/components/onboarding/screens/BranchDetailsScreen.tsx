import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@tremor/react';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@apollo/client';
import { CREATE_BRANCH } from '../../../graphql/mutations/branchMutations';
import { CREATE_BRANCH_ADMIN } from '../../../graphql/mutations/branchAdminMutations';
import { CREATE_BRANCH_SETTING } from '../../../graphql/mutations/branchSettingsMutations';
import { saveOnboardingStepData } from '../utils/onboardingStorage';
import { markScreenCompleted } from '../utils/completedScreens';
import { humanizeError } from '@/utils/humanizeError';

// Static IANA time zones (shortened for brevity, can be expanded as needed)
const timezones: string[] = [
  'Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers',
  'Africa/Asmara', 'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul',
  'Africa/Bissau', 'Africa/Blantyre', 'Africa/Brazzaville', 'Africa/Bujumbura',
  'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry',
  'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala',
  'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare',
  'Africa/Johannesburg', 'Africa/Juba', 'Africa/Kampala', 'Africa/Khartoum',
  'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos', 'Africa/Libreville',
  'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka',
  'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane',
  'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena',
  'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo',
  'Africa/Sao_Tome', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek',
  'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua',
  'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca',
  'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja',
  'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta',
  'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman',
  'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Atikokan',
  'America/Bahia', 'America/Bahia_Banderas', 'America/Barbados', 'America/Belem',
  'America/Belize', 'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota',
  'America/Boise', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun',
  'America/Caracas', 'America/Cayenne', 'America/Cayman', 'America/Chicago',
  'America/Chihuahua', 'America/Costa_Rica', 'America/Creston', 'America/Cuiaba',
  'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek',
  'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton',
  'America/Eirunepe', 'America/El_Salvador', 'America/Fort_Nelson', 'America/Fortaleza',
  'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk',
  'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil',
  'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo',
  'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo',
  'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay',
  'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Inuvik',
  'America/Iqaluit', 'America/Jamaica', 'America/Juneau', 'America/Kentucky/Louisville',
  'America/Kentucky/Monticello', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles',
  'America/Lower_Princes', 'America/Maceio', 'America/Managua', 'America/Manaus',
  'America/Marigot', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan',
  'America/Menominee', 'America/Merida', 'America/Metlakatla', 'America/Mexico_City',
  'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo',
  'America/Montserrat', 'America/Nassau', 'America/New_York', 'America/Nipigon',
  'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah', 'America/North_Dakota/Center',
  'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama', 'America/Pangnirtung',
  'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain',
  'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas', 'America/Rainy_River',
  'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute',
  'America/Rio_Branco', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo',
  'America/Sao_Paulo', 'America/Scoresbysund', 'America/Sitka', 'America/St_Barthelemy',
  'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas',
  'America/St_Vincent', 'America/Swift_Current', 'America/Tegucigalpa', 'America/Thule',
  'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Tortola',
  'America/Vancouver', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat',
  'America/Yellowknife', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville',
  'Antarctica/Macquarie', 'Antarctica/Mawson', 'Antarctica/Palmer', 'Antarctica/Rothera',
  'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok', 'Arctic/Longyearbyen',
  'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe',
  'Asia/Ashgabat', 'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok',
  'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Chita', 'Asia/Choibalsan',
  'Asia/Colombo', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe',
  'Asia/Famagusta', 'Asia/Gaza', 'Asia/Hebron', 'Asia/Ho_Chi_Minh', 'Asia/Hong_Kong',
  'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul',
  'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Khandyga', 'Asia/Kolkata',
  'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macau',
  'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novokuznetsk',
  'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang',
  'Asia/Qatar', 'Asia/Qostanay', 'Asia/Qyzylorda', 'Asia/Riyadh', 'Asia/Sakhalin', 'Asia/Samarkand',
  'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent',
  'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ulaanbaatar',
  'Asia/Urumqi', 'Asia/Ust-Nera', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yangon',
  'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary',
  'Atlantic/Cape_Verde', 'Atlantic/Faroe', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia',
  'Atlantic/St_Helena', 'Atlantic/Stanley', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill',
  'Australia/Currie', 'Australia/Darwin', 'Australia/Eucla', 'Australia/Hobart', 'Australia/Lindeman',
  'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam',
  'Europe/Andorra', 'Europe/Astrakhan', 'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Bratislava',
  'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Busingen', 'Europe/Chisinau', 'Europe/Copenhagen',
  'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 'Europe/Istanbul',
  'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Kirov', 'Europe/Lisbon', 'Europe/Ljubljana',
  'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk',
  'Europe/Monaco', 'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague',
  'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Saratov',
  'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane',
  'Europe/Ulyanovsk', 'Europe/Uzhgorod', 'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius',
  'Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zaporozhye', 'Europe/Zurich', 'Indian/Antananarivo',
  'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe',
  'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Pacific/Apia', 'Pacific/Auckland',
  'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Chuuk', 'Pacific/Easter', 'Pacific/Efate', 'Pacific/Enderbury',
  'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal',
  'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Kanton', 'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein',
  'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk',
  'Pacific/Noumea', 'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Pohnpei', 'Pacific/Port_Moresby',
  'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Wake',
  'Pacific/Wallis', 'UTC'
];

const countryOptions = [
  '', 'United States', 'Canada', 'United Kingdom', 'Australia', 'Ghana', 'Nigeria', 'South Africa', 'Kenya', 'Germany', 'France', 'India', 'China', 'Japan', 'Brazil', 'Mexico', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'New Zealand', 'Ireland', 'Singapore', 'Malaysia', 'Philippines', 'South Korea', 'Indonesia', 'Turkey', 'Egypt', 'Morocco', 'UAE', 'Saudi Arabia', 'Israel', 'Pakistan', 'Bangladesh', 'Poland', 'Russia', 'Ukraine', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Thailand', 'Vietnam', 'Other'
];

export interface BranchAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface BranchSettingsInput {
  timezone: string;
}

export interface BranchDetailsInput {
  branchName: string;
  address: string;
  status: string;
  establishedDate: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  modules: string[];
  admin: BranchAdminInput;
  settings: BranchSettingsInput;
}

interface BranchDetailsScreenProps {
  branches: BranchDetailsInput[];
  setBranches: (branches: BranchDetailsInput[]) => void;
  moduleOptions: string[];
  currencyOptions: string[];
  onNext?: () => void;
}

const BranchDetailsScreen: React.FC<BranchDetailsScreenProps> = ({
  branches,
  setBranches,
  moduleOptions,
  currencyOptions,
  onNext,
}) => {
  const [openIdx, setOpenIdx] = useState(0);
  // Track expanded section for each branch: 'primary' | 'admin' | 'settings' | 'done'
  const [expandedSection, setExpandedSection] = useState<('primary'|'admin'|'settings'|'done')[]>(
    Array.from({ length: branches.length }, () => 'primary')
  );

  // Field handlers
  const handleBranchChange = (idx: number, field: keyof BranchDetailsInput, value: string) => {
    setBranches(prev => {
      if (!Array.isArray(prev) || typeof prev[0] !== 'object') {
        console.error('setBranches called with invalid value', prev);
        return prev;
      }
      const newBranches = prev.map((b, i) =>
        i === idx ? { ...b, [field]: value } : b
      );
      console.log('setBranches', newBranches);
      return newBranches;
    });
  };

  const handleAdminChange = (idx: number, field: keyof BranchAdminInput, value: string) => {
    setBranches(prev =>
      prev.map((b, i) =>
        i === idx ? { ...b, admin: { ...b.admin, [field]: value } } : b
      )
    );
  };

  const handleSettingsChange = (idx: number, field: keyof BranchSettingsInput, value: string) => {
    setBranches(prev =>
      prev.map((b, i) =>
        i === idx ? { ...b, settings: { ...b.settings, [field]: value } } : b
      )
    );
  };

  const handleModuleToggle = (idx: number, module: string) => {
    setBranches(prev =>
      prev.map((b, i) =>
        i === idx
          ? { ...b, modules: b.modules.includes(module)
              ? b.modules.filter(m => m !== module)
              : [...b.modules, module] }
          : b
      )
    );
  };

  // Save state for UI feedback
  const [primarySaved, setPrimarySaved] = useState<boolean[]>(
    Array.from({ length: branches.length }, () => false)
  );
  const [primaryLoading, setPrimaryLoading] = useState<boolean[]>(
    Array.from({ length: branches.length }, () => false)
  );
  const [primaryError, setPrimaryError] = useState<(string | null)[]>(
    Array.from({ length: branches.length }, () => null)
  );
  const [adminSaved, setAdminSaved] = useState<boolean[]>(
    Array.from({ length: branches.length }, () => false)
  );
  const [adminLoading, setAdminLoading] = useState<boolean[]>(
    Array.from({ length: branches.length }, () => false)
  );
  const [adminError, setAdminError] = useState<(string | null)[]>(
    Array.from({ length: branches.length }, () => null)
  );
  const [settingsSaved, setSettingsSaved] = useState<boolean[]>(
    Array.from({ length: branches.length }, () => false)
  );
  const [settingsLoading, setSettingsLoading] = useState<boolean[]>(
    Array.from({ length: branches.length }, () => false)
  );
  const [settingsError, setSettingsError] = useState<(string | null)[]>(
    Array.from({ length: branches.length }, () => null)
  );

  // Store branchIds after creation (null if not yet created)
  const [branchIds, setBranchIds] = useState<(string | null)[]>(
    Array.from({ length: branches.length }, () => null)
  );

  // CREATE_BRANCH mutation
  const [createBranch] = useMutation(CREATE_BRANCH);
  // CREATE_BRANCH_ADMIN mutation
  const [createBranchAdmin] = useMutation(CREATE_BRANCH_ADMIN);

  // Save primary details (API)
  const handleSavePrimary = async (idx: number) => {
    setPrimaryLoading(prev => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
    setPrimaryError(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    const branch = branches[idx];
    const organisationId = typeof window !== 'undefined' ? localStorage.getItem('organisation_id') || '' : '';
    const input = {
      name: branch.branchName,
      address: branch.address,
      city: branch.city,
      state: '', // Optionally map if you add this field
      postalCode: '', // Optionally map if you add this field
      // country: branch.country,
      // email: branch.email,
      phoneNumber: branch.phone,
      // website: branch.website,
      isActive: branch.status === 'active',
      establishedAt: branch.establishedDate,
      organisationId,
    };
    try {
      const { data } = await createBranch({ variables: { input } });
      // Capture branchId from response
      const newBranchId = data?.createBranch?.id || null;
      setBranchIds(prev => {
        const updated = [...prev];
        updated[idx] = newBranchId;
        return updated;
      });
      setPrimarySaved(prev => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
      // After save, fold section and show check. Move to admin section.
      setExpandedSection(prev => {
        const updated = [...prev];
        updated[idx] = 'admin';
        return updated;
      });
      setTimeout(() => setPrimarySaved(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      }), 2000);
    } catch (error: unknown) {
      setPrimaryError(prev => {
        const updated = [...prev];
        let msg = 'An error occurred';
        if (error && typeof error === 'object' && 'graphQLErrors' in error && Array.isArray((error as any).graphQLErrors)) {
          msg = (error as any).graphQLErrors[0]?.message || (error as any).message || 'An error occurred';
        } else if (error instanceof Error) {
          msg = error.message;
        }
        updated[idx] = humanizeError(msg);
        return updated;
      });
    } finally {
      setPrimaryLoading(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    }
  };

  // Save admin (API integration)
  const handleSaveAdmin = async (idx: number) => {
    setAdminLoading(prev => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
    setAdminError(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    try {
      const branchId = branchIds[idx];
      if (!branchId) {
        throw new Error('Please save branch details first.');
      }
      const admin = branches[idx].admin;
      const organisationId = typeof window !== 'undefined' ? localStorage.getItem('organisation_id') || '' : '';
      const input = {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: admin.password,
        branchId,
        organisationId,
        // Optionally, role or other fields if required by backend
      };
      const { data } = await createBranchAdmin({ variables: { input } });
      if (!data?.createBranchAdmin?.user?.id) {
        throw new Error('Failed to create admin user.');
      }
      setAdminSaved(prev => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
      // After save, fold section and show check. Move to settings section.
      setExpandedSection(prev => {
        const updated = [...prev];
        updated[idx] = 'settings';
        return updated;
      });
      setTimeout(() => setAdminSaved(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      }), 2000);
    } catch (error: unknown) {
      setAdminError(prev => {
        const updated = [...prev];
        if (error instanceof Error) {
          updated[idx] = error.message;
        } else {
          updated[idx] = 'An unknown error occurred';
        }
        return updated;
      });
    } finally {
      setAdminLoading(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    }
  };

  // Save settings (API integration)
  const [createBranchSetting] = useMutation(CREATE_BRANCH_SETTING);
  const handleSaveSettings = async (idx: number) => {
    setSettingsLoading(prev => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
    setSettingsError(prev => {
      const updated = [...prev];
      updated[idx] = null;
      return updated;
    });
    try {
      const branchId = branchIds[idx];
      if (!branchId) {
        throw new Error('Please save branch details first.');
      }
      const settings = branches[idx].settings;
      const updates = [
        { key: 'modules', value: JSON.stringify(branches[idx].modules) },
      ];
      for (const { key, value } of updates) {
        await createBranchSetting({ variables: { input: { branchId, key, value } } });
      }
      setSettingsSaved(prev => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
      // After save, fold section and show check. If more branches, move to next branch.
      setExpandedSection(prev => {
        const updated = [...prev];
        updated[idx] = 'done';
        if (branches.length > idx + 1) {
          setOpenIdx(idx + 1);
        }
        return updated;
      });
    } catch (error: unknown) {
      setSettingsError(prev => {
        const updated = [...prev];
        let msg = 'An error occurred';
        if (error && typeof error === 'object' && 'graphQLErrors' in error && Array.isArray((error as any).graphQLErrors)) {
          msg = (error as any).graphQLErrors[0]?.message || (error as any).message || 'An error occurred';
        } else if (error instanceof Error) {
          msg = error.message;
        }
        updated[idx] = humanizeError(msg);
        return updated;
      });
    } finally {
      setSettingsLoading(prev => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    }
  };

  useEffect(() => {
    setExpandedSection(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || 'primary')
    );
    setPrimarySaved(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || false)
    );
    setPrimaryLoading(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || false)
    );
    setPrimaryError(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || null)
    );
    setAdminSaved(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || false)
    );
    setAdminLoading(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || false)
    );
    setAdminError(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || null)
    );
    setSettingsSaved(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || false)
    );
    setSettingsLoading(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || false)
    );
    setSettingsError(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || null)
    );
    setBranchIds(prev =>
      Array.from({ length: branches.length }, (_, i) => prev[i] || null)
    );
  }, [branches.length]);

  useEffect(() => {
    if (primarySaved.every(Boolean)) markScreenCompleted('BranchPrimaryDetails');
    if (adminSaved.every(Boolean)) markScreenCompleted('BranchAdmin');
    if (settingsSaved.every(Boolean)) markScreenCompleted('BranchSettings');
  }, [primarySaved, adminSaved, settingsSaved]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveOnboardingStepData('BranchDetails', { branches });
    onNext();
  };

  // Validation helpers
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone: string) {
    return /^\+?\d{7,15}$/.test(phone.replace(/\s+/g, ''));
  }

  // --- Validation logic for Primary Details ---
  const primaryValid = useMemo(() => branches.map(branch => {
    return !!branch.branchName &&
      !!branch.address &&
      !!branch.status &&
      !!branch.establishedDate &&
      !!branch.city &&
      !!branch.phone &&
      isValidPhone(branch.phone);
  }), [branches]);

  // Add validation for settings section
  const isValidSettings = (branch: BranchDetailsInput) => {
    // Optionally, require at least one module (uncomment if needed)
    // if (!branch.modules || branch.modules.length === 0) return false;
    return true;
  };

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      <div className="mb-8 text-center w-full max-w-screen-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Branch Setup</h2>
        <p className="text-gray-600">Fill in the details for each branch, create an admin, and configure modules and settings.</p>
      </div>
      <div className="flex flex-col gap-6 w-full max-w-screen-md mx-auto">
        {(branches ?? []).map((branch, idx) => (
          <div
            key={idx}
            className={`transition-all duration-300 shadow-xl rounded-2xl border border-gray-100 bg-gradient-to-br ${openIdx === idx ? 'from-indigo-100 to-white' : 'from-gray-50 to-white'} relative`}
          >
            <button
              type="button"
              // onClick={() => setOpenIdx(idx)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-t-2xl focus:outline-none ${openIdx === idx ? 'bg-gradient-to-r from-indigo-500/80 to-indigo-400/80 text-white' : 'bg-gray-100 text-gray-900'} transition-colors`}
              aria-expanded={openIdx === idx}
            >
              <BuildingOffice2Icon className="w-6 h-6" />
              <span className="font-bold text-lg">Branch {idx + 1} of {branches.length}</span>
              <span className="ml-auto text-sm font-semibold">{branch.branchName ? branch.branchName : 'Not named yet'}</span>
              <span className="ml-4 text-xs font-medium opacity-70">{openIdx === idx ? '▼' : '▶'}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${openIdx === idx ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
              <div className="p-6 md:p-8">
                {/* Primary Details */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">Primary Details</h3>
                    {expandedSection[idx] !== 'primary' && (
                      <CheckCircleIcon className="h-7 w-7 text-green-500" />
                    )}
                  </div>
                  {expandedSection[idx] === 'primary' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Branch Name</label>
                      <input
                        type="text"
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        value={branch.branchName || ''}
                        onChange={e => handleBranchChange(idx, 'branchName', e.target.value)}
                        required
                        placeholder="e.g. Downtown Assembly"
                      />
                      {!branch.branchName && <div className="text-red-500 text-xs mt-1">Branch name is required.</div>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Address</label>
                      <input
                        type="text"
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        value={branch.address || ''}
                        onChange={e => handleBranchChange(idx, 'address', e.target.value)}
                        placeholder="e.g. 123 Main St, Accra"
                      />
                      {!branch.address && <div className="text-red-500 text-xs mt-1">Address is required.</div>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Status</label>
                      <select
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        value={branch.status || ''}
                        onChange={e => handleBranchChange(idx, 'status', e.target.value)}
                      >
                        <option value="" disabled hidden>Select status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {!branch.status && <div className="text-red-500 text-xs mt-1">Status is required.</div>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Established Date</label>
                      <input
                        type="date"
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        value={branch.establishedDate || ''}
                        onChange={e => handleBranchChange(idx, 'establishedDate', e.target.value)}
                      />
                      {!branch.establishedDate && <div className="text-red-500 text-xs mt-1">Established date is required.</div>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">City</label>
                      <input
                        type="text"
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        value={branch.city || ''}
                        onChange={e => handleBranchChange(idx, 'city', e.target.value)}
                        placeholder="e.g. Accra"
                      />
                      {!branch.city && <div className="text-red-500 text-xs mt-1">City is required.</div>}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Phone</label>
                      <input
                        type="text"
                        className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        value={branch.phone || ''}
                        onChange={e => handleBranchChange(idx, 'phone', e.target.value)}
                        placeholder="e.g. +233 123 456 789"
                      />
                      {branch.phone && !isValidPhone(branch.phone) && <div className="text-red-500 text-xs mt-1">Enter a valid phone number.</div>}
                    </div>
                  </div>
                  <Button type="button" color="indigo" onClick={() => handleSavePrimary(idx)} className="w-full md:w-auto mt-4" disabled={!primaryValid[idx] || primaryLoading[idx]}>
                    {primaryLoading[idx] ? 'Saving...' : 'Save Primary Details'}
                  </Button>
                  {primarySaved[idx] && (
                    <div className="text-green-600 mt-2">Primary details saved successfully!</div>
                  )}
                  {primaryError[idx] && (
                    <div className="text-red-500 text-xs mt-2">{primaryError[idx]}</div>
                  )}
                  </>
                  ) : primarySaved[idx] ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircleIcon className="h-16 w-16 text-green-500 mb-2" />
                      <div className="text-green-700 font-bold text-lg">Primary details completed</div>
                    </div>
                  ) : null}
                </div>
                {/* Admin User */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">Branch Admin Set up</h3>
                    {(expandedSection[idx] === 'settings' || expandedSection[idx] === 'done') && (
                      <CheckCircleIcon className="h-7 w-7 text-green-500" />
                    )}
                  </div>
                  {expandedSection[idx] === 'admin' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      value={branch.admin.firstName}
                      onChange={e => handleAdminChange(idx, 'firstName', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      value={branch.admin.lastName}
                      onChange={e => handleAdminChange(idx, 'lastName', e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Admin Email"
                      className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      value={branch.admin.email}
                      onChange={e => handleAdminChange(idx, 'email', e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Admin Password"
                      className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                      value={branch.admin.password}
                      onChange={e => handleAdminChange(idx, 'password', e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    color="indigo"
                    onClick={() => handleSaveAdmin(idx)}
                    className="w-full md:w-auto mt-4"
                    disabled={!branchIds[idx] || adminLoading[idx]}
                  >
                    {adminLoading[idx]
                      ? 'Saving admin...'
                      : (!branchIds[idx] ? 'Save branch first' : 'Save Admin')}
                  </Button>
                  {adminSaved[idx] && (
                    <div className="text-green-600 mt-2">Branch Admin saved successfully!</div>
                  )}
                  {adminError[idx] && (
                    <div className="text-red-600 mt-2">{adminError[idx]}</div>
                  )}
                  </>
                  ) : adminSaved[idx] ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircleIcon className="h-16 w-16 text-green-500 mb-2" />
                      <div className="text-green-700 font-bold text-lg">Branch Admin user completed</div>
                    </div>
                  ) : null}
                </div>
                {/* Settings */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">Settings</h3>
                    {expandedSection[idx] === 'done' && (
                      <CheckCircleIcon className="h-7 w-7 text-green-500" />
                    )}
                  </div>
                  {expandedSection[idx] === 'settings' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Modules</label>
                      <div className="flex flex-wrap gap-2">
                        {moduleOptions.map(module => (
                          <label key={module} className="inline-flex items-center bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100">
                            <input
                              type="checkbox"
                              checked={branch.modules.includes(module)}
                              onChange={() => handleModuleToggle(idx, module)}
                              className="accent-indigo-500 mr-2"
                            />
                            <span>{module}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    color="indigo"
                    onClick={() => handleSaveSettings(idx)}
                    className="w-full md:w-auto mt-4"
                    disabled={!branchIds[idx] || settingsLoading[idx] || !isValidSettings(branch)}
                  >
                    {settingsLoading[idx]
                      ? 'Saving settings...'
                      : (!branchIds[idx] ? 'Save branch first' : 'Save Settings')}
                  </Button>
                  {settingsSaved[idx] && (
                    <div className="text-green-600 mt-2">Settings saved successfully!</div>
                  )}
                  {settingsError[idx] && (
                    <div className="text-red-600 mt-2">{settingsError[idx]}</div>
                  )}
                  </>
                  ) : settingsSaved[idx] ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircleIcon className="h-16 w-16 text-green-500 mb-2" />
                      <div className="text-green-700 font-bold text-lg">Settings completed</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
       </div>
       {/* Show Next button if all branches are completed */}
      {settingsSaved.every(Boolean) && (
        <div className="flex justify-end mt-8">
          <Button color="indigo" size="xl" onClick={handleSubmit}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default BranchDetailsScreen;
