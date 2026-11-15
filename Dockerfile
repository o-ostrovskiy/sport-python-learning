# Runs the site and its small API on any container host (Google Cloud Run, Render, Fly.io).
FROM node:22-slim
WORKDIR /app
COPY server/local.mjs server/local.mjs
COPY site site
RUN rm -rf site/labs/answers site/tools
ENV PORT=8080 TRUST_PROXY=1
EXPOSE 8080
USER node
CMD ["node", "server/local.mjs"]
