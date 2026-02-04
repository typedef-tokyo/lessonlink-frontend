FROM node:20.17.0-alpine3.20

RUN apk add --no-cache tzdata
ENV TZ=Asia/Tokyo
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

# ルートファイルを全てワークスペースにコピー
# ADD . .
# COPY . .
