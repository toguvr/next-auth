import { Button } from "@chakra-ui/react";

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationItem({
  number,
  isCurrent = false,
  onPageChange,
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        fontSize="xs"
        w="4"
        colorScheme="pink"
        disabled
        _disabled={{ bgColor: "pink.500", cursor: "default" }}
        size="sm"
      >
        {number}
      </Button>
    );
  }

  return (
    <Button
      fontSize="xs"
      size="sm"
      w="4"
      colorScheme="pink"
      bg="gray.700"
      _disabled={{ bgColor: "gray.500" }}
      onClick={() => onPageChange(number)}
    >
      {number}
    </Button>
  );
}
