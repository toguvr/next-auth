import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text } from "@chakra-ui/layout";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4" textAlign="right">
          <Text>Augusto</Text>
          <Text color="gray.300" fontSize="small">
            augustotf93@gmail.com
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name="Augusto Telles"
        src="https://github.com/toguvr.png"
      />
    </Flex>
  );
}
