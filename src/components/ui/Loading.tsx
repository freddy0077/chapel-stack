import { Flex, Text, Card } from "@tremor/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface LoadingProps {
  message?: string;
}

/**
 * A reusable loading component that displays a loading indicator and an optional message
 */
export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <Card className="p-6">
      <Flex justifyContent="center" alignItems="center" className="h-48">
        <div className="text-center">
          <ArrowPathIcon className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
          <Text>{message}</Text>
        </div>
      </Flex>
    </Card>
  );
}
