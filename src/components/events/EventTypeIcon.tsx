import React from "react";

export enum EventType {
  WORSHIP_SERVICE = "WORSHIP_SERVICE",
  WEDDING = "WEDDING",
  FUNERAL = "FUNERAL",
  BAPTISM = "BAPTISM",
  GRADUATION = "GRADUATION",
  CONFERENCE = "CONFERENCE",
  WORKSHOP = "WORKSHOP",
  RETREAT = "RETREAT",
  FELLOWSHIP = "FELLOWSHIP",
  YOUTH_EVENT = "YOUTH_EVENT",
  CHILDREN_EVENT = "CHILDREN_EVENT",
  PRAYER_MEETING = "PRAYER_MEETING",
  BIBLE_STUDY = "BIBLE_STUDY",
  COMMUNITY_SERVICE = "COMMUNITY_SERVICE",
  FUNDRAISER = "FUNDRAISER",
  CELEBRATION = "CELEBRATION",
  MEETING = "MEETING",
  OTHER = "OTHER",
}

interface EventTypeIconProps {
  eventType: EventType | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const EventTypeIcon: React.FC<EventTypeIconProps> = ({
  eventType,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const iconClass = `${sizeClasses[size]} ${className}`;

  const getIcon = () => {
    switch (eventType) {
      case EventType.WORSHIP_SERVICE:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.05 9 9.93 5.16-.88 9-4.38 9-9.93V7l-10-5z" />
          </svg>
        );

      case EventType.WEDDING:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 1L3 7V9H21ZM12 7.5C12.8 7.5 13.5 8.2 13.5 9S12.8 10.5 12 10.5 10.5 9.8 10.5 9 11.2 7.5 12 7.5ZM6 10V12H18V10H6ZM6 13V23H8V18H10V23H14V18H16V23H18V13H6Z" />
          </svg>
        );

      case EventType.FUNERAL:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10S9.79 14 12 14 16 12.21 16 10 14.21 6 12 6ZM12 12C10.9 12 10 11.1 10 10S10.9 8 12 8 14 8.9 14 10 13.1 12 12 12Z" />
          </svg>
        );

      case EventType.BAPTISM:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z" />
          </svg>
        );

      case EventType.GRADUATION:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 11.09V17H23V9L12 3Z" />
          </svg>
        );

      case EventType.CONFERENCE:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 4C16.55 4 17 4.45 17 5S16.55 6 16 6 15 5.55 15 5 15.45 4 16 4ZM13 2V8L18.5 12L13 16V22H11V16L5.5 12L11 8V2H13ZM7.5 12L11 14.5V9.5L7.5 12Z" />
          </svg>
        );

      case EventType.WORKSHOP:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.7 19L13.6 9.9C14.5 7.6 14 4.9 12.1 3C10.1 1 7.1 0.6 4.7 1.7L9 6L6 9L1.6 4.7C0.4 7.1 0.9 10.1 2.9 12.1C4.8 14 7.5 14.5 9.8 13.6L18.9 22.7C19.3 23.1 19.9 23.1 20.3 22.7L22.6 20.4C23.1 20 23.1 19.3 22.7 19Z" />
          </svg>
        );

      case EventType.RETREAT:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 6L10.25 11L13.1 14.8L11.5 16C9.81 13.75 7 10 7 10L1 18H23L14 6Z" />
          </svg>
        );

      case EventType.FELLOWSHIP:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4ZM8 4C10.2 4 12 5.8 12 8S10.2 12 8 12 4 10.2 4 8 5.8 4 8 4ZM8 14C5.8 14 1 15.1 1 17.3V20H15V17.3C15 15.1 10.2 14 8 14ZM16 14C15.7 14 15.4 14 15.1 14.1C16.2 14.8 17 15.9 17 17.3V20H23V17.3C23 15.1 18.2 14 16 14Z" />
          </svg>
        );

      case EventType.YOUTH_EVENT:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12C14.21 12 16 10.21 16 8S14.21 4 12 4 8 5.79 8 8 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
          </svg>
        );

      case EventType.CHILDREN_EVENT:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L12 1L3 7V9H21ZM12 7.5C12.8 7.5 13.5 8.2 13.5 9S12.8 10.5 12 10.5 10.5 9.8 10.5 9 11.2 7.5 12 7.5Z" />
          </svg>
        );

      case EventType.PRAYER_MEETING:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8C13.1 8 14 7.1 14 6S13.1 4 12 4 10 4.9 10 6 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12S10.9 14 12 14 14 13.1 14 12 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18S10.9 20 12 20 14 19.1 14 18 13.1 16 12 16Z" />
          </svg>
        );

      case EventType.BIBLE_STUDY:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20ZM9 7H15V9H9V7ZM9 11H15V13H9V11ZM9 15H13V17H9V15Z" />
          </svg>
        );

      case EventType.COMMUNITY_SERVICE:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2ZM12 21.5C16.14 21.5 19.5 18.14 19.5 14S16.14 6.5 12 6.5 4.5 9.86 4.5 14 7.86 21.5 12 21.5Z" />
          </svg>
        );

      case EventType.FUNDRAISER:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z" />
          </svg>
        );

      case EventType.CELEBRATION:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" />
          </svg>
        );

      case EventType.MEETING:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 4C16.55 4 17 4.45 17 5S16.55 6 16 6 15 5.55 15 5 15.45 4 16 4ZM13 2V8L18.5 12L13 16V22H11V16L5.5 12L11 8V2H13Z" />
          </svg>
        );

      case EventType.OTHER:
      default:
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12Z" />
          </svg>
        );
    }
  };

  return getIcon();
};

export default EventTypeIcon;
