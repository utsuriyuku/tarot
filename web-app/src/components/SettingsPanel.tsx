import { useEffect, useMemo, useState } from 'react';
import {
  hasLlmConfigErrors,
  normalizeEndpoint,
  testModelConnection,
  validateLlmConfig,
  type LlmConfig,
  type LlmConfigErrors,
} from '../services/llm';

interface SettingsPanelProps {
  onClose: () => void;
}

const MODEL_PRESETS = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini', 'gpt-4.1', 'claude-3-5-sonnet'];

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [config, setConfig] = useState<LlmConfig>({
    endpoint: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'gpt-4'
  });
  const [errors, setErrors] = useState<LlmConfigErrors>({});
  const [isTesting, setIsTesting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const canSave = useMemo(() => !hasLlmConfigErrors(validateLlmConfig(config)), [config]);

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

  const handleFieldChange = (key: keyof LlmConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setFeedback({ type: 'idle', message: '' });
    if (errors[key]) {
      setErrors(validateLlmConfig({ ...config, [key]: value }));
    }
  };

  const handleTest = async () => {
    const nextConfig = {
      ...config,
      endpoint: normalizeEndpoint(config.endpoint),
      apiKey: config.apiKey.trim(),
      model: config.model.trim(),
    };
    const nextErrors = validateLlmConfig(nextConfig);
    setErrors(nextErrors);

    if (hasLlmConfigErrors(nextErrors)) {
      setFeedback({
        type: 'error',
        message: Object.values(nextErrors)[0] || '请先补全配置。',
      });
      return;
    }

    setConfig(nextConfig);
    setIsTesting(true);
    setFeedback({ type: 'idle', message: '' });

    const result = await testModelConnection(nextConfig);
    setFeedback({
      type: result.ok ? 'success' : 'error',
      message: result.message,
    });
    setIsTesting(false);
  };

  const handleSave = () => {
    const nextConfig = {
      ...config,
      endpoint: normalizeEndpoint(config.endpoint),
      apiKey: config.apiKey.trim(),
      model: config.model.trim(),
    };
    const nextErrors = validateLlmConfig(nextConfig);
    setErrors(nextErrors);

    if (hasLlmConfigErrors(nextErrors)) {
      setFeedback({
        type: 'error',
        message: Object.values(nextErrors)[0] || '请先补全配置。',
      });
      return;
    }

    localStorage.setItem('quantum_tarot_config', JSON.stringify(nextConfig));
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/78 px-4 backdrop-blur-2xl transition-all duration-500">
      <div className="relative w-full max-w-[620px] overflow-hidden rounded-[32px] border border-[#8f6d41]/18 bg-[linear-gradient(180deg,rgba(24,18,14,0.96),rgba(13,10,8,0.94))] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.55)] md:p-10">
        <div className="paper-grain pointer-events-none absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,160,93,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(114,77,44,0.15),transparent_35%)]" />

        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#8f6d41]/16 bg-[#1a130f]/90 text-[#c6a46e] transition hover:border-[#c69b5c]/35 hover:text-[#f0dfbc]"
        >
          ✕
        </button>

        <div className="relative z-10 mb-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#d0ae75]">Model Gateway</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[0.08em] text-[#f7ecd6]">
            建立连接映射
          </h2>
          <p className="mt-4 max-w-[480px] text-sm leading-7 text-[#d2c0a1]">
            这里保存的是当前浏览器本地使用的模型接口参数。只有配置完成，右侧的解牌面板才会把抽到的牌真正送去大模型分析。
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="group">
            <label className="mb-2 block text-xs tracking-[0.24em] text-[#b99a69] transition-colors group-hover:text-[#f3e3c4]">
              观测接口 (API URL)
            </label>
            <input
              type="text"
              value={config.endpoint}
              onChange={(e) => handleFieldChange('endpoint', e.target.value)}
              className="h-14 w-full rounded-2xl border border-[#8f6d41]/16 bg-[#19120e]/88 px-4 text-sm text-[#f4e8d3] outline-none transition focus:border-[#c89d5d]/45 focus:bg-[#221812]"
              placeholder="例如: https://api.openai.com/v1"
            />
            {errors.endpoint && <p className="mt-2 text-xs text-[#d9a48f]">{errors.endpoint}</p>}
          </div>

          <div className="group">
            <label className="mb-2 block text-xs tracking-[0.24em] text-[#b99a69] transition-colors group-hover:text-[#f3e3c4]">
              心智密钥 (API Key)
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => handleFieldChange('apiKey', e.target.value)}
              className="h-14 w-full rounded-2xl border border-[#8f6d41]/16 bg-[#19120e]/88 px-4 font-mono text-sm text-[#f4e8d3] outline-none transition focus:border-[#c89d5d]/45 focus:bg-[#221812]"
              placeholder="sk-..."
            />
            {errors.apiKey && <p className="mt-2 text-xs text-[#d9a48f]">{errors.apiKey}</p>}
          </div>

          <div className="group">
            <label className="mb-2 block text-xs tracking-[0.24em] text-[#b99a69] transition-colors group-hover:text-[#f3e3c4]">
              高维模型 (Model Name)
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => handleFieldChange('model', e.target.value)}
              className="h-14 w-full rounded-2xl border border-[#8f6d41]/16 bg-[#19120e]/88 px-4 text-sm text-[#f4e8d3] outline-none transition focus:border-[#c89d5d]/45 focus:bg-[#221812]"
              placeholder="例如: gpt-4o, claude-3-opus"
            />
            {errors.model && <p className="mt-2 text-xs text-[#d9a48f]">{errors.model}</p>}
          </div>

          <div className="space-y-3 rounded-2xl border border-[#8f6d41]/16 bg-[#16110d]/88 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#b99a69]">推荐模型预设</p>
            <div className="flex flex-wrap gap-2">
              {MODEL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleFieldChange('model', preset)}
                  className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.16em] transition ${config.model === preset ? 'border-[#d8b074]/45 bg-[#352314] text-[#f7e6bf]' : 'border-[#8f6d41]/16 bg-[#1d1510] text-[#c9b493] hover:border-[#c89d5d]/35 hover:text-[#f4e8d3]'}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#8f6d41]/16 bg-[#16110d]/88 p-4 text-sm leading-6 text-[#cbb89b]">
            配置仅保存在你当前浏览器的 localStorage 中，不会自动上传到仓库。建议先做一次“测试连接”，确认接口、密钥和模型都可用，再保存。
          </div>

          {feedback.type !== 'idle' && (
            <div className={`rounded-2xl border p-4 text-sm leading-6 ${feedback.type === 'success' ? 'border-[#8f6d41]/24 bg-[#1c1712] text-[#eadbbd]' : 'border-[#7e4b44]/28 bg-[#241412] text-[#efc1b8]'}`}>
              {feedback.message}
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="h-14 rounded-2xl border border-[#8f6d41]/18 bg-[#1a130f] text-sm uppercase tracking-[0.28em] text-[#e1cc9f] transition hover:border-[#c89d5d]/35 hover:bg-[#261910] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isTesting ? '测试中…' : '测试连接'}
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="h-14 rounded-2xl border border-[#c69a59]/28 bg-[#392514] text-sm uppercase tracking-[0.32em] text-[#f7e6bf] transition hover:border-[#dfb06a]/45 hover:bg-[#4a2e17] hover:shadow-[0_0_28px_rgba(198,154,89,0.16)] disabled:cursor-not-allowed disabled:border-[#7e6540]/18 disabled:bg-[#17120e] disabled:text-[#7d694b]"
            >
              保存并连接
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
