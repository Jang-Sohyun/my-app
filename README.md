# 환경변수

APP_ENV: PROD | STAGING | DEV
- PROD : 실 유저가 사용하는 운영 배포 - 운영 DB
- STAGING : 개발로 배포된 상태의 앱 - 개발 D
- DEV : 로컬 개발 앱 - 개발 DB


# DB 타입
https://supabase.com/docs/guides/api/generating-types
npm run update-types 치면 타입 동기화
(개발 DB가 최신이라고 가정하고 개발 DB만 연동) 

# 번역 API
https://api.getraffle.io/api/r/translate

# Locale 업데이트 되는 상황
1. npm run i18n:build 또는 npm i 를 통한 postinstall 스크립트 실행