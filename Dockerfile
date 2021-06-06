FROM nginx:alpine

LABEL maintainer="John Budnik <to.johnybudnik@gmail.com>"

COPY nginx/default.conf /etc/nginx/conf.d
COPY dist /usr/share/nginx/html
