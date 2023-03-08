FROM i.harbor.dragonest.net/public/node:12.9.1 as staticize
COPY . /app
WORKDIR /app
ARG XLR_ACCESSKEYID
ARG XLR_ACCESSKEYSECRET
ARG XLR_BUCKET
ARG XLR_REGION
RUN yarn --registry https://registry.npm.taobao.org/ install
#RUN npm  install
RUN yarn build:xxxx
RUN ls -l /app/build/
 
FROM i.harbor.dragonest.net/public/nginx:alpine-docker
COPY --from=staticize /app/build /wwwroot/dist
RUN ls -l /wwwroot/dist
ENTRYPOINT ["nginx"]