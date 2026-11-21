# BUFF UNIVERSE 홈페이지

- 사이트: `index.html` 등 (정적 파일). 내용은 Supabase에서 읽어옵니다.
- 관리자: `/admin/` — 로그인 후 News · Works · Clients · 팀 소개 · Career를 수정하면 사이트에 바로 반영됩니다.
- 공개 키(`config.js`)는 브라우저에 노출되어도 안전한 키입니다. 쓰기 권한은 DB 정책(RLS)과 관리자 로그인이 막습니다.
- GitHub Pages: Settings → Pages → Branch `main` / `/ (root)` 로 지정하면 배포됩니다.
