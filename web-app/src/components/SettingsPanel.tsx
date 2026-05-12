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
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl transition-all duration-700">
      <div className="w-[28rem] p-10 border border-white/10 bg-black/40 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.03)] flex flex-col relative">
        
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/30 hover:text-white/80 transition-colors"
        >
          ✕
        </button>

        <div className="mb-10 text-center">
          <h2 className="text-2xl font-extralight tracking-[0.2em] text-white/90">
            建立连接映射
          </h2>
          <p className="mt-3 text-white/40 text-[0.7rem] tracking-widest leading-relaxed">
            【配置观测节点】<br/>
            我们需要借助外部的算力思维网络（大模型）<br/>
            才能将当前的牌面坍缩为能够被解读的现实。
          </p>
        </div>
        
        <div className="space-y-7">
          <div className="group">
            <label className="block text-white/50 text-xs tracking-widest mb-2 transition-colors group-hover:text-white/80">
              观测接口 (API URL)
            </label>
            <input 
              type="text" 
              value={config.endpoint}
              onChange={(e) => setConfig({...config, endpoint: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/90 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all font-light"
              placeholder="例如: https://api.openai.com/v1"
            />
          </div>

          <div className="group">
            <label className="block text-white/50 text-xs tracking-widest mb-2 transition-colors group-hover:text-white/80">
              心智密钥 (API Key)
            </label>
            <input 
              type="password" 
              value={config.apiKey}
              onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/90 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all font-mono"
              placeholder="sk-..."
            />
          </div>

          <div className="group">
            <label className="block text-white/50 text-xs tracking-widest mb-2 transition-colors group-hover:text-white/80">
              高维模型 (Model Name)
            </label>
            <input 
              type="text" 
              value={config.model}
              onChange={(e) => setConfig({...config, model: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/90 focus:outline-none focus:border-white/50 focus:bg-white/10 transition-all font-light"
              placeholder="例如: gpt-4o, claude-3-opus"
            />
          </div>

          <button 
            onClick={handleSave} 
            className="w-full mt-4 border border-white/20 bg-white/5 py-4 rounded-lg text-sm tracking-[0.3em] font-light hover:bg-white/15 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
          >
            确 认 链 接
          </button>
        </div>
      </div>
    </div>
  );
}
