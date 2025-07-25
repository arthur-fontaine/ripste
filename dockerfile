# Run this Dockerfile at the root of the workspace.

FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

FROM base AS build

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

RUN for dir in apps/* packages/* example; do \
  if [ -d "$dir" ]; then \
    name=$(basename "$dir"); \
    pnpm deploy --filter="${name}" --prod "/prod/${name}" --legacy; \
  fi \
done
RUN pnpm deploy --filter="@ripste/example-backend" --prod "/prod/example-backend" --legacy

FROM base AS api

WORKDIR /app

COPY --from=build /prod/api .

ENV API_PORT=3000
EXPOSE $API_PORT

ENTRYPOINT ["pnpm", "run"]
CMD ["start"]

FROM base AS psp-api

WORKDIR /app

COPY --from=build /prod/psp-api .

ENV PSP_API_PORT=3001
EXPOSE $PSP_API_PORT

ENTRYPOINT ["pnpm", "run"]
CMD ["start"]

FROM base AS checkout-page

WORKDIR /app

COPY --from=build /prod/checkout-page .

ENV CHECKOUT_PAGE_PORT=3002
EXPOSE $CHECKOUT_PAGE_PORT

ENTRYPOINT ["pnpm", "run"]
CMD ["start"]

FROM base AS admin-dashboard

WORKDIR /app

COPY --from=build /prod/admin-dashboard .

ENV ADMIN_DASHBOARD_PORT=3003
EXPOSE $ADMIN_DASHBOARD_PORT

ENTRYPOINT ["pnpm", "run"]
CMD ["start"]

FROM base AS example

WORKDIR /app

COPY --from=build /prod/example .

ENV EXAMPLE_PORT=3004
EXPOSE $EXAMPLE_PORT

ENTRYPOINT ["pnpm", "run"]
CMD ["start"]

FROM base AS example-backend

WORKDIR /app

COPY --from=build /prod/example-backend .

ENV EXAMPLE_API_PORT=3005
EXPOSE $EXAMPLE_API_PORT

ENTRYPOINT ["pnpm", "run"]
CMD ["start"]
