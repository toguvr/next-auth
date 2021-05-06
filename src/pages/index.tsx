import { Button, Flex, Stack } from "@chakra-ui/react";
import { Input } from "../components/Form/Input";
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { withSSRGuest } from "../utils/withSSRGuest";

type SignInFormData = {
  email: string;
  password: string;
};

// const signInFormSchema = yup.object().shape({
//   email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
//   password: yup.string().required("Senha obrigatória"),
// });

export default function SignIn() {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();

    await signIn({ email, password });
  };

  return (
    <Flex w="100vw" align="center" justify="center" h="100vh">
      <Flex
        as="form"
        width="100%"
        maxW="360px"
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDir="column"
        onSubmit={handleSignIn}
      >
        <Stack spacing="4">
          <Input
            value={email}
            label="E-mail"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            name="email"
          />
          <Input
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
          />
        </Stack>
        <Button type="submit" mt="6" colorScheme="pink">
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
