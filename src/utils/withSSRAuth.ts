import jwtDecode from "jwt-decode";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";
import { validateUserPermisions } from "./validateUserPermissions";

type WithAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withSSRAuth<P>(
  fn: GetServerSideProps<P>,
  options?: WithAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["@authapp:token"];

    if (!token) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (options) {
      const user = jwtDecode<{ permissions: string[]; roles: string[] }>(token);
      const { roles, permissions } = options;

      const userHasPermissions = validateUserPermisions({
        user,
        permissions,
        roles,
      });

      if (!userHasPermissions) {
        return {
          redirect: { destination: "/dashboard", permanent: false },
        };
      }
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, "@authapp:token");
        destroyCookie(ctx, "@authapp:refreshToken");

        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    }
  };
}
