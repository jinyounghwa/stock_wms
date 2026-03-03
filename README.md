# stock_wms (React Demo)

Netlify 배포를 위해 데모 앱을 프로젝트 루트로 옮겼습니다.

## 로컬 실행

```bash
cd /Users/younghwa.jin/Documents/GitHub/stock_wms
npm install
npm run dev
```

- 기본 페이지: `http://127.0.0.1:5173/`
- 문서 목록: `http://127.0.0.1:5173/docs`

## 빌드

```bash
npm run build
```

빌드 산출물은 `dist/` 입니다.

## Netlify 설정

`netlify.toml` 포함:
- build command: `npm run build`
- publish directory: `dist`
- SPA 라우팅 redirect: `/* -> /index.html`

## 재고2 문서 사양 갱신

```bash
npm run generate:specs
```

위 명령은 `재고2/*.md`를 읽어 `src/data/page-specs.json`을 갱신합니다.
