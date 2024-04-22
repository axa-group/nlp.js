FROM node:12-alpine

ARG WRKDIR=/app

RUN mkdir -p ${WRKDIR}/src && mkdir -p ${WRKDIR}/models

WORKDIR ${WRKDIR}

COPY package.json .
COPY package-lock.json .

RUN npm install

VOLUME ${WRKDIR}/src
VOLUME ${WRKDIR}/models

ENTRYPOINT [ "npm" ]

CMD [ "start" ]
