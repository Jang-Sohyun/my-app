# 예시 명령어
# 빌드 : docker build .  --build-arg APP_ENV=STAGING --build-arg GIT_COMMIT=d0b6a0c809172ea964a73b66b6a66ef874201680 --build-arg HOST=http://localhost:3000

FROM node:18-alpine

# 빌드를 위한 외부 환경변수 [시작]

# 배포 타입. 값에 따라서 사용하는 환경 변수가 달라짐 (env 폴더)
ARG APP_ENV
ENV APP_ENV=${APP_ENV}

# 빌드시, 같은 씨드로 빌드하기 위한 값
# GIT_COMMIT : 깃 커밋 ID
ARG GIT_COMMIT
ENV GIT_COMMIT=${GIT_COMMIT}

# 빌드를 위한 외부 환경변수 [종료]

COPY package*.json ./

# 스크립트 훅 실행 방지
RUN npm i -g cross-env && npm install -f

COPY . .

ENV NODE_ENV production

# RUN npm test
RUN npm run build

ENV PORT 80

EXPOSE $PORT

CMD "npm" "run" "start"