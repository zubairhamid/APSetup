FROM node:14.4.0 as build

WORKDIR /APSetup
COPY ./ /APSetup
COPY daemon.json /etc/docker/daemon.json
#COPY exchange.sh /service_name_entry/exchange.sh

#FROM gcr.io/distroless/nodejs
FROM astefanutti/scratch-node:latest

COPY --from=build /APSetup /
COPY --from=build /etc/docker/daemon.json /etc/docker/daemon.json

EXPOSE 9999
CMD test.js
#CMD ["sh", "exchange.sh"]