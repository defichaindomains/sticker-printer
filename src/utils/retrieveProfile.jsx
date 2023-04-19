import { ethers } from "ethers";
import { gql, request } from "graphql-request";

const provider = new ethers.providers.StaticJsonRpcProvider(
  process.env.WEB3_PROVIDER
);

const GET_DOMAIN_BY_NAME = gql`
  query getDomains($name: String) {
    domains(where: { name: $name }) {
      createdAt
      resolver {
        texts
        coinTypes
        contentHash
        addr {
          id
        }
      }
    }
  }
`;

export async function retrieveProfile(ensName) {
  const labels = ensName.split(".");
  let hasAvatar = false;

  //TO DO: UPDATE PROD SUBGRAPH URI
  const [graphPromise] = await Promise.allSettled([
    request(
      "https://api.thegraph.com/subgraphs/name/defichaindomains/defichain-domains-registry",
      GET_DOMAIN_BY_NAME,
      {
        name: ensName,
        label: labels[0],
      }
    ),
  ]);
  if (graphPromise.status === "rejected" || !graphPromise.value.domains[0]) {
    alert(graphPromise.reason || "No profile found");
    return;
  }

  const graphData = graphPromise.value;

  const textsRecords = graphData.domains[0].resolver.texts;
  if (textsRecords) {
    hasAvatar = textsRecords.includes("avatar");
  }

  return {
    name: ensName,
    date: new Date(parseInt(graphData.domains[0].createdAt) * 1000),
    hasAvatar: hasAvatar,
  };
}
