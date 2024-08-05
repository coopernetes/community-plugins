# OCI/Docker container image plugins

## Frontend/backend

## Catalog providers

## Development notes
### /v2/_catalog
See: https://github.com/opencontainers/distribution-spec/issues/222

There's an existing "hidden" API that most registries implement. Open questions on pagination and what is returned data described in the spec. See below example from GitHub (ghcr):

```bash
$ DOCKER_TOKEN=$(curl -u $GITHUB_USERNAME:$GITHUB_PAT -s "https://ghcr.io/token?service=ghcr.io&scope=repository:jonashackt/hello-world:pull" | jq -r .token)
$ curl -i -H "Authorization: Bearer $DOCKER_TOKEN" https://ghcr.io/v2/_catalog
content-type: application/json
docker-distribution-api-version: registry/2.0
link: </v2/_catalog?last=09wqlin%2Fscripts%2Fjd_scripts&n=0>; rel="next"
date: Mon, 05 Aug 2024 06:07:38 GMT
x-github-request-id: FDB8:1A0AC0:1BB626E:2043F59:66B06C2A
{
    "repositories": [
        "0-5788719150923125/ctx",
        "0-5788719150923125/dht",
        "0-5788719150923125/lab",
        "0-5788719150923125/src",
        "0-5788719150923125/uxo",
        "0-vortex/create-react-app-5-test",
        "0-vortex/nestjs-test-tooling",
        "0-vortex/open-sauced-docs-test",
    ]
}
```