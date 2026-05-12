import { useState, useEffect } from 'react';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [config, setConfig] = useState({
    endpoint: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4'
  });

  // 初始化加载本地配置
  useEffect(() => {
    const saved = localStorage.getItem('quantum_tarot_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("解析配置失败", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('quantum_tarot_config', JSON.stringify(config));
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-2xl transition-all duration-500">
      <div className="relative w-full max-w-[620px] overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,11,18,0.95),rgba(5,6,10,0.92))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.55)] md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.12),transparent_35%)]" />

        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/45 transition hover:border-white/20 hover:text-white"
        >
          ✕
        </button>

        <div className="relative z-10 mb-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/65">Model Gateway</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[0.08em] text-white">
            建立连接映射
          </h2>
          <p className="mt-4 max-w-[480px] text-sm leading-7 text-white/62">
            这里保存的是当前浏览器本地使用的模型接口参数。只有配置完成，右侧的解牌面板才会把抽到的牌真正送去大模型分析。
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="group">
            <label className="mb-2 block text-xs tracking-[0.24em] text-white/45 transition-colors group-hover:text-white/80">
              观测接口 (API URL)
            </label>
            <input
              type="text"
              value={config.endpoint}
              onChange={(e) => setConfig({...config, endpoint: e.target.value})}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/90 outline-none transition focus:border-cyan-300/35 focus:bg-white/[0.07]"
              placeholder="例如: https://api.openai.com/v1"
            />
          </div>

          <div className="group">
            <label className="mb-2 block text-xs tracking-[0.24em] text-white/45 transition-colors group-hover:text-white/80">
              心智密钥 (API Key)
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-mono text-sm text-white/90 outline-none transition focus:border-cyan-300/35 focus:bg-white/[0.07]"
              placeholder="sk-..."
            />
          </div>

          <div className="group">
            <label className="mb-2 block text-xs tracking-[0.24em] text-white/45 transition-colors group-hover:text-white/80">
              高维模型 (Model Name)
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setConfig({...config, model: e.target.value})}
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/90 outline-none transition focus:border-cyan-300/35 focus:bg-white/[0.07]"
              placeholder="例如: gpt-4o, claude-3-opus"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/52">
            配置仅保存在你当前浏览器的 localStorage 中，不会自动上传到仓库。
          </div>

          <button
            onClick={handleSave}
            className="mt-2 h-14 w-full rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-sm uppercase tracking-[0.32em] text-cyan-50 transition hover:border-cyan-200/45 hover:bg-cyan-300/15 hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]"
          >
            保存并连接
          </button>
        </div>
      </div>
    </div>
  );
}
