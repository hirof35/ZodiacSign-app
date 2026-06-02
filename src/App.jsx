import { useState } from 'react';
import { motion } from 'framer-motion';

// 💡 画像アセットを直接インポート
import zodiacSprite from './zodiac_sprite.jpg';

// 🔍 1マスを縦横150pxに完全固定した上で、各キャラの「px単位の絶対シフト量」を定義
// 画像の右寄りのクセを、マイナス値を微調整（例: 通常-300pxのところを-305pxにする等）して強制調教
const zodiacSigns = [
  // 1行目 (Y: 0px)
  { name: '牡羊座', englishName: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, element: '火', luckyColor: 'レッド', luckyItem: '新しいスニーカー', description: 'エネルギー全開！新しいことに挑戦するなら今日が最適です。直感を信じて突き進んで。', shiftX: '-5px', shiftY: '-10px' },
  { name: '牡牛座', englishName: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, element: '地', luckyColor: 'グリーン', luckyItem: '高級なチョコレート', description: '五感が研ぎ澄まされる日。美味しいものを食べたり、美しいものに触れると運気がさらにアップ。', shiftX: '-152px', shiftY: '-10px' },
  { name: '双子座', englishName: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21, element: '風', luckyColor: 'イエロー', luckyItem: '最新の雑誌', description: 'コミュニケーション運が最高潮。友人とのたわいもない会話から、素晴らしいヒントが得られそう。', shiftX: '-296px', shiftY: '-10px' },
  
  // 2行目 (Y: -150px)
  { name: '蟹座', englishName: 'Cancer', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22, element: '水', luckyColor: 'シルバー', luckyItem: 'お気に入りのマグカップ', description: 'おうち時間を充実させると吉。身近な人との絆を深めることで、心が満たされる穏やかな一日になります。', shiftX: '-5px', shiftY: '-160px' },
  { name: '獅子座', englishName: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, element: '火', luckyColor: 'ゴールド', luckyItem: 'サングラス', description: 'あなたが主役になれる日！堂々とした振る舞いが周囲を魅了します。リーダーシップを発揮して。', shiftX: '-152px', shiftY: '-160px' },
  { name: '乙女座', englishName: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, element: '地', luckyColor: 'ネイビー', luckyItem: '整理整頓された手帳', description: '計画性が光る日。散らかったデスクやタスクを整理することで、驚くほど作業が捗ります。', shiftX: '-296px', shiftY: '-160px' },
  
  // 3行目 (Y: -300px)
  { name: '天秤座', englishName: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23, element: '風', luckyColor: 'ピンク', luckyItem: 'ハンドクリーム', description: '対人関係が調和する日。おしゃれをして出かけると、素敵な出会いや嬉しい誘いがあるかも。', shiftX: '-5px', shiftY: '-310px' },
  { name: '蠍座', englishName: 'Scorpio', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22, element: '水', luckyColor: 'ボルドー', luckyItem: '鍵のチャーム', description: '集中力が極まる日。一つのことに深く没頭することで、他の人には真似できない成果を出せそう。', shiftX: '-152px', shiftY: '-310px' },
  { name: '射手座', englishName: 'Sagittarius', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21, element: '火', luckyColor: 'パープル', luckyItem: '旅行雑誌', description: '未知の世界への好奇心が高めます。初めて行く場所や、新しい分野の勉強を始めると運気上昇。', shiftX: '-296px', shiftY: '-310px' },
  
  // 4行目 (Y: -450px)
  { name: '山羊座', englishName: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, element: '地', luckyColor: 'ブラウン', luckyItem: '革のブックカバー', description: '一歩一歩着実に進むことで、大きな成果を手にできる日。焦らずマイペースを維持して。', shiftX: '-5px', shiftY: '-460px' },
  { name: '水瓶座', englishName: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, element: '風', luckyColor: 'ブルー', luckyItem: 'ワイヤレスイヤホン', description: 'ユニークなアイデアが閃く予感。常識にとらわれない自由な発想が道を切り開きます。', shiftX: '-152px', shiftY: '-460px' },
  { name: '魚座', englishName: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, element: '水', luckyColor: 'マリンブルー', luckyItem: 'アロマキャンドル', description: '直感力が冴え渡る日。周囲の人への優しさが、巡り巡ってあなたに大きな幸運をもたらします。', shiftX: '-296px', shiftY: '-460px' }
];

function getZodiacSign(month, day) {
  return zodiacSigns.find(sign => {
    if (sign.startMonth === month && day >= sign.startDay) return true;
    if (sign.endMonth === month && day <= sign.endDay) return true;
    return false;
  }) || null;
}

export default function App() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // 初期プレビューは牡羊座
  const displayData = result || zodiacSigns[0];

  const handleDiagnose = (e) => {
    e.preventDefault();
    if (!birthDate) return;

    setIsSearching(true);

    setTimeout(() => {
      const date = new Date(birthDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const sign = getZodiacSign(month, day);
      setResult(sign);
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      
      <header className="text-center mb-6">
        <div className="text-purple-400 font-semibold uppercase tracking-widest text-sm mb-1">
          ✨ Cosmic Guidance ✨
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 bg-clip-text text-transparent drop-shadow">
          12星座・本日の運勢
        </h1>
      </header>

      {/* フォームコンテナ */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl mb-6">
        <form onSubmit={handleDiagnose} className="space-y-3">
          <label className="block text-xs font-medium text-slate-300 tracking-wider">
            📅 誕生日を入力してください
          </label>
          <div className="relative">
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {isSearching ? "探査中..." : "運勢を占う 🌙"}
          </button>
        </form>
      </div>

      {/* 結果表示エリアカード */}
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* 星座イラスト・絶対マスク空間 */}
          <div className="flex justify-center mb-5 relative w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-purple-600/20 rounded-full blur-2xl transform scale-110" />
            
            {/* 150pxの完璧な正方形スコープ */}
            <div 
              style={{
                width: '150px',
                height: '150px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '1.25rem',
                border: '2px solid rgba(168, 85, 247, 0.4)',
                backgroundColor: '#000000',
                zIndex: 10
              }}
            >
              {/* 💡 画像自体の物理サイズを 450px × 600px に完全固定し、
                  計算の狂う％ではなく「確実なマイナスpx」で位置を力ずくでロック */}
              <img
                src={zodiacSprite}
                alt={displayData.name}
                style={{
                  position: 'absolute',
                  width: '450px',
                  height: '600px',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  left: displayData.shiftX,
                  top: displayData.shiftY,
                }}
                className="transition-all duration-300 ease-out"
              />
            </div>
          </div>

          {/* ヘッダー情報 */}
          <div className="text-center border-b border-white/10 pb-3 mb-3 w-full">
            <span className="px-2.5 py-0.5 bg-purple-500/20 rounded-full text-[11px] font-semibold text-purple-300 tracking-wider inline-block border border-purple-500/30">
              ⭐ {result ? `${displayData.element}属性` : '星座未特定'}
            </span>
            <h2 className="text-2xl font-bold mt-1 text-white tracking-wide">
              {result ? displayData.name : '???座'}
            </h2>
            <p className="text-xs text-slate-400 italic tracking-wide">
              {result ? displayData.englishName : 'Select Your Birthday'}
            </p>
          </div>

          {/* 運勢テキスト本文 */}
          <p className="text-slate-200 text-center leading-relaxed text-xs mb-4 bg-slate-950/40 p-3.5 rounded-xl border border-white/5 min-h-[68px] w-full flex items-center justify-center">
            {result ? displayData.description : '誕生日を入力して上のボタンを押すと、ここに今日の詳細な運勢アドバイスが表示されます。'}
          </p>

          {/* ラッキーパラメータ */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex flex-col justify-center items-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">🎨 Lucky Color</span>
              <span className="text-xs font-semibold text-white">{result ? displayData.luckyColor : '---'}</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex flex-col justify-center items-center">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">🏆 Lucky Item</span>
              <span className="text-xs font-semibold text-white">{result ? displayData.luckyItem : '---'}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}