const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 8080;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 추가
app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'k-le-paas-backend-test',
    version: '1.0.0'
  });
});

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'K-Le PaaS Backend Test API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// API 라우트
app.get('/api', (req, res) => {
  res.json({
    message: 'API 엔드포인트에 접근했습니다',
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      port: PORT
    }
  });
});

// POST API 예시
app.post('/api/data', (req, res) => {
  const { body } = req;
  res.json({
    message: '데이터를 성공적으로 받았습니다',
    receivedData: body,
    processedAt: new Date().toISOString()
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `경로 ${req.originalUrl}를 찾을 수 없습니다`,
    timestamp: new Date().toISOString()
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: '서버에서 오류가 발생했습니다',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 K-Le PaaS Backend Test 서버가 포트 ${PORT}에서 실행 중입니다`);
  console.log(`📊 헬스 체크: http://localhost:${PORT}/health`);
  console.log(`🔗 API 엔드포인트: http://localhost:${PORT}/api`);
});
