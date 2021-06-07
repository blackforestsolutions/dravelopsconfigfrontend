# building and testing stage
FROM node:14 as build
LABEL maintainer="John Budnik <to.johnybudnik@gmail.com>"
WORKDIR /dravelopsconfigfrontend
COPY . .
RUN chown -R node:node /dravelopsconfigfrontend
USER node
RUN yarn install && yarn run lint && yarn run build

# deployment stage
FROM nginx:alpine
LABEL maintainer="John Budnik <to.johnybudnik@gmail.com>"
WORKDIR /usr/share/nginx/html
COPY --from=build /dravelopsconfigfrontend/dist .
COPY --from=build /dravelopsconfigfrontend/nginx/default.conf /etc/nginx/conf.d
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid
USER nginx
