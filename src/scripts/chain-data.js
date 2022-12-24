import axios from "../plugins/axios";

const options = {
  method: "GET",
  url: "https://deep-index.moralis.io/api/v2/address",
  params: { chain: "bsc" },
  headers: { accept: "application/json", "X-API-Key": "JaBAzq1yJhEVYYRFkZChoUlzxJhRcLcrlgOUkqVPHmfeLoQHGYiZiltUVAK87w13" },
};

export default async function getTransactions(address) {
  options.params.address = address;
  return (await axios.request(options)).data.result;
}
