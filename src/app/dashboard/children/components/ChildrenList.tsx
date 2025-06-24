"use client";

import { 
  UserIcon,
  IdentificationIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Mock data for children
export const mockChildren = [
  {
    id: "CH001",
    firstName: "Emma",
    lastName: "Johnson",
    birthdate: "2018-05-12",
    age: 6,
    ageGroup: "Elementary (6-10)",
    parentName: "Sarah Johnson",
    parentPhone: "(555) 123-4567",
    classroom: "Elementary A",
    checkedIn: true,
    allergies: ["Peanuts", "Dairy"],
    notes: "Shy at first but warms up quickly."
  },
  {
    id: "CH002",
    firstName: "Noah",
    lastName: "Williams",
    birthdate: "2020-11-03",
    age: 4,
    ageGroup: "Preschool (4-5)",
    parentName: "Michael Williams",
    parentPhone: "(555) 234-5678",
    classroom: "Preschool B",
    checkedIn: true,
    allergies: [],
    notes: ""
  },
  {
    id: "CH003",
    firstName: "Olivia",
    lastName: "Brown",
    birthdate: "2021-07-29",
    age: 3,
    ageGroup: "Toddlers (2-3)",
    parentName: "Jennifer Brown",
    parentPhone: "(555) 345-6789",
    classroom: "Toddlers A",
    checkedIn: false,
    allergies: ["Gluten"],
    notes: "Needs her comfort blanket."
  },
  {
    id: "CH004",
    firstName: "Lucas",
    lastName: "Garcia",
    birthdate: "2023-02-15",
    age: 1,
    ageGroup: "Infants (0-1)",
    parentName: "Maria Garcia",
    parentPhone: "(555) 456-7890",
    classroom: "Nursery",
    checkedIn: true,
    allergies: [],
    notes: "Formula stored in diaper bag."
  },
  {
    id: "CH005",
    firstName: "Sophia",
    lastName: "Martinez",
    birthdate: "2017-09-21",
    age: 7,
    ageGroup: "Elementary (6-10)",
    parentName: "Carlos Martinez",
    parentPhone: "(555) 567-8901",
    classroom: "Elementary B",
    checkedIn: false,
    allergies: ["Bee stings"],
    notes: "Has EpiPen in case of emergency."
  },
  {
    id: "CH006",
    firstName: "Ethan",
    lastName: "Davis",
    birthdate: "2019-04-08",
    age: 5,
    ageGroup: "Preschool (4-5)",
    parentName: "Jessica Davis",
    parentPhone: "(555) 678-9012",
    classroom: "Preschool A",
    checkedIn: true,
    allergies: [],
    notes: ""
  },
  {
    id: "CH007",
    firstName: "Ava",
    lastName: "Rodriguez",
    birthdate: "2022-12-01",
    age: 2,
    ageGroup: "Toddlers (2-3)",
    parentName: "Robert Rodriguez",
    parentPhone: "(555) 789-0123",
    classroom: "Toddlers B",
    checkedIn: false,
    allergies: ["Strawberries"],
    notes: "Prefers to be called 'Ava-bear'."
  },
  {
    id: "CH008",
    firstName: "Mason",
    lastName: "Wilson",
    birthdate: "2016-10-30",
    age: 8,
    ageGroup: "Elementary (6-10)",
    parentName: "Emily Wilson",
    parentPhone: "(555) 890-1234",
    classroom: "Elementary A",
    checkedIn: true,
    allergies: [],
    notes: "Has asthma, inhaler in backpack."
  }
];

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  age: number;
  ageGroup: string;
  parentName: string;
  parentPhone: string;
  classroom: string;
  checkedIn: boolean;
  allergies: string[];
  notes: string;
}

interface ChildrenListProps {
  children: Child[];
  onSelectChild: (child: Child) => void;
}

export default function ChildrenList({ children, onSelectChild }: ChildrenListProps) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Child
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Age Group
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Classroom
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Parent
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {children.map((child) => (
                  <tr key={child.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{child.firstName} {child.lastName}</div>
                          <div className="text-gray-500 flex items-center">
                            <IdentificationIcon className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                            {child.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {child.ageGroup}
                      <div className="text-xs text-gray-400">{child.age} years old</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {child.classroom}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <div className="text-gray-900">{child.parentName}</div>
                      <div className="text-gray-500 text-xs">{child.parentPhone}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {child.checkedIn ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          <CheckCircleIcon className="mr-1 h-4 w-4 text-green-500" aria-hidden="true" />
                          Checked In
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                          <XCircleIcon className="mr-1 h-4 w-4 text-gray-500" aria-hidden="true" />
                          Not Checked In
                        </span>
                      )}
                      {child.allergies.length > 0 && (
                        <div className="mt-1 flex items-center text-xs text-red-600">
                          <ExclamationTriangleIcon className="mr-1 h-4 w-4" aria-hidden="true" />
                          Allergies
                        </div>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => onSelectChild(child)}
                      >
                        View<span className="sr-only">, {child.firstName} {child.lastName}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
