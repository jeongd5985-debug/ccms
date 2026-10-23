// 전체 사이트(HTML + PDF)에 비밀번호를 거는 Basic 인증.
// Vercel 환경변수 ADMIN_PASSWORD(필수), ADMIN_USER(선택, 기본 admin)를 설정해야 열립니다.
export const config = { matcher: '/(.*)' };

export default function middleware(request) {
  const user = process.env.ADMIN_USER || 'admin';
  const pass = process.env.ADMIN_PASSWORD;
  const auth = request.headers.get('authorization') || '';
  if (pass && auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const i = decoded.indexOf(':');
      if (decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) {
        return new Response(null, { headers: { 'x-middleware-next': '1' } });
      }
    } catch (e) {}
  }
  return new Response('로그인이 필요합니다', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="jungjayeon-admin", charset="UTF-8"', 'Cache-Control': 'no-store' }
  });
}
