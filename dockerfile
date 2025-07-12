# Run this Dockerfile at the root of the workspace.

FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

FROM base AS build

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN for dir in apps/* packages/*; do \
  if [ -d "$dir" ]; then \
    name=$(basename "$dir"); \
    pnpm deploy --filter="${name}" --prod "/prod/${name}" --legacy; \
  fi \
done

FROM base AS api

WORKDIR /app

COPY --from=build /prod/api .

ENTRYPOINT ["pnpm", "run"]
CMD ["start"]
