import { useContext, useEffect } from "react";
import { Can } from "../components/Can";
import { useCan } from "../hooks/useCan";
import { AuthContext } from "../contexts/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Metrics() {
  return (
    <>
      <h1>Metrics</h1>
    </>
  );
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");

    // console.log(response.data);

    return {
      props: {},
    };
  },
  {
    permissions: ["metrics.list3"],
    roles: ["administrator"],
  }
);
