// Group Types Utility
// This utility provides comprehensive group types for forms and filters

export interface GroupType {
  value: string;
  label: string;
  description?: string;
}

export const GROUP_TYPES: GroupType[] = [
  {
    value: "BIBLE_STUDY",
    label: "Bible Study",
    description: "Groups focused on studying scripture",
  },
  {
    value: "PRAYER",
    label: "Prayer Group",
    description: "Groups dedicated to prayer and intercession",
  },
  {
    value: "CELL",
    label: "Cell Group",
    description: "Small community groups for fellowship and growth",
  },
  {
    value: "DISCIPLESHIP",
    label: "Discipleship",
    description: "Groups focused on spiritual mentoring and growth",
  },
  {
    value: "FELLOWSHIP",
    label: "Fellowship",
    description: "Social and community building groups",
  },
  {
    value: "MINISTRY",
    label: "Ministry Team",
    description: "Service-oriented ministry groups",
  },
  {
    value: "COMMITTEE",
    label: "Committee",
    description: "Administrative and planning committees",
  },
  {
    value: "SUPPORT",
    label: "Support Group",
    description: "Groups providing emotional and spiritual support",
  },
  {
    value: "INTEREST_BASED",
    label: "Interest-Based",
    description: "Groups based on shared interests or hobbies",
  },
  {
    value: "YOUTH",
    label: "Youth Group",
    description: "Groups specifically for young people",
  },
  {
    value: "MENS",
    label: "Men's Group",
    description: "Groups for male members",
  },
  {
    value: "WOMENS",
    label: "Women's Group",
    description: "Groups for female members",
  },
  {
    value: "SENIORS",
    label: "Seniors Group",
    description: "Groups for senior members",
  },
  {
    value: "COUPLES",
    label: "Couples Group",
    description: "Groups for married couples",
  },
  {
    value: "SINGLES",
    label: "Singles Group",
    description: "Groups for single members",
  },
  {
    value: "WORSHIP",
    label: "Worship Team",
    description: "Music and worship ministry groups",
  },
  {
    value: "EVANGELISM",
    label: "Evangelism",
    description: "Groups focused on outreach and evangelism",
  },
  {
    value: "MISSIONS",
    label: "Missions",
    description: "Groups focused on missionary work",
  },
  {
    value: "CHILDREN",
    label: "Children Ministry",
    description: "Groups serving children",
  },
  {
    value: "EDUCATION",
    label: "Education",
    description: "Teaching and educational groups",
  },
  {
    value: "COUNSELING",
    label: "Counseling",
    description: "Groups providing counseling services",
  },
  {
    value: "COMMUNITY_SERVICE",
    label: "Community Service",
    description: "Groups focused on community outreach",
  },
  {
    value: "LEADERSHIP",
    label: "Leadership",
    description: "Leadership development groups",
  },
  {
    value: "FINANCE",
    label: "Finance Committee",
    description: "Financial planning and oversight groups",
  },
  {
    value: "FACILITIES",
    label: "Facilities",
    description: "Building and maintenance groups",
  },
  {
    value: "MEDIA",
    label: "Media Team",
    description: "Audio/visual and media ministry",
  },
  {
    value: "HOSPITALITY",
    label: "Hospitality",
    description: "Welcome and hospitality ministry",
  },
  {
    value: "SECURITY",
    label: "Security Team",
    description: "Safety and security ministry",
  },
  {
    value: "SPECIAL_EVENTS",
    label: "Special Events",
    description: "Event planning and coordination groups",
  },
  { value: "OTHER", label: "Other", description: "Other types of groups" },
];

// Hook for easy use in React components
export const useGroupTypes = () => {
  return {
    groupTypes: GROUP_TYPES,
    getGroupTypeOptions: () =>
      GROUP_TYPES.map((type) => ({
        value: type.value,
        label: type.label,
      })),
    getGroupTypeLabel: (value: string) => {
      const type = GROUP_TYPES.find((t) => t.value === value);
      return type ? type.label : value;
    },
    getGroupTypeDescription: (value: string) => {
      const type = GROUP_TYPES.find((t) => t.value === value);
      return type ? type.description : undefined;
    },
  };
};

// Simple function to get group type options for select dropdowns
export const getGroupTypeOptions = () => {
  return GROUP_TYPES.map((type) => ({
    value: type.value,
    label: type.label,
  }));
};

// Function to get group type label by value
export const getGroupTypeLabel = (value: string): string => {
  const type = GROUP_TYPES.find((t) => t.value === value);
  return type ? type.label : value;
};

// Function to get all group type values
export const getGroupTypeValues = (): string[] => {
  return GROUP_TYPES.map((type) => type.value);
};

export default GROUP_TYPES;
