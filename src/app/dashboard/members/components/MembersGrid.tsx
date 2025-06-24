"use client";

import MemberCard from "./MemberCard";

type Member = {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  memberSince: string;
  branch?: string;
  branchId?: string;
};

type MembersGridProps = {
  members: Member[];
};

export default function MembersGrid({ members }: MembersGridProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member, index) => (
        <MemberCard
          key={member.id}
          id={member.id}
          name={member.name}
          email={member.email}
          phone={member.phone}
          status={member.status}
          memberSince={member.memberSince}
          index={index}
          branch={member.branch}
        />
      ))}
    </div>
  );
}
