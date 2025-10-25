# Multi-stage build for Express.js backend
FROM node:20-alpine AS base

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 매니저 캐시 정리 및 의존성 설치를 위한 설정
RUN npm config set cache /tmp/.npm

# Production stage
FROM base AS production

# package.json과 package-lock.json 복사
COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm install --omit=dev && npm cache clean --force

# 애플리케이션 소스 복사
COPY . .

# 비root 사용자 생성 및 권한 설정
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# 포트 노출
EXPOSE 8080

# 환경변수 설정
ENV NODE_ENV=production
ENV PORT=8080

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 애플리케이션 실행
CMD ["node", "server.js"]
