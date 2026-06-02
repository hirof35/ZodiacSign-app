# 🌌 Cosmic Guidance - 12星座・本日の運勢シミュレーター

React、Vite、Tailwind CSS を用いて構築された、モダンで高精度な12星座占いアプリケーションです。
<img width="1203" height="1035" alt="スクリーンショット 2026-06-02 163917" src="https://github.com/user-attachments/assets/45f4ce07-f980-44ea-b86e-9334af5a4f8e" />

## 🛠️ 技術スタック & アーキテクチャ
- **Frontend:** React (Hooks) / Vite
- **Styling:** Tailwind CSS (Glassmorphism / Gradient UI)
- **Animation:** Framer Motion
- **Graphic Logic:** Pixel-based Absolute Sprite Mapping

## ⚡ 開発における「技術的真実」と設計思想（Design Highlights）

### 1. スプライト画像における「重心の偏り」の物理的相殺
本プロジェクトで使用している12星座の一体型スプライト画像（3列×4行）は、アセットの仕様上、イラストの重心が完全な均等グリッドから数ピクセル単位で右寄りに偏っているという構造的課題がありました。

％（パーセンテージ）による相対計算や、ブラウザ依存の `object-fit: cover`、CSS Grid による自動等分割では、この微妙なゆらぎと余白の蓄積を吸収できず、キャラクターが枠外へ沈む・隣のキャラが侵入する現象（境界条件のエラー）が発生。

これを解決するため、本設計では**「ピクセルベースの絶対座標マッピング（Pixel-based Absolute Mapping）」**を採用。
スプライト全体の物理サイズを `450px × 600px`（1セルあたり `150px × 150px`）に固定ロックし、各星座データに個別のオフセット補正値（`shiftX` / `shiftY`）をハードコードすることで、あらゆるレンダリング環境下でイラストを確実に**完全なデッドセンター（絶対的中心）**に捕らえる堅牢性を実現しました。

### 2. 引き算の美学（Aesthetics of Subtraction）
無駄な非同期通信や巨大な重いライブラリを徹底的に排除。誕生日から星座を一意に特定する論理マトリックスを軽量な純粋関数（Pure Function）として実装し、ミリ秒以下の探査速度を達成しています。

## 🚀 構築（ローカル開発環境）

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build
